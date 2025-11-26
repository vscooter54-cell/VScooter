# VScooter E-Commerce - MongoDB Schema Summary

## ✅ Schema Creation Complete (8/8)

All MongoDB schemas have been successfully created and validated. Below is a comprehensive overview of each schema with their key features.

---

## 📊 Schema Overview

### 1. **User Schema** (`models/User.js`)
**Purpose**: User authentication, profile management, and account data

**Key Features**:
- ✅ User authentication with bcrypt password hashing
- ✅ Multiple shipping addresses with default selection
- ✅ Wishlist integration
- ✅ Email verification system
- ✅ Password reset token functionality
- ✅ Role-based access control (customer/admin)

**Fields**: 20 | **Methods**: 2 | **Virtuals**: 1 | **Indexes**: 1

**Methods**:
- `comparePassword(enteredPassword)` - Verify password during login
- `initializeTimestamps()` - Auto-generated

**Virtuals**:
- `fullName` - Combines firstName + lastName

**Security Features**:
- Pre-save hook automatically hashes passwords
- Password reset tokens with expiration
- Email verification workflow

---

### 2. **Product Schema** (`models/Product.js`)
**Purpose**: Product catalog with multilingual and multi-currency support

**Key Features**:
- ✅ Bilingual product data (EN/DE)
- ✅ Multi-currency pricing (USD/EUR)
- ✅ Discount and sale pricing
- ✅ Inventory tracking with low-stock alerts
- ✅ Product specifications (range, speed, weight, charge time)
- ✅ Image gallery management
- ✅ Rating aggregation
- ✅ SEO-friendly slugs
- ✅ Tags and search optimization
- ✅ Premium/Featured product flags

**Fields**: 30 | **Methods**: 3 | **Virtuals**: 1 | **Indexes**: 6

**Methods**:
- `isInStock(quantity)` - Check if product has sufficient stock
- `isLowStock()` - Check if stock is below threshold
- `initializeTimestamps()` - Auto-generated

**Virtuals**:
- `primaryImage` - Returns the first image from gallery

**Indexes**:
- Text search on name/description (EN/DE) and tags
- Unique slug for SEO URLs
- Category and subcategory composite index
- Stock level index for inventory queries
- Featured and premium product indexes

---

### 3. **Cart Schema** (`models/Cart.js`)
**Purpose**: Shopping cart management with automatic calculations

**Key Features**:
- ✅ User-specific carts with guest support
- ✅ Automatic totals calculation (subtotal, tax, shipping, discount)
- ✅ Multi-currency support
- ✅ Coupon/discount integration
- ✅ Auto-expiration after 30 days (TTL index)
- ✅ Item quantity management
- ✅ Product reference tracking

**Fields**: 14 | **Methods**: 5 | **Virtuals**: 1 | **Indexes**: 2

**Methods**:
- `calculateTotals(taxRate, shippingCost, discountAmount)` - Recalculate all totals
- `addItem(productId, quantity, price, currency)` - Add or update cart item
- `removeItem(productId)` - Remove item from cart
- `updateItemQuantity(productId, quantity)` - Update quantity
- `clearCart()` - Empty the cart

**Virtuals**:
- `itemCount` - Total number of items in cart

**Auto-Expiration**:
- Carts automatically deleted after 30 days of inactivity

---

### 4. **Order Schema** (`models/Order.js`)
**Purpose**: Order processing, tracking, and lifecycle management

**Key Features**:
- ✅ Auto-generated order numbers (VS-YYYY-XXXXXX format)
- ✅ Complete order history and status tracking
- ✅ Shipping address capture
- ✅ Payment integration (Stripe/PayPal)
- ✅ Multi-status workflow (pending → processing → shipped → delivered)
- ✅ Status history with timestamps and notes
- ✅ Cancellation and refund tracking
- ✅ Shipping tracking information
- ✅ Pricing breakdown (subtotal, tax, shipping, discount)

**Fields**: 28 | **Methods**: 3 | **Virtuals**: 1 | **Indexes**: 6

**Methods**:
- `updateStatus(newStatus, note)` - Update order status with history
- `calculateTotal()` - Recalculate order total
- `initializeTimestamps()` - Auto-generated

