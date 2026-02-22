'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  Target,
  Plus,
  Edit,
  Trash2,
  Zap,
} from 'lucide-react';

interface PricingRule {
  id: string;
  name: string;
  type: 'automatic' | 'manual' | 'competition';
  status: 'active' | 'paused';
  condition: string;
  adjustment: string;
  affectedProducts: number;
}

export default function DynamicPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockRules: PricingRule[] = [
          {
            id: 'rule-1',
            name: 'Competitor Match',
            type: 'competition',
            status: 'active',
            condition: 'Price < Competitor',
            adjustment: '-5%',
            affectedProducts: 234,
          },
          {
            id: 'rule-2',
            name: 'Low Stock Surcharge',
            type: 'automatic',
            status: 'active',
            condition: 'Stock < 5',
            adjustment: '+10%',
            affectedProducts: 45,
          },
        ];
        setRules(mockRules);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Pricing</h1>
          <p className="text-sm text-muted-foreground">Automated price adjustments based on demand and competition</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Rules</span>
              <Zap className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{rules.filter(r => r.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Applied To</span>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">279 Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Revenue Lift</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">+12.4%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Strategy Rules</CardTitle>
          <CardDescription>Rules currently controlling your store prices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/40 rounded-lg border gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{rule.name}</h3>
                    <Badge variant="outline" className="capitalize">{rule.type}</Badge>
                    <Badge className={rule.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}>{rule.status.toUpperCase()}</Badge>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span><span className="font-medium text-primary">Condition:</span> {rule.condition}</span>
                    <span><span className="font-medium text-primary">Adjustment:</span> {rule.adjustment}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 mr-4">
                    <Switch checked={rule.status === 'active'} />
                    <Label className="text-sm">Active</Label>
                  </div>
                  <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
