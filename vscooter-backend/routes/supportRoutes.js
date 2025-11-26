const express = require('express');
const {
  createTicket,
  getMyTickets,
  getTicket,
  addMessage,
  closeTicket,
  reopenTicket,
  rateTicket,
  getAllTickets,
  assignTicket,
  updatePriority,
  addInternalNote,
  getSupportStats
} = require('../controllers/supportController');

const { protect, authorize } = require('../middleware/auth');
const { validate, validateObjectId } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// Validation rules
const createTicketValidation = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('category').isIn(['general', 'technical', 'billing', 'shipping', 'product', 'returns', 'other'])
    .withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  body('message').trim().notEmpty().withMessage('Message is required')
];

const addMessageValidation = [
  body('message').trim().notEmpty().withMessage('Message is required')
];

const rateTicketValidation = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').optional().trim()
];

const assignValidation = [
  body('adminId').notEmpty().withMessage('Admin ID is required')
];

const priorityValidation = [
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority')
];

// Protected routes
router.use(protect);

router.post('/tickets', createTicketValidation, validate, createTicket);
router.get('/tickets/my-tickets', getMyTickets);
router.get('/tickets/:id', validateObjectId('id'), getTicket);
router.post('/tickets/:id/messages', validateObjectId('id'), addMessageValidation, validate, addMessage);
router.put('/tickets/:id/close', validateObjectId('id'), closeTicket);
router.put('/tickets/:id/reopen', validateObjectId('id'), reopenTicket);
router.post('/tickets/:id/rate', validateObjectId('id'), rateTicketValidation, validate, rateTicket);

// Admin routes
router.use(authorize('admin'));

router.get('/stats/overview', getSupportStats);
router.get('/tickets', getAllTickets);
router.put('/tickets/:id/assign', validateObjectId('id'), assignValidation, validate, assignTicket);
router.put('/tickets/:id/priority', validateObjectId('id'), priorityValidation, validate, updatePriority);
router.post('/tickets/:id/notes', validateObjectId('id'), addInternalNote);

module.exports = router;
