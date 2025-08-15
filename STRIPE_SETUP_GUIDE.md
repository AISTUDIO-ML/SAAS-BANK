
# Stripe Integration Setup Guide

## Environment Variables Required

You need to set up the following environment variables for Stripe integration:

### Frontend (.env)
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### Backend Environment Variables
```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Stripe Dashboard Setup

1. **Create a Stripe Account**
   - Go to https://stripe.com and create an account
   - Complete the onboarding process

2. **Get Your API Keys**
   - Navigate to Developers > API Keys
   - Copy your Publishable Key (starts with pk_)
   - Copy your Secret Key (starts with sk_)
   - Keep these keys secure!

3. **Set Up Webhook Endpoint**
   - Go to Developers > Webhooks
   - Click "Add endpoint"
   - Add your endpoint URL: `https://yourdomain.com/api/stripe-webhook`
   - Select events to listen for:
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Copy the webhook signing secret

4. **Create Products and Prices**
   - Go to Products in your Stripe Dashboard
   - Create products for each subscription plan
   - Set up recurring prices for each product
   - Note down the Price IDs (starts with price_)

## Testing

### Test Cards
Use these test card numbers for testing:

**Successful Payments:**
- `4242424242424242` (Visa)
- `5555555555554444` (Mastercard)

**Declined Payments:**
- `4000000000000002` (Card declined)
- `4000000000009995` (Insufficient funds)

### Test Mode vs Live Mode
- Always start with test mode (test keys start with pk_test_ and sk_test_)
- Only switch to live mode when ready for production
- Live keys start with pk_live_ and sk_live_

## Security Best Practices

1. **Never expose secret keys in frontend code**
2. **Use HTTPS for all webhook endpoints**
3. **Verify webhook signatures**
4. **Store keys securely in environment variables**
5. **Regularly rotate your API keys**
6. **Monitor transactions in Stripe Dashboard**

## Common Issues and Solutions

### Issue: "No such customer"
**Solution:** Ensure you're creating customers before creating subscriptions

### Issue: "No such payment method"
**Solution:** Attach payment methods to customers before using them

### Issue: "Webhook signature verification failed"
**Solution:** Check your webhook secret and ensure the raw request body is used

### Issue: "Invalid API key"
**Solution:** Verify you're using the correct key for your environment (test/live)

## Development Workflow

1. Set up test environment with test keys
2. Test payment flows thoroughly
3. Test webhook handling
4. Verify subscription lifecycle management
5. Test error scenarios
6. Switch to live keys for production

## Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Library](https://stripe.com/docs/stripe-js/react)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Testing Guide](https://stripe.com/docs/testing)
