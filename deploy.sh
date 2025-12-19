#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 EasyToBuy Deployment Script${NC}"
echo "================================"

# Check if running on server
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    cat > .env << EOF
# OpenAI API Key for AI features
OPENAI_API_KEY=your-openai-api-key-here

# MongoDB Configuration
MONGODB_ROOT_PASSWORD=admin123

# Kafka Configuration
KAFKA_BOOTSTRAP_SERVERS=kafka:29092
EOF
    echo -e "${YELLOW}⚠️  Please edit .env file with your actual values before continuing!${NC}"
    exit 1
fi

# Pull latest code
echo -e "${GREEN}📥 Pulling latest code from GitHub...${NC}"
git pull origin main

# Build all backend services
echo -e "${GREEN}🔨 Building backend services...${NC}"
cd backend

services=("product-service" "auth-service" "order-service" "inventory-service" "notification-service" "rating-service")

for service in "${services[@]}"; do
    echo -e "${YELLOW}Building $service...${NC}"
    cd $service
    mvn clean package -DskipTests
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to build $service${NC}"
        exit 1
    fi
    cd ..
done

echo -e "${GREEN}✅ All services built successfully${NC}"

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose down

# Start new containers
echo -e "${GREEN}▶️  Starting new containers...${NC}"
docker compose up -d --build

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to start (30 seconds)...${NC}"
sleep 30

# Check service health
echo -e "${GREEN}🏥 Checking service health...${NC}"
docker compose ps

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo "================================"
echo -e "📊 Frontend: ${GREEN}http://localhost:4200${NC}"
echo -e "🔧 Product API: ${GREEN}http://localhost:8081/swagger-ui.html${NC}"
echo -e "⭐ Rating API: ${GREEN}http://localhost:8086/swagger-ui.html${NC}"
echo -e "🔐 Auth API: ${GREEN}http://localhost:8085/swagger-ui.html${NC}"
echo -e "📈 Grafana: ${GREEN}http://localhost:3001${NC}"
echo -e "📊 Prometheus: ${GREEN}http://localhost:9099${NC}"
echo -e "🎛️  Kafka UI: ${GREEN}http://localhost:8080${NC}"
echo ""
echo -e "${YELLOW}💡 To view logs: docker compose logs -f${NC}"
echo -e "${YELLOW}💡 To stop: docker compose down${NC}"
