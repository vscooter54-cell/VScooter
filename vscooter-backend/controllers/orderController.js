const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { ErrorResponse, asyncHandler } = require('../middleware/error');

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { shippingAddress, paymentMethod, paymentDetails } = req.body;

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product appliedCoupon');

  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Cart is empty', 400));
  }

  // Validate stock availability
  for (const item of cart.items) {
    if (!item.product || !item.product.isActive) {
      return next(new ErrorResponse(`Product ${item.product?.name?.en || 'unknown'} is no longer available`, 400));
    }

    if (item.product.inventory.stock < item.quantity) {
      return next(new ErrorResponse(
        `Insufficient stock for ${item.product.name.en}. Only ${item.product.inventory.stock} available`,
        400
      ));
    }
  }

  // Prepare order items
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    quantity: item.quantity,
    price: item.product.pricing.salePrice,
    image: item.product.images[0]
  }));

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    paymentDetails,
    pricing: {
      subtotal: cart.calculations.subtotal,
      tax: cart.calculations.tax,
      shipping: cart.calculations.shipping,
      discount: cart.calculations.discount,
      total: cart.calculations.total,
      currency: cart.currency
    },
    appliedCoupon: cart.appliedCoupon
  });

  // Reduce stock for each product
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { 'inventory.stock': -item.quantity }
    });
  }

  // Track coupon usage
  if (cart.appliedCoupon) {
    const Coupon = require('../models/Coupon');
    await Coupon.findByIdAndUpdate(cart.appliedCoupon, {
      $inc: { 'usage.totalUsed': 1 },
      $push: { 'usage.usedBy': { user: req.user.id, orderId: order._id } }
    });
  }

  // Clear cart
  cart.items = [];
  cart.appliedCoupon = undefined;
  await cart.save();

  // TODO: Send order confirmation email

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

/**
 * @desc    Get all orders for user
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments({ user: req.user.id });

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: orders
  });
});

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'firstName lastName email')
    .populate('items.product');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Make sure user is order owner or admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Check authorization
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to cancel this order', 403));
  }

  // Check if order can be cancelled
  if (!['pending', 'processing'].includes(order.status)) {
    return next(new ErrorResponse('Order cannot be cancelled at this stage', 400));
  }

  const result = await order.cancel(req.body.reason);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { 'inventory.stock': item.quantity }
    });
  }

  // TODO: Process refund if payment was made
  // TODO: Send cancellation email

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

/**
 * @desc    Get all orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build query
  const query = {};

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.paymentStatus) {
    query['payment.status'] = req.query.paymentStatus;
  }

  if (req.query.userId) {
    query.user = req.query.userId;
  }

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    query.createdAt = {};
    if (req.query.startDate) {
      query.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      query.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const orders = await Order.find(query)
    .populate('user', 'firstName lastName email')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);

  // Calculate summary statistics
  const stats = await Order.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    stats: stats[0] || { totalRevenue: 0, averageOrderValue: 0 },
    data: orders
  });
});

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const result = await order.updateStatus(status);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  // TODO: Send status update email to customer

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

/**
 * @desc    Update shipping info (Admin)
 * @route   PUT /api/orders/:id/shipping
 * @access  Private/Admin
 */
exports.updateShipping = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const { carrier, trackingNumber, estimatedDelivery } = req.body;

  if (carrier) order.shipping.carrier = carrier;
  if (trackingNumber) order.shipping.trackingNumber = trackingNumber;
  if (estimatedDelivery) order.shipping.estimatedDelivery = estimatedDelivery;

  // Update shipping date if not set
  if (!order.shipping.shippedAt && order.status === 'shipped') {
    order.shipping.shippedAt = Date.now();
  }

  await order.save();

  // TODO: Send shipping update email

  res.status(200).json({
    success: true,
    message: 'Shipping info updated successfully',
    data: order
  });
});

/**
 * @desc    Update payment status (Admin)
 * @route   PUT /api/orders/:id/payment
 * @access  Private/Admin
 */
exports.updatePaymentStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const { status, transactionId } = req.body;

  if (status) order.payment.status = status;
  if (transactionId) order.payment.transactionId = transactionId;

  if (status === 'paid' && !order.payment.paidAt) {
    order.payment.paidAt = Date.now();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Payment status updated successfully',
    data: order
  });
});

/**
 * @desc    Process refund (Admin)
 * @route   POST /api/orders/:id/refund
 * @access  Private/Admin
 */
exports.processRefund = asyncHandler(async (req, res, next) => {
  const { amount, reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (order.payment.status !== 'paid') {
    return next(new ErrorResponse('Order has not been paid', 400));
  }

  const refundAmount = amount || order.pricing.total;

  if (refundAmount > order.pricing.total) {
    return next(new ErrorResponse('Refund amount cannot exceed order total', 400));
  }

  // TODO: Process actual refund with payment gateway

  order.refund.amount = refundAmount;
  order.refund.status = 'processed';
  order.refund.processedAt = Date.now();
  order.refund.reason = reason;

  order.payment.status = 'refunded';

  await order.save();

  // TODO: Send refund confirmation email

  res.status(200).json({
    success: true,
    message: 'Refund processed successfully',
    data: order
  });
});

/**
 * @desc    Get order statistics (Admin)
 * @route   GET /api/orders/stats/overview
 * @access  Private/Admin
 */
exports.getOrderStats = asyncHandler(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $facet: {
        statusBreakdown: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        paymentBreakdown: [
          { $group: { _id: '$payment.status', count: { $sum: 1 } } }
        ],
        revenueByMonth: [
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              revenue: { $sum: '$pricing.total' },
              orders: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': -1, '_id.month': -1 } },
          { $limit: 12 }
        ],
        totalStats: [
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              totalRevenue: { $sum: '$pricing.total' },
              averageOrderValue: { $avg: '$pricing.total' }
            }
          }
        ]
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0]
  });
});
