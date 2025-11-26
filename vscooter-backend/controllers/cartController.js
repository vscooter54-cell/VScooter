const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { ErrorResponse, asyncHandler } = require('../middleware/error');

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart) {
    // Create empty cart if doesn't exist
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart
  });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  // Verify product exists and is active
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (!product.isActive) {
    return next(new ErrorResponse('Product is not available', 400));
  }

  // Check stock availability
  if (product.inventory.stock < quantity) {
    return next(new ErrorResponse('Insufficient stock available', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    // Create new cart
    cart = await Cart.create({
      user: req.user.id,
      items: [{ product: productId, quantity }]
    });
  } else {
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;

      // Check stock for new quantity
      if (product.inventory.stock < newQuantity) {
        return next(new ErrorResponse('Insufficient stock available', 400));
      }

      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  // Populate and return cart
  cart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Item added to cart',
    data: cart
  });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/items/:productId
 * @access  Private
 */
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (quantity < 1) {
    return next(new ErrorResponse('Quantity must be at least 1', 400));
  }

  // Verify product and stock
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  if (product.inventory.stock < quantity) {
    return next(new ErrorResponse('Insufficient stock available', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  cart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Cart updated',
    data: cart
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:productId
 * @access  Private
 */
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse('Item not found in cart', 404));
  }

  cart.items.splice(itemIndex, 1);
  await cart.save();

  cart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: cart
  });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
exports.clearCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.items = [];
  cart.appliedCoupon = undefined;
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    data: cart
  });
});

/**
 * @desc    Apply coupon to cart
 * @route   POST /api/cart/coupon
 * @access  Private
 */
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const { code } = req.body;
  const Coupon = require('../models/Coupon');

  let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Cart is empty', 400));
  }

  // Find and validate coupon
  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    return next(new ErrorResponse('Invalid coupon code', 400));
  }

  const validation = await coupon.canBeUsed(req.user.id, cart.calculations.subtotal);

  if (!validation.valid) {
    return next(new ErrorResponse(validation.reason, 400));
  }

  // Apply coupon
  cart.appliedCoupon = coupon._id;
  await cart.save();

  cart = await Cart.findById(cart._id).populate('items.product appliedCoupon');

  res.status(200).json({
    success: true,
    message: 'Coupon applied successfully',
    data: cart
  });
});

/**
 * @desc    Remove coupon from cart
 * @route   DELETE /api/cart/coupon
 * @access  Private
 */
exports.removeCoupon = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  cart.appliedCoupon = undefined;
  await cart.save();

  cart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Coupon removed',
    data: cart
  });
});

/**
 * @desc    Validate cart (check stock, prices, etc.)
 * @route   GET /api/cart/validate
 * @access  Private
 */
exports.validateCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(200).json({
      success: true,
      valid: true,
      issues: []
    });
  }

  const issues = [];

  // Check each item
  for (const item of cart.items) {
    if (!item.product) {
      issues.push({
        type: 'product_not_found',
        productId: item.product,
        message: 'Product no longer available'
      });
      continue;
    }

    if (!item.product.isActive) {
      issues.push({
        type: 'product_inactive',
        productId: item.product._id,
        productName: item.product.name.en,
        message: 'Product is no longer available'
      });
      continue;
    }

    if (item.product.inventory.stock < item.quantity) {
      issues.push({
        type: 'insufficient_stock',
        productId: item.product._id,
        productName: item.product.name.en,
        requestedQuantity: item.quantity,
        availableStock: item.product.inventory.stock,
        message: `Only ${item.product.inventory.stock} items available`
      });
    }
  }

  res.status(200).json({
    success: true,
    valid: issues.length === 0,
    issues,
    data: cart
  });
});

/**
 * @desc    Merge guest cart with user cart (after login)
 * @route   POST /api/cart/merge
 * @access  Private
 */
exports.mergeCart = asyncHandler(async (req, res, next) => {
  const { guestCartItems } = req.body; // Array of { productId, quantity }

  if (!guestCartItems || guestCartItems.length === 0) {
    return next(new ErrorResponse('No items to merge', 400));
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  // Merge items
  for (const guestItem of guestCartItems) {
    const product = await Product.findById(guestItem.productId);

    if (!product || !product.isActive) {
      continue;
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === guestItem.productId
    );

    if (existingItemIndex > -1) {
      // Add quantities
      const newQuantity = cart.items[existingItemIndex].quantity + guestItem.quantity;
      cart.items[existingItemIndex].quantity = Math.min(
        newQuantity,
        product.inventory.stock
      );
    } else {
      cart.items.push({
        product: guestItem.productId,
        quantity: Math.min(guestItem.quantity, product.inventory.stock)
      });
    }
  }

  await cart.save();

  cart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    message: 'Carts merged successfully',
    data: cart
  });
});
