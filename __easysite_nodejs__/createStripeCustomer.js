
// Create or retrieve a Stripe customer and store in database
async function createStripeCustomer(email, name, userId) {
    if (!email) {
        throw new Error('Email is required to create a customer');
    }
    
    try {
        // Check if customer already exists in our database
        const existingCustomer = await window.ezsite.apis.tablePage(34718, {
            PageNo: 1,
            PageSize: 1,
            Filters: [
                { name: 'email', op: 'Equal', value: email }
            ]
        });
        
        if (existingCustomer.data?.List?.length > 0) {
            return existingCustomer.data.List[0];
        }
        
        // For demo purposes, create a mock customer
        // In production, this would create an actual Stripe customer
        const mockCustomer = {
            id: 'cus_demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            email: email,
            name: name || email.split('@')[0],
            created: Math.floor(Date.now() / 1000),
            metadata: {
                user_id: userId?.toString() || 'anonymous',
                source: 'subscription_platform'
            }
        };
        
        // Store customer in database (matching stripe_customers table structure)
        const customerData = {
            stripe_customer_id: mockCustomer.id,
            email: email,
            user_id: userId || null,
            created_at: new Date().toISOString()
        };
        
        const { error: createError } = await window.ezsite.apis.tableCreate(34718, customerData);
        if (createError) {
            console.error('Error storing customer:', createError);
            // Continue with mock customer even if database storage fails
        }
        
        return {
            ...mockCustomer,
            ...customerData
        };
        
    } catch (error) {
        console.error('Error in createStripeCustomer:', error);
        throw new Error('Failed to create customer: ' + error.message);
    }
}
