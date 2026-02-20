#!/bin/bash
# Manual GitHub Pages Deployment Script
# Use this to deploy Command Center to GitHub Pages from any branch

set -e

echo "🚀 CONSTRUCT-OS COMMAND CENTER - MANUAL DEPLOYMENT"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must run from apps/command-center directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Build the app
echo "🔨 Building Next.js app..."
NODE_ENV=production npm run build

# Check if build succeeded
if [ ! -d "out" ]; then
    echo "❌ Error: Build failed - no 'out' directory created"
    exit 1
fi

echo "✅ Build completed successfully"
echo ""
echo "📊 Build Output:"
ls -lh out/ | head -10
echo ""

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."

# Check if gh-pages branch exists
cd ../..
git fetch origin gh-pages 2>/dev/null || echo "Creating new gh-pages branch"

# Copy build output
if [ -d "gh-pages-temp" ]; then
    rm -rf gh-pages-temp
fi

mkdir -p gh-pages-temp
cp -r apps/command-center/out/* gh-pages-temp/

# Create .nojekyll file (important for GitHub Pages)
touch gh-pages-temp/.nojekyll

# Create CNAME if needed (optional - uncomment if you have a custom domain)
# echo "your-domain.com" > gh-pages-temp/CNAME

# Commit and push to gh-pages branch
git checkout --orphan gh-pages-new || git checkout gh-pages
git --work-tree=gh-pages-temp add --all
git --work-tree=gh-pages-temp commit -m "Deploy Command Center - $(date -u +%Y-%m-%d\ %H:%M:%S\ UTC)"
git push origin HEAD:gh-pages --force

# Cleanup
rm -rf gh-pages-temp
git checkout -

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo "=================================================="
echo "🌐 Your site will be available at:"
echo "   https://infinity-x-one-systems.github.io/construct-iq-360/"
echo ""
echo "⏰ Note: GitHub Pages may take 1-2 minutes to update"
echo "=================================================="
