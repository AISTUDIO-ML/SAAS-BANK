
// Get subscription analytics and statistics
async function getSubscriptionAnalytics() {
    try {
        const analytics = {
            total_subscriptions: 0,
            active_subscriptions: 0,
            canceled_subscriptions: 0,
            total_revenue: 0,
            monthly_recurring_revenue: 0,
            churn_rate: 0,
            plan_distribution: {},
            recent_subscriptions: []
        };
        
        // Get all subscriptions
        const allSubscriptions = await window.ezsite.apis.tablePage(34719, {
            PageNo: 1,
            PageSize: 1000,
            OrderByField: 'created_at',
            IsAsc: false
        });
        
        if (allSubscriptions.data?.List) {
            const subscriptions = allSubscriptions.data.List;
            analytics.total_subscriptions = subscriptions.length;
            
            // Count by status
            subscriptions.forEach(sub => {
                if (sub.status === 'active') {
                    analytics.active_subscriptions++;
                } else if (sub.status === 'canceled') {
                    analytics.canceled_subscriptions++;
                }
                
                // Plan distribution
                if (analytics.plan_distribution[sub.plan_name]) {
                    analytics.plan_distribution[sub.plan_name]++;
                } else {
                    analytics.plan_distribution[sub.plan_name] = 1;
                }
            });
            
            // Calculate churn rate
            if (analytics.total_subscriptions > 0) {
                analytics.churn_rate = (analytics.canceled_subscriptions / analytics.total_subscriptions) * 100;
            }
            
            // Get recent subscriptions (last 10)
            analytics.recent_subscriptions = subscriptions.slice(0, 10);
        }
        
        // Mock revenue data (in production, calculate from actual payments)
        analytics.total_revenue = analytics.active_subscriptions * 2999; // Assuming average $29.99
        analytics.monthly_recurring_revenue = analytics.active_subscriptions * 2999;
        
        return analytics;
        
    } catch (error) {
        console.error('Error getting subscription analytics:', error);
        throw new Error('Failed to get analytics: ' + error.message);
    }
}
