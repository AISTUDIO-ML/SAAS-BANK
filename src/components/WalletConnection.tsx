import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ExternalLink, Copy } from 'lucide-react';
import { ethers } from 'ethers';

interface WalletConnectionProps {
  onWalletConnect?: (address: string, provider: ethers.BrowserProvider) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onWalletConnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [chainId, setChainId] = useState<number>(0);
  const [balance, setBalance] = useState<string>('0');
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const supportedChains = {
    137: 'Polygon',
    80001: 'Polygon Mumbai',
    1: 'Ethereum',
    5: 'Goerli',
  };

  useEffect(() => {
    checkWalletConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_accounts', []);
        
        if (accounts.length > 0) {
          const network = await provider.getNetwork();
          const balance = await provider.getBalance(accounts[0]);
          
          setProvider(provider);
          setWalletAddress(accounts[0]);
          setChainId(Number(network.chainId));
          setBalance(ethers.formatEther(balance));
          setIsConnected(true);
          
          if (onWalletConnect) {
            onWalletConnect(accounts[0], provider);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      toast({
        title: 'MetaMask Required',
        description: 'Please install MetaMask to use this feature.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(accounts[0]);
        
        setProvider(provider);
        setWalletAddress(accounts[0]);
        setChainId(Number(network.chainId));
        setBalance(ethers.formatEther(balance));
        setIsConnected(true);
        
        if (onWalletConnect) {
          onWalletConnect(accounts[0], provider);
        }
        
        toast({
          title: 'Wallet Connected',
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        });
      }
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setChainId(0);
    setBalance('0');
    setProvider(null);
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      checkWalletConnection();
    }
  };

  const handleChainChanged = () => {
    checkWalletConnection();
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: 'Address Copied',
      description: 'Wallet address copied to clipboard',
    });
  };

  const switchToPolygon = async () => {
    if (!window.ethereum) return;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x89' }], // Polygon mainnet
      });
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x89',
              chainName: 'Polygon Mainnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/'],
            }],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Connect your wallet to access crypto subscriptions
          </div>
          <Button 
            onClick={connectWallet} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connecting...' : 'Connect MetaMask'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </div>
          <Badge variant={chainId === 137 ? 'default' : 'secondary'}>
            {supportedChains[chainId as keyof typeof supportedChains] || `Chain ${chainId}`}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium">Address</div>
          <div className="flex items-center gap-2">
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </code>
            <Button size="sm" variant="ghost" onClick={copyAddress}>
              <Copy className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <a
                href={`https://polygonscan.com/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium">Balance</div>
          <div className="text-lg font-semibold">
            {parseFloat(balance).toFixed(4)} {chainId === 137 ? 'MATIC' : 'ETH'}
          </div>
        </div>

        {chainId !== 137 && (
          <Button onClick={switchToPolygon} variant="outline" className="w-full">
            Switch to Polygon
          </Button>
        )}
        
        <Button onClick={disconnectWallet} variant="outline" className="w-full">
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletConnection;