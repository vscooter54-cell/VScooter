require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    name: {
      en: 'Falcon 500',
      de: 'Falcon 500'
    },
    description: {
      en: 'The Falcon 500 is our premium electric scooter designed for urban commuters who demand the best. With a powerful motor and long-range battery, it delivers exceptional performance and reliability.',
      de: 'Der Falcon 500 ist unser Premium-Elektroroller für urbane Pendler, die das Beste verlangen. Mit einem leistungsstarken Motor und Langstrecken-Akku bietet er außergewöhnliche Leistung und Zuverlässigkeit.'
    },
    category: 'scooter',
    subcategory: 'model-x',
    pricing: {
      usd: 799,
      eur: 799,
      originalPrice: {
        usd: 899,
        eur: 899
      },
      discount: 11
    },
    images: [
      { url: 'falcon-500.webp', alt: 'Falcon 500 Electric Scooter', isPrimary: true },
      { url: 'falcon-500-side.webp', alt: 'Falcon 500 Side View', isPrimary: false },
      { url: 'falcon-500-detail.webp', alt: 'Falcon 500 Detail', isPrimary: false }
    ],
    specifications: {
      range: '35 miles (56 km)',
      maxSpeed: '25 mph (40 km/h)',
      weight: '26 lbs (12 kg)',
      chargeTime: '4 hours',
      motorPower: '350W Brushless',
      batteryCapacity: '36V 10Ah',
      maxLoad: '220 lbs (100 kg)'
    },
    features: {
      en: [
        'Dual suspension system',
        'LED headlight and taillight',
        'LCD display',
        'App connectivity',
        'Anti-theft alarm',
        'Cruise control'
      ],
      de: [
        'Doppelfederungssystem',
        'LED-Scheinwerfer und Rücklicht',
        'LCD-Display',
        'App-Konnektivität',
        'Diebstahlalarm',
        'Tempomat'
      ]
    },
    inventory: {
      stock: 50,
      lowStockThreshold: 10,
      sku: 'VS-FALCON-500'
    },
    tags: ['electric', 'premium', 'long-range', 'fast'],
    isFeatured: true,
    isPremium: true,
    isActive: true
  },
  {
    name: {
      en: 'Mars',
      de: 'Mars'
    },
    description: {
      en: 'The Mars scooter offers the perfect balance of performance and affordability. Ideal for daily commutes and city exploration, it combines reliability with style.',
      de: 'Der Mars-Roller bietet die perfekte Balance zwischen Leistung und Erschwinglichkeit. Ideal für tägliche Pendelfahrten und Stadterkundungen, kombiniert er Zuverlässigkeit mit Stil.'
    },
    category: 'scooter',
    subcategory: 'model-y',
    pricing: {
      usd: 699,
      eur: 699
    },
    images: [
      { url: 'mars.webp', alt: 'Mars Electric Scooter', isPrimary: true },
      { url: 'mars-side.webp', alt: 'Mars Side View', isPrimary: false },
      { url: 'mars-detail.webp', alt: 'Mars Detail', isPrimary: false }
    ],
    specifications: {
      range: '28 miles (45 km)',
      maxSpeed: '20 mph (32 km/h)',
      weight: '24 lbs (11 kg)',
      chargeTime: '3.5 hours',
      motorPower: '250W Brushless',
      batteryCapacity: '36V 7.5Ah',
      maxLoad: '200 lbs (90 kg)'
    },
    features: {
      en: [
        'Front suspension',
        'LED lights',
        'LCD display',
        'Foldable design',
        'Kickstand',
        'Phone holder'
      ],
      de: [
        'Vorderfederung',
        'LED-Beleuchtung',
        'LCD-Display',
        'Faltbares Design',
        'Ständer',
        'Handyhalterung'
      ]
    },
    inventory: {
      stock: 75,
      lowStockThreshold: 15,
      sku: 'VS-MARS-STD'
    },
    tags: ['electric', 'affordable', 'city', 'commute'],
    isFeatured: true,
    isPremium: false,
    isActive: true
  },
  {
    name: {
      en: 'Amiga',
      de: 'Amiga'
    },
    description: {
      en: 'The Amiga is our top-of-the-line model, engineered for enthusiasts who want maximum performance. With extended range and superior speed, it\'s the ultimate urban mobility solution.',
      de: 'Der Amiga ist unser Spitzenmodell, entwickelt für Enthusiasten, die maximale Leistung wollen. Mit erweiterter Reichweite und überlegener Geschwindigkeit ist es die ultimative urbane Mobilitätslösung.'
    },
    category: 'scooter',
    subcategory: 'model-z',
    pricing: {
      usd: 1199,
      eur: 1199,
      originalPrice: {
        usd: 1299,
        eur: 1299
      },
      discount: 8
    },
    images: [
      { url: 'amiga.webp', alt: 'Amiga Electric Scooter', isPrimary: true },
      { url: 'amiga-side.webp', alt: 'Amiga Side View', isPrimary: false },
      { url: 'amiga-detail.webp', alt: 'Amiga Detail', isPrimary: false }
    ],
    specifications: {
      range: '45 miles (72 km)',
      maxSpeed: '30 mph (48 km/h)',
      weight: '32 lbs (15 kg)',
      chargeTime: '5 hours',
      motorPower: '500W Dual Motors',
      batteryCapacity: '48V 15Ah',
      maxLoad: '265 lbs (120 kg)'
    },
    features: {
      en: [
        'Dual motor system',
        'Full suspension',
        'Hydraulic brakes',
        'Premium LED lights',
        'Advanced LCD display',
        'App with GPS tracking',
        'Turn signals',
        'Anti-theft system'
      ],
      de: [
        'Dual-Motor-System',
        'Vollfederung',
        'Hydraulische Bremsen',
        'Premium LED-Beleuchtung',
        'Erweitertes LCD-Display',
        'App mit GPS-Tracking',
        'Blinker',
        'Diebstahlschutzsystem'
      ]
    },
    inventory: {
      stock: 30,
      lowStockThreshold: 8,
      sku: 'VS-AMIGA-PRO'
    },
    tags: ['electric', 'premium', 'high-performance', 'long-range', 'dual-motor'],
    isFeatured: true,
    isPremium: true,
    isActive: true
  },
  // Accessories
  {
    name: {
      en: 'Safety Helmet',
      de: 'Sicherheitshelm'
    },
    description: {
      en: 'Premium safety helmet with adjustable fit, ventilation system, and reflective strips for night visibility. Certified to safety standards.',
      de: 'Premium-Sicherheitshelm mit verstellbarer Passform, Belüftungssystem und reflektierenden Streifen für Nachtsichtbarkeit. Zertifiziert nach Sicherheitsstandards.'
    },
    category: 'accessory',
    subcategory: 'helmet',
    pricing: {
      usd: 89,
      eur: 89
    },
    images: [
      { url: 'helmet.webp', alt: 'Safety Helmet', isPrimary: true }
    ],
    inventory: {
      stock: 100,
      lowStockThreshold: 20,
      sku: 'VS-ACC-HELMET'
    },
    tags: ['accessory', 'safety', 'helmet'],
    isFeatured: false,
    isPremium: false,
    isActive: true
  },
  {
    name: {
      en: 'Security Lock',
      de: 'Sicherheitsschloss'
    },
    description: {
      en: 'Heavy-duty cable lock with combination mechanism. Weather-resistant and designed specifically for scooters.',
      de: 'Robustes Kabelschloss mit Kombinationsmechanismus. Wetterbeständig und speziell für Roller entwickelt.'
    },
    category: 'accessory',
    subcategory: 'lock',
    pricing: {
      usd: 45,
      eur: 45
    },
    images: [
      { url: 'lock.webp', alt: 'Security Lock', isPrimary: true }
    ],
    inventory: {
      stock: 150,
      lowStockThreshold: 30,
      sku: 'VS-ACC-LOCK'
    },
    tags: ['accessory', 'security', 'lock'],
    isFeatured: false,
    isPremium: false,
    isActive: true
  },
  {
    name: {
      en: 'Fast Charger',
      de: 'Schnellladegerät'
    },
    description: {
      en: 'High-speed charger compatible with all VScooter models. Charges up to 50% faster than standard chargers.',
      de: 'Hochgeschwindigkeitsladegerät kompatibel mit allen VScooter-Modellen. Lädt bis zu 50% schneller als Standardladegeräte.'
    },
    category: 'accessory',
    subcategory: 'charger',
    pricing: {
      usd: 129,
      eur: 129
    },
    images: [
      { url: 'charger.webp', alt: 'Fast Charger', isPrimary: true }
    ],
    inventory: {
      stock: 80,
      lowStockThreshold: 15,
      sku: 'VS-ACC-CHARGER'
    },
    tags: ['accessory', 'charger', 'fast-charging'],
    isFeatured: false,
    isPremium: false,
    isActive: true
  },
  {
    name: {
      en: 'Storage Bag',
      de: 'Aufbewahrungstasche'
    },
    description: {
      en: 'Waterproof handlebar bag with phone holder window. Perfect for carrying essentials while riding.',
      de: 'Wasserdichte Lenkertasche mit Handyhalter-Fenster. Perfekt zum Tragen von Essentials beim Fahren.'
    },
    category: 'accessory',
    subcategory: 'bag',
    pricing: {
      usd: 69,
      eur: 69
    },
    images: [
      { url: 'bag.webp', alt: 'Storage Bag', isPrimary: true }
    ],
    inventory: {
      stock: 120,
      lowStockThreshold: 25,
      sku: 'VS-ACC-BAG'
    },
    tags: ['accessory', 'storage', 'waterproof'],
    isFeatured: false,
    isPremium: false,
    isActive: true
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products one by one to trigger pre-save hooks
    const createdProducts = [];
    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
      createdProducts.push(product);
    }
    console.log(`✅ Successfully seeded ${createdProducts.length} products`);

    // Display created products
    createdProducts.forEach(product => {
      console.log(`   - ${product.name.en} (${product.category}) - Stock: ${product.inventory.stock}`);
    });

    console.log('\n📊 Product Summary:');
    console.log(`   Scooters: ${createdProducts.filter(p => p.category === 'scooter').length}`);
    console.log(`   Accessories: ${createdProducts.filter(p => p.category === 'accessory').length}`);
    console.log(`   Featured: ${createdProducts.filter(p => p.isFeatured).length}`);
    console.log(`   Premium: ${createdProducts.filter(p => p.isPremium).length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
