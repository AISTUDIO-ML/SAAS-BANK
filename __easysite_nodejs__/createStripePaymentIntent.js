
function createStripePaymentIntent(amount, currency, customerId, metadata) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }
  
  // Validate required parameters
  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }
  
  if (!currency) {
    currency = 'usd';
  }
  
  // Create payment intent
  const paymentIntentData = {
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency.toLowerCase(),
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: metadata || {}
  };
  
  if (customerId) {
    paymentIntentData.customer = customerId;
  }
  
  return stripe.paymentIntents.create(paymentIntentData);
}
