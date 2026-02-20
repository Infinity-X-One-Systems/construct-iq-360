#!/bin/bash

echo "🚀 Verifying Command Center Build..."
echo ""

# Check required files exist
files=(
  "out/index.html"
  "out/manifest.json"
  "out/sw.js"
  "out/favicon.svg"
  "out/data/raw-leads/2026-02-19.json"
  "out/icons/icon-192x192.png"
  "out/icons/icon-512x512.png"
)

echo "📁 Checking required files..."
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ MISSING: $file"
    exit 1
  fi
done

echo ""
echo "📄 Checking HTML content..."
if grep -q "CONSTRUCT-OS" out/index.html; then
  echo "  ✅ Title found"
else
  echo "  ❌ Title not found"
  exit 1
fi

if grep -q "neon-green" out/index.html; then
  echo "  ✅ Theme colors found"
else
  echo "  ❌ Theme colors not found"
  exit 1
fi

echo ""
echo "🗺️ Checking lead data..."
if grep -q "Orange County Convention Center" out/data/raw-leads/2026-02-19.json; then
  echo "  ✅ Lead data intact"
else
  echo "  ❌ Lead data missing"
  exit 1
fi

echo ""
echo "📊 Build Statistics:"
echo "  HTML Size: $(wc -c < out/index.html) bytes"
echo "  Total Files: $(find out -type f | wc -l)"
echo "  Total Size: $(du -sh out | cut -f1)"

echo ""
echo "✅ All checks passed! Build is ready for deployment."