**Virtuals**:
- `shippingAddressFormatted` - Formatted shipping address string

**Order Number Format**: `VS-2025-000001` (auto-increments)

**Status Flow**:
```
pending → processing → shipped → delivered
          ↓
       cancelled
          ↓
       refunded
```

---

### 5. **Review Schema** (`models/Review.js`)
**Purpose**: Product reviews and rating system with moderation

**Key Features**:
- ✅ 1-5 star rating system
- ✅ Review title and detailed comments
- ✅ Image attachments for reviews
- ✅ Verified purchase badges
- ✅ Helpful votes tracking
- ✅ Admin approval/moderation workflow
- ✅ Admin responses to reviews
- ✅ Automatic product rating calculation
- ✅ One review per user per product (enforced)

**Fields**: 18 | **Methods**: 2 | **Statics**: 1 | **Indexes**: 3

**Methods**:
- `markHelpful(userId)` - Mark review as helpful
- `initializeTimestamps()` - Auto-generated

**Static Methods**:
- `calculateAverageRating(productId)` - Recalculates product rating

**Auto-Calculation**:
- Post-save hook automatically updates Product rating
- Only approved reviews count towards rating

**Unique Constraint**:
- Compound index ensures one review per user per product

---

### 6. **Coupon Schema** (`models/Coupon.js`)
**Purpose**: Discount and coupon code system

**Key Features**:
- ✅ Percentage or fixed amount discounts
- ✅ Multi-currency support (USD/EUR)
- ✅ Validity date range
- ✅ Usage limits (total and per-user)
- ✅ Minimum purchase requirements
- ✅ Maximum discount caps
- ✅ Product/category restrictions
- ✅ User eligibility rules
- ✅ First purchase only option
- ✅ Public vs private coupons
- ✅ Usage tracking with order references

**Fields**: 26 | **Methods**: 6 | **Virtuals**: 2 | **Indexes**: 4

**Methods**:
- `isValid()` - Check if coupon is currently valid
- `canUserUse(userId, userOrderCount)` - Check user eligibility
- `appliesTo(cartItems)` - Check if coupon applies to cart
- `calculateDiscount(subtotal)` - Calculate discount amount
- `applyCoupon(userId, orderNumber)` - Apply and track usage
- `initializeTimestamps()` - Auto-generated

**Virtuals**:
- `daysUntilExpiration` - Days remaining until expiration
- `usagePercentage` - Usage rate (0-100%)

**Discount Types**:
- `percentage` - Percentage off (with optional max cap)
- `fixed` - Fixed amount off in specified currency

---

### 7. **Wishlist Schema** (`models/Wishlist.js`)
**Purpose**: User wishlist/favorites with notification preferences

**Key Features**:
- ✅ Save favorite products
- ✅ Price drop notifications
- ✅ Restock notifications
- ✅ Target price alerts
- ✅ Shareable wishlists with tokens
- ✅ Public/private visibility
- ✅ Easy move to cart functionality
- ✅ Product addition timestamp tracking

**Fields**: 8 | **Methods**: 7 | **Virtuals**: 2 | **Indexes**: 4

**Methods**:
- `addProduct(productId, notifyOnSale, notifyOnRestock)` - Add to wishlist
- `removeProduct(productId)` - Remove from wishlist
- `hasProduct(productId)` - Check if product is in wishlist
- `clearWishlist()` - Remove all items
- `generateShareToken()` - Create shareable link
- `moveToCart(productIds)` - Move items to shopping cart
- `initializeTimestamps()` - Auto-generated

**Virtuals**:
- `itemCount` - Number of items in wishlist
- `notificationItems` - Items with notifications enabled

**Unique Constraint**:
- One wishlist per user

---

### 8. **Support Schema** (`models/Support.js`)
**Purpose**: Customer support ticket and messaging system

**Key Features**:
- ✅ Auto-generated ticket numbers (TKT-YYYY-XXXXXX)
- ✅ Multi-category ticket classification
- ✅ Priority levels (low, medium, high, urgent)
- ✅ Status workflow tracking
- ✅ Two-way messaging (customer ↔ admin)
- ✅ File attachments support
- ✅ Read/unread message tracking
- ✅ Ticket assignment to admins
- ✅ Internal notes (admin-only)
- ✅ Order/product references
- ✅ Customer satisfaction ratings
- ✅ Resolution tracking

