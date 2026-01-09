import React, { useState, useEffect } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

// Helper function to cache image in IndexedDB
async function cacheImageToIndexedDB(url: string, blob: Blob) {
  try {
    const db = await openImageDB();
    const transaction = db.transaction(['images'], 'readwrite');
    const store = transaction.objectStore('images');
    await store.put({ url, blob, timestamp: Date.now() });
  } catch (error) {
    console.log('Failed to cache image to IndexedDB:', error);
  }
}

// Helper function to retrieve image from IndexedDB
async function getImageFromIndexedDB(url: string): Promise<Blob | null> {
  try {
    const db = await openImageDB();
    const transaction = db.transaction(['images'], 'readonly');
    const store = transaction.objectStore('images');
    return new Promise((resolve, reject) => {
      const request = store.get(url);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.blob : null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.log('Failed to retrieve image from IndexedDB:', error);
    return null;
  }
}

// Helper function to open/create IndexedDB
function openImageDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('HPC_ImageCache', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'url' });
      }
    };
  });
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [cachedImageUrl, setCachedImageUrl] = useState<string | undefined>(undefined)

  const { src, alt, style, className, ...rest } = props

  // On mount, try to load cached image if original fails
  useEffect(() => {
    if (!src) return;

    const loadImage = async () => {
      try {
        // Try to get from IndexedDB cache
        const cachedBlob = await getImageFromIndexedDB(src);
        if (cachedBlob) {
          const blobUrl = URL.createObjectURL(cachedBlob);
          setCachedImageUrl(blobUrl);
        }
      } catch (error) {
        console.log('Failed to load cached image:', error);
      }
    };

    loadImage();

    return () => {
      if (cachedImageUrl) {
        URL.revokeObjectURL(cachedImageUrl);
      }
    };
  }, [src])

  const handleError = () => {
    setDidError(true)
  }

  const handleLoad = async (e: React.SyntheticEvent<HTMLImageElement>) => {
    try {
      // When image loads successfully, cache it for offline use
      if (src) {
        const img = e.target as HTMLImageElement;
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              cacheImageToIndexedDB(src, blob);
            }
          });
        }
      }
    } catch (error) {
      console.log('Failed to cache image on load:', error);
    }
  }

  // If there was an error, try showing cached version
  if (didError && cachedImageUrl) {
    return (
      <img 
        src={cachedImageUrl} 
        alt={alt} 
        className={className} 
        style={style} 
        {...rest} 
        onError={handleError}
        data-original-url={src}
      />
    )
  }

  // If error and no cache, show error placeholder
  if (didError) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
        </div>
      </div>
    )
  }

  // Normal image rendering with caching on successful load
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}
