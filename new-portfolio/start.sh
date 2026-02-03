#!/bin/bash

# Omar Abdelzaher Portfolio - Quick Start Guide
# This script helps you get the new portfolio running

echo "🚀 Omar's New Portfolio - Quick Start"
echo "======================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is required but not installed. Please install Python 3.x"
    exit 1
fi

echo "✅ Python found!"
echo ""
echo "Starting development server..."
echo "Visit: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")" || exit
python3 -m http.server 8000 --bind 127.0.0.1
