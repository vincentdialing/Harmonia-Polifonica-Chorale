
  import { createRoot } from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Register service worker for offline caching - defer to after paint
  if ('serviceWorker' in navigator) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        navigator.serviceWorker.register('/service-worker.js').catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
      });
    } else {
      // Defer using requestIdleCallback or setTimeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          navigator.serviceWorker.register('/service-worker.js').catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
        });
      } else {
        setTimeout(() => {
          navigator.serviceWorker.register('/service-worker.js').catch((error) => {
            console.log('Service Worker registration failed:', error);
          });
        }, 2000);
      }
    }
  }
  