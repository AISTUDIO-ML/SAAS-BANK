
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SubscriptionCard from '@/components/SubscriptionCard';
import { Wallet, TrendingUp, Activity, Plus, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const mockSubscriptions = [
  {
    type: 'superfluid' as const,
    title: 'Netflix Premium',
    amount: '15.99',
    token: 'USDT',
    status: 'active' as const,
    streamRate: '15.99 USDT'
  },
  {
    type: 'sablier' as const,
    title: 'Adobe Creative Suite',
    amount: '52.99',
    token: 'USDT',
    status: 'active' as const,
    progress: 65,
    endDate: '2024-12-31'
  },
  {
    type: 'superfluid' as const,
    title: 'Spotify Family',
    amount: '12.99',
    token: 'USDT',
    status: 'paused' as const,
    streamRate: '12.99 USDT'
  }];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your crypto subscriptions and payment streams</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 active, 1 paused</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Outflow</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$28.98</div>
              <p className="text-xs text-muted-foreground">USDT per month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$456.78</div>
              <p className="text-xs text-muted-foreground">USDT available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15%</div>
              <p className="text-xs text-muted-foreground">vs traditional billing</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subscriptions">My Subscriptions</TabsTrigger>
            <TabsTrigger value="streams">Payment Streams</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active Subscriptions</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Subscription
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSubscriptions.map((sub, index) =>
              <SubscriptionCard key={index} {...sub} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="streams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Streams</CardTitle>
                <CardDescription>
                  Monitor your real-time payment streams and time-locked transfers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <p className="font-medium">Netflix Premium Stream</p>
                        <p className="text-sm text-gray-500">Superfluid • 15.99 USDT/month</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Streaming</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Adobe Creative Suite</p>
                        <p className="text-sm text-gray-500">Sablier • 52.99 USDT locked</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800">Time-locked</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Analytics visualization would be implemented here with a charting library
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stream Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Successful payments</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average stream duration</span>
                      <span className="font-medium">4.2 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gas fees saved</span>
                      <span className="font-medium text-green-600">$127.34</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>);

};

export default Dashboard;