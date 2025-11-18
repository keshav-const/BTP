#!/bin/bash

echo "========================================="
echo "Backend Endpoints Test Suite"
echo "========================================="
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "GET /health"
curl -s http://localhost:5000/health | jq -c '{success, message}'
echo ""
echo ""

# Test 2: Products List (no auth required)
echo "Test 2: Products List (Public)"
echo "GET /api/products"
PRODUCTS_RESPONSE=$(curl -s http://localhost:5000/api/products)
echo $PRODUCTS_RESPONSE | jq -c '{success, message, productCount: .data.pagination.total}'
echo ""
echo ""

# Test 3: Login
echo "Test 3: Login"
echo "POST /api/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
echo $LOGIN_RESPONSE | jq -c '{success, message, hasToken: (.data.accessToken != null)}'
echo ""
echo ""

# Test 4: Get Profile (auth required)
echo "Test 4: Get Profile (Protected)"
echo "GET /api/auth/profile"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/auth/profile | jq -c '{success, message, email: .data.email}'
echo ""
echo ""

# Test 5: Get Cart (auth required)
echo "Test 5: Get Cart (Protected)"
echo "GET /api/cart"
curl -s -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/cart | jq -c '{success, message, totalItems: .data.totalQuantity}'
echo ""
echo ""

# Test 6: Error case - Missing auth
echo "Test 6: Error Case - Missing Authorization"
echo "GET /api/auth/profile (no token)"
curl -s http://localhost:5000/api/auth/profile | jq -c '{success, message}'
echo ""
echo ""

# Test 7: Error case - Invalid token
echo "Test 7: Error Case - Invalid Token"
echo "GET /api/auth/profile (bad token)"
curl -s -H "Authorization: Bearer invalid_token" http://localhost:5000/api/auth/profile | jq -c '{success, message}'
echo ""
echo ""

# Test 8: Error case - 404
echo "Test 8: Error Case - Not Found"
echo "GET /api/nonexistent"
curl -s http://localhost:5000/api/nonexistent | jq -c '{success, message}'
echo ""
echo ""

echo "========================================="
echo "All tests completed!"
echo "========================================="
