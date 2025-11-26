const User = require('../models/User');
const { ErrorResponse, asyncHandler } = require('../middleware/error');
const crypto = require('crypto');

/**
 * @desc    Register user
 * @route   POST /api/users/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('User already exists with this email', 400));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    phone
  });

  // Generate email verification token
  const verificationToken = user.getEmailVerificationToken();
  await user.save();

  // TODO: Send verification email
  // await sendEmail({ ... });

  sendTokenResponse(user, 201, res, 'Registration successful. Please verify your email.');
});

/**
 * @desc    Login user
 * @route   POST /api/users/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Check for user (include password for comparison)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if user is active
  if (!user.isActive) {
    return next(new ErrorResponse('Account is deactivated', 401));
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Login successful');
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/users/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
    data: {}
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user details
 * @route   PUT /api/users/me
 * @access  Private
 */
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/users/updatepassword
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

/**
 * @desc    Forgot password
 * @route   POST /api/users/forgotpassword
 * @access  Public
 */
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('No user found with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // TODO: Send email with reset URL
  // const sendEmail = require('../utils/email');
  // await sendEmail.sendPasswordResetEmail(user.email, resetUrl);

  res.status(200).json({
    success: true,
    message: 'If an account exists with that email, a password reset link has been sent',
    data: {}
  });
});

/**
 * @desc    Reset password
 * @route   PUT /api/users/resetpassword/:resettoken
 * @access  Public
 */
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired reset token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

/**
 * @desc    Verify email
 * @route   GET /api/users/verify/:token
 * @access  Public
 */
exports.verifyEmail = asyncHandler(async (req, res, next) => {
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({ emailVerificationToken });

  if (!user) {
    return next(new ErrorResponse('Invalid verification token', 400));
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Email verified successfully');
});

/**
 * @desc    Add shipping address
 * @route   POST /api/users/addresses
 * @access  Private
 */
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // If this is the first address, make it default
  if (user.shippingAddresses.length === 0) {
    req.body.isDefault = true;
  }

  // If setting as default, unset other defaults
  if (req.body.isDefault) {
    user.shippingAddresses.forEach(addr => addr.isDefault = false);
  }

  user.shippingAddresses.push(req.body);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address added successfully',
    data: user
  });
});

/**
 * @desc    Update shipping address
 * @route   PUT /api/users/addresses/:addressId
 * @access  Private
 */
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const address = user.shippingAddresses.id(req.params.addressId);

  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  // If setting as default, unset other defaults
  if (req.body.isDefault) {
    user.shippingAddresses.forEach(addr => addr.isDefault = false);
  }

  Object.assign(address, req.body);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address updated successfully',
    data: user
  });
});

/**
 * @desc    Delete shipping address
 * @route   DELETE /api/users/addresses/:addressId
 * @access  Private
 */
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const address = user.shippingAddresses.id(req.params.addressId);

  if (!address) {
    return next(new ErrorResponse('Address not found', 404));
  }

  address.remove();
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Address deleted successfully',
    data: user
  });
});

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.role) query.role = req.query.role;
  if (req.query.isActive !== undefined) query.isActive = req.query.isActive === 'true';

  const users = await User.find(query)
    .select('-password')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: users
  });
});

/**
 * @desc    Get single user (Admin)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * @desc    Update user (Admin)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
    isActive: req.body.isActive
  };

  const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

/**
 * @desc    Delete user (Admin)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: {}
  });
});

/**
 * @desc    Export user data (GDPR - Right to Data Portability)
 * @route   GET /api/users/export-data
 * @access  Private
 */
exports.exportUserData = asyncHandler(async (req, res, next) => {
  const Order = require('../models/Order');
  const Review = require('../models/Review');
  const Wishlist = require('../models/Wishlist');
  const Support = require('../models/Support');

  // Get user data
  const user = await User.findById(req.user.id).select('-password -refreshToken');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Get all related data
  const [orders, reviews, wishlist, supportTickets] = await Promise.all([
    Order.find({ user: req.user.id }),
    Review.find({ user: req.user.id }),
    Wishlist.find({ user: req.user.id }).populate('product', 'name price'),
    Support.find({ user: req.user.id })
  ]);

  // Compile all data
  const exportData = {
    exportDate: new Date().toISOString(),
    user: {
      personalInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone
      },
      addresses: user.addresses,
      preferences: {
        emailNotifications: user.emailNotifications,
        marketingConsent: user.marketingConsent
      },
      accountInfo: {
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        role: user.role
      }
    },
    orders: orders.map(order => ({
      orderNumber: order.orderNumber,
      date: order.createdAt,
      status: order.status,
      items: order.items,
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      billingAddress: order.billingAddress
    })),
    reviews: reviews.map(review => ({
      product: review.product,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt
    })),
    wishlist: wishlist.map(item => ({
      product: item.product,
      addedAt: item.createdAt
    })),
    supportTickets: supportTickets.map(ticket => ({
      subject: ticket.subject,
      category: ticket.category,
      status: ticket.status,
      createdAt: ticket.createdAt,
      messages: ticket.messages
    }))
  };

  res.status(200).json({
    success: true,
    message: 'User data exported successfully',
    data: exportData
  });
});

/**
 * @desc    Delete user account and all data (GDPR - Right to Erasure)
 * @route   DELETE /api/users/delete-account
 * @access  Private
 */
exports.deleteUserAccount = asyncHandler(async (req, res, next) => {
  const { password, confirmDelete } = req.body;

  // Validate deletion confirmation
  if (confirmDelete !== 'DELETE MY ACCOUNT') {
    return next(new ErrorResponse('Please confirm account deletion', 400));
  }

  // Get user with password for verification
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid password', 401));
  }

  const Order = require('../models/Order');
  const Review = require('../models/Review');
  const Wishlist = require('../models/Wishlist');
  const Support = require('../models/Support');
  const Cart = require('../models/Cart');

  // Delete or anonymize user data
  // Note: Orders must be retained for legal/accounting reasons but can be anonymized
  await Promise.all([
    // Anonymize orders (keep for tax records)
    Order.updateMany(
      { user: user._id },
      {
        $set: {
          'shippingAddress.firstName': 'Deleted',
          'shippingAddress.lastName': 'User',
          'shippingAddress.email': 'deleted@deleted.com',
          'shippingAddress.phone': '',
          'billingAddress.firstName': 'Deleted',
          'billingAddress.lastName': 'User',
          'billingAddress.email': 'deleted@deleted.com',
          'billingAddress.phone': ''
        }
      }
    ),
    // Delete reviews (mark user as deleted)
    Review.updateMany(
      { user: user._id },
      { $set: { userName: 'Deleted User', user: null } }
    ),
    // Delete wishlist
    Wishlist.deleteMany({ user: user._id }),
    // Delete support tickets
    Support.deleteMany({ user: user._id }),
    // Delete cart
    Cart.deleteMany({ user: user._id })
  ]);

  // Delete user account
  await user.remove();

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
    data: {}
  });
});

/**
 * Helper function to get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      data: user
    });
};
