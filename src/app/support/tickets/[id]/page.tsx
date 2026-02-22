'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Paperclip, AlertTriangle, Clock, CheckCircle, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PageLayout } from '@/components/layout/page-layout';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  isAdmin: boolean;
  isBot: boolean;
  message: string;
  createdAt: string;
}

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  orderId?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

const mockTicket: Ticket = {
  id: '1',
  ticketId: 'T-2024-001234',
  subject: 'Order #ORD-2024-5678 - Missing Item',
  category: 'order_issue',
  status: 'in_progress',
  priority: 'high',
  orderId: 'ORD-2024-5678',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-16T14:45:00Z',
  assignedTo: 'Sarah Johnson',
};

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user1',
    senderName: 'You',
    isAdmin: false,
    isBot: false,
    message: 'I received my order #ORD-2024-5678 today but item "Wireless Headphones" was missing from the package. The box was sealed but the item was not inside.',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    senderId: 'bot',
    senderName: 'Support Bot',
    isAdmin: false,
    isBot: true,
    message: 'Thank you for contacting us. I\'ve received your ticket #T-2024-001234 regarding the missing item in your order. A support agent will review your case and get back to you within 24 hours.',
    createdAt: '2024-01-15T10:31:00Z',
  },
  {
    id: '3',
    senderId: 'admin1',
    senderName: 'Sarah Johnson',
    isAdmin: true,
    isBot: false,
    message: 'Hello! I\'m sorry to hear about the missing item. I\'ve reviewed your order and checked with our warehouse team. We apologize for the inconvenience. I\'ll be processing a replacement for you right away. You should receive a confirmation email shortly.',
    createdAt: '2024-01-16T14:45:00Z',
  },
];

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();

  const [ticket] = useState<Ticket>(mockTicket);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      open: 'destructive',
      in_progress: 'default',
      resolved: 'secondary',
      closed: 'outline',
    };
    const labels: Record<string, string> = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {labels[status] || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      low: 'outline',
      normal: 'secondary',
      high: 'default',
      urgent: 'destructive',
    };
    return (
      <Badge variant={variants[priority] || 'default'} className="capitalize">
        {priority}
      </Badge>
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);

    try {
      const response = await fetch(`/api/support/tickets/${ticket.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            senderId: 'user1',
            senderName: 'You',
            isAdmin: false,
            isBot: false,
            message: newMessage,
            createdAt: new Date().toISOString(),
          },
        ]);
        setNewMessage('');
        toast({
          title: 'Message Sent',
          description: 'Your message has been sent successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send message. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleEscalate = () => {
    toast({
      title: 'Ticket Escalated',
      description: 'Your ticket has been escalated to a higher priority.',
    });
  };

  return (
    <PageLayout>
      <main className="flex-1 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link href="/support/tickets">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tickets
            </Button>
          </Link>

          {/* Ticket Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-muted-foreground">
                      {ticket.ticketId}
                    </span>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
                  <CardDescription>
                    Created on {new Date(ticket.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  {ticket.status !== 'closed' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Escalate
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Escalate Ticket</DialogTitle>
                          <DialogDescription>
                            This will increase the ticket priority and notify senior support staff. Are you sure?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-3 mt-4">
                          <Button onClick={handleEscalate}>
                            Yes, Escalate
                          </Button>
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogTrigger>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Link href="/support/tickets/new">
                    <Button variant="outline" size="sm">
                      New Ticket
                    </Button>
                  </Link>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="font-medium capitalize">{ticket.category.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Order ID</p>
                  <p className="font-medium">{ticket.orderId || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Assigned To</p>
                  <p className="font-medium">{ticket.assignedTo || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Last Updated</p>
                  <p className="font-medium">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Alert for open tickets */}
          {ticket.status === 'open' && (
            <Alert className="mb-6">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                This ticket is currently open. A support agent will respond within 24-48 hours.
              </AlertDescription>
            </Alert>
          )}

          {ticket.status === 'in_progress' && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                This ticket is being actively worked on by {ticket.assignedTo || 'our support team'}.
              </AlertDescription>
            </Alert>
          )}

          {/* Messages */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={message.isAdmin ? 'bg-primary' : 'bg-muted'}>
                        {message.isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>

                    <div className={`flex-1 max-w-[80%] ${message.isAdmin ? '' : 'text-right'}`}>
                      <div
                        className={`inline-block rounded-lg p-4 ${message.isAdmin
                            ? 'bg-muted text-left'
                            : 'bg-primary text-primary-foreground text-left'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">
                            {message.senderName}
                          </span>
                          {message.isAdmin && (
                            <Badge variant="secondary" className="text-xs">Support</Badge>
                          )}
                          {message.isBot && (
                            <Badge variant="outline" className="text-xs">Bot</Badge>
                          )}
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Message Form */}
          {ticket.status !== 'closed' && (
            <Card>
              <CardHeader>
                <CardTitle>Add Follow-up Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your message here..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach Files
                    </Button>
                    <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}>
                      <Send className="h-4 w-4 mr-2" />
                      {isSending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <Link href="/support/chat">
                  <Button variant="outline" className="w-full">
                    Start Live Chat
                  </Button>
                </Link>
                <Link href="/help-center">
                  <Button variant="outline" className="w-full">
                    Browse FAQs
                  </Button>
                </Link>
                <Link href="/support/tickets/new">
                  <Button variant="outline" className="w-full">
                    Create New Ticket
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </PageLayout>
  );
}
