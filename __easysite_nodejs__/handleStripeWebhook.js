
function handleStripeWebhook(payload, signature) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe configuration incomplete');
  }
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }
  
  // Handle different event types
  switch (event.type) {
    case 'invoice.payment_succeeded':
      return handleInvoicePaymentSucceeded(event.data.object);
    case 'invoice.payment_failed':
      return handleInvoicePaymentFailed(event.data.object);
    case 'customer.subscription.created':
      return handleSubscriptionCreated(event.data.object);
    case 'customer.subscription.updated':
      return handleSubscriptionUpdated(event.data.object);
    case 'customer.subscription.deleted':
      return handleSubscriptionDeleted(event.data.object);
    default:
      return { received: true, type: event.type };
  }
}

function handleInvoicePaymentSucceeded(invoice) {
  return {
    type: 'payment_succeeded',
    subscriptionId: invoice.subscription,
    customerId: invoice.customer,
    amount: invoice.amount_paid / 100,
    currency: invoice.currency
  };
}

function handleInvoicePaymentFailed(invoice) {
  return {
    type: 'payment_failed',
    subscriptionId: invoice.subscription,
    customerId: invoice.customer,
    amount: invoice.amount_due / 100,
    currency: invoice.currency
  };
}

function handleSubscriptionCreated(subscription) {
  return {
    type: 'subscription_created',
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status
  };
}

function handleSubscriptionUpdated(subscription) {
  return {
    type: 'subscription_updated',
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status
  };
}

function handleSubscriptionDeleted(subscription) {
  return {
    type: 'subscription_deleted',
    subscriptionId: subscription.id,
    customerId: subscription.customer,
    status: subscription.status
  };
}
