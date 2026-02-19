# Construct-OS Command Center 🎯

**Central Intelligence Dashboard for Construction Lead Automation**

## Overview

The Command Center is a Next.js 14 production-ready dashboard that provides real-time visibility into the Construct-OS autonomous lead generation system.

## Features

- **🗺️ Live Lead Map**: Interactive Leaflet.js map displaying Orlando construction leads
- **�� Real-Time Metrics**: Live dashboard with project values, success rates, and system status
- **💻 System Terminal**: Live log feed showing Hunter-Killer operations
- **📋 Project Board**: GitHub Projects integration
- **⚡ PWA Ready**: Progressive Web App with offline capabilities
- **🌙 Dark Theme**: Vegas Matt style with neon green (#39FF14) accents
- **📱 Mobile-First**: Fully responsive design

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Leaflet.js / React-Leaflet
- Static Export for GitHub Pages

## Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

The dashboard is configured for GitHub Pages deployment with:
- Static export (`output: 'export'`)
- Base path configuration
- PWA manifest and service worker
- Optimized assets

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout with PWA integration
│   └── page.tsx         # Main dashboard page
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section with live stats
│   ├── MetricCard.tsx   # Metric display cards
│   ├── LeadMap.tsx      # Map wrapper component
│   ├── LeafletMap.tsx   # Leaflet implementation
│   ├── Terminal.tsx     # Live terminal logs
│   ├── ProjectBoard.tsx # GitHub Projects display
│   └── ActionButtons.tsx # Quick action buttons
├── lib/
│   ├── leads.ts         # Lead data utilities
│   └── terminal.ts      # Terminal log generation
└── styles/
    └── globals.css      # Global styles and Leaflet overrides
```

## Color Palette

- **Background**: `#000000` (Black)
- **Surface**: `#0a0a0a` (Dark Gray)
- **Border**: `#1a1a1a` (Darker Gray)
- **Primary**: `#FFFFFF` (White)
- **Accent**: `#39FF14` (Neon Green)

## Performance

- Static site generation
- Optimized images
- Code splitting
- PWA caching

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Proprietary - Infinity X One Systems

---

**Built with 🤖 by Construct-OS**
