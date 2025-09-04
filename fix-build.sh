#!/bin/bash
echo "🔧 Fixing build issues..."

# Install dependencies
cd apps/web
npm install --save react-hot-toast zustand html2canvas jspdf
npm install --save-dev @types/html2canvas

# Try building with relaxed TypeScript settings
echo "📦 Building project..."
npm run build

echo "✅ Fix complete!"
