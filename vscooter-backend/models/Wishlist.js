const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  notifyOnSale: {
    type: Boolean,
    default: false
  },
  notifyOnRestock: {
    type: Boolean,
    default: false
  },
  targetPrice: {
    type: Number,
    default: null // User can set a target price for notifications
  }
}, { _id: true });

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [wishlistItemSchema],
  isPublic: {
    type: Boolean,
    default: false // Allow users to share their wishlist
  },
  shareToken: {
    type: String,
    index: { sparse: true } // Only set if wishlist is shared
  }
}, {
  timestamps: true
});

// Index for quick user lookup
wishlistSchema.index({ user: 1 }, { unique: true });

// Method to add product to wishlist
wishlistSchema.methods.addProduct = function(productId, notifyOnSale = false, notifyOnRestock = false) {
  const existingItem = this.items.find(
    item => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    // Update notification preferences if product already in wishlist
    existingItem.notifyOnSale = notifyOnSale;
    existingItem.notifyOnRestock = notifyOnRestock;
    return { added: false, message: 'Product already in wishlist, preferences updated' };
  }

  this.items.push({
    product: productId,
    notifyOnSale,
    notifyOnRestock,
    addedAt: new Date()
  });

  return { added: true, message: 'Product added to wishlist' };
};

// Method to remove product from wishlist
wishlistSchema.methods.removeProduct = function(productId) {
  const initialLength = this.items.length;
  this.items = this.items.filter(
    item => item.product.toString() !== productId.toString()
  );

  if (this.items.length < initialLength) {
    return { removed: true, message: 'Product removed from wishlist' };
  }

  return { removed: false, message: 'Product not found in wishlist' };
};

// Method to check if product is in wishlist
wishlistSchema.methods.hasProduct = function(productId) {
  return this.items.some(
    item => item.product.toString() === productId.toString()
  );
};

// Method to clear wishlist
wishlistSchema.methods.clearWishlist = function() {
  this.items = [];
  return this;
};

// Method to generate share token
wishlistSchema.methods.generateShareToken = function() {
  if (!this.shareToken) {
    this.shareToken = require('crypto').randomBytes(16).toString('hex');
  }
  return this.shareToken;
};

// Method to move items to cart
wishlistSchema.methods.moveToCart = async function(productIds = null) {
  // If no specific products, move all items
  const itemsToMove = productIds
    ? this.items.filter(item => productIds.includes(item.product.toString()))
    : this.items;

  return itemsToMove.map(item => ({
    productId: item.product,
    quantity: 1
  }));
};

// Virtual for item count
wishlistSchema.virtual('itemCount').get(function() {
  return this.items.length;
});

// Virtual for products needing notification
wishlistSchema.virtual('notificationItems').get(function() {
  return {
    sale: this.items.filter(item => item.notifyOnSale),
    restock: this.items.filter(item => item.notifyOnRestock),
    priceTarget: this.items.filter(item => item.targetPrice !== null)
  };
});

// Ensure virtuals are included in JSON
wishlistSchema.set('toJSON', { virtuals: true });
wishlistSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
