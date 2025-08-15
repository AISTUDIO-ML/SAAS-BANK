
// Process incoming Stripe webhooks
async function processStripeWebhook(eventType, eventData, signature) {
    try {
        console.log('Processing Stripe webhook:', eventType);
        
        switch (eventType) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(eventData);
                break;
                
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(eventData);
                break;
                
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(eventData);
                break;
                
            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(eventData);
                break;
                
            case 'invoice.payment_failed':
                await handlePaymentFailed(eventData);
                break;
                
            default:
                console.log('Unhandled webhook event type:', eventType);
        }
        
        // Log webhook event
        await logWebhookEvent(eventType, eventData, 'processed');
        
        return { success: true, message: 'Webhook processed successfully' };
        
    } catch (error) {
        console.error('Webhook processing error:', error);
        await logWebhookEvent(eventType, eventData, 'failed', error.message);
        throw error;
    }
}

async function handleSubscriptionCreated(subscription) {
    const subscriptionData = {
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        status: subscription.status,
        price_id: subscription.items.data[0]?.price?.id,
        plan_name: subscription.metadata?.plan_name || 'Unknown Plan',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };
    
    await window.ezsite.apis.tableCreate(34719, subscriptionData);
}

async function handleSubscriptionUpdated(subscription) {
    // Find existing subscription
    const result = await window.ezsite.apis.tablePage(34719, {
        PageNo: 1,
        PageSize: 1,
        Filters: [
            { name: 'stripe_subscription_id', op: 'Equal', value: subscription.id }
        ]
    });
    
    if (result.data?.List?.length > 0) {
        const existingSubscription = result.data.List[0];
        
        const updateData = {
            ID: existingSubscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end || false,
            updated_at: new Date().toISOString()
        };
        
        await window.ezsite.apis.tableUpdate(34719, updateData);
    }
}

async function handleSubscriptionDeleted(subscription) {
    const result = await window.ezsite.apis.tablePage(34719, {
        PageNo: 1,
        PageSize: 1,
        Filters: [
            { name: 'stripe_subscription_id', op: 'Equal', value: subscription.id }
        ]
    });
    
    if (result.data?.List?.length > 0) {
        const existingSubscription = result.data.List[0];
        
        const updateData = {
            ID: existingSubscription.id,
            status: 'canceled',
            updated_at: new Date().toISOString()
        };
        
        await window.ezsite.apis.tableUpdate(34719, updateData);
    }
}

async function handlePaymentSucceeded(invoice) {
    console.log('Payment succeeded for invoice:', invoice.id);
    // Update subscription status if needed
}

async function handlePaymentFailed(invoice) {
    console.log('Payment failed for invoice:', invoice.id);
    // Handle payment failure
}

async function logWebhookEvent(eventType, eventData, status, errorMessage = null) {
    try {
        const webhookData = {
            event_type: eventType,
            event_id: eventData.id || 'unknown',
            status: status,
            error_message: errorMessage,
            processed_at: new Date().toISOString(),
            event_data: JSON.stringify(eventData).substring(0, 1000) // Truncate if too long
        };
        
        await window.ezsite.apis.tableCreate(34720, webhookData);
    } catch (error) {
        console.error('Failed to log webhook event:', error);
    }
}
