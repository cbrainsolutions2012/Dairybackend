# VPS Deployment Checklist for Milk Dairy Backend

## Pre-deployment Setup
- [x] VPS with Ubuntu/Debian (recommended)
- [x] Domain name pointed to VPS IP
- [x] SSH access to VPS
- [x] Root or sudo access
- [x] Database already set up on VPS
- [x] GitHub repository ready for deployment

## Deployment Method: GitHub
Using GitHub for clean, version-controlled deployment to `/var/www/milk-dairy-backend/`

## Step-by-Step Deployment

### 1. Connect to your VPS
```bash
ssh root@your-vps-ip
# or
ssh username@your-vps-ip
```

### 2. Create project directory
```bash
sudo mkdir -p /var/www/milk-dairy-backend
cd /var/www/milk-dairy-backend
```

### 3. Clone from GitHub (Recommended)
```bash
# Clone your repository
git clone https://github.com/cbrainsolutions2012/Dairybackend.git .

# Verify files
ls -la
```

### 4. Run GitHub deployment script
```bash
# Make deployment script executable
chmod +x deploy-github.sh

# Run the automated deployment
sudo ./deploy-github.sh
```

This script will automatically:
- Install Node.js, PM2, Nginx, MySQL client
- Install dependencies
- Set up environment configuration
- Configure Nginx with your domain
- Start the application with PM2
- Set up firewall and optional SSL

### 5. Configure environment variables
```bash
nano .env.production
```
Update with your actual values:
- Database credentials
- Domain name
- JWT secret
- Other production settings

### 6. Connect to your existing database
Since your database is already set up on the VPS, you just need to:
```bash
# Test database connection
mysql -u your_db_user -p your_database_name -e "SHOW TABLES;"
```

If you need to import/update the schema:
```bash
# Import or update database schema (if needed)
mysql -u your_db_user -p your_database_name < milk_dairy.sql
```

### 7. Configure Nginx
```bash
# Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/milk-dairy-api

# Update domain name in config
sudo nano /etc/nginx/sites-available/milk-dairy-api

# Enable site
sudo ln -s /etc/nginx/sites-available/milk-dairy-api /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 8. Setup SSL (Optional but recommended)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 9. Start application
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 process list
pm2 save

# Setup PM2 startup
pm2 startup
# Follow the instructions shown
```

### 10. Test deployment
```bash
# Check if app is running
pm2 status

# Test API endpoint
curl http://your-domain.com/
curl http://your-domain.com/api-docs

# Check logs
pm2 logs milk-dairy-api
```

## Post-deployment

### Firewall Setup
```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Monitoring
```bash
# View logs
pm2 logs

# Monitor performance
pm2 monit

# Restart if needed
pm2 restart milk-dairy-api
```

### Backup Setup
```bash
# Setup automated database backup
crontab -e
# Add: 0 2 * * * mysqldump -u dairy_user -p'password' milk_dairy > /backup/milk_dairy_$(date +\%Y\%m\%d).sql
```

## Troubleshooting

### Common Issues:
1. **Port 3000 already in use**: Change PORT in .env.production
2. **Database connection failed**: Check MySQL credentials
3. **Nginx 502 error**: Ensure Node.js app is running (pm2 status)
4. **Permission denied**: Check file permissions (chown/chmod)

### Useful Commands:
```bash
# View app status
pm2 status

# Restart app
pm2 restart milk-dairy-api

# View logs
pm2 logs milk-dairy-api

# Check nginx status
sudo systemctl status nginx

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

## Future Updates from GitHub

To update your VPS with latest changes:

```bash
# Quick update script
chmod +x update-from-github.sh
./update-from-github.sh
```

Or manually:
```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm install --production

# Restart application
pm2 restart milk-dairy-api
```

## Your API will be available at:
- **HTTP**: http://your-domain.com
- **HTTPS**: https://your-domain.com (after SSL setup)
- **API Docs**: https://your-domain.com/api-docs
