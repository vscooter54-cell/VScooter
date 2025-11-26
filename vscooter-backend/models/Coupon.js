const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    uppercase: true,
    trim: true,
    maxlength: [20, 'Coupon code cannot exceed 20 characters']
  },
  description: {
    en: {
      type: String,
      required: true
    },
    de: {
      type: String,
      required: true
    }
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: [true, 'Discount value is required'],
    min: [0, 'Discount value must be positive']
  },
  currency: {
    type: String,
    enum: ['usd', 'eur'],
    default: 'eur',
    required: function() {
      return this.discountType === 'fixed';
    }
  },
  minimumPurchase: {
    type: Number,
    default: 0,
    min: [0, 'Minimum purchase must be positive']
  },
  maximumDiscount: {
    type: Number,
    default: null,
    min: [0, 'Maximum discount must be positive']
  },
  validFrom: {
    type: Date,
    required: true,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  },
  usageLimit: {
    total: {
      type: Number,
      default: null // null means unlimited
    },
    perUser: {
      type: Number,
      default: 1
    }
  },
  usageCount: {
    type: Number,
    default: 0
  },
  usedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderNumber: String
  }],
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  excludedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: String,
    enum: ['commuter', 'sport', 'premium', 'eco', 'kids']
  }],
  eligibleUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  firstPurchaseOnly: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true // False for private/invite-only coupons
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for quick code lookup
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ isActive: 1 });

// Method to check if coupon is currently valid
couponSchema.methods.isValid = function() {
  const now = new Date();

  // Check if active
  if (!this.isActive) {
    return { valid: false, message: 'Coupon is not active' };
  }

  // Check date range
  if (now < this.validFrom) {
    return { valid: false, message: 'Coupon is not yet valid' };
  }

  if (now > this.validUntil) {
    return { valid: false, message: 'Coupon has expired' };
  }

  // Check usage limit
  if (this.usageLimit.total !== null && this.usageCount >= this.usageLimit.total) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }

  return { valid: true, message: 'Coupon is valid' };
};

// Method to check if user can use this coupon
couponSchema.methods.canUserUse = function(userId, userOrderCount = 0) {
  // Check if user has exceeded per-user limit
  const userUsageCount = this.usedBy.filter(
    usage => usage.user.toString() === userId.toString()
  ).length;

  if (userUsageCount >= this.usageLimit.perUser) {
    return { canUse: false, message: 'You have already used this coupon the maximum number of times' };
  }

  // Check if first purchase only
  if (this.firstPurchaseOnly && userOrderCount > 0) {
    return { canUse: false, message: 'This coupon is only valid for first-time customers' };
  }

  // Check if user is in eligible users list (if list exists)
  if (this.eligibleUsers.length > 0) {
    const isEligible = this.eligibleUsers.some(
      eligibleUserId => eligibleUserId.toString() === userId.toString()
    );

    if (!isEligible) {
      return { canUse: false, message: 'You are not eligible to use this coupon' };
    }
  }

  return { canUse: true, message: 'User can use this coupon' };
};

// Method to check if coupon applies to cart items
couponSchema.methods.appliesTo = function(cartItems) {
  // If no restrictions, applies to all
  if (this.applicableProducts.length === 0 && this.applicableCategories.length === 0) {
    return { applies: true, message: 'Coupon applies to all products' };
  }

  // Check if any cart item matches applicable products
  if (this.applicableProducts.length > 0) {
    const hasApplicableProduct = cartItems.some(item =>
      this.applicableProducts.some(productId =>
        productId.toString() === item.product.toString()
      )
    );

    if (!hasApplicableProduct) {
      return { applies: false, message: 'Coupon does not apply to any items in your cart' };
    }
  }

  // Check excluded products
  if (this.excludedProducts.length > 0) {
    const hasExcludedProduct = cartItems.some(item =>
      this.excludedProducts.some(productId =>
        productId.toString() === item.product.toString()
      )
    );

    if (hasExcludedProduct) {
      return { applies: false, message: 'Your cart contains excluded products' };
    }
  }

  return { applies: true, message: 'Coupon applies to cart items' };
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(subtotal) {
  let discountAmount = 0;

  if (this.discountType === 'percentage') {
    discountAmount = (subtotal * this.discountValue) / 100;

    // Apply maximum discount cap if set
    if (this.maximumDiscount !== null && discountAmount > this.maximumDiscount) {
      discountAmount = this.maximumDiscount;
    }
  } else if (this.discountType === 'fixed') {
    discountAmount = this.discountValue;
  }

  // Ensure discount doesn't exceed subtotal
  if (discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  return Math.round(discountAmount * 100) / 100; // Round to 2 decimals
};

// Method to apply coupon (increment usage)
couponSchema.methods.applyCoupon = function(userId, orderNumber) {
  this.usageCount += 1;
  this.usedBy.push({
    user: userId,
    usedAt: new Date(),
    orderNumber
  });
  return this;
};

// Virtual for days until expiration
couponSchema.virtual('daysUntilExpiration').get(function() {
  const now = new Date();
  const diffTime = this.validUntil - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

// Virtual for usage percentage
couponSchema.virtual('usagePercentage').get(function() {
  if (this.usageLimit.total === null) return 0;
  return Math.round((this.usageCount / this.usageLimit.total) * 100);
});

// Ensure virtuals are included in JSON
couponSchema.set('toJSON', { virtuals: true });
couponSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Coupon', couponSchema);
