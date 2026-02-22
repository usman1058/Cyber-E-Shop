'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AdminTicketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [message, setMessage] = useState('');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: 'destructive',
      in_progress: 'default',
      resolved: 'secondary',
      closed: 'outline',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Ticket</h1>
          <p className="text-sm text-muted-foreground">Detailed view and conversation</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">T-2024-001234</CardTitle>
              <CardDescription>Order #ORD-5678 - Missing Item</CardDescription>
            </div>
            <div className="flex gap-2">
              {getStatusBadge('in_progress')}
              <Badge variant="destructive">High Priority</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Ticket Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-muted/40 p-4 rounded-lg border">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Category</p>
                <p className="font-semibold">Order Issue</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Customer</p>
                <p className="font-semibold">John Doe</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="font-semibold text-sm">john.doe@email.com</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Created</p>
                <p className="font-semibold">Jan 15, 2024</p>
              </div>
            </div>

            {/* Conversation */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Conversation History</h3>

              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted-foreground text-white">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none border">
                    <p className="text-sm font-bold mb-1">John Doe</p>
                    <p className="text-sm leading-relaxed">I received my order #ORD-5678 today but item "Wireless Headphones" was missing from the package. The box was sealed but the item was not inside.</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 px-1">Jan 15, 2024 • 10:30 AM</p>
                </div>
              </div>

              <div className="flex gap-4 flex-row-reverse">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">AJ</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-primary/10 p-4 rounded-2xl rounded-tr-none border border-primary/20">
                    <p className="text-sm font-bold mb-1 text-primary">Sarah Johnson (Support Specialist)</p>
                    <p className="text-sm leading-relaxed">Hello John! I'm sorry to hear about the missing item. I've reviewed your order and checked with the warehouse team. We apologize for the inconvenience. I'll be processing a replacement for you right away.</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1 px-1 text-right">Jan 16, 2024 • 2:45 PM</p>
                </div>
              </div>
            </div>

            {/* Reply Form */}
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-bold">Add Response</h3>
              <Textarea
                placeholder="Type your official response here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[150px] bg-background"
              />
              <div className="flex flex-wrap gap-3">
                <Button className="font-bold">
                  Send Response
                </Button>
                <Button variant="outline">Close Ticket</Button>
                <Button variant="outline" className="text-destructive hover:bg-destructive/10">Escalate to Manager</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
