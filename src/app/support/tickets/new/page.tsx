'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PageLayout } from '@/components/layout/page-layout';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export default function NewTicketPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    orderId: '',
    productId: '',
    message: '',
    email: '',
    name: '',
  });

  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: FileAttachment[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category || !formData.subject || !formData.message) {
      toast({
        title: 'Missing Required Fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          attachments,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Ticket Created',
          description: `Your support ticket ${result.ticketId} has been created successfully.`,
        });
        router.push('/support/tickets');
      } else {
        toast({
          title: 'Error',
          description: result.message || 'Failed to create ticket. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Link href="/help-center">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help Center
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
              <CardDescription>
                Fill out the form below and our support team will get back to you within 24-48 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order_issue">Order Issue</SelectItem>
                      <SelectItem value="product_question">Product Question</SelectItem>
                      <SelectItem value="refund">Refund Request</SelectItem>
                      <SelectItem value="return">Return Request</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="payment">Payment Issue</SelectItem>
                      <SelectItem value="shipping">Shipping Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    Subject <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                {/* Order ID (Optional) */}
                {(formData.category === 'order_issue' ||
                  formData.category === 'refund' ||
                  formData.category === 'return' ||
                  formData.category === 'shipping') && (
                  <div className="space-y-2">
                    <Label htmlFor="orderId">Order ID (Optional)</Label>
                    <Input
                      id="orderId"
                      placeholder="Enter your order number"
                      value={formData.orderId}
                      onChange={(e) => handleInputChange('orderId', e.target.value)}
                    />
                  </div>
                )}

                {/* Product ID (Optional) */}
                {formData.category === 'product_question' && (
                  <div className="space-y-2">
                    <Label htmlFor="productId">Product ID (Optional)</Label>
                    <Input
                      id="productId"
                      placeholder="Enter the product ID or name"
                      value={formData.productId}
                      onChange={(e) => handleInputChange('productId', e.target.value)}
                    />
                  </div>
                )}

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your issue in detail..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label>Attachments (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      id="attachments"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <label htmlFor="attachments" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Maximum file size: 5MB. Allowed: Images, PDF, DOC, DOCX
                      </p>
                    </label>
                  </div>

                  {/* Attachment List */}
                  {attachments.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {attachments.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Paperclip className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAttachment(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Info (for guests) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? 'Creating Ticket...' : 'Create Ticket'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Alternative Contact Methods */}
          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Other Ways to Get Help</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Link href="/support/chat">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="font-medium">Live Chat</span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      Available 9AM-6PM EST
                    </span>
                  </Button>
                </Link>
                <Link href="/help-center">
                  <Button variant="outline" className="w-full justify-start">
                    <span className="font-medium">Browse FAQs</span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      Find quick answers
                    </span>
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
