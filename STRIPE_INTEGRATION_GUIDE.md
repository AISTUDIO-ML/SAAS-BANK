
# Stripe Integration Guide

This guide will help you set up Stripe for subscription payments in your application.

## Prerequisites

1. A Stripe account (sign up at [https://stripe.com](https://stripe.com))
2. Access to your Stripe Dashboard
3. Basic understanding of webhook endpoints

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
4. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

⚠️ **Important**: Never share your secret key or commit it to version control.

## Step 2: Configure Environment Variables

Set the following environment variables in your deployment environment:

```bash
# Required Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Optional: For webhook verification
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### For Development
Create a `.env` file in your project root:
```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### For Production
Set these variables in your hosting platform:
- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Heroku**: Config Vars in Dashboard
- **Railway**: Variables tab

## Step 3: Create Products and Prices in Stripe

1. Go to **Products** in your Stripe Dashboard
2. Click **Add Product**
3. Create your subscription plans (e.g., Starter, Professional, Enterprise)
4. For each product, add recurring prices (monthly/yearly)
5. Copy the Price IDs - you'll need these for your application

## Step 4: Set Up Webhooks (Optional but Recommended)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.com/api/webhooks/stripe`
4. Select these events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to your environment variables

## Step 5: Test Your Integration

1. Use Stripe's test card numbers:
   - Success: `4242424242424242`
   - Decline: `4000000000000002`
   - Requires authentication: `4000002500003155`

2. Monitor webhook events in your Stripe Dashboard
3. Check your database for subscription records

## Step 6: Go Live

1. Replace test keys with live keys in production
2. Test with real payment methods
3. Update webhook endpoint to production URL

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Always verify webhooks** using the signing secret
3. **Use HTTPS** for all webhook endpoints
4. **Validate all data** received from webhooks
5. **Log webhook events** for debugging and monitoring

## Troubleshooting

### Common Issues

**Issue**: "Invalid API Key"
**Solution**: Check that your API keys are correct and not mixed up (publishable vs secret)

**Issue**: "Webhook signature verification failed"
**Solution**: Ensure your webhook secret is correctly configured

**Issue**: "No such price"
**Solution**: Verify the price ID exists in your Stripe Dashboard

### Testing Webhook Events

Use Stripe CLI to forward events to your local environment:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [React Stripe.js Documentation](https://stripe.com/docs/stripe-js/react)

## API Reference

### Backend Functions
- `createStripeCustomer(email, name, userId)` - Create/retrieve customer
- `createStripeCheckout(priceId, customerId, successUrl, cancelUrl)` - Create checkout session
- `getUserSubscription(userId, email)` - Get user's subscription status
- `processStripeWebhook(eventType, eventData, signature)` - Handle webhook events

### Frontend Components
- `<StripeProvider>` - Stripe Elements provider
- `<StripeCheckout>` - Subscription plan selection and checkout
- `<SubscriptionStatus>` - Current subscription display
- `<AdminSubscriptionDashboard>` - Admin analytics and management
