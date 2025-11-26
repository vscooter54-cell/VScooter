const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Create a payment intent for checkout
 */
const createPaymentIntent = async ({ amount, currency = 'usd', metadata = {} }) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Confirm a payment
 */
const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: paymentIntent.status === 'succeeded',
      status: paymentIntent.status,
      paymentIntent
    };
  } catch (error) {
    console.error('Stripe confirm payment error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a refund
 */
const createRefund = async ({ paymentIntentId, amount, reason }) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial refund if amount specified
      reason: reason || 'requested_by_customer'
    });

    return {
      success: true,
      refund
    };
  } catch (error) {
    console.error('Stripe refund error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a customer in Stripe
 */
const createCustomer = async ({ email, name, metadata = {} }) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata
    });

    return {
      success: true,
      customerId: customer.id,
      customer
    };
  } catch (error) {
    console.error('Stripe create customer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Retrieve a customer
 */
const getCustomer = async (customerId) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);

    return {
      success: true,
      customer
    };
  } catch (error) {
    console.error('Stripe get customer error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a checkout session
 */
const createCheckoutSession = async ({ lineItems, customerId, successUrl, cancelUrl, metadata = {} }) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'DE', 'FR', 'CH']
      }
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
      session
    };
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Construct webhook event
 */
const constructWebhookEvent = (payload, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    return {
      success: true,
      event
    };
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  createPaymentIntent,
  confirmPayment,
  createRefund,
  createCustomer,
  getCustomer,
  createCheckoutSession,
  constructWebhookEvent
};
