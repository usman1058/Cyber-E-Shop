'use client';

import { Bot, MessageSquare, Settings, Zap, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function AdminChatbotPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Chatbot</h1>
          <p className="text-sm text-muted-foreground">Configure AI chatbot and automated responses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Moderation
          </Button>
          <Button>
            <Sparkles className="h-4 w-4 mr-2" />
            Train AI
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Core Settings</CardTitle>
            <CardDescription>Primary configuration for the support bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Enable Chatbot</Label>
                <p className="text-sm text-muted-foreground">Show the chat widget to customers</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/40 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">AI Smart Response</Label>
                <p className="text-sm text-muted-foreground">Use GPT-4 to handle complex queries</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Active Capabilities</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Badge className="bg-primary/10 text-primary p-2 h-auto"><MessageSquare className="h-4 w-4" /></Badge>
                  <span className="text-sm font-medium">Order Tracking</span>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Badge className="bg-primary/10 text-primary p-2 h-auto"><Zap className="h-4 w-4" /></Badge>
                  <span className="text-sm font-medium">Auto-Refunds</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bot Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">99.9% Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Resolution Rate</span>
                <span className="text-lg font-bold">78%</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Tuning
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs opacity-90 mb-4">Currently using specialized Cyber-eShop LLM-v2 for high accuracy support.</p>
              <Button variant="secondary" size="sm" className="w-full">Upgrade Model</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
