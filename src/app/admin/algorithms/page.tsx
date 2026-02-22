'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Settings,
  RefreshCw,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface Algorithm {
  id: string;
  name: string;
  type: 'recommendation' | 'search' | 'pricing' | 'personalization' | 'fraud';
  status: 'active' | 'paused' | 'error';
  version: string;
  accuracy: number;
  lastRun: string;
  config: {
    enabled: boolean;
    frequency: string;
  };
}

export default function AlgorithmControlCenterPage() {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlgorithms = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockAlgorithms: Algorithm[] = [
          {
            id: 'algo-1',
            name: 'Product Recommendation Engine',
            type: 'recommendation',
            status: 'active',
            version: '3.2.1',
            accuracy: 94.5,
            lastRun: '2025-01-19T10:00:00Z',
            config: { enabled: true, frequency: 'hourly' },
          },
          {
            id: 'algo-2',
            name: 'Search Ranking Algorithm',
            type: 'search',
            status: 'active',
            version: '2.8.0',
            accuracy: 91.2,
            lastRun: '2025-01-19T09:30:00Z',
            config: { enabled: true, frequency: 'hourly' },
          },
          {
            id: 'algo-3',
            name: 'Dynamic Pricing Engine',
            type: 'pricing',
            status: 'paused',
            version: '1.5.3',
            accuracy: 88.7,
            lastRun: '2025-01-18T14:00:00Z',
            config: { enabled: false, frequency: 'daily' },
          },
        ];
        setAlgorithms(mockAlgorithms);
      } catch (error) {
        console.error('Failed to fetch algorithms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlgorithms();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500 hover:bg-green-600',
      paused: 'bg-yellow-500 hover:bg-yellow-600',
      error: 'bg-red-500 hover:bg-red-600',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      active: CheckCircle,
      paused: Clock,
      error: AlertTriangle,
    };
    return icons[status] || AlertTriangle;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Algorithms</h1>
          <p className="text-sm text-muted-foreground">Manage and monitor core system intelligence</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Global Config
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Total Active</p>
            <p className="text-2xl font-bold text-green-600">{algorithms.filter(a => a.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">System Health</p>
            <p className="text-2xl font-bold text-blue-600">98.2%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Critical Errors</p>
            <p className="text-2xl font-bold text-red-600">0</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center"><RefreshCw className="h-8 w-8 animate-spin" /></div>
        ) : (
          algorithms.map((algo) => {
            const StatusIcon = getStatusIcon(algo.status);
            return (
              <Card key={algo.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{algo.name}</CardTitle>
                      <CardDescription>
                        v{algo.version} • {algo.type.toUpperCase()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(algo.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {algo.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-xl font-bold">{algo.accuracy}%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Frequency</p>
                      <p className="text-lg font-semibold capitalize">{algo.config.frequency}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Switch checked={algo.config.enabled} />
                      <Label className="text-sm">Active</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Logs</Button>
                      <Button variant="outline" size="sm">Tune</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
