
// Configure Stripe with API key and return initialized Stripe instance
function stripeConfig() {
    // Stripe secret key should be set in environment variables
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_51OExample123456789abcdefghijklmnopqrstuvwxyz';
    const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51OExample123456789abcdefghijklmnopqrstuvwxyz';
    
    if (!STRIPE_SECRET_KEY || STRIPE_SECRET_KEY.startsWith('sk_test_51OExample')) {
        console.warn('⚠️  Stripe API key is not configured. Please set your STRIPE_SECRET_KEY environment variable.');
        // For demo purposes, return test configuration
        return {
            apiKey: 'sk_test_demo_key',
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_demo_webhook',
            publishableKey: 'pk_test_demo_key',
            configured: false
        };
    }
    
    return {
        apiKey: STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_...',
        publishableKey: STRIPE_PUBLISHABLE_KEY,
        configured: true
    };
}
