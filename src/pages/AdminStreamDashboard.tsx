import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  Search,
  Filter,
  ExternalLink,
  Pause,
  Play,
  X } from
'lucide-react';

const AdminStreamDashboard: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [paymentStreams, setPaymentStreams] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscribers: 0,
    totalStreams: 0,
    monthlyGrowth: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);

      // Load subscriptions
      const { data: subsData, error: subsError } = await window.ezsite.apis.tablePage(34169, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'id',
        IsAsc: false,
        Filters: []
      });

      if (subsError) throw new Error(subsError);
      setSubscriptions(subsData.List || []);

      // Load payment streams
      const { data: streamsData, error: streamsError } = await window.ezsite.apis.tablePage(34170, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'id',
        IsAsc: false,
        Filters: []
      });

      if (streamsError) throw new Error(streamsError);
      setPaymentStreams(streamsData.List || []);

      // Load transactions
      const { data: txData, error: txError } = await window.ezsite.apis.tablePage(34171, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: 'id',
        IsAsc: false,
        Filters: []
      });

      if (txError) throw new Error(txError);
      setTransactions(txData.List || []);

      // Calculate stats
      calculateStats(subsData.List || [], streamsData.List || []);

    } catch (error: any) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Load Error',
        description: error.message || 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (subs: any[], streams: any[]) => {
    const totalRevenue = subs.reduce((sum, sub) => sum + (sub.amount || 0), 0);
    const activeSubscribers = subs.filter((sub) => sub.status === 'active').length;
    const totalStreams = streams.filter((stream) => stream.is_active).length;

    setStats({
      totalRevenue,
      activeSubscribers,
      totalStreams,
      monthlyGrowth: 12.5 // Mock growth rate
    });
  };

  const filteredSubscriptions = subscriptions.filter((sub) =>
  sub.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  sub.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  sub.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':return 'default';
      case 'paused':return 'secondary';
      case 'cancelled':return 'destructive';
      case 'expired':return 'outline';
      default:return 'secondary';
    }
  };

  const formatAddress = (address: string) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A';
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stream Analytics</h1>
            <p className="text-gray-600">Monitor and manage crypto subscriptions</p>
          </div>
          <Button onClick={loadDashboardData} disabled={isLoading}>
            <Activity className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatAmount(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.activeSubscribers.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Streams</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalStreams}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                  <p className="text-2xl font-bold text-gray-900">
                    +{stats.monthlyGrowth}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="streams">Active Streams</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Subscription Management</CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search subscriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64" />

                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscriptions.map((sub) =>
                      <TableRow key={sub.id}>
                          <TableCell className="font-mono">
                            {formatAddress(sub.wallet_address)}
                          </TableCell>
                          <TableCell className="capitalize">{sub.plan_name}</TableCell>
                          <TableCell>{formatAmount(sub.amount)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {sub.payment_method === 'superfluid' ? '⚡' : '🔒'} {sub.payment_method}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(sub.status)}>
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(sub.start_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Pause className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Streams Tab */}
          <TabsContent value="streams" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Payment Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Stream Address</TableHead>
                        <TableHead>Sender</TableHead>
                        <TableHead>Receiver</TableHead>
                        <TableHead>Flow Rate</TableHead>
                        <TableHead>Total Streamed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentStreams.map((stream) =>
                      <TableRow key={stream.id}>
                          <TableCell className="font-mono">
                            {formatAddress(stream.stream_address)}
                          </TableCell>
                          <TableCell className="font-mono">
                            {formatAddress(stream.sender)}
                          </TableCell>
                          <TableCell className="font-mono">
                            {formatAddress(stream.receiver)}
                          </TableCell>
                          <TableCell>{stream.flow_rate} wei/s</TableCell>
                          <TableCell>{formatAmount(stream.total_streamed)}</TableCell>
                          <TableCell>
                            <Badge variant={stream.is_active ? 'default' : 'secondary'}>
                              {stream.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(stream.last_updated).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction Hash</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Gas Used</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx) =>
                      <TableRow key={tx.id}>
                          <TableCell className="font-mono">
                            {formatAddress(tx.transaction_hash)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {tx.transaction_type?.replace('_', ' ')}
                          </TableCell>
                          <TableCell>{formatAmount(tx.amount)}</TableCell>
                          <TableCell>{tx.gas_used}</TableCell>
                          <TableCell>
                            <Badge variant={
                          tx.status === 'confirmed' ? 'default' :
                          tx.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(tx.timestamp).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>);

};

export default AdminStreamDashboard;