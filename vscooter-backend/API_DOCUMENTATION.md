# VScooter API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://api.vscooter.com
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## User Routes (`/api/users`)

### Public Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890" // optional
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Forgot Password
```http
POST /api/users/forgotpassword
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
PUT /api/users/resetpassword/:resettoken

{
  "password": "newpassword123"
}
```

#### Verify Email
```http
GET /api/users/verify/:token
```

### Protected Endpoints (Require Authentication)

#### Get Current User
```http
GET /api/users/me
Authorization: Bearer <token>
```

#### Update User Details
```http
PUT /api/users/me
Authorization: Bearer <token>

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Update Password
```http
PUT /api/users/updatepassword
Authorization: Bearer <token>

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### Logout
```http
POST /api/users/logout
Authorization: Bearer <token>
```

#### Add Shipping Address
```http
POST /api/users/addresses
Authorization: Bearer <token>

{
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "postalCode": "10001",
  "country": "USA",
  "isDefault": true
}
```

#### Update Shipping Address
```http
PUT /api/users/addresses/:addressId
Authorization: Bearer <token>

{
  "street": "456 Oak Ave",
  "isDefault": false
}
```

#### Delete Shipping Address
```http
DELETE /api/users/addresses/:addressId
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Users
```http
GET /api/users?page=1&limit=20&role=customer
Authorization: Bearer <admin_token>
```

#### Get Single User
```http
GET /api/users/:id
Authorization: Bearer <admin_token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <admin_token>

{
  "role": "admin",
  "isActive": true
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

---

## Product Routes (`/api/products`)

### Public Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=scooter&search=falcon&sort=price-asc&minPrice=500&maxPrice=1500&minRating=4&inStock=true&featured=true
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)
- `category`: Filter by category
- `tags`: Filter by tags (comma-separated)
- `search`: Search in name/description
- `sort`: price-asc, price-desc, rating, popular, newest, name
- `minPrice`, `maxPrice`: Price range
- `minRating`: Minimum rating
- `inStock`: true/false
- `featured`: true/false

#### Get Single Product
```http
GET /api/products/:id
```

#### Get Product by Slug
```http
GET /api/products/slug/:slug
```

#### Get Categories
```http
GET /api/products/categories
```

#### Get Tags
```http
GET /api/products/tags
```

#### Get Featured Products
```http
GET /api/products/featured?limit=4
```

#### Get Related Products
```http
GET /api/products/:id/related?limit=4
```

#### Check Stock Availability
```http
POST /api/products/check-stock

{
  "items": [
    { "productId": "60d5ec49e35b2c001f8e4f1a", "quantity": 2 },
    { "productId": "60d5ec49e35b2c001f8e4f1b", "quantity": 1 }
  ]
}
```

### Admin Endpoints

#### Create Product
```http
POST /api/products
Authorization: Bearer <admin_token>

{
  "name": { "en": "Falcon 500", "de": "Falcon 500" },
  "description": { "en": "Premium scooter", "de": "Premium-Roller" },
  "category": "scooter",
  "pricing": {
    "regularPrice": { "USD": 899, "EUR": 899 },
    "salePrice": { "USD": 799, "EUR": 799 }
  },
  "inventory": {
    "stock": 50,
    "lowStockThreshold": 10
  },
  "images": ["image1.jpg", "image2.jpg"],
  "specifications": {
    "range": { "miles": 35, "kilometers": 56 },
    "maxSpeed": { "mph": 25, "kmh": 40 },
    "weight": { "pounds": 26, "kilograms": 12 },
    "chargeTime": { "hours": 4 }
  },
  "tags": ["electric", "premium"],
  "isFeatured": true
}
```

#### Update Product
```http
PUT /api/products/:id
Authorization: Bearer <admin_token>

{
  "pricing": {
    "salePrice": { "USD": 749, "EUR": 749 }
  }
}
```

#### Delete Product
```http
DELETE /api/products/:id
Authorization: Bearer <admin_token>
```

#### Update Inventory
```http
PATCH /api/products/:id/inventory
Authorization: Bearer <admin_token>

{
  "stock": 45,
  "lowStockThreshold": 5
}
```

---

## Cart Routes (`/api/cart`)

All cart routes require authentication.

#### Get Cart
```http
GET /api/cart
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /api/cart/items
Authorization: Bearer <token>

{
  "productId": "60d5ec49e35b2c001f8e4f1a",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/items/:productId
Authorization: Bearer <token>

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/items/:productId
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer <token>
```

#### Apply Coupon
```http
POST /api/cart/coupon
Authorization: Bearer <token>

{
  "code": "SAVE20"
}
```

