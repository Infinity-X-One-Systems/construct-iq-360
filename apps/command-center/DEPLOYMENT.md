# Command Center Deployment Guide

## Local Development

```bash
cd apps/command-center
npm install --legacy-peer-deps
npm run dev
```

Visit http://localhost:3000

## Production Build

```bash
cd apps/command-center
npm run build
```

The static site will be generated in `out/` directory.

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

The Command Center automatically deploys to GitHub Pages on every push to `main` that modifies:
- `apps/command-center/**`
- `data/raw-leads/**`

**Setup Steps:**

1. Go to repository Settings → Pages
2. Set Source to "GitHub Actions"
3. Push changes to `main` branch
4. Visit: `https://infinityxonesystems.github.io/construct-iq-360/`

### Manual Deployment

```bash
# Build the site
cd apps/command-center
npm run build

# The out/ folder is ready to deploy to any static host
```

## Environment Configuration

The app uses different base paths for local vs production:

- **Local**: `http://localhost:3000/`
- **Production**: `https://infinityxonesystems.github.io/construct-iq-360/`

This is automatically handled in `next.config.js`.

## Deployment Options

### GitHub Pages (Current)
- Free hosting
- Automatic SSL
- Custom domain support
- CDN included

### Alternative Hosts
- **Vercel**: `vercel deploy`
- **Netlify**: Drag & drop `out/` folder
- **AWS S3**: `aws s3 sync out/ s3://bucket-name`
- **Any static host**: Upload `out/` contents

## PWA Features

The app includes:
- Service Worker (`sw.js`)
- Web App Manifest (`manifest.json`)
- Offline caching
- Add to Home Screen support

## Performance

- Static site generation (SSG)
- Code splitting
- Lazy loading for maps
- Optimized assets
- CDN delivery

## Troubleshooting

### Build Fails

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Map Not Loading

Ensure Leaflet CSS is included in layout.tsx:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

### Base Path Issues

Check `next.config.js` basePath configuration matches your deployment URL.

## Monitoring

Check deployment status:
- GitHub Actions: https://github.com/InfinityXOneSystems/construct-iq-360/actions
- Live Site: https://infinityxonesystems.github.io/construct-iq-360/

---

**Status**: ✅ Production Ready
