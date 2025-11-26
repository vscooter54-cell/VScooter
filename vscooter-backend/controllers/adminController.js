const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Review = require('../models/Review');
const SiteSettings = require('../models/SiteSettings');
const { ErrorResponse, asyncHandler } = require('../middleware/error');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/admin/dashboard
 * @access  Private/Admin
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Get total counts
  const [
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue,
    monthlyOrders,
    lastMonthOrders,
    monthlyRevenue,
    lastMonthRevenue,
    pendingOrders,
    recentOrders,
    topProducts,
    lowStockProducts
  ] = await Promise.all([
    // Total users
    User.countDocuments({ role: 'customer' }),

    // Total orders
    Order.countDocuments(),

    // Total products
    Product.countDocuments({ isActive: true }),

    // Total revenue
    Order.aggregate([
      { $match: { status: { $in: ['delivered', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),

    // This month orders
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),

    // Last month orders
    Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    }),

    // This month revenue
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $in: ['delivered', 'completed'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),

    // Last month revenue
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: { $in: ['delivered', 'completed'] }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),

    // Pending orders
    Order.countDocuments({ status: 'pending' }),

    // Recent orders (last 10)
    Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .select('orderNumber totalAmount status createdAt'),

    // Top selling products
    Order.aggregate([
      { $match: { status: { $in: ['delivered', 'completed'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' }
    ]),

    // Low stock products
    Product.find({ stock: { $lte: 10 }, isActive: true })
      .select('name stock price images')
      .limit(10)
  ]);

  // Calculate growth rates
  const orderGrowth = lastMonthOrders > 0
    ? ((monthlyOrders - lastMonthOrders) / lastMonthOrders * 100).toFixed(1)
    : 100;

  const revenueGrowth = lastMonthRevenue[0]?.total > 0
    ? ((monthlyRevenue[0]?.total - lastMonthRevenue[0]?.total) / lastMonthRevenue[0]?.total * 100).toFixed(1)
    : 100;

  // Get revenue by day for the last 30 days
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const revenueByDay = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
        status: { $in: ['delivered', 'completed'] }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyOrders,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingOrders,
        orderGrowth: parseFloat(orderGrowth),
        revenueGrowth: parseFloat(revenueGrowth)
      },
      recentOrders,
      topProducts: topProducts.map(p => ({
        id: p._id,
        name: p.productInfo.name,
        image: p.productInfo.images?.[0],
        totalSold: p.totalSold,
        revenue: p.revenue
      })),
      lowStockProducts,
      revenueByDay
    }
  });
});

/**
 * @desc    Get all customers with filters and pagination
 * @route   GET /api/admin/customers
 * @access  Private/Admin
 */
exports.getCustomers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  // Build filter
  const filter = { role: 'customer' };

  if (req.query.search) {
    filter.$or = [
      { firstName: { $regex: req.query.search, $options: 'i' } },
      { lastName: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }

  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  // Get customers
  const customers = await User.find(filter)
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Get order stats for each customer
  const customersWithStats = await Promise.all(
    customers.map(async (customer) => {
      const orderStats = await Order.aggregate([
        { $match: { user: customer._id } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$totalAmount' },
            lastOrderDate: { $max: '$createdAt' }
          }
        }
      ]);

      return {
        ...customer.toObject(),
        stats: orderStats[0] || { totalOrders: 0, totalSpent: 0, lastOrderDate: null }
      };
    })
  );

  const total = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: customers.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: customersWithStats
  });
});

/**
 * @desc    Get customer details with full history
 * @route   GET /api/admin/customers/:id
 * @access  Private/Admin
 */
exports.getCustomerDetails = asyncHandler(async (req, res, next) => {
  const customer = await User.findById(req.params.id)
    .select('-password -refreshToken');

  if (!customer) {
    return next(new ErrorResponse('Customer not found', 404));
  }

  // Get customer's orders
  const orders = await Order.find({ user: customer._id })
    .sort({ createdAt: -1 })
    .select('orderNumber totalAmount status createdAt items');

  // Get customer's reviews
  const reviews = await Review.find({ user: customer._id })
    .populate('product', 'name images')
    .sort({ createdAt: -1 });

  // Calculate statistics
  const stats = await Order.aggregate([
    { $match: { user: customer._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        avgOrderValue: { $avg: '$totalAmount' },
        lastOrderDate: { $max: '$createdAt' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      customer,
      orders,
      reviews,
      stats: stats[0] || { totalOrders: 0, totalSpent: 0, avgOrderValue: 0, lastOrderDate: null }
    }
  });
});

/**
 * @desc    Get site settings
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
exports.getSettings = asyncHandler(async (req, res, next) => {
  const settings = await SiteSettings.getInstance();

  res.status(200).json({
    success: true,
    data: settings
  });
});

/**
 * @desc    Update site settings
 * @route   PUT /api/admin/settings
 * @access  Private/Admin
 */
exports.updateSettings = asyncHandler(async (req, res, next) => {
  let settings = await SiteSettings.getInstance();

  // Update settings
  Object.keys(req.body).forEach(key => {
    if (req.body[key] !== undefined) {
      settings[key] = req.body[key];
    }
  });

  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Settings updated successfully',
    data: settings
  });
});

/**
 * @desc    Get analytics data
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
exports.getAnalytics = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, type = 'daily' } = req.query;

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  // Revenue over time
  const revenueData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: { $in: ['delivered', 'completed'] }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: type === 'monthly' ? '%Y-%m' : '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Product sales
  const productSales = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }
  ]);

  // Customer acquisition
  const newCustomers = await User.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        role: 'customer'
      }
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: type === 'monthly' ? '%Y-%m' : '%Y-%m-%d',
            date: '$createdAt'
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Order status distribution
  const ordersByStatus = await Order.aggregate([
    { $match: { createdAt: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      revenueData,
      productSales: productSales.map(p => ({
        id: p._id,
        name: p.product.name,
        totalSold: p.totalSold,
        revenue: p.revenue
      })),
      newCustomers,
      ordersByStatus
    }
  });
});

module.exports = exports;