#### Remove Coupon
```http
DELETE /api/cart/coupon
Authorization: Bearer <token>
```

#### Validate Cart
```http
GET /api/cart/validate
Authorization: Bearer <token>
```

#### Merge Guest Cart
```http
POST /api/cart/merge
Authorization: Bearer <token>

{
  "guestCartItems": [
    { "productId": "60d5ec49e35b2c001f8e4f1a", "quantity": 1 }
  ]
}
```

---

## Order Routes (`/api/orders`)

### Customer Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>

{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "stripe",
  "paymentDetails": {
    "paymentIntentId": "pi_xxxxx"
  }
}
```

#### Get My Orders
```http
GET /api/orders/my-orders?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer <token>
```

#### Cancel Order
```http
PUT /api/orders/:id/cancel
Authorization: Bearer <token>

{
  "reason": "Changed my mind"
}
```

### Admin Endpoints

#### Get All Orders
```http
GET /api/orders?page=1&status=pending&paymentStatus=paid&userId=xxx&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <admin_token>
```

#### Get Order Statistics
```http
GET /api/orders/stats/overview
Authorization: Bearer <admin_token>
```

#### Update Order Status
```http
PUT /api/orders/:id/status
Authorization: Bearer <admin_token>

{
  "status": "shipped"
}
```

#### Update Shipping Info
```http
PUT /api/orders/:id/shipping
Authorization: Bearer <admin_token>

{
  "carrier": "UPS",
  "trackingNumber": "1Z999AA10123456784",
  "estimatedDelivery": "2024-02-15"
}
```

#### Update Payment Status
```http
PUT /api/orders/:id/payment
Authorization: Bearer <admin_token>

{
  "status": "paid",
  "transactionId": "txn_xxxxx"
}
```

#### Process Refund
```http
POST /api/orders/:id/refund
Authorization: Bearer <admin_token>

{
  "amount": 899,
  "reason": "Product defect"
}
```

---

## Review Routes (`/api/reviews`)

### Public Endpoints

#### Get Product Reviews
```http
GET /api/reviews/product/:productId?page=1&rating=5&verified=true&sort=helpful
```

### Customer Endpoints

#### Get My Reviews
```http
GET /api/reviews/my-reviews
Authorization: Bearer <token>
```

#### Create Review
```http
POST /api/reviews
Authorization: Bearer <token>

{
  "product": "60d5ec49e35b2c001f8e4f1a",
  "rating": 5,
  "title": "Excellent scooter!",
  "comment": "Very happy with my purchase",
  "images": ["review1.jpg"]
}
```

#### Update Review
```http
PUT /api/reviews/:id
Authorization: Bearer <token>

{
  "rating": 4,
  "comment": "Updated review"
}
```

#### Delete Review
```http
DELETE /api/reviews/:id
Authorization: Bearer <token>
```

#### Mark Review as Helpful
```http
POST /api/reviews/:id/helpful
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Reviews
```http
GET /api/reviews?status=pending&rating=1&verified=true
Authorization: Bearer <admin_token>
```

#### Get Review Statistics
```http
GET /api/reviews/stats/overview
Authorization: Bearer <admin_token>
```

#### Moderate Review
```http
PUT /api/reviews/:id/moderate
Authorization: Bearer <admin_token>

{
  "status": "approved",
  "adminNotes": "Review approved"
}
```

#### Respond to Review
```http
POST /api/reviews/:id/respond
Authorization: Bearer <admin_token>

{
  "response": "Thank you for your feedback!"
}
```

---

## Coupon Routes (`/api/coupons`)

### Customer Endpoints

#### Validate Coupon
```http
POST /api/coupons/validate
Authorization: Bearer <token>

{
  "code": "SAVE20",
  "subtotal": 899
}
```

#### Check User Usage
```http
GET /api/coupons/check-usage/:code
Authorization: Bearer <token>
```

### Admin Endpoints

#### Get All Coupons
```http
GET /api/coupons?page=1&isActive=true&discountType=percentage
Authorization: Bearer <admin_token>
```

#### Get Single Coupon
```http
GET /api/coupons/:id
Authorization: Bearer <admin_token>
```

#### Get All Coupon Statistics
```http
GET /api/coupons/stats/overview
Authorization: Bearer <admin_token>
```

#### Get Coupon Statistics
```http
GET /api/coupons/:id/stats
Authorization: Bearer <admin_token>
```

