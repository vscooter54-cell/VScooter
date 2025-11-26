const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  range: {
    type: String,
    required: true
  },
  maxSpeed: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },
  chargeTime: {
    type: String,
    required: true
  },
  motorPower: String,
  batteryCapacity: String,
  maxLoad: String,
  waterResistance: String
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  usd: {
    type: Number,
    required: true
  },
  eur: {
    type: Number,
    required: true
  },
  originalPrice: {
    usd: Number,
    eur: Number
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    en: {
      type: String,
      required: true,
      trim: true
    },
    de: {
      type: String,
      required: true,
      trim: true
    }
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
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
  category: {
    type: String,
    enum: ['scooter', 'accessory'],
    required: true
  },
  subcategory: {
    type: String,
    enum: ['model-x', 'model-y', 'model-z', 'helmet', 'lock', 'charger', 'bag', 'other'],
    required: true
  },
  pricing: {
    type: pricingSchema,
    required: true
  },
  specifications: {
    type: specificationSchema,
    required: function() {
      return this.category === 'scooter';
    }
  },
  features: {
    en: [{
      type: String
    }],
    de: [{
      type: String
    }]
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  inventory: {
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    sku: {
      type: String,
      unique: true,
      required: true
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  seo: {
    metaTitle: {
      en: String,
      de: String
    },
    metaDescription: {
      en: String,
      de: String
    },
    keywords: [String]
  }
}, {
  timestamps: true
});

// Create slug from product name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name.en')) {
    this.slug = this.name.en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  return this.inventory.stock >= quantity;
};

// Method to check if stock is low
productSchema.methods.isLowStock = function() {
  return this.inventory.stock <= this.inventory.lowStockThreshold;
};

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Index for search functionality
productSchema.index({ 'name.en': 'text', 'name.de': 'text', 'description.en': 'text', 'description.de': 'text', tags: 'text' });
productSchema.index({ slug: 1 }, { unique: true });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ 'inventory.stock': 1 });

module.exports = mongoose.model('Product', productSchema);
