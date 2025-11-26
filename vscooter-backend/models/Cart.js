const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['usd', 'eur'],
    default: 'eur'
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totals: {
    subtotal: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  appliedCoupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null
  },
  currency: {
    type: String,
    enum: ['usd', 'eur'],
    default: 'eur'
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, {
  timestamps: true
});

// Method to calculate cart totals
cartSchema.methods.calculateTotals = function(taxRate = 0.19, shippingCost = 0, discountAmount = 0) {
  // Calculate subtotal
  this.totals.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Calculate tax
  this.totals.tax = this.totals.subtotal * taxRate;

  // Set shipping
  this.totals.shipping = shippingCost;

  // Set discount
  this.totals.discount = discountAmount;

  // Calculate total
  this.totals.total = this.totals.subtotal + this.totals.tax + this.totals.shipping - this.totals.discount;

  return this.totals;
};

// Method to add item to cart
cartSchema.methods.addItem = function(productId, quantity, price, currency = 'eur') {
  const existingItem = this.items.find(item => item.product.toString() === productId.toString());

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price,
      currency
    });
  }

  return this;
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => item.product.toString() !== productId.toString());
  return this;
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function(productId, quantity) {
  const item = this.items.find(item => item.product.toString() === productId.toString());

  if (item) {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
    }
  }

  return this;
};

// Method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  this.appliedCoupon = null;
  this.totals = {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0
  };
  return this;
};

// Virtual for item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((count, item) => count + item.quantity, 0);
});

// Auto-delete expired carts
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Ensure virtuals are included in JSON
cartSchema.set('toJSON', { virtuals: true });
cartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Cart', cartSchema);
