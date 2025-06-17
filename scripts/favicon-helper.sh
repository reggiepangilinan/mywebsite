#!/bin/bash

# Favicon Generation Script
# This script helps convert the SVG favicon to various formats needed for web compatibility

echo "🎨 Favicon Generation Helper"
echo "============================="
echo ""

echo "📁 SVG files created:"
echo "  ✅ /public/favicon.svg (32x32)"
echo "  ✅ /public/icon-192.svg (192x192)"
echo ""

echo "🔧 To generate additional favicon formats, you can use:"
echo ""
echo "Online converters:"
echo "  • https://realfavicongenerator.net/ (Upload favicon.svg)"
echo "  • https://favicon.io/favicon-converter/ (Upload favicon.svg)"
echo "  • https://convertio.co/svg-ico/ (Convert SVG to ICO)"
echo ""

echo "Command line tools (if available):"
echo "  • ImageMagick: convert favicon.svg -resize 32x32 favicon.ico"
echo "  • Inkscape: inkscape favicon.svg -w 32 -h 32 -o favicon.ico"
echo ""

echo "📱 Recommended additional sizes for PWA:"
echo "  • 16x16 (favicon.ico)"
echo "  • 32x32 (favicon.ico)"
echo "  • 48x48 (favicon.png)"
echo "  • 96x96 (favicon.png)"
echo "  • 144x144 (apple-touch-icon.png)"
echo "  • 192x192 (android-chrome-192x192.png)"
echo "  • 512x512 (android-chrome-512x512.png)"
echo ""

echo "✨ Your current favicon setup:"
echo "  • Uses your initials 'RP'"
echo "  • Blue to purple gradient (matches your brand)"
echo "  • Clean, professional design"
echo "  • SVG format for crisp scaling"
echo ""

echo "🚀 Next steps:"
echo "  1. Visit https://realfavicongenerator.net/"
echo "  2. Upload your favicon.svg file"
echo "  3. Download the generated favicon package"
echo "  4. Replace the current favicon.ico in /public/"
echo ""
