import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Code,
  ExternalLink,
  Zap,
  Lock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Copy } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CryptoIntegrationGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${label} copied to clipboard`
    });
  };

  const contractAddresses = {
    polygon: {
      superfluid: '0x3E14dC1b13c488a8d5D310918780c983bD5982E7',
      sablier: '0x14E673edD527Be681DEE7575Fb5a69BC9228e253',
      usdt: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
    },
    ethereum: {
      superfluid: '0xEbdA4ceF883A7B12c4E669Ebc58927FBa8447C7D',
      sablier: '0xB10daee1FCF62243aE27776D7a92D39dC8740f95',
      usdt: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Crypto Integration Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete documentation for integrating Superfluid and Sablier protocols 
          into your SaaS platform for real-time and time-locked payments.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="superfluid">Superfluid</TabsTrigger>
          <TabsTrigger value="sablier">Sablier</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Superfluid Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Real-time payment streaming for continuous subscriptions.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Per-second billing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Instant cancellation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">No upfront payment</span>
                  </div>
                </div>
                <Badge variant="outline">Gas Optimized</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                  Sablier Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Time-locked vesting contracts for upfront payments.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Upfront discounts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Guaranteed revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Withdrawal protection</span>
                  </div>
                </div>
                <Badge variant="outline">Vesting Enabled</Badge>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Both protocols are audited and battle-tested with millions in TVL. 
              They provide enterprise-grade security for crypto-native subscription models.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Implementation Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600">95%</div>
                  <div className="text-sm text-gray-600">Lower transaction costs</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Chargeback risk</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-purple-600">Global</div>
                  <div className="text-sm text-gray-600">Accessibility</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Superfluid Tab */}
        <TabsContent value="superfluid" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Superfluid Integration Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Install SDK</h4>
                    <div className="bg-gray-100 p-2 rounded mt-2 font-mono text-sm relative">
                      npm install @superfluid-finance/sdk-core
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => copyToClipboard('npm install @superfluid-finance/sdk-core', 'Command')}>

                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Initialize Framework</h4>
                    <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-xs overflow-x-auto">
                      {`const sf = await Framework.create({
  chainId: 137,
  provider: signer,
});`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Create Payment Stream</h4>
                    <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-xs overflow-x-auto">
                      {`const createFlowOperation = token.createFlow({
  receiver: "0x...",
  flowRate: "3858024691358", // $10/month
});
await createFlowOperation.exec(signer);`}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contract Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Polygon Mainnet</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Superfluid Host:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {contractAddresses.polygon.superfluid}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">USDT:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {contractAddresses.polygon.usdt}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sablier Tab */}
        <TabsContent value="sablier" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sablier Integration Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Install SDK</h4>
                    <div className="bg-gray-100 p-2 rounded mt-2 font-mono text-sm relative">
                      npm install @sablier/v2-sdk
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => copyToClipboard('npm install @sablier/v2-sdk', 'Command')}>

                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Create Stream Contract</h4>
                    <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-xs overflow-x-auto">
                      {`const streamParams = {
  sender: walletAddress,
  recipient: companyWallet,
  totalAmount: ethers.parseUnits("120", 6),
  asset: usdtAddress,
  cancelable: true,
  timestamps: { start, cliff: start, end }
};`}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Deploy Time-Lock</h4>
                    <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-xs overflow-x-auto">
                      {`const tx = await sablierContract.createWithTimestamps(
  streamParams
);
const receipt = await tx.wait();`}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Time-Lock Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">For Business</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Guaranteed cash flow</li>
                    <li>• Reduced churn risk</li>
                    <li>• Upfront revenue recognition</li>
                    <li>• Lower payment processing costs</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">For Users</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Significant discounts</li>
                    <li>• Price protection</li>
                    <li>• No recurring charges</li>
                    <li>• Transparent vesting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Deployment Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Database tables created for subscriptions and streams</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Wallet connection implemented with MetaMask support</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Stream monitoring and analytics dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Replace mock implementations with actual SDK calls</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Configure production contract addresses</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Set up blockchain event monitoring</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> The current implementation uses mock data for demonstration. 
              For production, replace with actual SDK calls and configure real contract interactions.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">1. SDK Integration</h4>
                  <p className="text-sm text-gray-600">
                    Replace mock Superfluid calls with actual SDK implementation once compatibility issues are resolved.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">2. Event Monitoring</h4>
                  <p className="text-sm text-gray-600">
                    Set up blockchain event listeners to automatically update stream status and payment data.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">3. Security Audit</h4>
                  <p className="text-sm text-gray-600">
                    Conduct thorough security review of smart contract interactions and user fund handling.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">4. User Testing</h4>
                  <p className="text-sm text-gray-600">
                    Test with real users on testnets before mainnet deployment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation & Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://docs.superfluid.finance" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Superfluid Documentation
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://docs.sablier.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Sablier Documentation
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://polygonscan.com" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Polygon Explorer
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://console.superfluid.finance" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Superfluid Console
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default CryptoIntegrationGuide;