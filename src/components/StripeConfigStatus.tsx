
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Eye, 
  EyeOff,
  Settings,
  CreditCard,
  Webhook,
  Key
} from 'lucide-react';

interface StripeConfig {
  publishableKey: string;
  configured: boolean;
}

const StripeConfigStatus: React.FC = () => {
  const [config, setConfig] = useState<StripeConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showKeys, setShowKeys] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConfiguration();
  }, []);

  const loadConfiguration = async () => {
    try {
      const { data, error } = await window.ezsite.apis.run({
        path: 'getStripeKeys',
        param: []
      });
      
      if (error) throw new Error(error);
      setConfig(data);
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast({
        title: 'Configuration Error',
        description: 'Failed to load Stripe configuration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`
    });
  };

  const maskKey = (key: string) => {
    if (!key) return 'Not configured';
    if (key.includes('Example')) return 'Demo key (not configured)';
    
    const parts = key.split('_');
    if (parts.length < 2) return key;
    
    return `${parts[0]}_${parts[1]}_${'*'.repeat(20)}${key.slice(-4)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading configuration...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Stripe Configuration Status
          </CardTitle>
          <CardDescription>
            Manage your Stripe integration settings and API keys
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {config?.configured ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              )}
              <div>
                <h4 className="font-semibold">
                  {config?.configured ? 'Fully Configured' : 'Configuration Required'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {config?.configured 
                    ? 'Stripe is ready for live payments' 
                    : 'API keys need to be configured'
                  }
                </p>
              </div>
            </div>
            <Badge 
              className={config?.configured 
                ? 'bg-green-100 text-green-800 border-green-300' 
                : 'bg-amber-100 text-amber-800 border-amber-300'
              }
            >
              {config?.configured ? 'Ready' : 'Setup Required'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Configuration Status</TabsTrigger>
          <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys Status
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeys(!showKeys)}
                >
                  {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showKeys ? 'Hide' : 'Show'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h5 className="font-medium">Publishable Key</h5>
                    <code className="text-xs text-muted-foreground">
                      {showKeys ? config?.publishableKey : maskKey(config?.publishableKey || '')}
                    </code>
                  </div>
                  {showKeys && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(config?.publishableKey || '', 'Publishable key')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <h5 className="font-medium">Secret Key</h5>
                    <code className="text-xs text-muted-foreground">
                      {showKeys ? 'sk_***_hidden_for_security' : 'Hidden for security'}
                    </code>
                  </div>
                  <Badge variant="outline">Server-side only</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
              <CardDescription>
                Follow these steps to configure Stripe in your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">1. Get your Stripe API keys</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Access your Stripe Dashboard to retrieve your API keys
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://dashboard.stripe.com/apikeys', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open Stripe Dashboard
                  </Button>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">2. Set environment variables</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Configure these environment variables in your deployment platform
                  </p>
                  <div className="bg-gray-100 p-3 rounded font-mono text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <code>STRIPE_SECRET_KEY=sk_test_...</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('STRIPE_SECRET_KEY=sk_test_...', 'Environment variable')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <code>STRIPE_PUBLISHABLE_KEY=pk_test_...</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('STRIPE_PUBLISHABLE_KEY=pk_test_...', 'Environment variable')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">3. Create products and prices</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Set up your subscription plans in Stripe Dashboard
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://dashboard.stripe.com/products', '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Manage Products
                  </Button>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">4. Configure webhooks (optional)</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Set up webhooks for real-time subscription updates
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://dashboard.stripe.com/webhooks', '_blank')}
                  >
                    <Webhook className="mr-2 h-4 w-4" />
                    Configure Webhooks
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Your Integration</CardTitle>
              <CardDescription>
                Use these test card numbers to verify your Stripe integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600">Successful Payment</h4>
                  <code className="text-sm">4242 4242 4242 4242</code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Any expiry date, CVC, and postal code
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-red-600">Declined Payment</h4>
                  <code className="text-sm">4000 0000 0000 0002</code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Card will be declined
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-yellow-600">Requires Authentication</h4>
                  <code className="text-sm">4000 0025 0000 3155</code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Triggers 3D Secure authentication
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-blue-600">Insufficient Funds</h4>
                  <code className="text-sm">4000 0000 0000 9995</code>
                  <p className="text-xs text-muted-foreground mt-1">
                    Card has insufficient funds
                  </p>
                </div>
              </div>
              
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  These test cards only work in test mode. Use real card numbers only in live mode.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StripeConfigStatus;
