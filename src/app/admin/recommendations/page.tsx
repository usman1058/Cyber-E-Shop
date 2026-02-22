'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  TrendingUp,
  Users,
  Target,
  RefreshCw,
} from 'lucide-react';

export default function RecommendationEnginePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const strategies = [
    { name: 'Collaborative Filtering', type: 'AI Model', performance: '92%', weight: 45, active: true },
    { name: 'Frequently Bought Together', type: 'Behavioral', performance: '88%', weight: 35, active: true },
    { name: 'New Arrivals Push', type: 'Static', performance: '75%', weight: 20, active: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
          <p className="text-sm text-muted-foreground">Optimize item discovery using machine learning models</p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retrain Models
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">CTR</span>
              <Target className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">8.4%</p>
            <Badge className="mt-1 bg-green-500/10 text-green-600 border-green-200">+1.2%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Conv. Rate</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">3.1%</p>
            <Badge className="mt-1 bg-green-500/10 text-green-600 border-green-200">+0.5%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Coverage</span>
              <Sparkles className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-bold">98.5%</p>
            <p className="text-xs text-muted-foreground mt-1">Catalog visibility</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Daily Queries</span>
              <Users className="h-4 w-4 text-orange-500" />
            </div>
            <p className="text-2xl font-bold">45.2k</p>
            <p className="text-xs text-muted-foreground mt-1">Active requests</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="strategies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="strategies">Mixing Strategies</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Weight Distribution</CardTitle>
              <CardDescription>Determine how much various algorithms influence the final recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {loading ? (
                <div className="py-12 text-center">Loading strategies...</div>
              ) : (
                strategies.map((strategy, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{strategy.name}</span>
                          <Badge variant="secondary" className="text-[10px]">{strategy.type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">Performance: {strategy.performance} precision</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-primary">{strategy.weight}%</span>
                        <Switch checked={strategy.active} />
                      </div>
                    </div>
                    <Slider defaultValue={[strategy.weight]} max={100} step={5} disabled={!strategy.active} />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="placements">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Homepage Reel</CardTitle></CardHeader>
              <CardContent className="p-4 bg-muted/50 rounded-lg text-center text-sm italic">
                Currently showing at position #2
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Post-Purchase Suggest</CardTitle></CardHeader>
              <CardContent className="p-4 bg-muted/50 rounded-lg text-center text-sm italic">
                Active on checkout-success page
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
