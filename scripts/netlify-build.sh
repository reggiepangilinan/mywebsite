#!/bin/bash

# Build script for Netlify deployment
echo "Starting Netlify build..."

# Install dependencies
npm ci

# Build the project
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📂 Static files are in the 'out' directory"
else
    echo "❌ Build failed!"
    exit 1
fi
