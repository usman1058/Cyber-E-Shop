'use client';

import { useState } from 'react';
import { MessageSquare, Bot, Users, TrendingUp, Download, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data
const chatData = {
  totalChats: 4567,
  botSolved: 68,
  avgDuration: 4.5,
  satisfactionScore: 4.8,
  categories: [
    { name: 'Order Status', percentage: 45 },
    { name: 'Product Inquiry', percentage: 30 },
    { name: 'Returns', percentage: 15 },
    { name: 'Technical Support', percentage: 10 },
  ]
};

const agentPerformance = [
  { name: 'Sarah Johnson', totalChats: 245, rating: 4.5, image: '/avatars/01.png' },
  { name: 'Mike Chen', totalChats: 198, rating: 4.8, image: '/avatars/02.png' },
  { name: 'Emily Davis', totalChats: 267, rating: 4.2, image: '/avatars/03.png' },
];

export default function ChatAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat Analytics</h1>
          <p className="text-sm text-muted-foreground">Customer chat and AI bot performance metrics</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Total Chats</span>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{chatData.totalChats}</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Bot Solved</span>
              <Bot className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{chatData.botSolved}%</p>
            <p className="text-xs text-muted-foreground mt-1">AI resolution rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Avg Duration</span>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{chatData.avgDuration}m</p>
            <p className="text-xs text-muted-foreground mt-1">Per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Satisfaction</span>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold">{chatData.satisfactionScore}/5</p>
            <p className="text-xs text-muted-foreground mt-1">Customer rating</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chat Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chatData.categories.map((cat, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{cat.name}</span>
                    <span className="text-sm text-muted-foreground">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Chat Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentPerformance.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.totalChats} chats</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{agent.rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}