'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FlaskConical,
  Play,
  Pause,
  TrendingUp,
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  type: 'ui' | 'pricing' | 'content' | 'feature';
  startDate: string;
  endDate?: string;
  variants: {
    id: string;
    name: string;
    traffic: number;
    conversionRate: number;
    participants: number;
  }[];
  winner?: string;
  significance: number;
  created: string;
}

export default function ABTestingDashboardPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiments = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockExperiments: Experiment[] = [
          {
            id: 'exp-1',
            name: 'Homepage CTA Button Color',
            description: 'Test different button colors for homepage CTA',
            status: 'running',
            type: 'ui',
            startDate: '2025-01-10',
            variants: [
              { id: 'v1', name: 'Control (Blue)', traffic: 50, conversionRate: 3.2, participants: 12500 },
              { id: 'v2', name: 'Variant (Green)', traffic: 50, conversionRate: 3.8, participants: 12500 },
            ],
            significance: 95,
            created: '2025-01-08',
          },
          {
            id: 'exp-2',
            name: 'Product Page Layout',
            description: 'Compare different product page layouts',
            status: 'running',
            type: 'ui',
            startDate: '2025-01-12',
            variants: [
              { id: 'v1', name: 'Standard', traffic: 33, conversionRate: 2.9, participants: 8300 },
              { id: 'v2', name: 'Grid View', traffic: 33, conversionRate: 3.4, participants: 8300 },
              { id: 'v3', name: 'Card Layout', traffic: 34, conversionRate: 3.1, participants: 8600 },
            ],
            significance: 87,
            created: '2025-01-10',
          },
          {
            id: 'exp-3',
            name: 'Free Shipping Threshold',
            description: 'Test different free shipping thresholds',
            status: 'completed',
            type: 'pricing',
            startDate: '2024-12-15',
            endDate: '2025-01-15',
            variants: [
              { id: 'v1', name: '$50 Threshold', traffic: 50, conversionRate: 4.1, participants: 18000 },
              { id: 'v2', name: '$75 Threshold', traffic: 50, conversionRate: 3.8, participants: 18000 },
            ],
            winner: 'v1',
            significance: 98,
            created: '2024-12-10',
          },
        ];

        setExperiments(mockExperiments);
      } catch (error) {
        console.error('Failed to fetch experiments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiments();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-500 hover:bg-gray-600',
      running: 'bg-green-500 hover:bg-green-600',
      paused: 'bg-yellow-500 hover:bg-yellow-600',
      completed: 'bg-blue-500 hover:bg-blue-600',
    };
    return colors[status] || 'bg-gray-500';
  };

  const toggleExperiment = (id: string) => {
    setExperiments(experiments.map(exp =>
      exp.id === id
        ? { ...exp, status: exp.status === 'running' ? 'paused' : 'running' as any }
        : exp
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">A/B Testing</h1>
          <p className="text-sm text-muted-foreground">Experiment and optimize store performance</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Experiment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Experiment</DialogTitle>
              <DialogDescription>Define your test parameters</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Experiment Name</Label>
                <Input placeholder="e.g., Checkout Workflow" />
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ui">UI/UX</SelectItem>
                    <SelectItem value="pricing">Pricing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Running</p>
            <p className="text-2xl font-bold">{experiments.filter(e => e.status === 'running').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold">{experiments.filter(e => e.status === 'completed').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Participants</p>
            <p className="text-2xl font-bold">145.2k</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground">Avg. Lift</p>
            <p className="text-2xl font-bold text-green-600">+8.4%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Experiments List</TabsTrigger>
          <TabsTrigger value="results">Performance Results</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            experiments.map((exp) => (
              <Card key={exp.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold">{exp.name}</h3>
                        <Badge className={getStatusColor(exp.status)}>{exp.status.toUpperCase()}</Badge>
                        <Badge variant="outline">{exp.type.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        {exp.variants.map((v) => (
                          <div key={v.id} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{v.name}</span>
                              <span className="font-bold">{v.conversionRate}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full">
                              <div className="h-1.5 bg-primary rounded-full transition-all" style={{ width: `${(v.conversionRate / 5) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleExperiment(exp.id)}>
                        {exp.status === 'running' ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {exp.status === 'running' ? 'Pause' : 'Start'}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader><CardTitle>Historical Performance</CardTitle></CardHeader>
            <CardContent className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground italic">Experiment results analytics placeholder</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
