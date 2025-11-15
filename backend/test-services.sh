#!/bin/bash

# OneWorld Backend Service Test Script
# This script tests all the backend API endpoints

set -e

BASE_URL_AUTH="http://localhost:3001"
BASE_URL_COMMENT="http://localhost:3002"

echo "======================================"
echo "OneWorld Backend Services Test"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local headers=$5
    
    echo -n "Testing $name... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -X $method "$url" $headers)
    else
        response=$(curl -s -X $method "$url" -H "Content-Type: application/json" $headers -d "$data")
    fi
    
    # Check for success or healthy status
    if echo "$response" | grep -q '"success":true\|"status":"healthy"'; then
        echo -e "${GREEN}✓ PASSED${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        echo "Response: $response"
        return 1
    fi
}

echo "1. Health Checks"
echo "----------------"
test_endpoint "Auth Service Health" "GET" "$BASE_URL_AUTH/health"
test_endpoint "Comment Service Health" "GET" "$BASE_URL_COMMENT/health"
echo ""

echo "2. User Registration & Authentication"
echo "--------------------------------------"
# Generate unique email
TIMESTAMP=$(date +%s)
EMAIL="testuser${TIMESTAMP}@example.com"
USERNAME="testuser${TIMESTAMP}"

# Register user
echo -n "Registering new user... "
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL_AUTH/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"username\": \"$USERNAME\",
        \"email\": \"$EMAIL\",
        \"password\": \"password123\",
        \"fullName\": \"Test User\"
    }")

if echo "$REGISTER_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ PASSED${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "Token received: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi
echo ""

echo "3. User Login"
echo "-------------"
echo -n "Logging in... "
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL_AUTH/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$EMAIL\",
        \"password\": \"password123\"
    }")

if echo "$LOGIN_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi
echo ""

echo "4. Profile Management"
echo "---------------------"
echo -n "Get Profile... "
GET_PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL_AUTH/api/auth/profile" \
    -H "Authorization: Bearer $TOKEN")

if echo "$GET_PROFILE_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $GET_PROFILE_RESPONSE"
fi

echo -n "Update Profile... "
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL_AUTH/api/auth/profile" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
        \"fullName\": \"Updated Test User\",
        \"bio\": \"This is a test bio\"
    }")

if echo "$UPDATE_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $UPDATE_RESPONSE"
fi
echo ""

echo "5. Comment Operations"
echo "---------------------"
echo -n "Create Comment... "
CREATE_COMMENT_RESPONSE=$(curl -s -X POST "$BASE_URL_COMMENT/api/comments" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
        \"postId\": 1,
        \"content\": \"This is a test comment!\"
    }")

if echo "$CREATE_COMMENT_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ PASSED${NC}"
    COMMENT_ID=$(echo "$CREATE_COMMENT_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
    echo "Comment ID: $COMMENT_ID"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $CREATE_COMMENT_RESPONSE"
    exit 1
fi

echo -n "Get Comments for Post... "
GET_COMMENTS_RESPONSE=$(curl -s -X GET "$BASE_URL_COMMENT/api/comments/post/1")

if echo "$GET_COMMENTS_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $GET_COMMENTS_RESPONSE"
fi

echo -n "Update Comment... "
UPDATE_COMMENT_RESPONSE=$(curl -s -X PUT "$BASE_URL_COMMENT/api/comments/$COMMENT_ID" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
        \"content\": \"This is an updated comment!\"
    }")

if echo "$UPDATE_COMMENT_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $UPDATE_COMMENT_RESPONSE"
fi

echo -n "Delete Comment... "
DELETE_COMMENT_RESPONSE=$(curl -s -X DELETE "$BASE_URL_COMMENT/api/comments/$COMMENT_ID" \
    -H "Authorization: Bearer $TOKEN")

if echo "$DELETE_COMMENT_RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✓ PASSED${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo "Response: $DELETE_COMMENT_RESPONSE"
fi
echo ""

echo "======================================"
echo -e "${GREEN}All tests completed successfully!${NC}"
echo "======================================"
