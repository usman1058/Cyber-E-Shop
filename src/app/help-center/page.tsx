'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MessageCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { PageLayout } from '@/components/layout/page-layout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    category: 'orders',
    question: 'How can I track my order?',
    answer: 'You can track your order by visiting the Order Tracking page and entering your order number or tracking number. Alternatively, you can find tracking information in your account under "Order History" or check the email confirmation you received after placing your order.',
  },
  {
    id: '2',
    category: 'orders',
    question: 'What should I do if I haven\'t received my order?',
    answer: 'If your order hasn\'t arrived by the estimated delivery date, please check the tracking information first. If there are no updates or if the status shows delivered but you haven\'t received it, please contact our support team with your order number, and we\'ll help resolve the issue.',
  },
  {
    id: '3',
    category: 'orders',
    question: 'Can I modify my order after placing it?',
    answer: 'Orders can be modified within 1 hour of placement if they haven\'t been processed yet. After that time, you may need to cancel and place a new order. Contact our support team as soon as possible with your order number.',
  },
  {
    id: '4',
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy for most items. Products must be unused, in original packaging, and accompanied by proof of purchase. Certain items like personalized products, hygiene items, and final sale items cannot be returned. Please visit our Returns page for detailed information.',
  },
  {
    id: '5',
    category: 'returns',
    question: 'How do I initiate a return?',
    answer: 'To initiate a return, go to your account, find the order in "Order History", and click "Return Item" or contact our support team. You\'ll receive a return authorization number and instructions on how to ship the item back. Once received and inspected, we\'ll process your refund.',
  },
  {
    id: '6',
    category: 'returns',
    question: 'How long does it take to receive a refund?',
    answer: 'Refunds are typically processed within 5-7 business days after we receive and inspect your return. The time it takes for the refund to appear in your account depends on your payment method. Credit card refunds may take 3-5 additional business days to appear on your statement.',
  },
  {
    id: '7',
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Credit/Debit Cards (Visa, MasterCard, American Express), PayPal, and Cash on Delivery (COD) in eligible areas. We are continuously working to add more payment options for your convenience.',
  },
  {
    id: '8',
    category: 'payment',
    question: 'Is my payment information secure?',
    answer: 'Yes, we take security very seriously. All payments are processed through secure, encrypted connections. We comply with PCI DSS standards and never store your complete credit card information on our servers.',
  },
  {
    id: '9',
    category: 'payment',
    question: 'Can I use multiple payment methods for one order?',
    answer: 'Currently, we support one payment method per order. However, you can use gift cards or promotional codes in combination with your chosen payment method during checkout.',
  },
  {
    id: '10',
    category: 'shipping',
    question: 'What are your shipping options and delivery times?',
    answer: 'We offer Standard Shipping (5-7 business days), Express Shipping (2-3 business days), and Next Day Delivery in select areas. Shipping times may vary based on your location and product availability. Free shipping is available on orders over $50.',
  },
  {
    id: '11',
    category: 'shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship within the United States. We are working on expanding our international shipping capabilities. Sign up for our newsletter to receive updates when we start shipping to new regions.',
  },
  {
    id: '12',
    category: 'shipping',
    question: 'Can I change my shipping address after placing an order?',
    answer: 'Address changes are possible only if the order hasn\'t been shipped yet. Please contact our support team immediately with your order number. Once an order has been shipped, we cannot redirect it to a different address.',
  },
  {
    id: '13',
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Click the "Sign In" button in the top right corner of our website, then select "Create Account". Fill in your email, create a password, and provide your basic information. You can also sign up during the checkout process.',
  },
  {
    id: '14',
    category: 'account',
    question: 'I forgot my password. How can I reset it?',
    answer: 'Click "Sign In" and then "Forgot Password". Enter your email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password. The link expires after 24 hours for security.',
  },
  {
    id: '15',
    category: 'product',
    question: 'How can I check if a product is in stock?',
    answer: 'Product availability is shown on each product page. If an item is out of stock, you can sign up for stock notifications to be alerted when it becomes available again. Low stock items will show a warning message.',
  },
  {
    id: '16',
    category: 'product',
    question: 'Do you offer warranties on products?',
    answer: 'Yes, most products come with manufacturer warranties. Warranty information is displayed on product pages. Additionally, we offer a 90-day Cyber Shop guarantee on eligible items. Please visit our Warranty page for detailed information.',
  },
];

const categories = [
  { id: 'all', name: 'All Topics' },
  { id: 'orders', name: 'Orders' },
  { id: 'returns', name: 'Returns & Refunds' },
  { id: 'payment', name: 'Payment' },
  { id: 'shipping', name: 'Shipping' },
  { id: 'account', name: 'Account' },
  { id: 'product', name: 'Product Info' },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to common questions or get in touch with our support team
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <Link href="/support/tickets/new">
                <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>Create Support Ticket</span>
                </Button>
              </Link>
              <Link href="/support/chat">
                <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
                  <MessageCircle className="h-6 w-6" />
                  <span>Live Chat</span>
                </Button>
              </Link>
              <Link href="/track-order">
                <Button variant="outline" className="w-full h-auto py-6 flex-col gap-2">
                  <HelpCircle className="h-6 w-6" />
                  <span>Track Order</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* FAQ Results */}
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left hover:no-underline">
                            <div className="flex items-start gap-3 flex-1">
                              <Badge variant="secondary" className="capitalize mt-1">
                                {faq.category}
                              </Badge>
                              <span className="flex-1">{faq.question}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">
                    No results found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search terms or browse different categories
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Still Need Help Section */}
        <section className="bg-muted/50 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground mb-8">
              Our support team is here to assist you with any questions or issues
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/support/tickets/new">
                <Button size="lg" className="w-full">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Submit a Support Ticket
                </Button>
              </Link>
              <Link href="/support/chat">
                <Button size="lg" variant="outline" className="w-full">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Start Live Chat
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
