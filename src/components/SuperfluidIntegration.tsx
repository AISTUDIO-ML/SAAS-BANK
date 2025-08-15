import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
// import { Framework } from '@superfluid-finance/sdk-core';
import { ethers } from 'ethers';
import { Play, Square, RefreshCw, Zap } from 'lucide-react';

interface SuperfluidIntegrationProps {
  provider: ethers.BrowserProvider;
  walletAddress: string;
  chainId: number;
}

interface StreamData {
  receiver: string;
  flowRate: string;
  token: string;
  isActive: boolean;
  totalStreamed: string;
}

const SuperfluidIntegration: React.FC<SuperfluidIntegrationProps> = ({
  provider,
  walletAddress,
  chainId
}) => {
  const [sf, setSf] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [streams, setStreams] = useState<StreamData[]>([]);
  const [newStreamReceiver, setNewStreamReceiver] = useState('');
  const [newStreamFlowRate, setNewStreamFlowRate] = useState('');
  const { toast } = useToast();

  // USDT token addresses for different networks
  const USDT_ADDRESSES = {
    137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon USDT
    1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum USDT
    5: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F' // Goerli USDT
  };

  // Company wallet address (replace with your actual address)
  const COMPANY_WALLET = '0x742d35Cc6634C0532925a3b8D8e01e5E8e2b6a9e';

  useEffect(() => {
    initializeSuperfluid();
  }, [provider, chainId]);

  const initializeSuperfluid = async () => {
    try {
      setIsLoading(true);

      // Mock Superfluid framework initialization
      // In production, this would use the actual Superfluid SDK
      const mockFramework = {
        isInitialized: true,
        chainId,
        provider
      };

      setSf(mockFramework);
      await loadExistingStreams(mockFramework);

      toast({
        title: 'Superfluid Initialized',
        description: 'Ready to create payment streams'
      });
    } catch (error: any) {
      console.error('Error initializing Superfluid:', error);
      toast({
        title: 'Initialization Failed',
        description: error.message || 'Failed to initialize Superfluid',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingStreams = async (framework: any) => {
    try {
      // Mock stream loading - in production, query Superfluid subgraph
      // Check database for existing streams
      const { data, error } = await window.ezsite.apis.tablePage(34170, {
        PageNo: 1,
        PageSize: 10,
        OrderByField: 'id',
        IsAsc: false,
        Filters: [
        {
          name: 'sender',
          op: 'Equal',
          value: walletAddress
        },
        {
          name: 'is_active',
          op: 'Equal',
          value: true
        }]

      });

      if (!error && data.List?.length > 0) {
        const activeStreams = data.List.map((stream: any) => ({
          receiver: stream.receiver,
          flowRate: stream.flow_rate,
          token: stream.token_address,
          isActive: stream.is_active,
          totalStreamed: stream.total_streamed.toString()
        }));

        setStreams(activeStreams);
      }
    } catch (error) {
      console.error('Error loading streams:', error);
    }
  };

  const createStream = async (planType: 'basic' | 'premium' | 'enterprise') => {
    if (!sf) return;

    const flowRates = {
      basic: '3858024691358', // ~$10/month in wei per second
      premium: '11574074074074', // ~$30/month in wei per second  
      enterprise: '38580246913580' // ~$100/month in wei per second
    };

    try {
      setIsLoading(true);

      const usdtAddress = USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES];
      if (!usdtAddress) {
        throw new Error('USDT not supported on this network');
      }

      // Mock transaction creation for demo
      const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const receipt = {
        transactionHash: mockTxHash,
        to: COMPANY_WALLET,
        from: walletAddress,
        blockNumber: Math.floor(Math.random() * 1000000) + 15000000
      };

      // Save subscription to database
      const subscriptionData = {
        user_id: 1, // Get from auth context
        plan_name: planType,
        plan_type: planType,
        amount: planType === 'basic' ? 10 : planType === 'premium' ? 30 : 100,
        payment_method: 'superfluid',
        status: 'active',
        wallet_address: walletAddress,
        stream_id: receipt.transactionHash,
        start_date: new Date().toISOString(),
        chain_id: chainId
      };

      const { error } = await window.ezsite.apis.tableCreate(34169, subscriptionData);
      if (error) throw new Error(error);

      // Save payment stream record
      const streamData = {
        subscription_id: 1, // Use actual subscription ID from response
        stream_address: receipt.to || '',
        sender: walletAddress,
        receiver: COMPANY_WALLET,
        token_address: usdtAddress,
        flow_rate: flowRates[planType],
        total_streamed: 0,
        is_active: true,
        last_updated: new Date().toISOString()
      };

      const { error: streamError } = await window.ezsite.apis.tableCreate(34170, streamData);
      if (streamError) throw new Error(streamError);

      await loadExistingStreams(sf);

      toast({
        title: 'Stream Created',
        description: `${planType} subscription stream started successfully`
      });
    } catch (error: any) {
      console.error('Error creating stream:', error);
      toast({
        title: 'Stream Creation Failed',
        description: error.message || 'Failed to create payment stream',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelStream = async (receiver: string) => {
    if (!sf) return;

    try {
      setIsLoading(true);

      const usdtAddress = USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES];
      if (!usdtAddress) throw new Error('USDT not supported');

      const usdtx = await sf.loadSuperToken(usdtAddress + 'x');
      const signer = await provider.getSigner();

      const deleteFlowOperation = usdtx.deleteFlow({
        sender: walletAddress,
        receiver
      });

      await deleteFlowOperation.exec(signer);
      await loadExistingStreams(sf);

      toast({
        title: 'Stream Cancelled',
        description: 'Payment stream has been cancelled'
      });
    } catch (error: any) {
      console.error('Error cancelling stream:', error);
      toast({
        title: 'Cancellation Failed',
        description: error.message || 'Failed to cancel stream',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!sf || isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <div>Initializing Superfluid...</div>
        </CardContent>
      </Card>);

  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Superfluid Real-time Streams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['basic', 'premium', 'enterprise'].map((plan) =>
            <Card key={plan} className="border-2">
                <CardHeader>
                  <CardTitle className="capitalize text-lg">{plan}</CardTitle>
                  <div className="text-2xl font-bold">
                    ${plan === 'basic' ? '10' : plan === 'premium' ? '30' : '100'}
                    <span className="text-sm font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                  onClick={() => createStream(plan as any)}
                  className="w-full"
                  disabled={isLoading}>

                    <Play className="h-4 w-4 mr-2" />
                    Start Stream
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {streams.length > 0 &&
      <Card>
          <CardHeader>
            <CardTitle>Active Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streams.map((stream, index) =>
            <div key={index} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <div className="font-medium">
                      To: {stream.receiver.slice(0, 6)}...{stream.receiver.slice(-4)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Flow Rate: {stream.flowRate} wei/second
                    </div>
                    <Badge variant={stream.isActive ? 'default' : 'secondary'}>
                      {stream.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <Button
                variant="destructive"
                size="sm"
                onClick={() => cancelStream(stream.receiver)}>

                    <Square className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
            )}
            </div>
          </CardContent>
        </Card>
      }
    </div>);

};

export default SuperfluidIntegration;