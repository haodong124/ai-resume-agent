#!/bin/bash

echo "Starting AI Resume Agent development environment..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start development servers
echo "Starting development servers..."
npm run dev
