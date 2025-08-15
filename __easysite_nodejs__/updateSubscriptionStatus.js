
function updateSubscriptionStatus(subscriptionId, status) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }
  
  if (!subscriptionId || !status) {
    throw new Error('Subscription ID and status are required');
  }
  
  const validStatuses = ['active', 'canceled', 'paused'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status. Must be one of: ' + validStatuses.join(', '));
  }
  
  // For Stripe API calls
  if (status === 'canceled') {
    return stripe.subscriptions.cancel(subscriptionId);
  } else if (status === 'paused') {
    return stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: 'void'
      }
    });
  } else if (status === 'active') {
    return stripe.subscriptions.update(subscriptionId, {
      pause_collection: ''
    });
  }
  
  return stripe.subscriptions.retrieve(subscriptionId);
}
