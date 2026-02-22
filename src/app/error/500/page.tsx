'use client';

import Link from 'next/link';
import { AlertCircle, Home, RefreshCw, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ServerErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardContent className="pt-16 pb-16 text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="text-4xl font-bold mb-4">500</h1>
            <h2 className="text-2xl font-semibold mb-4">Server Error</h2>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Something went wrong on our end. Our team has been notified and is working
              to fix the issue. Please try again later.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
              <Button onClick={() => window.location.reload()} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm text-muted-foreground mb-4">Need help?</p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Link href="/help-center">
                  <Button variant="outline" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Help Center
                  </Button>
                </Link>
                <Link href="/support/tickets/new">
                  <Button variant="outline" className="flex-1">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
