#!/bin/bash

echo "Building AI Resume Agent..."

# Clean previous builds
echo "Cleaning previous builds..."
npm run clean

# Build all packages
echo "Building packages..."
npm run build

# Check build output
if [ -d "apps/web/dist" ] && [ -d "apps/functions/dist" ]; then
  echo "✅ Build successful!"
  echo "Web app built to: apps/web/dist"
  echo "Functions built to: apps/functions/dist"
else
  echo "❌ Build failed!"
  exit 1
fi
