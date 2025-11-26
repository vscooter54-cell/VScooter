const nodemailer = require('nodemailer');

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

/**
 * Send email
 */
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `${process.env.FROM_NAME || 'VScooter'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || options.message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Email Templates
 */

// Welcome email
const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Welcome to VScooter!</h1>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for joining VScooter. We're excited to have you on board!</p>
      <p>Start exploring our range of premium electric scooters and accessories.</p>
      <p>Best regards,<br>The VScooter Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject: 'Welcome to VScooter',
    html
  });
};

// Email verification
const sendVerificationEmail = async (user, verificationUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Verify Your Email</h1>
      <p>Hi ${user.firstName},</p>
      <p>Please click the button below to verify your email address:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" style="background-color: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </p>
      <p>Or copy and paste this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>Best regards,<br>The VScooter Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject: 'Verify Your VScooter Account',
    html
  });
};

// Password reset email
const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Reset Your Password</h1>
      <p>Hi ${user.firstName},</p>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link: ${resetUrl}</p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The VScooter Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject: 'Password Reset Request',
    html
  });
};

// Order confirmation email
const sendOrderConfirmationEmail = async (order, user) => {
  const itemsList = order.items.map(item => `
    <tr>
      <td>${item.name.en}</td>
      <td>${item.quantity}</td>
      <td>${order.pricing.currency} ${item.price[order.pricing.currency]}</td>
      <td>${order.pricing.currency} ${(item.price[order.pricing.currency] * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Order Confirmation</h1>
      <p>Hi ${user.firstName},</p>
      <p>Thank you for your order! Your order #${order.orderNumber} has been confirmed.</p>

      <h2>Order Details:</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px; text-align: left;">Qty</th>
            <th style="padding: 10px; text-align: left;">Price</th>
            <th style="padding: 10px; text-align: left;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>

      <div style="text-align: right; margin: 20px 0;">
        <p><strong>Subtotal:</strong> ${order.pricing.currency} ${order.pricing.subtotal}</p>
        <p><strong>Tax:</strong> ${order.pricing.currency} ${order.pricing.tax}</p>
        <p><strong>Shipping:</strong> ${order.pricing.currency} ${order.pricing.shipping}</p>
        ${order.pricing.discount > 0 ? `<p><strong>Discount:</strong> -${order.pricing.currency} ${order.pricing.discount}</p>` : ''}
        <p style="font-size: 1.2em;"><strong>Total:</strong> ${order.pricing.currency} ${order.pricing.total}</p>
      </div>

      <h3>Shipping Address:</h3>
      <p>
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </p>

      <p>We'll send you another email when your order ships.</p>
      <p>Best regards,<br>The VScooter Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html
  });
};

// Shipping update email
const sendShippingUpdateEmail = async (order, user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Your Order Has Shipped!</h1>
      <p>Hi ${user.firstName},</p>
      <p>Great news! Your order #${order.orderNumber} has been shipped.</p>

      <h3>Tracking Information:</h3>
      <p><strong>Carrier:</strong> ${order.shipping.carrier}</p>
      <p><strong>Tracking Number:</strong> ${order.shipping.trackingNumber}</p>
      ${order.shipping.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.shipping.estimatedDelivery).toLocaleDateString()}</p>` : ''}

      <p>You can track your shipment using the tracking number above.</p>
      <p>Best regards,<br>The VScooter Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject: `Your Order Has Shipped - ${order.orderNumber}`,
    html
  });
};

// Support ticket response email
const sendSupportResponseEmail = async (ticket, user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #EF4444;">Support Ticket Update</h1>
      <p>Hi ${user.firstName},</p>
      <p>Your support ticket #${ticket.ticketNumber} has been updated.</p>

      <h3>Ticket Details:</h3>
      <p><strong>Subject:</strong> ${ticket.subject}</p>
      <p><strong>Status:</strong> ${ticket.status}</p>

      <p>Please log in to your account to view the latest response.</p>
      <p>Best regards,<br>The VScooter Support Team</p>
    </div>
  `;

  return sendEmail({
    email: user.email,
    subject: `Support Ticket Update - ${ticket.ticketNumber}`,
    html
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendShippingUpdateEmail,
  sendSupportResponseEmail
};
