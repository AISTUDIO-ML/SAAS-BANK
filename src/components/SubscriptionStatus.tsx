
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import StripeSubscriptionManager from '@/components/StripeSubscriptionManager';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard, 
  Calendar,
  DollarSign,
  User,
  RefreshCw,
  Crown
} from 'lucide-react';

interface Subscription {
  id: number;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  price_id: string;
  plan_name: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  is_active?: boolean;
  days_remaining?: number;
}

const SubscriptionStatus: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const { data: userInfo, error: userError } = await window.ezsite.apis.getUserInfo();
      
      if (userError) {
        setLoading(false);
        return;
      }

      const { data, error } = await window.ezsite.apis.run({
        path: 'getUserSubscription',
        param: [userInfo.ID, userInfo.Email]
      });
      
      if (error && !error.includes('No active subscription')) {
        throw new Error(error);
      }
      
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription status',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    setRefreshing(true);
    await loadSubscription();
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Subscription status has been updated'
    });
  };

  const getStatusBadge = (status: string, isActive?: boolean) => {
    if (isActive) {
      return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Past Due</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Canceled</Badge>;
      case 'incomplete':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Incomplete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading subscription status...</p>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Crown className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>No Active Subscription</CardTitle>
            <CardDescription>
              You don't have an active subscription yet. Choose a plan to get started!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.href = '/subscriptions'} className="w-full">
              <CreditCard className="mr-2 h-4 w-4" />
              Browse Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {subscription.is_active ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              Current Subscription
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSubscription}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan:</span>
                <span className="text-sm">{subscription.plan_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(subscription.status, subscription.is_active)}
              </div>
              {subscription.days_remaining !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Days Remaining:</span>
                  <span className="text-sm font-semibold">
                    {subscription.days_remaining} days
                  </span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Current Period:</span>
                <span className="text-sm">
                  {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next Billing:</span>
                <span className="text-sm">
                  {subscription.cancel_at_period_end 
                    ? 'Cancels at period end' 
                    : formatDate(subscription.current_period_end)
                  }
                </span>
              </div>
            </div>
          </div>

          {subscription.is_active && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your subscription is active and will {subscription.cancel_at_period_end ? 'end' : 'renew'} on{' '}
                {formatDate(subscription.current_period_end)}.
              </AlertDescription>
            </Alert>
          )}

          {!subscription.is_active && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Your subscription is not active. Please update your payment method or contact support.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <StripeSubscriptionManager />
    </div>
  );
};

export default SubscriptionStatus;
