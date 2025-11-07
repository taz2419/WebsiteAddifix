#!/bin/bash

echo "🚀 AddiFix Website Setup Script"
echo "================================"

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [[ $(uname -m) == 'arm64' ]]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
else
    echo "✅ Homebrew is already installed"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Installing Node.js..."
    brew install node
else
    echo "✅ Node.js is already installed ($(node --version))"
fi

# Install project dependencies
echo "📦 Installing project dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the server, run:"
echo "  npm start"
echo ""
echo "Then open your browser to: http://localhost:3000"
