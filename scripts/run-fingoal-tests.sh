#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}     Fingoal API Integration Test Suite      ${NC}"
echo -e "${BLUE}==============================================${NC}"

# Create output directory if it doesn't exist
mkdir -p scripts/output

# Check if ts-node is installed
if ! command -v ts-node &> /dev/null; then
    echo -e "${RED}ts-node is not installed. Please install it with: npm install -g ts-node${NC}"
    exit 1
fi

# Check if required files exist
if [ ! -f .env.local ]; then
    echo -e "${RED}Error: .env.local file not found. Please create it with Fingoal credentials.${NC}"
    echo "Required variables:"
    echo "  FINGOAL_CLIENT_ID=your_client_id"
    echo "  FINGOAL_CLIENT_SECRET=your_client_secret"
    echo "  FINGOAL_BASE_URL=https://findmoney-dev.fingoal.com/v3"
    exit 1
fi

echo -e "\n${BLUE}Step 1: Testing Fingoal Authentication${NC}"
echo "----------------------------------------"
ts-node scripts/test-fingoal-auth.ts
AUTH_RESULT=$?

if [ $AUTH_RESULT -ne 0 ]; then
    echo -e "${RED}Authentication test failed. Please check your credentials.${NC}"
    exit 1
fi

echo -e "\n${BLUE}Step 2: Testing Transaction Enrichment${NC}"
echo "----------------------------------------"
ts-node scripts/test-fingoal-enrichment.ts
ENRICHMENT_RESULT=$?

if [ $ENRICHMENT_RESULT -ne 0 ]; then
    echo -e "${RED}Enrichment test failed. Please check the error messages above.${NC}"
    exit 1
fi

echo -e "\n${GREEN}All tests completed successfully!${NC}"
echo -e "${BLUE}==============================================${NC}"
echo "Detailed results are saved in the scripts/output directory."
echo -e "${BLUE}==============================================${NC}" 