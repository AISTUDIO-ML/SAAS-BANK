
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import StripeProvider from '@/components/StripeProvider';
import StripeSubscriptionManager from '@/components/StripeSubscriptionManager';
import StripeSetupStatus from '@/components/StripeSetupStatus';
import { CreditCard, ShoppingCart, Settings, TrendingUp, Users, Shield, Zap, Clock } from 'lucide-react';

const StripeSubscriptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('setup');

  return (
    <StripeProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-green-600 to-blue-600 text-white border-none">
              💳 Powered by Stripe
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Traditional Subscriptions
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Choose from our flexible subscription plans and pay securely with your credit card or PayPal
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <Card className="text-center border-2 border-blue-100">
              <CardContent className="p-6">
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-gray-600">
                  Pay with confidence using Stripe's industry-leading security
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-green-100">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">PCI Compliant</h3>
                <p className="text-sm text-gray-600">
                  Your payment data is protected with bank-level security
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center border-2 border-purple-100">
              <CardContent className="p-6">
                <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Instant Activation</h3>
                <p className="text-sm text-gray-600">
                  Get immediate access after successful payment
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto mb-8">
              <TabsTrigger value="setup" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Setup
              </TabsTrigger>
              <TabsTrigger value="plans" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Plans
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Manage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="setup" className="mt-6">
              <div className="max-w-2xl mx-auto">
                <StripeSetupStatus />
              </div>
            </TabsContent>

            <TabsContent value="plans" className="mt-6">
              <SubscriptionPlans />
            </TabsContent>

            <TabsContent value="manage" className="mt-6">
              <StripeSubscriptionManager />
            </TabsContent>
          </Tabs>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">50,000+</div>
                <div className="text-sm text-gray-600">Happy Subscribers</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-sm text-gray-600">Payment Success Rate</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/50 backdrop-blur">
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-gray-600">Secure & Protected</div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Why Choose Our Subscription Service?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">🔒 Secure & Reliable</h3>
                    <p className="text-sm text-gray-600">
                      Industry-standard encryption and PCI compliance ensure your data is always protected.
                    </p>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">💳 Multiple Payment Options</h3>
                    <p className="text-sm text-gray-600">
                      Pay with credit cards, debit cards, or digital wallets - whatever works best for you.
                    </p>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">🎯 Flexible Plans</h3>
                    <p className="text-sm text-gray-600">
                      Choose from various subscription tiers designed to meet different needs and budgets.
                    </p>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold mb-2">📞 24/7 Support</h3>
                    <p className="text-sm text-gray-600">
                      Our dedicated support team is always ready to help with any questions or issues.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </StripeProvider>
  );
};

export default StripeSubscriptions;
