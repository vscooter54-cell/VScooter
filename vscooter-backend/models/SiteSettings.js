const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  // Site Identity
  siteName: {
    type: String,
    default: 'VScooter'
  },
  siteTagline: {
    type: String,
    default: 'The Future of Urban Mobility'
  },
  logo: {
    type: String,
    default: null
  },
  favicon: {
    type: String,
    default: null
  },

  // Theme Colors
  theme: {
    primaryColor: {
      type: String,
      default: '#DC2626' // red-600
    },
    secondaryColor: {
      type: String,
      default: '#1F2937' // gray-800
    },
    accentColor: {
      type: String,
      default: '#3B82F6' // blue-600
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    textColor: {
      type: String,
      default: '#1F2937'
    }
  },

  // Typography
  typography: {
    headingFont: {
      type: String,
      default: 'Inter'
    },
    bodyFont: {
      type: String,
      default: 'Inter'
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    }
  },

  // Homepage Sections
  homepage: {
    heroTitle: {
      en: { type: String, default: 'VScooter' },
      de: { type: String, default: 'VScooter' }
    },
    heroSubtitle: {
      en: { type: String, default: 'The Future of Urban Mobility' },
      de: { type: String, default: 'Die Zukunft der urbanen Mobilität' }
    },
    heroVideo: {
      type: String,
      default: null
    },
    heroImage: {
      type: String,
      default: null
    },
    showFeaturedProducts: {
      type: Boolean,
      default: true
    },
    showTestimonials: {
      type: Boolean,
      default: true
    },
    showFeatures: {
      type: Boolean,
      default: true
    }
  },

  // Banners
  banners: [{
    title: {
      en: String,
      de: String
    },
    description: {
      en: String,
      de: String
    },
    image: String,
    link: String,
    buttonText: {
      en: String,
      de: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      enum: ['top', 'middle', 'bottom', 'popup'],
      default: 'top'
    },
    startDate: Date,
    endDate: Date
  }],

  // Contact Information
  contact: {
    email: {
      type: String,
      default: 'support@vscooter.com'
    },
    phone: {
      type: String,
      default: '+49 (0) 123 456 789'
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: 'Germany'
      }
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      youtube: String
    }
  },

  // Business Settings
  business: {
    currency: {
      type: String,
      enum: ['EUR', 'USD', 'GBP', 'CHF'],
      default: 'EUR'
    },
    vatRate: {
      type: Number,
      default: 19 // German VAT
    },
    defaultLanguage: {
      type: String,
      enum: ['en', 'de'],
      default: 'de'
    },
    timezone: {
      type: String,
      default: 'Europe/Berlin'
    },
    dateFormat: {
      type: String,
      default: 'DD.MM.YYYY'
    }
  },

  // Email Settings
  email: {
    orderConfirmation: {
      enabled: { type: Boolean, default: true },
      subject: {
        en: { type: String, default: 'Order Confirmation' },
        de: { type: String, default: 'Bestellbestätigung' }
      }
    },
    shippingNotification: {
      enabled: { type: Boolean, default: true },
      subject: {
        en: { type: String, default: 'Your Order Has Shipped' },
        de: { type: String, default: 'Ihre Bestellung wurde versandt' }
      }
    },
    welcomeEmail: {
      enabled: { type: Boolean, default: true },
      subject: {
        en: { type: String, default: 'Welcome to VScooter' },
        de: { type: String, default: 'Willkommen bei VScooter' }
      }
    }
  },

  // Shipping Settings
  shipping: {
    freeShippingThreshold: {
      type: Number,
      default: 50 // EUR
    },
    standardShippingCost: {
      type: Number,
      default: 5.99
    },
    expressShippingCost: {
      type: Number,
      default: 12.99
    },
    estimatedDeliveryDays: {
      min: { type: Number, default: 3 },
      max: { type: Number, default: 5 }
    }
  },

  // Payment Settings
  payment: {
    enabledMethods: [{
      type: String,
      enum: ['stripe', 'paypal', 'sofort', 'klarna', 'invoice']
    }],
    testMode: {
      type: Boolean,
      default: true
    }
  },

  // SEO Settings
  seo: {
    metaTitle: {
      en: String,
      de: String
    },
    metaDescription: {
      en: String,
      de: String
    },
    metaKeywords: {
      en: [String],
      de: [String]
    },
    googleAnalyticsId: String,
    facebookPixelId: String
  },

  // Maintenance Mode
  maintenance: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: {
      en: { type: String, default: 'We are currently undergoing maintenance. Please check back soon.' },
      de: { type: String, default: 'Wir führen derzeit Wartungsarbeiten durch. Bitte schauen Sie bald wieder vorbei.' }
    },
    allowedIPs: [String]
  },

  // Feature Flags
  features: {
    enableReviews: { type: Boolean, default: true },
    enableWishlist: { type: Boolean, default: true },
    enableGuestCheckout: { type: Boolean, default: true },
    enableNewsletter: { type: Boolean, default: true },
    enableLiveChat: { type: Boolean, default: false },
    enableProductComparison: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Singleton pattern - only one settings document
siteSettingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
