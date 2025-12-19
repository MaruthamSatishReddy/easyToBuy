#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⏮️  Rolling back to previous version...${NC}"

# Get current commit
CURRENT_COMMIT=$(git rev-parse HEAD)

# Get previous commit
PREVIOUS_COMMIT=$(git rev-parse HEAD~1)

echo -e "${YELLOW}Current commit: $CURRENT_COMMIT${NC}"
echo -e "${YELLOW}Rolling back to: $PREVIOUS_COMMIT${NC}"

# Confirm rollback
read -p "Are you sure you want to rollback? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Rollback cancelled${NC}"
    exit 1
fi

# Checkout previous commit
git checkout $PREVIOUS_COMMIT

# Rebuild and redeploy
echo -e "${GREEN}Rebuilding and redeploying...${NC}"
./deploy.sh

echo -e "${GREEN}✅ Rollback complete!${NC}"
echo -e "${YELLOW}To return to latest: git checkout main${NC}"
