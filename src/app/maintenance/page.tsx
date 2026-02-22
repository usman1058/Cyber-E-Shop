'use client';

import Link from 'next/link';
import { Construction, Home, Mail, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardContent className="pt-16 pb-16 text-center">
            <div className="mx-auto w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Construction className="h-10 w-10 text-amber-600" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Under Maintenance</h1>

            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're performing scheduled maintenance to improve your experience. We'll be back
              shortly. Thank you for your patience!
            </p>

            <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Expected Back Online</p>
                  <p className="text-lg font-semibold">2:00 PM EST</p>
                </div>
              </div>
              <div className="h-2 bg-primary/20 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-1/3 animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col gap-4 max-w-md mx-auto mb-8">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Homepage
                </Button>
              </Link>
              <Link href="/support/tickets/new">
                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Stay connected with us:
              </p>
              <div className="flex justify-center gap-4 mt-4">
                {['Blog', 'Twitter', 'Instagram'].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {social}
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
