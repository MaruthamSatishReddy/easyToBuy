#!/bin/bash

# EasyToBuy Server Setup Script
# Run this on a fresh Ubuntu 20.04+ server

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔧 EasyToBuy Server Setup${NC}"
echo "=========================="

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update
sudo apt upgrade -y

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo -e "${YELLOW}🐳 Installing Docker Compose...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo -e "${YELLOW}📥 Installing Git...${NC}"
sudo apt install -y git

# Install Java (for building)
echo -e "${YELLOW}☕ Installing Java 21...${NC}"
sudo apt install -y openjdk-21-jdk maven

# Install Nginx
echo -e "${YELLOW}🌐 Installing Nginx...${NC}"
sudo apt install -y nginx

# Configure firewall
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create application directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
sudo mkdir -p /opt/easytobuy
sudo chown $USER:$USER /opt/easytobuy

echo ""
echo -e "${GREEN}✅ Server setup complete!${NC}"
echo "=========================="
echo ""
echo "Next steps:"
echo "1. Clone repository: cd /opt/easytobuy && git clone https://github.com/MaruthamSatishReddy/easyToBuy.git"
echo "2. Configure environment: cd easyToBuy && cp .env.example .env && nano .env"
echo "3. Deploy: ./deploy.sh"
echo ""
echo -e "${YELLOW}⚠️  You may need to log out and back in for Docker permissions to take effect${NC}"
