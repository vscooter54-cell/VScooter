const Support = require('../models/Support');
const { ErrorResponse, asyncHandler } = require('../middleware/error');

/**
 * @desc    Create support ticket
 * @route   POST /api/support/tickets
 * @access  Private
 */
exports.createTicket = asyncHandler(async (req, res, next) => {
  const { subject, category, priority, message, attachments } = req.body;

  const ticket = await Support.create({
    user: req.user.id,
    subject,
    category,
    priority: priority || 'medium',
    messages: [
      {
        sender: req.user.id,
        senderType: 'customer',
        message,
        attachments: attachments || []
      }
    ]
  });

  // TODO: Send notification email to support team

  res.status(201).json({
    success: true,
    message: 'Support ticket created successfully',
    data: ticket
  });
});

/**
 * @desc    Get all user's tickets
 * @route   GET /api/support/tickets/my-tickets
 * @access  Private
 */
exports.getMyTickets = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { user: req.user.id };

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  const tickets = await Support.find(query)
    .sort('-updatedAt')
    .skip(skip)
    .limit(limit);

  const total = await Support.countDocuments(query);

  res.status(200).json({
    success: true,
    count: tickets.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: tickets
  });
});

/**
 * @desc    Get single ticket
 * @route   GET /api/support/tickets/:id
 * @access  Private
 */
exports.getTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Support.findById(req.params.id)
    .populate('user', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName')
    .populate('messages.sender', 'firstName lastName');

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  // Check authorization (user or admin)
  if (ticket.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to access this ticket', 403));
  }

  res.status(200).json({
    success: true,
    data: ticket
  });
});

/**
 * @desc    Add message to ticket
 * @route   POST /api/support/tickets/:id/messages
 * @access  Private
 */
exports.addMessage = asyncHandler(async (req, res, next) => {
  const { message, attachments } = req.body;

  const ticket = await Support.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  // Check authorization
  if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to add message to this ticket', 403));
  }

  const result = await ticket.addMessage({
    sender: req.user.id,
    senderType: req.user.role === 'admin' ? 'admin' : 'customer',
    message,
    attachments: attachments || []
  });

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  await ticket.populate('user assignedTo messages.sender');

  // TODO: Send notification email

  res.status(200).json({
    success: true,
    message: 'Message added successfully',
    data: ticket
  });
});

/**
 * @desc    Close ticket
 * @route   PUT /api/support/tickets/:id/close
 * @access  Private
 */
exports.closeTicket = asyncHandler(async (req, res, next) => {
  const { resolution } = req.body;

  const ticket = await Support.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  // Check authorization
  if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to close this ticket', 403));
  }

  const result = await ticket.close(resolution);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Ticket closed successfully',
    data: ticket
  });
});

/**
 * @desc    Reopen ticket
 * @route   PUT /api/support/tickets/:id/reopen
 * @access  Private
 */
exports.reopenTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Support.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  // Check authorization
  if (ticket.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to reopen this ticket', 403));
  }

  const result = await ticket.reopen();

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Ticket reopened successfully',
    data: ticket
  });
});

/**
 * @desc    Rate ticket resolution
 * @route   POST /api/support/tickets/:id/rate
 * @access  Private
 */
exports.rateTicket = asyncHandler(async (req, res, next) => {
  const { rating, feedback } = req.body;

  const ticket = await Support.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  // Check authorization (only ticket owner can rate)
  if (ticket.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to rate this ticket', 403));
  }

  const result = await ticket.addRating(rating, feedback);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Rating submitted successfully',
    data: ticket
  });
});

/**
 * @desc    Get all tickets (Admin)
 * @route   GET /api/support/tickets
 * @access  Private/Admin
 */
exports.getAllTickets = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const query = {};

  // Filter by status
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by priority
  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  // Filter by assigned admin
  if (req.query.assignedTo) {
    query.assignedTo = req.query.assignedTo;
  }

  // Filter unassigned
  if (req.query.unassigned === 'true') {
    query.assignedTo = null;
  }

  const tickets = await Support.find(query)
    .populate('user', 'firstName lastName email')
    .populate('assignedTo', 'firstName lastName')
    .sort('-updatedAt')
    .skip(skip)
    .limit(limit);

  const total = await Support.countDocuments(query);

  res.status(200).json({
    success: true,
    count: tickets.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: tickets
  });
});

/**
 * @desc    Assign ticket to admin (Admin)
 * @route   PUT /api/support/tickets/:id/assign
 * @access  Private/Admin
 */
exports.assignTicket = asyncHandler(async (req, res, next) => {
  const { adminId } = req.body;

  const ticket = await Support.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  const result = await ticket.assignTo(adminId);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  await ticket.populate('assignedTo', 'firstName lastName');

  // TODO: Send notification to assigned admin

  res.status(200).json({
    success: true,
    message: 'Ticket assigned successfully',
    data: ticket
  });
});

/**
 * @desc    Update ticket priority (Admin)
 * @route   PUT /api/support/tickets/:id/priority
 * @access  Private/Admin
 */
exports.updatePriority = asyncHandler(async (req, res, next) => {
  const { priority } = req.body;

  const ticket = await Support.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  const result = await ticket.updatePriority(priority);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Priority updated successfully',
    data: ticket
  });
});

/**
 * @desc    Add internal note (Admin)
 * @route   POST /api/support/tickets/:id/notes
 * @access  Private/Admin
 */
exports.addInternalNote = asyncHandler(async (req, res, next) => {
  const { note } = req.body;

  const ticket = await Support.findById(req.params.id);

  if (!ticket) {
    return next(new ErrorResponse('Ticket not found', 404));
  }

  const result = await ticket.addInternalNote(req.user.id, note);

  if (!result.success) {
    return next(new ErrorResponse(result.message, 400));
  }

  res.status(200).json({
    success: true,
    message: 'Internal note added successfully',
    data: ticket
  });
});

/**
 * @desc    Get support statistics (Admin)
 * @route   GET /api/support/stats/overview
 * @access  Private/Admin
 */
exports.getSupportStats = asyncHandler(async (req, res, next) => {
  const stats = await Support.aggregate([
    {
      $facet: {
        statusBreakdown: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        categoryBreakdown: [
          { $group: { _id: '$category', count: { $sum: 1 } } }
        ],
        priorityBreakdown: [
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ],
        ratingStats: [
          { $match: { 'rating.score': { $exists: true } } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: '$rating.score' },
              totalRatings: { $sum: 1 }
            }
          }
        ],
        assignmentStats: [
          {
            $group: {
              _id: '$assignedTo',
              count: { $sum: 1 }
            }
          }
        ],
        totalStats: [
          {
            $group: {
              _id: null,
              totalTickets: { $sum: 1 },
              openTickets: {
                $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
              },
              closedTickets: {
                $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
              }
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
