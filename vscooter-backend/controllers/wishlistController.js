const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { ErrorResponse, asyncHandler } = require('../middleware/error');

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
exports.getWishlist = asyncHandler(async (req, res, next) => {
  let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product');

  if (!wishlist) {
    // Create empty wishlist if doesn't exist
    wishlist = await Wishlist.create({
      user: req.user.id,
      items: []
    });
  }

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist/items
 * @access  Private
 */
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId, notifyOnPriceDrop, notifyOnRestock, targetPrice } = req.body;

  // Verify product exists
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user.id,
      items: []
    });
  }

  // Check if product already in wishlist
  const existingItem = wishlist.items.find(
    item => item.product.toString() === productId
  );

  if (existingItem) {
    return next(new ErrorResponse('Product already in wishlist', 400));
  }

  const result = await wishlist.addItem(productId, {
    notifyOnPriceDrop,
    notifyOnRestock,
    targetPrice
  });

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  wishlist = await Wishlist.findById(wishlist._id).populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Item added to wishlist',
    data: wishlist
  });
});

/**
 * @desc    Update wishlist item
 * @route   PUT /api/wishlist/items/:productId
 * @access  Private
 */
exports.updateWishlistItem = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { notifyOnPriceDrop, notifyOnRestock, targetPrice } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  const item = wishlist.items.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    return next(new ErrorResponse('Item not found in wishlist', 404));
  }

  if (notifyOnPriceDrop !== undefined) {
    item.notifyOnPriceDrop = notifyOnPriceDrop;
  }

  if (notifyOnRestock !== undefined) {
    item.notifyOnRestock = notifyOnRestock;
  }

  if (targetPrice !== undefined) {
    item.targetPrice = targetPrice;
  }

  await wishlist.save();

  wishlist = await Wishlist.findById(wishlist._id).populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Wishlist item updated',
    data: wishlist
  });
});

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/items/:productId
 * @access  Private
 */
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  const result = await wishlist.removeItem(productId);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 404));
  }

  wishlist = await Wishlist.findById(wishlist._id).populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Item removed from wishlist',
    data: wishlist
  });
});

/**
 * @desc    Clear wishlist
 * @route   DELETE /api/wishlist
 * @access  Private
 */
exports.clearWishlist = asyncHandler(async (req, res, next) => {
  const result = await wishlist.clearAll();

  if (!result.success) {
    return next(new ErrorResponse(result.message, 404));
  }

  res.status(200).json({
    success: true,
    message: 'Wishlist cleared',
    data: wishlist
  });
});

/**
 * @desc    Move item from wishlist to cart
 * @route   POST /api/wishlist/items/:productId/move-to-cart
 * @access  Private
 */
exports.moveToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  const wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  // Verify product is in wishlist
  const wishlistItem = wishlist.items.find(
    item => item.product.toString() === productId
  );

  if (!wishlistItem) {
    return next(new ErrorResponse('Product not in wishlist', 404));
  }

  // Get product details
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    return next(new ErrorResponse('Product not available', 400));
  }

  // Check stock
  if (product.inventory.stock < quantity) {
    return next(new ErrorResponse('Insufficient stock available', 400));
  }

  // Add to cart
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: productId, quantity }]
    });
  } else {
    const existingCartItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  // Remove from wishlist
  await wishlist.removeItem(productId);

  res.status(200).json({
    success: true,
    message: 'Item moved to cart',
    data: {
      cart: await Cart.findById(cart._id).populate('items.product'),
      wishlist: await Wishlist.findById(wishlist._id).populate('items.product')
    }
  });
});

/**
 * @desc    Move all items from wishlist to cart
 * @route   POST /api/wishlist/move-all-to-cart
 * @access  Private
 */
exports.moveAllToCart = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product');

  if (!wishlist || wishlist.items.length === 0) {
    return next(new ErrorResponse('Wishlist is empty', 400));
  }

  const unavailableItems = [];
  const movedItems = [];

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  for (const item of wishlist.items) {
    const product = item.product;

    // Check if product is available and in stock
    if (!product || !product.isActive || product.inventory.stock < 1) {
      unavailableItems.push({
        productId: product?._id,
        name: product?.name?.en || 'Unknown',
        reason: !product ? 'Not found' : !product.isActive ? 'Not available' : 'Out of stock'
      });
      continue;
    }

    // Add to cart
    const existingCartItem = cart.items.find(
      cartItem => cartItem.product.toString() === product._id.toString()
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      cart.items.push({ product: product._id, quantity: 1 });
    }

    movedItems.push(product._id.toString());
  }

  await cart.save();

  // Remove moved items from wishlist
  wishlist.items = wishlist.items.filter(
    item => !movedItems.includes(item.product._id.toString())
  );

  await wishlist.save();

  res.status(200).json({
    success: true,
    message: `${movedItems.length} items moved to cart`,
    data: {
      movedCount: movedItems.length,
      unavailableItems,
      cart: await Cart.findById(cart._id).populate('items.product'),
      wishlist: await Wishlist.findById(wishlist._id).populate('items.product')
    }
  });
});

/**
 * @desc    Share wishlist
 * @route   PUT /api/wishlist/share
 * @access  Private
 */
exports.shareWishlist = asyncHandler(async (req, res, next) => {
  const { name, isPublic } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user.id });

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  const result = await wishlist.makeShareable(name, isPublic);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  const shareUrl = `${process.env.FRONTEND_URL}/wishlist/shared/${wishlist.shareToken}`;

  res.status(200).json({
    success: true,
    message: 'Wishlist is now shareable',
    data: {
      wishlist,
      shareUrl
    }
  });
});

/**
 * @desc    Get shared wishlist
 * @route   GET /api/wishlist/shared/:token
 * @access  Public
 */
exports.getSharedWishlist = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ shareToken: req.params.token })
    .populate('items.product')
    .populate('user', 'firstName lastName');

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  if (!wishlist.isPublic) {
    return next(new ErrorResponse('This wishlist is private', 403));
  }

  res.status(200).json({
    success: true,
    data: wishlist
  });
});

/**
 * @desc    Check price drops
 * @route   GET /api/wishlist/check-price-drops
 * @access  Private
 */
exports.checkPriceDrops = asyncHandler(async (req, res, next) => {
  const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items.product');

  if (!wishlist) {
    return next(new ErrorResponse('Wishlist not found', 404));
  }

  const priceDrops = [];

  for (const item of wishlist.items) {
    if (!item.product) continue;

    const currentPrice = item.product.pricing.salePrice.USD; // Assuming USD
    const addedPrice = item.addedPrice?.USD || currentPrice;

    if (currentPrice < addedPrice) {
      const dropAmount = addedPrice - currentPrice;
      const dropPercentage = ((dropAmount / addedPrice) * 100).toFixed(2);

      priceDrops.push({
        product: item.product,
        originalPrice: addedPrice,
        currentPrice,
        dropAmount,
        dropPercentage: `${dropPercentage}%`
      });
    }

    // Check target price
    if (item.targetPrice && currentPrice <= item.targetPrice.USD) {
      priceDrops.push({
        product: item.product,
        targetPrice: item.targetPrice.USD,
        currentPrice,
        message: 'Target price reached!'
      });
    }
  }

  res.status(200).json({
    success: true,
    count: priceDrops.length,
    data: priceDrops
  });
});
