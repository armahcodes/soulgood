#!/bin/bash
set -e

cd /Users/ben/projects/soulgood

# Install dependencies if node_modules doesn't exist or package.json changed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules/.package-lock.json" ]; then
  echo "Installing dependencies..."
  pnpm install
fi

echo "Environment ready."
