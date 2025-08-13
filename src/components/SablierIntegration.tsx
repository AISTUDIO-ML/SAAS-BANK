import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ethers } from 'ethers';
import { Clock, Calendar, Lock } from 'lucide-react';

interface SablierIntegrationProps {
  provider: ethers.BrowserProvider;
  walletAddress: string;
  chainId: number;
}

interface TimeLockedStream {
  id: string;
  recipient: string;
  amount: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'active' | 'completed';
}

const SablierIntegration: React.FC<SablierIntegrationProps> = ({
  provider,
  walletAddress,
  chainId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [streams, setStreams] = useState<TimeLockedStream[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(30); // days
  const [customAmount, setCustomAmount] = useState<string>('');
  const { toast } = useToast();

  // Sablier V2 contract addresses
  const SABLIER_ADDRESSES = {
    137: '0x14E673edD527Be681DEE7575Fb5a69BC9228e253', // Polygon
    1: '0xB10daee1FCF62243aE27776D7a92D39dC8740f95', // Ethereum
  };

  const USDT_ADDRESSES = {
    137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // Polygon USDT
    1: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum USDT
  };

  const COMPANY_WALLET = '0x742d35Cc6634C0532925a3b8D8e01e5E8e2b6a9e';

  const createTimeLockedStream = async (planType: 'annual' | 'quarterly' | 'custom') => {
    try {
      setIsLoading(true);
      
      const sablierAddress = SABLIER_ADDRESSES[chainId as keyof typeof SABLIER_ADDRESSES];
      const usdtAddress = USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES];
      
      if (!sablierAddress || !usdtAddress) {
        throw new Error('Sablier not supported on this network');
      }

      // Define stream parameters
      const amounts = {
        annual: ethers.parseUnits('120', 6), // $120 for annual (10% discount)
        quarterly: ethers.parseUnits('90', 6), // $90 for quarterly (25% savings per quarter)
        custom: ethers.parseUnits(customAmount || '100', 6),
      };

      const durations = {
        annual: 365 * 24 * 60 * 60, // 1 year in seconds
        quarterly: 90 * 24 * 60 * 60, // 90 days in seconds
        custom: selectedDuration * 24 * 60 * 60, // custom days in seconds
      };

      const amount = amounts[planType];
      const duration = durations[planType];
      const startTime = Math.floor(Date.now() / 1000);
      const endTime = startTime + duration;

      // Create Sablier stream contract interface
      const sablierABI = [
        'function createWithTimestamps((address,bool,uint40,address,uint40,address,uint128)) external returns (uint256)',
        'function withdraw(uint256,address,uint128) external',
        'function cancel(uint256) external',
      ];

      const signer = await provider.getSigner();
      const sablierContract = new ethers.Contract(sablierAddress, sablierABI, signer);

      // First approve USDT spending
      const usdtABI = ['function approve(address,uint256) external returns (bool)'];
      const usdtContract = new ethers.Contract(usdtAddress, usdtABI, signer);
      
      const approveTx = await usdtContract.approve(sablierAddress, amount);
      await approveTx.wait();

      // Create the time-locked stream
      const streamParams = {
        sender: walletAddress,
        cancelable: true,
        transferable: false,
        timestamps: {
          start: startTime,
          cliff: startTime,
          end: endTime,
        },
        recipient: COMPANY_WALLET,
        amounts: {
          deposit: amount,
        },
        asset: usdtAddress,
      };

      // Note: This is a simplified version. The actual Sablier integration
      // requires more complex parameter handling
      const createTx = await sablierContract.createWithTimestamps([
        walletAddress, // sender
        true, // cancelable
        startTime, // start
        COMPANY_WALLET, // recipient
        endTime, // end  
        usdtAddress, // asset
        amount, // amount
      ]);

      const receipt = await createTx.wait();
      const streamId = receipt.logs[0]?.topics[1] || receipt.transactionHash;

      // Save to database
      const subscriptionData = {
        user_id: 1, // Get from auth context
        plan_name: planType,
        plan_type: planType,
        amount: planType === 'annual' ? 120 : planType === 'quarterly' ? 90 : parseFloat(customAmount || '100'),
        payment_method: 'sablier',
        status: 'active',
        wallet_address: walletAddress,
        stream_id: streamId,
        start_date: new Date().toISOString(),
        end_date: new Date(endTime * 1000).toISOString(),
        chain_id: chainId,
      };

      const { error } = await window.ezsite.apis.tableCreate(34169, subscriptionData);
      if (error) throw new Error(error);

      // Add to local state
      const newStream: TimeLockedStream = {
        id: streamId,
        recipient: COMPANY_WALLET,
        amount: ethers.formatUnits(amount, 6),
        duration: duration / (24 * 60 * 60), // convert to days
        startTime: new Date(startTime * 1000),
        endTime: new Date(endTime * 1000),
        status: 'active',
      };

      setStreams(prev => [...prev, newStream]);
      
      toast({
        title: 'Time-Locked Stream Created',
        description: `${planType} subscription locked for ${duration / (24 * 60 * 60)} days`,
      });
      
    } catch (error: any) {
      console.error('Error creating time-locked stream:', error);
      toast({
        title: 'Stream Creation Failed',
        description: error.message || 'Failed to create time-locked stream',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Sablier Time-Locked Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Annual Plan */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Annual Plan
                </CardTitle>
                <div className="text-2xl font-bold">
                  $120
                  <span className="text-sm font-normal">/year</span>
                </div>
                <Badge variant="secondary">Save $24/year</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Pay upfront for 12 months, funds locked until expiration
                </div>
                <Button 
                  onClick={() => createTimeLockedStream('annual')}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock for 1 Year
                </Button>
              </CardContent>
            </Card>

            {/* Quarterly Plan */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Quarterly Plan
                </CardTitle>
                <div className="text-2xl font-bold">
                  $90
                  <span className="text-sm font-normal">/quarter</span>
                </div>
                <Badge variant="secondary">Save $30/quarter</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Pay for 3 months upfront, funds locked for 90 days
                </div>
                <Button 
                  onClick={() => createTimeLockedStream('quarterly')}
                  className="w-full"
                  disabled={isLoading}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock for 90 Days
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Custom Plan */}
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle>Custom Time-Lock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount">Amount (USDT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="100"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  />
                </div>
              </div>
              <Button 
                onClick={() => createTimeLockedStream('custom')}
                className="w-full"
                disabled={isLoading || !customAmount}
              >
                <Lock className="h-4 w-4 mr-2" />
                Create Custom Lock
              </Button>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Active Streams */}
      {streams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Time-Locked Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {streams.map((stream) => (
                <div key={stream.id} className="flex items-center justify-between p-4 border rounded">
                  <div>
                    <div className="font-medium">${stream.amount} USDT</div>
                    <div className="text-sm text-muted-foreground">
                      {stream.duration} days lock period
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Ends: {stream.endTime.toLocaleDateString()}
                    </div>
                    <Badge variant={
                      stream.status === 'active' ? 'default' : 
                      stream.status === 'completed' ? 'secondary' : 
                      'outline'
                    }>
                      {stream.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      To: {stream.recipient.slice(0, 6)}...{stream.recipient.slice(-4)}
                    </div>
                    {stream.status === 'active' && (
                      <div className="text-xs text-green-600">
                        Streaming...
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SablierIntegration;