**Fields**: 25 | **Methods**: 7 | **Virtuals**: 3 | **Indexes**: 8

**Methods**:
- `addMessage(sender, senderUserId, messageText, attachments)` - Add message
- `updateStatus(newStatus, userId, note)` - Update ticket status
- `assignTicket(adminUserId)` - Assign to admin
- `addInternalNote(note, userId)` - Add admin note
- `markMessagesAsRead(sender)` - Mark messages as read
- `addSatisfactionRating(rating, feedback)` - Add customer rating
- `initializeTimestamps()` - Auto-generated

**Virtuals**:
- `unreadCount` - Unread messages for customer/admin
- `responseTime` - Initial response time in hours
- `hoursSinceLastUpdate` - Time since last activity

**Ticket Categories**:
- Order inquiry, Product question, Technical support
- Warranty claim, Return/refund, Shipping/delivery
- Payment issue, Account issue, Complaint, Other

**Status Flow**:
```
open → in_progress → resolved → closed
       ↓
   waiting_customer
       ↓
   waiting_internal
```

---

## 🔐 Security Features

### Password Security
- bcrypt hashing with automatic pre-save hooks
- No plain-text password storage
- Secure password comparison methods

### Data Validation
- Email format validation
- Required field enforcement
- String length limits (maxlength)
- Enum constraints for status fields
- Number range validation (min/max)

### Indexes for Performance
- Unique indexes on critical fields (email, order numbers, ticket numbers)
- Composite indexes for common queries
- Text search indexes for product search
- TTL indexes for automatic cart cleanup

---

## 📈 Relationships Between Schemas

```
User
 ├─→ Cart (1:1)
 ├─→ Order (1:Many)
 ├─→ Review (1:Many)
 ├─→ Wishlist (1:1)
 └─→ Support (1:Many)

Product
 ├─→ Cart Items (1:Many)
 ├─→ Order Items (1:Many)
 ├─→ Review (1:Many)
 └─→ Wishlist Items (1:Many)

Order
 ├─→ User (Many:1)
 ├─→ Coupon (Many:1, optional)
 └─→ Support (1:Many, optional)

Coupon
 ├─→ Product (Many:Many, optional restrictions)
 └─→ User (Many:Many, usage tracking)
```

---

## 🎯 Next Steps

With all schemas complete, the next phase is:

1. **Backend API Implementation** (controllers + routes)
   - Authentication endpoints (register, login, logout, password reset)
   - User management endpoints (profile, addresses)
   - Product endpoints (CRUD, search, filter)
   - Cart endpoints (add, update, remove, checkout)
   - Order endpoints (create, track, update)
   - Review endpoints (create, update, moderate)
   - Coupon endpoints (validate, apply)
   - Wishlist endpoints (add, remove, share)
   - Support endpoints (create ticket, messaging)

2. **Middleware Creation**
   - Authentication middleware (JWT verification)
   - Authorization middleware (role checks)
   - Error handling middleware
   - Request validation middleware
   - File upload middleware

3. **API Documentation**
   - Complete API contract with all endpoints
   - Request/response examples
   - Authentication requirements
   - Error codes and messages

---

## 📊 Schema Statistics

| Schema | Fields | Methods | Statics | Virtuals | Indexes |
|--------|--------|---------|---------|----------|---------|
| User | 20 | 2 | 0 | 1 | 1 |
| Product | 30 | 3 | 0 | 1 | 6 |
| Cart | 14 | 5 | 0 | 1 | 2 |
| Order | 28 | 3 | 0 | 1 | 6 |
| Review | 18 | 2 | 1 | 0 | 3 |
| Coupon | 26 | 6 | 0 | 2 | 4 |
| Wishlist | 8 | 7 | 0 | 2 | 4 |
| Support | 25 | 7 | 0 | 3 | 8 |
| **Total** | **169** | **35** | **1** | **11** | **34** |

---

✨ **All schemas are production-ready and follow MongoDB best practices!**
