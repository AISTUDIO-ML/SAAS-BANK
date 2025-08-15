
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StripeCheckout from '@/components/StripeCheckout';
import SubscriptionStatus from '@/components/SubscriptionStatus';
import { Check, CreditCard, Zap, Lock, Crown } from 'lucide-react';

const SubscriptionPlans = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Subscription Management</h2>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing preferences
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6 mt-8">
          <SubscriptionStatus />
        </TabsContent>

        <TabsContent value="plans" className="space-y-6 mt-8">
          <StripeCheckout />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubscriptionPlans;
