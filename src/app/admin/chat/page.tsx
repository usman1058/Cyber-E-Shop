'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Users, Clock, Bot, User, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActiveChat {
  id: string;
  sessionId: string;
  customer: string;
  email: string;
  agent?: string;
  status: 'active' | 'bot' | 'waiting';
  duration: string;
  messages: number;
  category?: string;
}

const mockActiveChats: ActiveChat[] = [
  {
    id: '1',
    sessionId: 'CHAT-001',
    customer: 'John Doe',
    email: 'john.doe@email.com',
    agent: 'Sarah Johnson',
    status: 'active',
    duration: '5m',
    messages: 12,
    category: 'Order Issue',
  },
  {
    id: '2',
    sessionId: 'CHAT-002',
    customer: 'Jane Smith',
    email: 'jane.smith@email.com',
    status: 'bot',
    duration: '2m',
    messages: 4,
    category: 'Product Question',
  },
  {
    id: '3',
    sessionId: 'CHAT-003',
    customer: 'Bob Wilson',
    email: 'bob.wilson@email.com',
    status: 'waiting',
    duration: '1m',
    messages: 2,
    category: 'Return Request',
  },
];

const agentStats = [
  { name: 'Sarah Johnson', activeChats: 2, avgResponseTime: '45s', resolvedToday: 28 },
  { name: 'Mike Chen', activeChats: 1, avgResponseTime: '38s', resolvedToday: 32 },
  { name: 'Emily Davis', activeChats: 0, avgResponseTime: '52s', resolvedToday: 24 },
];

export default function AdminChatPage() {
  const [activeChats] = useState<ActiveChat[]>(mockActiveChats);
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      bot: 'secondary',
      waiting: 'destructive',
    };
    const labels: Record<string, string> = {
      active: 'Active',
      bot: 'Bot',
      waiting: 'Waiting',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const filteredChats = activeChats.filter((chat) => {
    return filterStatus === 'all' || chat.status === filterStatus;
  });

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r hidden lg:block">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Cyber Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/chat">
            <Button variant="secondary" className="w-full justify-start">
              Live Chat
            </Button>
          </Link>
          <Link href="/admin/tickets">
            <Button variant="ghost" className="w-full justify-start">
              Tickets
            </Button>
          </Link>
          <Link href="/admin/chatbot">
            <Button variant="ghost" className="w-full justify-start">
              Chatbot Config
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Live Chat Dashboard</h1>
                <p className="text-sm text-muted-foreground">Real-time customer support monitoring</p>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Dashboard */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Overview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Active Chats</span>
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">{activeChats.filter(c => c.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Currently in progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Bot Chats</span>
                  <Bot className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-2xl font-bold">{activeChats.filter(c => c.status === 'bot').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Automated responses</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Waiting</span>
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <p className="text-2xl font-bold">{activeChats.filter(c => c.status === 'waiting').length}</p>
                <p className="text-xs text-muted-foreground mt-1">Needs agent</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Avg Response</span>
                  <Users className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold">45s</p>
                <p className="text-xs text-muted-foreground mt-1">Today's average</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Active Chats */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Active Chats</CardTitle>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1 text-sm border rounded-md bg-background"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="bot">Bot</option>
                    <option value="waiting">Waiting</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredChats.map((chat) => (
                    <div
                      key={chat.id}
                      className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary">
                          {chat.customer.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{chat.customer}</span>
                          {getStatusBadge(chat.status)}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.email}</p>
                        {chat.category && (
                          <p className="text-xs text-muted-foreground mt-1">{chat.category}</p>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium">{chat.duration}</p>
                        <p className="text-xs text-muted-foreground">{chat.messages} msgs</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {chat.agent && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-green-600 text-xs">
                                {chat.agent.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground hidden sm:inline">
                              {chat.agent}
                            </span>
                          </div>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <User className="h-4 w-4 mr-2" />
                              Take Over
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bot className="h-4 w-4 mr-2" />
                              Transfer to Bot
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              End Chat
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredChats.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No active chats</p>
                    <p>All chats are currently handled by agents or completed</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agent Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {agentStats.map((agent, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {agent.activeChats} active chat{agent.activeChats !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant={agent.activeChats > 0 ? 'default' : 'secondary'}>
                          {agent.activeChats > 0 ? 'Online' : 'Idle'}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Avg Response</span>
                          <span className="font-medium">{agent.avgResponseTime}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Resolved Today</span>
                          <span className="font-medium">{agent.resolvedToday}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
