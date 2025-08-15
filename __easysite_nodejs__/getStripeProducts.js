
// Get available Stripe products and prices
function getStripeProducts() {
    // Mock Stripe products data
    const mockProducts = [
        {
            id: 'prod_starter',
            name: 'Starter Plan',
            description: 'Perfect for individuals and small projects',
            prices: [
                {
                    id: 'price_starter_monthly',
                    unit_amount: 999, // $9.99
                    currency: 'usd',
                    recurring: {
                        interval: 'month',
                        interval_count: 1
                    },
                    product: 'prod_starter'
                },
                {
                    id: 'price_starter_yearly',
                    unit_amount: 9999, // $99.99
                    currency: 'usd',
                    recurring: {
                        interval: 'year',
                        interval_count: 1
                    },
                    product: 'prod_starter'
                }
            ],
            features: [
                'Up to 10 streams',
                'Basic analytics',
                'Community support',
                'Standard integrations'
            ]
        },
        {
            id: 'prod_professional',
            name: 'Professional Plan',
            description: 'Ideal for growing businesses',
            prices: [
                {
                    id: 'price_pro_monthly',
                    unit_amount: 2999, // $29.99
                    currency: 'usd',
                    recurring: {
                        interval: 'month',
                        interval_count: 1
                    },
                    product: 'prod_professional'
                },
                {
                    id: 'price_pro_yearly',
                    unit_amount: 29999, // $299.99
                    currency: 'usd',
                    recurring: {
                        interval: 'year',
                        interval_count: 1
                    },
                    product: 'prod_professional'
                }
            ],
            features: [
                'Up to 100 streams',
                'Advanced analytics',
                'Priority support',
                'Advanced integrations',
                'Custom webhooks'
            ]
        },
        {
            id: 'prod_enterprise',
            name: 'Enterprise Plan',
            description: 'For large-scale operations',
            prices: [
                {
                    id: 'price_enterprise_monthly',
                    unit_amount: 9999, // $99.99
                    currency: 'usd',
                    recurring: {
                        interval: 'month',
                        interval_count: 1
                    },
                    product: 'prod_enterprise'
                },
                {
                    id: 'price_enterprise_yearly',
                    unit_amount: 99999, // $999.99
                    currency: 'usd',
                    recurring: {
                        interval: 'year',
                        interval_count: 1
                    },
                    product: 'prod_enterprise'
                }
            ],
            features: [
                'Unlimited streams',
                'Real-time analytics',
                'Dedicated support',
                'Custom integrations',
                'SLA guarantee',
                'Multi-tenant support'
            ]
        }
    ];
    
    return mockProducts;
}
