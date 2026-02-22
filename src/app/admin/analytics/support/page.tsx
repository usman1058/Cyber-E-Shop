'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Clock, Users, TrendingUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const supportData = {
  totalTickets: 1568,
  openTickets: 45,
  closedTickets: 1423,
  avgResponseTime: 45,
  slaCompliance: 95,
  ticketsByCategory: [
    { category: 'Order Issue', count: 345, avgResponse: '38min' },
    { category: 'Product Question', count: 456, avgResponse: '52min' },
    { category: 'Refund', count: 234, avgResponse: '41min' },
    { category: 'Technical', count: 289, avgResponse: '35min' },
    { category: 'Other', count: 244, avgResponse: '44min' },
  ],
};

const agentStats = [
  { name: 'Sarah Johnson', totalTickets: 289, avgResponse: '42min', slaRate: '98%' },
  { name: 'Mike Chen', totalTickets: 256, avgResponse: '38min', slaRate: '96%' },
  { name: 'Emily Davis', totalTickets: 198, avgResponse: '51min', slaRate: '94%' },
];

export default function SupportAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30days');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Analytics</h1>
          <p className="text-sm text-muted-foreground">Ticket performance and metrics</p>
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
              <span className="text-sm font-medium">Total Tickets</span>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{supportData.totalTickets}</p>
            <Badge variant="secondary" className="mt-2">{supportData.closedTickets} closed</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Open Tickets</span>
              <Clock className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">{supportData.openTickets}</p>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Avg Response</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold">{supportData.avgResponseTime}m</p>
            <p className="text-xs text-muted-foreground">All tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">SLA Compliance</span>
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold">{supportData.slaCompliance}%</p>
            <p className="text-xs text-muted-foreground">Target: 95%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {supportData.ticketsByCategory.map((cat, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{cat.category}</p>
                    <p className="text-sm text-muted-foreground">{cat.count} tickets</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{cat.avgResponse} avg</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Agents</CardTitle>
            <CardDescription>Best performing support team members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentStats.map((agent, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{agent.name}</span>
                    <Badge variant="secondary">Online</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{agent.totalTickets} tickets</span>
                    <span>• {agent.avgResponse} avg</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${agent.slaRate}%` }} />
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
