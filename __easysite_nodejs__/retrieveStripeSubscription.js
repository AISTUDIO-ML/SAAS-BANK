
function retrieveStripeSubscription(subscriptionId) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }
  
  if (!subscriptionId) {
    throw new Error('Subscription ID is required');
  }
  
  return stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
}
