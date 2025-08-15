
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  Settings, 
  Globe, 
  Webhook, 
  CreditCard,
  Copy,
  ExternalLink,
  CheckCircle 
} from 'lucide-react';

const StripeSetupGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyType: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyType);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const webhookUrl = `${window.location.origin}/api/stripe/webhook`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Stripe Integration Setup</h2>
        <p className="text-muted-foreground mt-2">
          Configure your Stripe account to enable subscription payments
        </p>
      </div>

      <Tabs defaultValue="keys" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Stripe API Keys
              </CardTitle>
              <CardDescription>
                Get your API keys from the Stripe Dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  <strong>Step 1:</strong> Log in to your{' '}
                  <a 
                    href="https://dashboard.stripe.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    Stripe Dashboard
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Publishable Key</label>
                  <div className="flex space-x-2">
                    <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                      pk_test_...your_publishable_key_here
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('pk_test_...your_publishable_key_here', 'publishable')}
                    >
                      {copiedKey === 'publishable' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add this to your environment variables as <code>VITE_STRIPE_PUBLISHABLE_KEY</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Secret Key</label>
                  <div className="flex space-x-2">
                    <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                      sk_test_...your_secret_key_here
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard('sk_test_...your_secret_key_here', 'secret')}
                    >
                      {copiedKey === 'secret' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add this to your server environment variables as <code>STRIPE_SECRET_KEY</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Webhook className="w-5 h-5 mr-2" />
                Webhook Configuration
              </CardTitle>
              <CardDescription>
                Set up webhooks to receive real-time updates from Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Webhook Endpoint URL</label>
                  <div className="flex space-x-2 mt-1">
                    <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm">
                      {webhookUrl}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(webhookUrl, 'webhook')}
                    >
                      {copiedKey === 'webhook' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Events to Listen For</label>
                  <div className="mt-2 space-y-1">
                    {[
                      'customer.subscription.created',
                      'customer.subscription.updated',
                      'customer.subscription.deleted',
                      'invoice.payment_succeeded',
                      'invoice.payment_failed'
                    ].map((event) => (
                      <Badge key={event} variant="outline" className="mr-2 mb-1">
                        {event}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Alert>
                  <Webhook className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Step 2:</strong> In your Stripe Dashboard, go to Developers → Webhooks → Add endpoint.
                    Use the URL above and select the events listed.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Product & Pricing Setup
              </CardTitle>
              <CardDescription>
                Create your subscription products and pricing in Stripe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Alert>
                  <Globe className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Step 3:</strong> In your Stripe Dashboard, go to Products → Create Product.
                    Set up your subscription plans with recurring pricing.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Starter Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Monthly: $9.99</li>
                        <li>• Yearly: $99.99</li>
                        <li>• Up to 10 streams</li>
                        <li>• Basic analytics</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed border-blue-300">
                    <CardHeader>
                      <CardTitle className="text-lg">Professional</CardTitle>
                      <Badge className="w-fit">Popular</Badge>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Monthly: $29.99</li>
                        <li>• Yearly: $299.99</li>
                        <li>• Up to 100 streams</li>
                        <li>• Advanced analytics</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Enterprise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm space-y-1">
                        <li>• Monthly: $99.99</li>
                        <li>• Yearly: $999.99</li>
                        <li>• Unlimited streams</li>
                        <li>• Dedicated support</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Copy the Price IDs from Stripe and update them in your 
                    backend configuration to match your actual pricing structure.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StripeSetupGuide;
