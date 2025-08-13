
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Users, DollarSign, Activity, AlertTriangle, Search, Filter } from 'lucide-react';

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    {
      id: '1',
      email: 'john.doe@example.com',
      subscriptions: 3,
      totalSpent: '156.78',
      status: 'active',
      lastActivity: '2024-01-15'
    },
    {
      id: '2', 
      email: 'jane.smith@example.com',
      subscriptions: 1,
      totalSpent: '52.99',
      status: 'active',
      lastActivity: '2024-01-14'
    },
    {
      id: '3',
      email: 'bob.wilson@example.com',
      subscriptions: 2,
      totalSpent: '89.45',
      status: 'paused',
      lastActivity: '2024-01-10'
    }
  ];

  const mockStreams = [
    {
      id: '1',
      user: 'john.doe@example.com',
      service: 'Netflix Premium',
      type: 'Superfluid',
      amount: '15.99 USDT/month',
      status: 'active',
      created: '2024-01-01'
    },
    {
      id: '2',
      user: 'jane.smith@example.com', 
      service: 'Adobe Creative',
      type: 'Sablier',
      amount: '52.99 USDT',
      status: 'locked',
      created: '2024-01-05'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, subscriptions, and monitor platform activity</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">USDT this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,562</div>
              <p className="text-xs text-muted-foreground">1,234 Superfluid, 2,328 Sablier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="streams">Stream Monitoring</TabsTrigger>
            <TabsTrigger value="analytics">Platform Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Monitor and manage platform users</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Subscriptions</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.subscriptions}</TableCell>
                        <TableCell>${user.totalSpent} USDT</TableCell>
                        <TableCell>
                          <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastActivity}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="streams" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Stream Monitoring</CardTitle>
                <CardDescription>Real-time monitoring of Superfluid and Sablier streams</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockStreams.map((stream) => (
                      <TableRow key={stream.id}>
                        <TableCell>{stream.user}</TableCell>
                        <TableCell>{stream.service}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{stream.type}</Badge>
                        </TableCell>
                        <TableCell>{stream.amount}</TableCell>
                        <TableCell>
                          <Badge className={stream.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}>
                            {stream.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{stream.created}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Monitor</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Monthly Active Users</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Average Subscription Value</span>
                      <span className="font-medium">$23.45 USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stream Success Rate</span>
                      <span className="font-medium text-green-600">99.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Platform Uptime</span>
                      <span className="font-medium text-green-600">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Monitoring Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Stream Anomaly Detection</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Fraud Prevention</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Access Control</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Predictive Analytics</span>
                      <Badge className="bg-blue-100 text-blue-800">Learning</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
