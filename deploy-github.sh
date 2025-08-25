#!/bin/bash

# GitHub-based VPS Deployment Script for Milk Dairy Backend
# Run this script on your VPS after cloning from GitHub

echo "🚀 Starting GitHub deployment for Milk Dairy Backend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x if not installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    sudo npm install -g pm2
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "📦 Installing Nginx..."
    sudo apt install -y nginx
fi

# Install MySQL client if not installed (for testing database connection)
if ! command -v mysql &> /dev/null; then
    echo "📦 Installing MySQL client..."
    sudo apt install -y mysql-client
fi

# Install project dependencies
echo "📦 Installing Node.js dependencies..."
npm install --production

# Create production environment file
echo "⚙️  Setting up production environment..."
if [ ! -f ".env.production" ]; then
    echo "Creating .env.production from template..."
    cp .env.production.template .env.production
    echo "⚠️  IMPORTANT: Please edit .env.production with your actual values:"
    echo "   - Database credentials"
    echo "   - Your domain name"
    echo "   - JWT secret"
    echo "   - Other production settings"
    echo ""
    read -p "Press Enter to edit .env.production now..." -r
    nano .env.production
fi

# Test database connection
echo "🔍 Testing database connection..."
read -p "Enter your database username: " DB_USER
read -s -p "Enter your database password: " DB_PASS
echo ""
read -p "Enter your database name: " DB_NAME

if mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES;" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
else
    echo "❌ Database connection failed. Please check your credentials."
    exit 1
fi

# Set up Nginx configuration
echo "🌐 Setting up Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/milk-dairy-api

# Update domain in nginx config
read -p "Enter your domain name (e.g., api.yourdomain.com): " DOMAIN_NAME
sudo sed -i "s/your-domain.com/$DOMAIN_NAME/g" /etc/nginx/sites-available/milk-dairy-api

# Enable site
sudo ln -sf /etc/nginx/sites-available/milk-dairy-api /etc/nginx/sites-enabled/

# Test nginx configuration
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    sudo systemctl restart nginx
    sudo systemctl enable nginx
else
    echo "❌ Nginx configuration error. Please check the config file."
    exit 1
fi

# Start application with PM2
echo "🚀 Starting application with PM2..."
pm2 delete milk-dairy-api 2>/dev/null || true
pm2 start ecosystem.config.js --env production

# Save PM2 process list and setup startup
pm2 save
pm2 startup | tail -1 | sudo bash

# Setup firewall
echo "🔒 Setting up firewall..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Setup SSL certificate (optional)
read -p "Do you want to setup SSL certificate with Let's Encrypt? (y/n): " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d "$DOMAIN_NAME" --non-interactive --agree-tos --email admin@"$DOMAIN_NAME"
fi

# Final status check
echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "🌐 Your API is now available at:"
echo "   HTTP:  http://$DOMAIN_NAME"
echo "   HTTPS: https://$DOMAIN_NAME (if SSL was configured)"
echo "   Docs:  https://$DOMAIN_NAME/api-docs"
echo ""
echo "📝 Useful commands:"
echo "   pm2 status          - Check app status"
echo "   pm2 logs            - View logs"
echo "   pm2 restart all     - Restart app"
echo "   sudo systemctl status nginx - Check Nginx status"
echo ""
echo "🔄 To update from GitHub in the future:"
echo "   git pull origin main"
echo "   npm install"
echo "   pm2 restart milk-dairy-api"
