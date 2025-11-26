const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ['customer', 'admin'],
    required: true
  },
  senderUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  attachments: [{
    url: String,
    filename: String,
    fileType: String,
    fileSize: Number
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date
}, {
  timestamps: true
});

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  guestEmail: {
    type: String,
    validate: {
      validator: function(v) {
        // Only required if user is not registered
        return this.user || (v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      },
      message: 'Valid email is required for guest users'
    }
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: [
      'order_inquiry',
      'product_question',
      'technical_support',
      'warranty_claim',
      'return_refund',
      'shipping_delivery',
      'payment_issue',
      'account_issue',
      'complaint',
      'other'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_customer', 'waiting_internal', 'resolved', 'closed'],
    default: 'open'
  },
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  messages: [messageSchema],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin user
    default: null
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  internalNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date,
    resolutionNote: String,
    customerSatisfaction: {
      type: Number,
      min: 1,
      max: 5
    },
    customerFeedback: String
  },
  closedAt: Date,
  lastResponseAt: Date,
  lastResponseBy: {
    type: String,
    enum: ['customer', 'admin']
  }
}, {
  timestamps: true
});

// Generate ticket number before saving
supportTicketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    const count = await mongoose.model('Support').countDocuments();
    const ticketNum = String(count + 1).padStart(6, '0');
    this.ticketNumber = `TKT-${new Date().getFullYear()}-${ticketNum}`;
  }
  next();
});

// Update lastResponseAt when new message is added
supportTicketSchema.pre('save', function(next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    const lastMessage = this.messages[this.messages.length - 1];
    this.lastResponseAt = lastMessage.createdAt || new Date();
    this.lastResponseBy = lastMessage.sender;
  }
  next();
});

// Indexes for querying
supportTicketSchema.index({ ticketNumber: 1 }, { unique: true });
supportTicketSchema.index({ user: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ priority: 1 });
supportTicketSchema.index({ category: 1 });
supportTicketSchema.index({ assignedTo: 1 });
supportTicketSchema.index({ createdAt: -1 });

// Method to add message
supportTicketSchema.methods.addMessage = function(sender, senderUserId, messageText, attachments = []) {
  this.messages.push({
    sender,
    senderUser: senderUserId,
    message: messageText,
    attachments,
    isRead: false,
    createdAt: new Date()
  });

  this.lastResponseAt = new Date();
  this.lastResponseBy = sender;

  // Auto-update status when customer responds
  if (sender === 'customer' && this.status === 'waiting_customer') {
    this.status = 'in_progress';
  }

  return this;
};

// Method to update status
supportTicketSchema.methods.updateStatus = function(newStatus, userId = null, note = '') {
  this.status = newStatus;

  if (newStatus === 'resolved' && !this.resolution.resolvedAt) {
    this.resolution.resolvedBy = userId;
    this.resolution.resolvedAt = new Date();
    this.resolution.resolutionNote = note;
  }

  if (newStatus === 'closed' && !this.closedAt) {
    this.closedAt = new Date();
  }

  return this;
};

// Method to assign ticket
supportTicketSchema.methods.assignTicket = function(adminUserId) {
  this.assignedTo = adminUserId;
  if (this.status === 'open') {
    this.status = 'in_progress';
  }
  return this;
};

// Method to add internal note
supportTicketSchema.methods.addInternalNote = function(note, userId) {
  this.internalNotes.push({
    note,
    addedBy: userId,
    addedAt: new Date()
  });
  return this;
};

// Method to mark messages as read
supportTicketSchema.methods.markMessagesAsRead = function(sender) {
  // Mark all messages from the opposite sender as read
  const targetSender = sender === 'customer' ? 'admin' : 'customer';

  this.messages.forEach(message => {
    if (message.sender === targetSender && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
    }
  });

  return this;
};

// Method to add customer satisfaction rating
supportTicketSchema.methods.addSatisfactionRating = function(rating, feedback = '') {
  this.resolution.customerSatisfaction = rating;
  this.resolution.customerFeedback = feedback;
  return this;
};

// Virtual for unread message count
supportTicketSchema.virtual('unreadCount').get(function() {
  return {
    customer: this.messages.filter(m => m.sender === 'admin' && !m.isRead).length,
    admin: this.messages.filter(m => m.sender === 'customer' && !m.isRead).length
  };
});

// Virtual for response time (in hours)
supportTicketSchema.virtual('responseTime').get(function() {
  if (this.messages.length < 2) return null;

  const firstMessage = this.messages[0];
  const firstResponse = this.messages.find(m => m.sender !== firstMessage.sender);

  if (!firstResponse) return null;

  const diffMs = new Date(firstResponse.createdAt) - new Date(firstMessage.createdAt);
  return Math.round(diffMs / (1000 * 60 * 60) * 10) / 10; // Hours with 1 decimal
});

// Virtual for time since last update (in hours)
supportTicketSchema.virtual('hoursSinceLastUpdate').get(function() {
  const lastUpdate = this.lastResponseAt || this.createdAt;
  const diffMs = new Date() - new Date(lastUpdate);
  return Math.round(diffMs / (1000 * 60 * 60));
});

// Ensure virtuals are included in JSON
supportTicketSchema.set('toJSON', { virtuals: true });
supportTicketSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Support', supportTicketSchema);
