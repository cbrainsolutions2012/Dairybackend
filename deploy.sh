#!/bin/bash

# VPS Deployment Script for Milk Dairy Backend
# Run this script on your VPS after uploading the code

echo "🚀 Starting Milk Dairy Backend Deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL (if not already installed)
echo "📦 Installing MySQL..."
sudo apt install mysql-server -y
sudo systemctl start mysql
sudo systemctl enable mysql

# Install Nginx (for reverse proxy)
echo "📦 Installing Nginx..."
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install PM2 globally
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Navigate to project directory
cd /var/www/milk-dairy-backend

# Install dependencies
echo "📦 Installing project dependencies..."
npm install --production

# Setup logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Setup database
echo "🗄️ Setting up database..."
mysql -u root -p < milk_dairy.sql

# Copy environment file
echo "⚙️ Setting up environment variables..."
cp .env.production.template .env.production
echo "❗ Please edit .env.production with your actual values"

# Set proper permissions
echo "🔐 Setting file permissions..."
sudo chown -R www-data:www-data /var/www/milk-dairy-backend
sudo chmod -R 755 /var/www/milk-dairy-backend

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

echo "✅ Deployment completed!"
echo "📝 Next steps:"
echo "1. Edit .env.production with your actual database and domain values"
echo "2. Configure Nginx reverse proxy (see nginx.conf)"
echo "3. Setup SSL certificate"
echo "4. Restart services: pm2 restart milk-dairy-api"
