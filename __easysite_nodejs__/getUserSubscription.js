
// Get user's active subscription
async function getUserSubscription(userId, email) {
    try {
        let filters = [];
        
        // If we have a user ID, search by that first
        if (userId) {
            // Find customer by user_id
            const customerResult = await window.ezsite.apis.tablePage(34718, {
                PageNo: 1,
                PageSize: 1,
                Filters: [
                    { name: 'user_id', op: 'Equal', value: userId }
                ]
            });
            
            if (customerResult.data?.List?.length > 0) {
                const customer = customerResult.data.List[0];
                filters.push({
                    name: 'stripe_customer_id',
                    op: 'Equal',
                    value: customer.stripe_customer_id
                });
            }
        } else if (email) {
            // Find customer by email
            const customerResult = await window.ezsite.apis.tablePage(34718, {
                PageNo: 1,
                PageSize: 1,
                Filters: [
                    { name: 'email', op: 'Equal', value: email }
                ]
            });
            
            if (customerResult.data?.List?.length > 0) {
                const customer = customerResult.data.List[0];
                filters.push({
                    name: 'stripe_customer_id',
                    op: 'Equal',
                    value: customer.stripe_customer_id
                });
            }
        }
        
        if (filters.length === 0) {
            return null; // No customer found
        }
        
        // Get active subscriptions
        const subscriptionResult = await window.ezsite.apis.tablePage(34719, {
            PageNo: 1,
            PageSize: 10,
            Filters: [
                ...filters,
                { name: 'status', op: 'Equal', value: 'active' }
            ],
            OrderByField: 'created_at',
            IsAsc: false
        });
        
        if (subscriptionResult.data?.List?.length > 0) {
            const subscription = subscriptionResult.data.List[0];
            
            // Check if subscription is still valid
            const currentPeriodEnd = new Date(subscription.current_period_end);
            const now = new Date();
            
            if (currentPeriodEnd > now) {
                return {
                    ...subscription,
                    is_active: true,
                    days_remaining: Math.ceil((currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                };
            } else {
                // Subscription expired, update status
                await window.ezsite.apis.tableUpdate(34719, {
                    ID: subscription.id,
                    status: 'past_due'
                });
                
                return {
                    ...subscription,
                    status: 'past_due',
                    is_active: false,
                    days_remaining: 0
                };
            }
        }
        
        return null; // No active subscription found
        
    } catch (error) {
        console.error('Error in getUserSubscription:', error);
        throw new Error('Failed to retrieve subscription: ' + error.message);
    }
}