#### Create Coupon
```http
POST /api/coupons
Authorization: Bearer <admin_token>

{
  "code": "SAVE20",
  "description": { "en": "20% off", "de": "20% Rabatt" },
  "discountType": "percentage",
  "discountValue": { "percentage": 20 },
  "validFrom": "2024-01-01",
  "validUntil": "2024-12-31",
  "usage": {
    "maxUses": 100,
    "maxUsesPerUser": 1
  },
  "minimumPurchase": { "USD": 50, "EUR": 50 }
}
```

#### Update Coupon
```http
PUT /api/coupons/:id
Authorization: Bearer <admin_token>

{
  "isActive": false
}
```

#### Delete Coupon
```http
DELETE /api/coupons/:id
Authorization: Bearer <admin_token>
```

#### Deactivate Coupon
```http
PUT /api/coupons/:id/deactivate
Authorization: Bearer <admin_token>
```

---

## Wishlist Routes (`/api/wishlist`)

### Public Endpoints

#### Get Shared Wishlist
```http
GET /api/wishlist/shared/:token
```

### Customer Endpoints

#### Get Wishlist
```http
GET /api/wishlist
Authorization: Bearer <token>
```

#### Add to Wishlist
```http
POST /api/wishlist/items
Authorization: Bearer <token>

{
  "productId": "60d5ec49e35b2c001f8e4f1a",
  "notifyOnPriceDrop": true,
  "notifyOnRestock": true,
  "targetPrice": 699
}
```

#### Update Wishlist Item
```http
PUT /api/wishlist/items/:productId
Authorization: Bearer <token>

{
  "notifyOnPriceDrop": false,
  "targetPrice": 649
}
```

#### Remove from Wishlist
```http
DELETE /api/wishlist/items/:productId
Authorization: Bearer <token>
```

#### Clear Wishlist
```http
DELETE /api/wishlist
Authorization: Bearer <token>
```

#### Move to Cart
```http
POST /api/wishlist/items/:productId/move-to-cart
Authorization: Bearer <token>

{
  "quantity": 1
}
```

#### Move All to Cart
```http
POST /api/wishlist/move-all-to-cart
Authorization: Bearer <token>
```

#### Share Wishlist
```http
PUT /api/wishlist/share
Authorization: Bearer <token>

{
  "name": "My Wishlist",
  "isPublic": true
}
```

#### Check Price Drops
```http
GET /api/wishlist/check-price-drops
Authorization: Bearer <token>
```

---

## Support Routes (`/api/support`)

### Customer Endpoints

#### Create Ticket
```http
POST /api/support/tickets
Authorization: Bearer <token>

{
  "subject": "Product inquiry",
  "category": "product",
  "priority": "medium",
  "message": "I have a question about...",
  "attachments": ["file1.jpg"]
}
```

#### Get My Tickets
```http
GET /api/support/tickets/my-tickets?page=1&status=open&category=technical
Authorization: Bearer <token>
```

#### Get Single Ticket
```http
GET /api/support/tickets/:id
Authorization: Bearer <token>
```

#### Add Message to Ticket
```http
POST /api/support/tickets/:id/messages
Authorization: Bearer <token>

{
  "message": "Additional information...",
  "attachments": ["file2.jpg"]
}
```

#### Close Ticket
```http
PUT /api/support/tickets/:id/close
Authorization: Bearer <token>

{
  "resolution": "Issue resolved"
}
```

#### Reopen Ticket
```http
PUT /api/support/tickets/:id/reopen
Authorization: Bearer <token>
```

#### Rate Ticket
```http
POST /api/support/tickets/:id/rate
Authorization: Bearer <token>

{
  "rating": 5,
  "feedback": "Excellent support!"
}
```

### Admin Endpoints

#### Get All Tickets
```http
GET /api/support/tickets?status=open&priority=high&assignedTo=xxx&unassigned=true
Authorization: Bearer <admin_token>
```

#### Get Support Statistics
```http
GET /api/support/stats/overview
Authorization: Bearer <admin_token>
```

#### Assign Ticket
```http
PUT /api/support/tickets/:id/assign
Authorization: Bearer <admin_token>

{
  "adminId": "60d5ec49e35b2c001f8e4f1c"
}
```

#### Update Priority
```http
PUT /api/support/tickets/:id/priority
Authorization: Bearer <admin_token>

{
  "priority": "urgent"
}
```

#### Add Internal Note
```http
POST /api/support/tickets/:id/notes
Authorization: Bearer <admin_token>

{
  "note": "Customer contacted via phone"
}
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ },
  "count": 10,
  "total": 100,
  "pages": 10,
  "currentPage": 1
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes

---

## Notes

- All dates are in ISO 8601 format
- Currency values are in cents (multiply by 100 for Stripe)
- File uploads should use multipart/form-data
- Pagination starts at page 1
- Maximum items per page: 100
