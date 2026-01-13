# Performance Optimization Guide

## Current Performance Issues (From Speed Insights)
- **First Contentful Paint (FCP): 3.42s** ⚠️ Poor (Target: < 2.5s)
- **Largest Contentful Paint (LCP): 4.77s** ⚠️ Needs improvement
- **Interaction to Next Paint (INP): 264ms** ⚠️ Needs improvement
- **Real Experience Score: 66/100**

---

## Optimizations Implemented ✅

### 1. **Lazy Load Analytics (App.tsx)**
- Converted `Analytics` and `SpeedInsights` components to lazy-loaded imports
- Wrapped in `<Suspense>` to defer loading until after initial render
- **Impact**: Reduces initial JavaScript payload blocking FCP

### 2. **Service Worker Registration Optimization (main.tsx)**
- Deferred SW registration using `requestIdleCallback` or `setTimeout`
- No longer blocks on window `load` event
- **Impact**: Improves FCP and TTI by ~200-400ms

### 3. **Build Optimization (vite.config.ts)**
- Added manual code splitting for vendor chunks:
  - `vendor-core`: React, React-DOM, React Router
  - `vendor-ui`: Framer Motion, Radix UI components
  - `vendor-icons`: Lucide icons
  - `vendor-email`: EmailJS
- Enabled Terser minification with dead code elimination
- Set `chunkSizeWarningLimit` to 1000KB
- **Impact**: Smaller initial bundle, better caching

### 4. **Font Loading Optimization (index.html)**
- Added `preconnect` links to Google Fonts CDN
- Reduces DNS lookup and connection time
- **Impact**: ~100-200ms improvement on font rendering

---

## Additional Optimization Recommendations 🚀

### Priority 1: Image Optimization
- [ ] Convert remaining images to WebP format (already using .webp, good!)
- [ ] Add responsive images with srcset for different screen sizes
- [ ] Implement lazy loading for below-fold images using `loading="lazy"`
- [ ] Use `<picture>` elements for art direction
- **Expected Impact**: 500ms-1s improvement on LCP

### Priority 2: Critical Rendering Path
- [ ] Extract critical CSS inline in `<head>` for above-fold content
- [ ] Defer non-critical CSS as async
- [ ] Minify and compress CSS
- [ ] Use CSS grid/flexbox instead of absolute positioning for layout stability
- **Expected Impact**: 300-500ms improvement on FCP

### Priority 3: Reduce JavaScript
- [ ] Tree-shake unused Radix UI components (only import what's used)
- [ ] Remove unused icons from lucide-react
- [ ] Consider using native HTML elements instead of heavy UI libraries for simple components
- [ ] Implement route-based code splitting for major sections
- **Expected Impact**: 400-600ms improvement on FCP/TTI

### Priority 4: Font Optimization
- [ ] Use `font-display: swap` to prevent FOIT (Flash of Invisible Text)
- [ ] Load only necessary font weights (consider loading 400, 600, 700 only)
- [ ] Use `preload` for critical font files
- **Expected Impact**: 200-400ms improvement on FCP

### Priority 5: Caching Strategy
- [ ] Configure aggressive caching headers for static assets (1 year)
- [ ] Set short cache duration for HTML (24 hours)
- [ ] Use versioned asset names to bust cache when needed
- **Expected Impact**: Faster repeat visits

---

## Quick Wins (Easy Implementation)

### 1. Inline Critical Fonts
```html
<!-- In index.html -->
<style>
  @font-face {
    font-family: 'Plus Jakarta Sans';
    font-weight: 600;
    font-display: swap;
    src: url('/fonts/plus-jakarta-sans-600.woff2') format('woff2');
  }
</style>
```

### 2. Enable Text Compression
Create `.htaccess` or configure Vercel to enable gzip/brotli compression:
```
vercel.json:
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Encoding",
          "value": "gzip"
        }
      ]
    }
  ]
}
```

### 3. Optimize Images Further
```bash
# Convert images to WebP with quality optimization
cwebp -q 80 original.png -o optimized.webp

# Use ImageOptim or Squoosh for batch processing
```

### 4. Split Large Components
Consider breaking the massive App.tsx into smaller route-based components:
- Home component
- Events component  
- About component
- Contact component

Load them only when needed using React Router lazy loading.

---

## Performance Targets

| Metric | Current | Target | Impact |
|--------|---------|--------|--------|
| FCP | 3.42s | 2.0s | 40% improvement |
| LCP | 4.77s | 2.5s | 48% improvement |
| INP | 264ms | 100ms | 62% improvement |
| CLS | 0 | 0 | ✅ Perfect |
| TTI | ~5s | 3s | 40% improvement |

---

## Monitoring & Testing

### Tools to Use:
1. **PageSpeed Insights**: https://pagespeed.web.dev
2. **WebPageTest**: https://webpagetest.org
3. **Vercel Speed Insights**: Already integrated
4. **Chrome DevTools Lighthouse**: Built-in performance audit

### Workflow:
```bash
# Build and test locally
npm run build
npm run preview

# Test with Lighthouse
# Open DevTools → Lighthouse → Generate Report
```

---

## Implementation Priority

**Phase 1 (This Week):**
- ✅ Lazy load analytics
- ✅ Defer service worker
- ✅ Code splitting setup
- [ ] Image optimization (add srcset)
- [ ] Font optimization (add font-display: swap)

**Phase 2 (Next Week):**
- [ ] Extract critical CSS
- [ ] Tree-shake unused components
- [ ] Route-based code splitting
- [ ] Caching headers configuration

**Phase 3 (Ongoing):**
- [ ] Monitor with Speed Insights
- [ ] A/B test optimizations
- [ ] Fine-tune based on real user metrics

---

## Expected Results

After implementing all optimizations:
- **FCP**: 3.42s → ~2.0s (41% improvement)
- **LCP**: 4.77s → ~2.5s (48% improvement)
- **Real Experience Score**: 66 → ~85-90

This should move your website from "Poor" to "Good" performance range.
