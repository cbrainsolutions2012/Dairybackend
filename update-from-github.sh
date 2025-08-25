#!/bin/bash

# GitHub Update Script for Milk Dairy Backend
# Run this script to update your VPS with latest changes from GitHub

echo "🔄 Updating Milk Dairy Backend from GitHub..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This is not a git repository. Please ensure you cloned from GitHub."
    exit 1
fi

# Backup current .env.production
if [ -f ".env.production" ]; then
    echo "💾 Backing up current .env.production..."
    cp .env.production .env.production.backup
fi

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

if [ $? -ne 0 ]; then
    echo "❌ Git pull failed. Please resolve conflicts manually."
    exit 1
fi

# Restore .env.production if it was overwritten
if [ -f ".env.production.backup" ]; then
    if [ -f ".env.production.template" ] && ! cmp -s ".env.production" ".env.production.backup"; then
        echo "⚠️  .env.production may have been updated. Checking differences..."
        echo "Current production config backed up as .env.production.backup"
        
        # Show differences if any
        if ! cmp -s ".env.production.template" ".env.production.backup"; then
            echo "📝 New environment variables may be available. Please review:"
            diff .env.production.template .env.production.backup || true
        fi
        
        mv .env.production.backup .env.production
    else
        rm .env.production.backup
    fi
fi

# Update dependencies
echo "📦 Updating Node.js dependencies..."
npm install --production

# Restart application
echo "🔄 Restarting application..."
pm2 restart milk-dairy-api

# Show status
echo ""
echo "✅ Update completed!"
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "📝 Recent commits:"
git log --oneline -5

echo ""
echo "🌐 Your API is running at:"
echo "   Check: curl http://localhost:3000"
echo "   Docs:  Your configured domain/api-docs"
