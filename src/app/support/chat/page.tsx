'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, Paperclip, MoreVertical, X, Bot, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PageLayout } from '@/components/layout/page-layout';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  isAdmin: boolean;
  isBot: boolean;
  message: string;
  createdAt: Date;
}

const mockBotResponses = [
  "Hello! Welcome to Cyber Shop support. How can I help you today?",
  "I understand your concern. Let me help you with that.",
  "I can assist you with order tracking, product information, returns, and more.",
  "For detailed information about our policies, please visit our Help Center.",
  "I'd be happy to help you track your order. Could you please provide your order number?",
  "Our return policy allows returns within 30 days of purchase. Would you like me to help you initiate a return?",
];

export default function LiveChatPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'bot',
      senderName: 'Support Bot',
      isAdmin: false,
      isBot: true,
      message: mockBotResponses[0],
      createdAt: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [agentName, setAgentName] = useState<string | null>(null);
  const [chatTranscriptEmail, setChatTranscriptEmail] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('order') && lowerMessage.includes('track')) {
      return "I can help you track your order! Please provide your order number, or you can visit our Track Order page for more details.";
    } else if (lowerMessage.includes('return')) {
      return "Our return policy allows returns within 30 days of purchase. You can initiate a return from your account under Order History or contact our support team for assistance.";
    } else if (lowerMessage.includes('refund')) {
      return "Refunds are typically processed within 5-7 business days after we receive your return. The time to see the refund in your account depends on your payment method.";
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('card')) {
      return "We accept Credit/Debit Cards (Visa, MasterCard, American Express), PayPal, and Cash on Delivery (COD). All payments are processed securely.";
    } else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      return "We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Next Day Delivery. Free shipping is available on orders over $50.";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with today?";
    } else if (lowerMessage.includes('human') || lowerMessage.includes('agent') || lowerMessage.includes('talk')) {
      return "I'm happy to help! If you'd like to speak with a human agent, I can transfer you. They're available 9AM-6PM EST. Would you like me to do that?";
    } else if (lowerMessage.includes('yes') && agentName) {
      return "I'll transfer you to a human agent right away. Please wait a moment...";
    }

    return mockBotResponses[Math.floor(Math.random() * mockBotResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      isAdmin: false,
      isBot: false,
      message: inputMessage,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: agentName ? 'agent' : 'bot',
        senderName: agentName || 'Support Bot',
        isAdmin: !!agentName,
        isBot: !agentName,
        message: agentName
          ? "Thanks for your patience. I'm reviewing your request and will help you right away."
          : generateBotResponse(userMessage.message),
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendTranscript = () => {
    if (!chatTranscriptEmail) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Transcript Sent',
      description: `Chat transcript has been sent to ${chatTranscriptEmail}`,
    });

    setChatTranscriptEmail('');
  };

  const handleEndChat = () => {
    toast({
      title: 'Chat Ended',
      description: 'Thank you for chatting with us. You can start a new chat anytime.',
    });
  };

  const requestHumanAgent = () => {
    setIsTyping(true);
    setTimeout(() => {
      setAgentName('Sarah Johnson');
      setIsTyping(false);

      const agentMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: 'agent',
        senderName: 'Sarah Johnson',
        isAdmin: true,
        isBot: false,
        message: "Hi there! This is Sarah from our support team. I've taken over your chat. How can I assist you today?",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    }, 2000);

    toast({
      title: 'Agent Requested',
      description: 'A human agent will join the chat shortly.',
    });
  };

  return (
    <PageLayout>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/help-center">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Help Center
              </Button>
            </Link>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={agentName ? 'bg-primary' : 'bg-muted'}>
                        {agentName ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {agentName || 'Support Bot'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={isConnected ? 'default' : 'destructive'} className="text-xs">
                          {isConnected ? 'Online' : 'Offline'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {agentName ? 'Human Agent' : 'AI Assistant'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!agentName && (
                        <DropdownMenuItem onClick={requestHumanAgent}>
                          Request Human Agent
                        </DropdownMenuItem>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            Send Transcript
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Send Chat Transcript</DialogTitle>
                            <DialogDescription>
                              Enter your email address to receive a copy of this conversation.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={chatTranscriptEmail}
                              onChange={(e) => setChatTranscriptEmail(e.target.value)}
                            />
                            <Button onClick={handleSendTranscript} className="w-full">
                              <Mail className="h-4 w-4 mr-2" />
                              Send Transcript
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <DropdownMenuItem onClick={handleEndChat}>
                        End Chat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <Separator />

              {/* Chat Messages */}
              <CardContent className="p-4 h-[500px] overflow-y-auto">
                <div className="space-y-4">
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

                      <div className={`flex-1 max-w-[75%] ${message.isAdmin ? '' : 'text-right'}`}>
                        <div
                          className={`inline-block rounded-lg p-4 ${
                            message.isAdmin
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
                          {message.createdAt.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted">
                          {agentName ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-4">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" />
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                          <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <Separator />

              {/* Chat Input */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={!isConnected}
                    />
                  </div>
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || !isConnected}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {agentName
                    ? 'You are chatting with a human agent'
                    : 'Powered by AI. Type "human" to connect with an agent.'}
                </p>
              </div>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/support/tickets/new">
              <Button variant="outline" className="w-full text-sm">
                Create Ticket
              </Button>
            </Link>
            <Link href="/help-center">
              <Button variant="outline" className="w-full text-sm">
                Browse FAQs
              </Button>
            </Link>
            <Link href="/track-order">
              <Button variant="outline" className="w-full text-sm">
                Track Order
              </Button>
            </Link>
            <Link href="/support/chat-history">
              <Button variant="outline" className="w-full text-sm">
                Chat History
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
