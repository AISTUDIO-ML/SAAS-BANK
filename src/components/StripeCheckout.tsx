
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, CreditCard } from 'lucide-react';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  prices: {
    id: string;
    unit_amount: number;
    currency: string;
    recurring: {
      interval: 'month' | 'year';
      interval_count: number;
    };
  }[];
  features: string[];
}

const StripeCheckout: React.FC = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'getStripeProducts',
        param: []
      });
      
      if (error) throw new Error(error);
      setPlans(data || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subscription plans',
        variant: 'destructive'
      });
    }
  };

  const createCheckoutSession = async (priceId: string, planName: string) => {
    setLoading(priceId);
    
    try {
      // First, check if user is authenticated
      const { data: userInfo, error: userError } = await window.ezsite.apis.getUserInfo();
      
      if (userError) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to subscribe to a plan',
          variant: 'destructive'
        });
        return;
      }

      // Create or get customer
      const { data: customer, error: customerError } = await window.ezsite.apis.run({
        path: 'createStripeCustomer',
        param: [
          userInfo.Email,
          userInfo.Name || userInfo.Email.split('@')[0],
          userInfo.ID
        ]
      });

      if (customerError) {
        console.error('Customer creation error:', customerError);
        // Continue with checkout even if customer creation fails
      }

      // Create checkout session
      const { data, error } = await window.ezsite.apis.run({
        path: 'createStripeCheckout',
        param: [
          priceId,
          customer?.stripe_customer_id || null,
          `${window.location.origin}/dashboard?success=true&plan=${encodeURIComponent(planName)}`,
          `${window.location.origin}/subscriptions?canceled=true`
        ]
      });

      if (error) throw new Error(error);

      // Show success message for demo
      toast({
        title: 'Demo Mode Active',
        description: 'This is a demonstration. In production, you would be redirected to Stripe checkout.',
      });

      // In demo mode, simulate successful subscription
      setTimeout(async () => {
        try {
          await window.ezsite.apis.run({
            path: 'createStripeSubscription',
            param: [
              customer?.stripe_customer_id || 'cus_demo_' + Date.now(),
              priceId,
              planName
            ]
          });
          
          toast({
            title: 'Subscription Created!',
            description: `Successfully subscribed to ${planName}`,
          });
          
          // Redirect to dashboard after delay
          setTimeout(() => {
            window.location.href = `${window.location.origin}/dashboard?success=true&plan=${encodeURIComponent(planName)}`;
          }, 2000);
          
        } catch (error) {
          console.error('Demo subscription error:', error);
        }
      }, 1000);

      // In production, redirect to Stripe checkout:
      // if (data?.url) {
      //   window.location.href = data.url;
      // }

    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Checkout Error',
        description: 'Failed to create checkout session. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(null);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const getMonthlyEquivalent = (amount: number, interval: 'month' | 'year') => {
    if (interval === 'month') return amount;
    return Math.round(amount / 12);
  };

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted rounded-lg p-1 flex">
          <Button
            variant={billingInterval === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingInterval('month')}
          >
            Monthly
          </Button>
          <Button
            variant={billingInterval === 'year' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setBillingInterval('year')}
          >
            Yearly
            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Save 20%</Badge>
          </Button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const price = plan.prices.find(p => p.recurring.interval === billingInterval);
          if (!price) return null;

          const isPopular = index === 1; // Make middle plan popular
          
          return (
            <Card key={plan.id} className={`relative ${isPopular ? 'border-blue-500 border-2' : ''}`}>
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                
                <div className="mt-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">
                      {formatPrice(price.unit_amount)}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      /{billingInterval}
                    </span>
                  </div>
                  
                  {billingInterval === 'year' && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatPrice(getMonthlyEquivalent(price.unit_amount, 'year'))}/month
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button
                  onClick={() => createCheckoutSession(price.id, plan.name)}
                  disabled={loading === price.id}
                  className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  {loading === price.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Get Started
                    </>
                  )}
                </Button>
                
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Alert>
        <CreditCard className="h-4 w-4" />
        <AlertDescription>
          All plans include a 14-day free trial. Cancel anytime. No hidden fees.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default StripeCheckout;
