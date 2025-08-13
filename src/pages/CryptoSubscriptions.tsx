import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import WalletConnection from '@/components/WalletConnection';
import SuperfluidIntegration from '@/components/SuperfluidIntegration';
import SablierIntegration from '@/components/SablierIntegration';
import { ethers } from 'ethers';
import { Wallet, Zap, Lock, CreditCard, Shield, Users, TrendingUp } from 'lucide-react';

const CryptoSubscriptions: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [chainId, setChainId] = useState<number>(0);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (walletAddress) {
      loadUserSubscriptions();
    }
  }, [walletAddress]);

  const loadUserSubscriptions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await window.ezsite.apis.tablePage(34169, {
        PageNo: 1,
        PageSize: 10,
        OrderByField: 'id',
        IsAsc: false,
        Filters: [
          {
            name: 'wallet_address',
            op: 'Equal',
            value: walletAddress,
          },
        ],
      });

      if (error) throw new Error(error);
      setSubscriptions(data.List || []);
    } catch (error: any) {
      console.error('Error loading subscriptions:', error);
      toast({
        title: 'Load Error',
        description: error.message || 'Failed to load subscriptions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = (address: string, walletProvider: ethers.BrowserProvider) => {
    setWalletAddress(address);
    setProvider(walletProvider);
    
    // Get chain ID
    walletProvider.getNetwork().then((network) => {
      setChainId(Number(network.chainId));
    });
  };

  if (!walletAddress || !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Crypto-Powered Subscriptions
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of recurring payments with real-time streaming and time-locked subscriptions 
              powered by Superfluid and Sablier protocols.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-6">
                  <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Real-time Streams</h3>
                  <p className="text-sm text-gray-600">
                    Pay per second with Superfluid's continuous payment streams
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Lock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Time-Locked Plans</h3>
                  <p className="text-sm text-gray-600">
                    Secure upfront payments with Sablier's vesting contracts
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">USDT Billing</h3>
                  <p className="text-sm text-gray-600">
                    Stable pricing with USDT on Ethereum-compatible chains
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex justify-center">
            <WalletConnection onWalletConnect={handleWalletConnect} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crypto Subscriptions</h1>
            <p className="text-gray-600">Manage your blockchain-powered subscriptions</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Connected Wallet</div>
            <div className="font-mono text-sm">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </div>
            <Badge variant={chainId === 137 ? 'default' : 'secondary'}>
              {chainId === 137 ? 'Polygon' : `Chain ${chainId}`}
            </Badge>
          </div>
        </div>

        {/* Current Subscriptions */}
        {subscriptions.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Your Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subscriptions.map((sub) => (
                  <Card key={sub.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="capitalize text-lg">{sub.plan_name}</CardTitle>
                        <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                          {sub.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Amount:</span>
                          <span className="font-semibold">${sub.amount} USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Method:</span>
                          <Badge variant="outline">
                            {sub.payment_method === 'superfluid' ? '⚡ Superfluid' : '🔒 Sablier'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Started:</span>
                          <span className="text-xs">
                            {new Date(sub.start_date).toLocaleDateString()}
                          </span>
                        </div>
                        {sub.end_date && (
                          <div className="flex justify-between">
                            <span className="text-sm">Ends:</span>
                            <span className="text-xs">
                              {new Date(sub.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Tabs */}
        <Tabs defaultValue="superfluid" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="superfluid" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Real-time Streaming
            </TabsTrigger>
            <TabsTrigger value="sablier" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Time-locked Plans
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="superfluid" className="mt-6">
            <SuperfluidIntegration
              provider={provider}
              walletAddress={walletAddress}
              chainId={chainId}
            />
          </TabsContent>
          
          <TabsContent value="sablier" className="mt-6">
            <SablierIntegration
              provider={provider}
              walletAddress={walletAddress}
              chainId={chainId}
            />
          </TabsContent>
        </Tabs>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm text-gray-600">Active Subscribers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">$2.5M</div>
              <div className="text-sm text-gray-600">Total Volume Streamed</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">99.9%</div>
              <div className="text-sm text-gray-600">Uptime Guarantee</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CryptoSubscriptions;