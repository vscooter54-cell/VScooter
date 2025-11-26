const Product = require('../models/Product');
const { ErrorResponse, asyncHandler } = require('../middleware/error');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by tags
  if (req.query.tags) {
    query.tags = { $in: req.query.tags.split(',') };
  }

  // Filter by price range
  if (req.query.minPrice || req.query.maxPrice) {
    query['pricing.salePrice'] = {};
    if (req.query.minPrice) {
      query['pricing.salePrice'].$gte = parseFloat(req.query.minPrice);
    }
    if (req.query.maxPrice) {
      query['pricing.salePrice'].$lte = parseFloat(req.query.maxPrice);
    }
  }

  // Filter by rating
  if (req.query.minRating) {
    query['ratings.average'] = { $gte: parseFloat(req.query.minRating) };
  }

  // Filter by availability
  if (req.query.inStock === 'true') {
    query['inventory.stock'] = { $gt: 0 };
  }

  // Filter by featured/premium
  if (req.query.featured === 'true') {
    query.isFeatured = true;
  }
  if (req.query.premium === 'true') {
    query.isPremium = true;
  }

  // Search query
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { 'name.en': searchRegex },
      { 'name.de': searchRegex },
      { 'description.en': searchRegex },
      { 'description.de': searchRegex },
      { tags: searchRegex }
    ];
  }

  // Only show active products for non-admin users
  query.isActive = true;

  // Sort
  let sortBy = '-createdAt'; // Default: newest first
  if (req.query.sort) {
    const sortMap = {
      'price-asc': 'pricing.salePrice',
      'price-desc': '-pricing.salePrice',
      'rating': '-ratings.average',
      'popular': '-ratings.count',
      'newest': '-createdAt',
      'name': 'name.en'
    };
    sortBy = sortMap[req.query.sort] || sortBy;
  }

  const products = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: products
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (!product.isActive) {
    return next(new ErrorResponse('Product not available', 404));
  }

  // Increment view count
  product.viewCount = (product.viewCount || 0) + 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Get product by slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
exports.getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (!product.isActive) {
    return next(new ErrorResponse('Product not available', 404));
  }

  // Increment view count
  product.viewCount = (product.viewCount || 0) + 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully',
    data: {}
  });
});

/**
 * @desc    Update product inventory
 * @route   PATCH /api/products/:id/inventory
 * @access  Private/Admin
 */
exports.updateInventory = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const { stock, lowStockThreshold } = req.body;

  if (stock !== undefined) {
    product.inventory.stock = stock;
  }

  if (lowStockThreshold !== undefined) {
    product.inventory.lowStockThreshold = lowStockThreshold;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: 'Inventory updated successfully',
    data: product
  });
});

/**
 * @desc    Get product categories
 * @route   GET /api/products/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Product.distinct('category', { isActive: true });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

/**
 * @desc    Get product tags
 * @route   GET /api/products/tags
 * @access  Public
 */
exports.getTags = asyncHandler(async (req, res, next) => {
  const tags = await Product.distinct('tags', { isActive: true });

  res.status(200).json({
    success: true,
    count: tags.length,
    data: tags
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 4;

  const products = await Product.find({ isFeatured: true, isActive: true })
    .sort('-createdAt')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

/**
 * @desc    Get related products
 * @route   GET /api/products/:id/related
 * @access  Public
 */
exports.getRelatedProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const limit = parseInt(req.query.limit) || 4;

  // Find products with same category or tags
  const relatedProducts = await Product.find({
    _id: { $ne: product._id },
    isActive: true,
    $or: [
      { category: product.category },
      { tags: { $in: product.tags } }
    ]
  })
    .sort('-ratings.average')
    .limit(limit);

  res.status(200).json({
    success: true,
    count: relatedProducts.length,
    data: relatedProducts
  });
});

/**
 * @desc    Check stock availability
 * @route   POST /api/products/check-stock
 * @access  Public
 */
exports.checkStock = asyncHandler(async (req, res, next) => {
  const { items } = req.body; // Array of { productId, quantity }

  const stockStatus = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      stockStatus.push({
        productId: item.productId,
        available: false,
        reason: 'Product not found'
      });
      continue;
    }

    if (!product.isActive) {
      stockStatus.push({
        productId: item.productId,
        available: false,
        reason: 'Product not available'
      });
      continue;
    }

    if (product.inventory.stock < item.quantity) {
      stockStatus.push({
        productId: item.productId,
        available: false,
        reason: 'Insufficient stock',
        availableStock: product.inventory.stock
      });
      continue;
    }

    stockStatus.push({
      productId: item.productId,
      available: true,
      availableStock: product.inventory.stock
    });
  }

  res.status(200).json({
    success: true,
    data: stockStatus
  });
});
