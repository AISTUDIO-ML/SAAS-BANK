
function createStripePrice(amount, currency, productName, interval) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }
  
  if (!amount || !productName) {
    throw new Error('Amount and product name are required');
  }
  
  // First create a product
  const product = stripe.products.create({
    name: productName,
  });
  
  // Then create a price for the product
  return product.then(prod => {
    return stripe.prices.create({
      unit_amount: Math.round(amount * 100), // Convert to cents
      currency: currency || 'usd',
      recurring: {
        interval: interval || 'month',
      },
      product: prod.id,
    });
  });
}
