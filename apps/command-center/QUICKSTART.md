# ⚡ Command Center - Quick Start Guide

Get the dashboard running in under 2 minutes!

## 🚀 Installation (30 seconds)

```bash
cd apps/command-center
npm install --legacy-peer-deps
```

## 💻 Development (10 seconds)

```bash
npm run dev
```

**Open**: http://localhost:3000

You should see:
- ✅ Dark theme with neon green accents
- ✅ Live clock in hero section
- ✅ 4 metric cards showing lead stats
- ✅ Interactive map with 5 Orlando leads
- ✅ Terminal with live logs
- ✅ Project board with tasks
- ✅ Action buttons

## 🏗️ Production Build (1 minute)

```bash
npm run build
```

**Output**: `out/` directory with 31 static files ready for deployment

## ✅ Verify Build

```bash
./verify-build.sh
```

Should show all checks passing ✅

## 🌐 View Production Build Locally

```bash
# Install a simple HTTP server
npm install -g serve

# Serve the out directory
serve out -p 3000
```

**Open**: http://localhost:3000

## 📦 What You Get

### Dashboard Sections
1. **Header** - Navigation + system status indicators
2. **Hero** - Live metrics with animated stats
3. **Metrics** - 4 cards showing lead statistics
4. **Map** - Interactive Leaflet map with lead markers
5. **Terminal** - Live system logs (updates every 5 seconds)
6. **Projects** - GitHub project board integration
7. **Actions** - Quick access buttons

### Interactive Features
- Click map markers to see lead details
- Terminal auto-scrolls with new logs
- All buttons link to GitHub
- Smooth scroll navigation
- Responsive on all devices

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```js
colors: {
  'neon-green': '#39FF14',  // Change to your color
  'dark-bg': '#000000',     // Background color
}
```

### Add Lead Data
Place JSON files in `public/data/raw-leads/`:
```json
{
  "scrape_date": "2026-02-19",
  "leads": [...]
}
```

### Modify Terminal Logs
Edit `src/lib/terminal.ts`:
```typescript
const messages = [
  'Your custom log message',
  // Add more messages
];
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps
```

### Map Not Loading
- Check console for errors
- Ensure Leaflet CSS is loaded
- Verify lead data has lat/lng coordinates

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

## 📱 Mobile Testing

### iOS Safari
1. Open on iPhone/iPad
2. Tap Share icon
3. Select "Add to Home Screen"
4. App icon appears on home screen

### Android Chrome
1. Open on Android device
2. Tap menu (3 dots)
3. Select "Add to Home screen"
4. App installs as PWA

## 🔧 Development Tips

### Hot Reload
- Edit any file in `src/`
- Browser auto-refreshes
- Changes appear instantly

### Component Location
- Pages: `src/app/page.tsx`
- Components: `src/components/*.tsx`
- Styles: `src/styles/globals.css`
- Utils: `src/lib/*.ts`

### Adding Components
1. Create file in `src/components/`
2. Import in `src/app/page.tsx`
3. Add to layout

## 📊 Performance

### Lighthouse Scores (Expected)
- Performance: 95+
- Accessibility: 90+
- Best Practices: 100
- SEO: 100
- PWA: Yes

### Bundle Size
- First Load JS: ~108 kB
- Page Weight: ~1.1 MB
- Load Time: <2s on 3G

## �� Deploy to GitHub Pages

See `DEPLOYMENT.md` for detailed instructions.

**TL;DR**:
1. Push to `main` branch
2. GitHub Actions auto-deploys
3. Visit deployed site

## 💡 Pro Tips

1. **Use Chrome DevTools** for responsive testing
2. **Enable React DevTools** for component debugging
3. **Check Network tab** to verify static assets load
4. **Test PWA** in incognito mode
5. **Lighthouse audit** before deploying

## 🎯 Next Steps

- [ ] Customize colors and branding
- [ ] Add your own lead data
- [ ] Connect to live data source
- [ ] Add authentication (if needed)
- [ ] Deploy to production
- [ ] Set up custom domain

## 📚 Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Leaflet.js](https://leafletjs.com/)
- [React-Leaflet](https://react-leaflet.js.org/)

---

**Ready to build something amazing!** 🎉

For support, check:
- README.md - Overview
- DEPLOYMENT.md - Deploy guide
- FEATURES.md - Feature list
- PROJECT_STATUS.md - Status
