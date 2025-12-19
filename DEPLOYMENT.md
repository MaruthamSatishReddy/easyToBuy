# EasyToBuy Deployment Guide

## Quick Deployment (3 Steps)

### 1. Server Setup (One-time)

SSH into your server and run:

```bash
# Download and run server setup script
wget https://raw.githubusercontent.com/MaruthamSatishReddy/easyToBuy/main/server-setup.sh
chmod +x server-setup.sh
./server-setup.sh
```

### 2. Clone and Configure

```bash
# Clone repository
cd /opt/easytobuy
git clone https://github.com/MaruthamSatishReddy/easyToBuy.git
cd easyToBuy

# Configure environment
cp .env.example .env
nano .env  # Edit with your OpenAI API key and other settings
```

### 3. Deploy

```bash
# Make scripts executable
chmod +x deploy.sh rollback.sh

# Deploy application
./deploy.sh
```

That's it! Your application will be running at:
- Frontend: http://your-server-ip:4200
- APIs: http://your-server-ip:8081, 8082, 8083, 8085, 8086

## Optional: Domain & SSL Setup

### Configure Nginx Reverse Proxy

```bash
# Copy nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/easytobuy

# Update domain name in the file
sudo nano /etc/nginx/sites-available/easytobuy

# Enable site
sudo ln -s /etc/nginx/sites-available/easytobuy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Install SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Maintenance Commands

```bash
# View logs
docker compose logs -f

# Restart services
docker compose restart

# Stop all services
docker compose down

# Update to latest version
git pull origin main
./deploy.sh

# Rollback to previous version
./rollback.sh
```

## Monitoring

- Grafana: http://your-domain.com/grafana (admin/admin)
- Prometheus: http://your-domain.com/prometheus
- Kafka UI: http://your-domain.com/kafka-ui

## Troubleshooting

### Services not starting
```bash
docker compose logs <service-name>
docker compose restart <service-name>
```

### Port conflicts
```bash
sudo lsof -i :<port>
sudo kill -9 <PID>
```

### Out of memory
```bash
docker system prune -a
```
