#!/bin/bash

set -e

NODE_VERSION="v20.19.3"
NODE_DIR="node-${NODE_VERSION}-linux-x64"
NODE_URL="https://nodejs.org/dist/${NODE_VERSION}/${NODE_DIR}.tar.xz"
INSTALL_PATH="/opt/node20"

echo "➡️ Downloading Node.js ${NODE_VERSION}..."
cd ~
curl -O "${NODE_URL}"

echo "📦 Extracting Node.js..."
tar -xf "${NODE_DIR}.tar.xz"

echo "🚚 Moving to ${INSTALL_PATH}..."
sudo rm -rf "${INSTALL_PATH}"
sudo mv "${NODE_DIR}" "${INSTALL_PATH}"

echo "🛠️ Setting up PATH..."
PROFILE_FILE="$HOME/.bashrc"
if ! grep -q 'export PATH="/opt/node20/bin:$PATH"' "$PROFILE_FILE"; then
  echo 'export PATH="/opt/node20/bin:$PATH"' >> "$PROFILE_FILE"
fi
export PATH="/opt/node20/bin:$PATH"

echo "✅ Installed Node.js:"
node -v
npm -v

echo "🎉 Done! Restart terminal or run: source ~/.bashrc"
