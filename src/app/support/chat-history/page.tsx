'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Calendar, Filter, Trash2, MessageCircle, Bot, User, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { PageLayout } from '@/components/layout/page-layout';

interface ChatSession {
  id: string;
  sessionId: string;
  status: 'active' | 'closed' | 'transferred';
  topic?: string;
  ticketId?: string;
  isBot: boolean;
  assignedTo?: string;
  createdAt: string;
  lastMessageAt: string;
  messageCount: number;
}

const mockChats: ChatSession[] = [
  {
    id: '1',
    sessionId: 'CHAT-2024-001234',
    status: 'closed',
    topic: 'Order Tracking Issue',
    ticketId: 'T-2024-001234',
    isBot: false,
    assignedTo: 'Sarah Johnson',
    createdAt: '2024-01-15T10:30:00Z',
    lastMessageAt: '2024-01-15T11:45:00Z',
    messageCount: 12,
  },
  {
    id: '2',
    sessionId: 'CHAT-2024-001233',
    status: 'closed',
    topic: 'Product Information',
    isBot: true,
    createdAt: '2024-01-14T14:20:00Z',
    lastMessageAt: '2024-01-14T14:35:00Z',
    messageCount: 8,
  },
  {
    id: '3',
    sessionId: 'CHAT-2024-001230',
    status: 'closed',
    topic: 'Return Request',
    ticketId: 'T-2024-001230',
    isBot: false,
    assignedTo: 'Mike Chen',
    createdAt: '2024-01-10T09:15:00Z',
    lastMessageAt: '2024-01-10T09:50:00Z',
    messageCount: 15,
  },
  {
    id: '4',
    sessionId: 'CHAT-2024-001228',
    status: 'transferred',
    topic: 'Payment Issue',
    isBot: false,
    assignedTo: 'Emily Davis',
    createdAt: '2024-01-08T16:00:00Z',
    lastMessageAt: '2024-01-08T16:20:00Z',
    messageCount: 6,
  },
  {
    id: '5',
    sessionId: 'CHAT-2024-001225',
    status: 'closed',
    topic: 'Shipping Inquiry',
    isBot: true,
    createdAt: '2024-01-05T11:30:00Z',
    lastMessageAt: '2024-01-05T11:45:00Z',
    messageCount: 5,
  },
];

export default function ChatHistoryPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [chats, setChats] = useState<ChatSession[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [deletingChat, setDeletingChat] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      active: 'default',
      closed: 'secondary',
      transferred: 'outline',
    };
    const labels: Record<string, string> = {
      active: 'Active',
      closed: 'Closed',
      transferred: 'Transferred',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="capitalize">
        {labels[status] || status}
      </Badge>
    );
  };

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      searchQuery === '' ||
      chat.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || chat.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== 'all') {
      const chatDate = new Date(chat.createdAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - chatDate.getTime()) / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case 'today':
          matchesDate = diffDays === 0;
          break;
        case 'week':
          matchesDate = diffDays <= 7;
          break;
        case 'month':
          matchesDate = diffDays <= 30;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDeleteChat = async (chatId: string) => {
    setDeletingChat(chatId);

    try {
      const response = await fetch(`/api/support/chat/${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        toast({
          title: 'Chat Deleted',
          description: 'Chat session has been deleted successfully.',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete chat. Please try again.',
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
      setDeletingChat(null);
      setSelectedChat(null);
    }
  };

  const handleDownloadTranscript = (chat: ChatSession) => {
    toast({
      title: 'Transcript Downloaded',
      description: `Chat transcript for ${chat.sessionId} has been downloaded.`,
    });
  };

  return (
    <PageLayout>
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Chat History</h1>
              <p className="text-muted-foreground">
                View your past chat conversations with support
              </p>
            </div>
            <Link href="/support/chat">
              <Button>
                <MessageCircle className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by topic, ticket ID, or agent..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>

                {/* Date Filter */}
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Chat List */}
          {filteredChats.length > 0 ? (
            <div className="space-y-4">
              {filteredChats.map((chat) => (
                <Card
                  key={chat.id}
                  className="hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-mono text-muted-foreground">
                            {chat.sessionId}
                          </span>
                          {getStatusBadge(chat.status)}
                          {chat.ticketId && (
                            <Link href={`/support/tickets/${chat.id}`}>
                              <Badge variant="outline" className="text-xs cursor-pointer hover:bg-accent">
                                {chat.ticketId}
                              </Badge>
                            </Link>
                          )}
                        </div>

                        {chat.topic && (
                          <h3 className="font-semibold mb-2">{chat.topic}</h3>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className={chat.isBot ? 'bg-muted' : 'bg-primary'}>
                              {chat.isBot ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                            </AvatarFallback>
                          </Avatar>
                          <span>
                            {chat.isBot ? 'AI Assistant' : chat.assignedTo || 'Support Agent'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end gap-2 min-w-[150px]">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(chat.lastMessageAt)}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {chat.messageCount} messages
                        </span>

                        <div className="flex gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadTranscript(chat)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedChat(chat)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Chat</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete this chat session? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-3 mt-4">
                                <Button
                                  variant="destructive"
                                  onClick={() => selectedChat && handleDeleteChat(selectedChat.id)}
                                  disabled={deletingChat === selectedChat?.id}
                                >
                                  {deletingChat === selectedChat?.id ? 'Deleting...' : 'Delete'}
                                </Button>
                                <DialogTrigger asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogTrigger>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Chats Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your filters or search terms'
                    : 'You haven\'t had any chat conversations yet'}
                </p>
                <Link href="/support/chat">
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Your First Chat
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Quick Links */}
          {chats.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Link href="/support/chat">
                    <Button variant="outline" className="w-full">
                      Start Live Chat
                    </Button>
                  </Link>
                  <Link href="/support/tickets">
                    <Button variant="outline" className="w-full">
                      View Tickets
                    </Button>
                  </Link>
                  <Link href="/help-center">
                    <Button variant="outline" className="w-full">
                      Browse FAQs
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
