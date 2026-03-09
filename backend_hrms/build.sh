#!/usr/bin/env bash
# Render build script — installs dependencies and runs migrations

set -o errexit

echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🗄️ Running database migrations..."
alembic upgrade head

echo "✅ Build complete!"
