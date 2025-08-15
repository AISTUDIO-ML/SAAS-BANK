
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Calendar, AlertCircle, CheckCircle, Pause, Play, X } from 'lucide-react';

interface StripeSubscription {
  id: number;
  plan_name: string;
  amount: number;
  currency: string;
  status: string;
  start_date: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  created_at: string;
}

interface StripeSubscriptionManagerProps {
  userId?: number;
}

const StripeSubscriptionManager: React.FC<StripeSubscriptionManagerProps> = ({ userId }) => {
  const [subscriptions, setSubscriptions] = useState<StripeSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(34169, {
        PageNo: 1,
        PageSize: 20,
        OrderByField: 'created_at',
        IsAsc: false,
        Filters: [
          {
            name: 'payment_method',
            op: 'Equal',
            value: 'stripe'
          }
        ]
      });

      if (error) throw new Error(error);
      setSubscriptions(data.List || []);
    } catch (error: any) {
      console.error('Error loading subscriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscriptions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscription: StripeSubscription) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      // Update subscription status in database
      const { error } = await window.ezsite.apis.tableUpdate(34169, {
        ID: subscription.id,
        status: 'cancelled',
        updated_at: new Date().toISOString()
      });

      if (error) throw new Error(error);

      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled successfully.',
      });

      // Reload subscriptions
      await loadSubscriptions();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, text: 'Active' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: X, text: 'Cancelled' },
      paused: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Pause, text: 'Paused' },
      ended: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle, text: 'Ended' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ended;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading your subscriptions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Stripe Subscriptions</h3>
          <p className="text-gray-600">You don't have any active Stripe subscriptions yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Stripe Subscriptions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{subscription.plan_name}</CardTitle>
                {getStatusBadge(subscription.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  ${subscription.amount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  {subscription.currency.toUpperCase()}/month
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>Started: {new Date(subscription.start_date).toLocaleDateString()}</span>
                </div>
                
                {subscription.stripe_subscription_id && (
                  <div className="text-xs text-gray-500 font-mono">
                    ID: {subscription.stripe_subscription_id.slice(0, 12)}...
                  </div>
                )}
              </div>

              {subscription.status === 'active' && (
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleCancelSubscription(subscription)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel Subscription
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StripeSubscriptionManager;
