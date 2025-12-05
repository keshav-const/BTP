#!/bin/bash

echo "=========================================="
echo "Product Images Status Check"
echo "=========================================="
echo ""

# Check MongoDB
echo "1. MongoDB Status:"
if docker ps | grep -q mongodb; then
    echo "   ✅ MongoDB container is running"
else
    echo "   ❌ MongoDB container is not running"
fi
echo ""

# Check Backend
echo "2. Backend API Status:"
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "   ✅ Backend API is running on port 3000"
else
    echo "   ❌ Backend API is not responding (status: $BACKEND_STATUS)"
fi
echo ""

# Check Frontend
echo "3. Frontend Status:"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "   ✅ Frontend is running on port 3001"
else
    echo "   ❌ Frontend is not responding (status: $FRONTEND_STATUS)"
fi
echo ""

# Check Products Count
echo "4. Database Products:"
PRODUCT_COUNT=$(curl -s http://localhost:3000/api/products?limit=1 | jq -r '.data.pagination.total' 2>/dev/null)
if [ "$PRODUCT_COUNT" = "27" ]; then
    echo "   ✅ Database has 27 products"
else
    echo "   ❌ Database has $PRODUCT_COUNT products (expected 27)"
fi
echo ""

# Check Images
echo "5. Product Images:"
NO_IMAGES=$(curl -s http://localhost:3000/api/products?limit=27 | jq '[.data.data[] | select(.images == null or .images == [] or (.images | length) == 0)] | length' 2>/dev/null)
if [ "$NO_IMAGES" = "0" ]; then
    echo "   ✅ All 27 products have images"
else
    echo "   ❌ $NO_IMAGES products are missing images"
fi
echo ""

# Sample product
echo "6. Sample Product Image:"
SAMPLE_IMAGE=$(curl -s http://localhost:3000/api/products?limit=1 | jq -r '.data.data[0] | "\(.name): \(.images[0])"' 2>/dev/null)
echo "   $SAMPLE_IMAGE"
echo ""

echo "=========================================="
echo "Summary"
echo "=========================================="
echo ""
echo "Services:"
echo "  • Backend API: http://localhost:3000"
echo "  • Frontend:    http://localhost:3001"
echo ""
echo "Open browser to: http://localhost:3001/products"
echo ""
echo "All product images should be visible!"
echo "=========================================="
