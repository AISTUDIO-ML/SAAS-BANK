
// Get Stripe configuration keys
function getStripeKeys() {
    const config = {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51OExample123456789abcdefghijklmnopqrstuvwxyz',
        configured: false
    };
    
    // Check if keys are properly configured
    if (process.env.STRIPE_SECRET_KEY && 
        process.env.STRIPE_PUBLISHABLE_KEY && 
        !process.env.STRIPE_SECRET_KEY.includes('Example') &&
        !process.env.STRIPE_PUBLISHABLE_KEY.includes('Example')) {
        config.configured = true;
    }
    
    return config;
}
