'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Ban,
  Clock,
  TrendingUp,
  XCircle,
  CheckCircle,
} from 'lucide-react';

interface FraudAlert {
  id: string;
  type: 'high' | 'medium' | 'low';
  category: 'card_testing' | 'account_takeover' | 'friendly_fraud' | 'suspicious_pattern';
  orderId: string;
  userId?: string;
  description: string;
  riskScore: number;
  status: 'pending' | 'investigating' | 'confirmed' | 'dismissed';
  createdAt: string;
  ipAddress: string;
  amount: number;
}

export default function FraudDetectionDashboardPage() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockAlerts: FraudAlert[] = [
          {
            id: 'alert-1',
            type: 'high',
            category: 'card_testing',
            orderId: 'ORD-123456',
            userId: 'user-123',
            description: 'Multiple failed payment attempts from same IP',
            riskScore: 95,
            status: 'investigating',
            createdAt: '2025-01-19T10:30:00Z',
            ipAddress: '192.168.1.100',
            amount: 0,
          },
          {
            id: 'alert-2',
            type: 'high',
            category: 'account_takeover',
            orderId: 'ORD-123457',
            userId: 'user-456',
            description: 'Suspicious login from unusual location',
            riskScore: 88,
            status: 'pending',
            createdAt: '2025-01-19T09:15:00Z',
            ipAddress: '10.0.0.50',
            amount: 1250.00,
          },
          {
            id: 'alert-3',
            type: 'medium',
            category: 'friendly_fraud',
            orderId: 'ORD-123458',
            userId: 'user-789',
            description: 'High value order with new account',
            riskScore: 65,
            status: 'investigating',
            createdAt: '2025-01-19T08:45:00Z',
            ipAddress: '172.16.0.10',
            amount: 890.50,
          },
          {
            id: 'alert-4',
            type: 'low',
            category: 'suspicious_pattern',
            orderId: 'ORD-123459',
            description: 'Unusual ordering pattern detected',
            riskScore: 45,
            status: 'dismissed',
            createdAt: '2025-01-18T23:20:00Z',
            ipAddress: '192.168.1.200',
            amount: 156.99,
          },
          {
            id: 'alert-5',
            type: 'high',
            category: 'card_testing',
            orderId: 'ORD-123460',
            description: 'Rapid multiple orders with different cards',
            riskScore: 92,
            status: 'confirmed',
            createdAt: '2025-01-18T21:10:00Z',
            ipAddress: '10.20.30.40',
            amount: 3240.00,
          },
        ];

        setAlerts(mockAlerts);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-500 hover:bg-red-600',
      medium: 'bg-yellow-500 hover:bg-yellow-600',
      low: 'bg-blue-500 hover:bg-blue-600',
    };
    return colors[type] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500 hover:bg-yellow-600',
      investigating: 'bg-blue-500 hover:bg-blue-600',
      confirmed: 'bg-red-500 hover:bg-red-600',
      dismissed: 'bg-green-500 hover:bg-green-600',
    };
    return colors[status] || 'bg-gray-500';
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch =
      alert.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.ipAddress.includes(searchTerm);

    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const updateAlertStatus = (id: string, status: FraudAlert['status']) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status } : alert
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fraud Detection</h1>
          <p className="text-sm text-muted-foreground">Monitor and investigate suspicious store activities</p>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
            <p className="text-2xl font-bold">{alerts.filter(a => a.status !== 'dismissed').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground text-yellow-600">Pending</p>
            <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'pending').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground text-red-600">Confirmed</p>
            <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'confirmed').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground text-green-600">Prevented Loss</p>
            <p className="text-2xl font-bold">${alerts.filter(a => a.status === 'confirmed').reduce((sum, a) => sum + a.amount, 0).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID, IP, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="alerts">Alert Queue</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <Card key={alert.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: alert.type === 'high' ? '#ef4444' : alert.type === 'medium' ? '#eab308' : '#3b82f6' }}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(alert.type)}>{alert.type.toUpperCase()}</Badge>
                        <Badge variant="outline" className={getStatusColor(alert.status).replace('bg-', 'text-').replace('hover:bg-', '')}>{alert.status.toUpperCase()}</Badge>
                        <span className="text-xs text-muted-foreground">{new Date(alert.createdAt).toLocaleString()}</span>
                      </div>
                      <h3 className="text-lg font-bold">{alert.description}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Order: </span>
                          <span className="font-mono font-medium">{alert.orderId}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">IP Address: </span>
                          <span className="font-mono font-medium">{alert.ipAddress}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk Score: </span>
                          <span className="font-bold text-red-600">{alert.riskScore}/100</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {alert.status === 'pending' && (
                        <Button size="sm" onClick={() => updateAlertStatus(alert.id, 'investigating')}>
                          Investigate
                        </Button>
                      )}
                      {alert.status === 'investigating' && (
                        <Button variant="destructive" size="sm" onClick={() => updateAlertStatus(alert.id, 'confirmed')}>
                          Confirm
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => updateAlertStatus(alert.id, 'dismissed')}>
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Trends</CardTitle>
              <CardDescription>Visual analysis of fraud attempts over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center border-dashed border-2 rounded-lg">
              <p className="text-muted-foreground italic">Trend charts visualization placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Velocity Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Rules based on transaction frequency and patterns.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Geographic Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Rules based on IP locations and shipping destinations.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
