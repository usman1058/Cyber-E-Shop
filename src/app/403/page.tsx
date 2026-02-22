'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldX, Home, Mail, ArrowLeft } from 'lucide-react';

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <ShieldX className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">
            403 Forbidden
          </h2>

          <p className="text-muted-foreground mb-8">
            You don't have permission to access this page. If you believe this is an error, please contact our support team.
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/help-center">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="w-full"
            >
              <button onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </button>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Need help? Visit our{' '}
              <Link href="/help-center" className="text-primary hover:underline">
                Help Center
              </Link>{' '}
              or contact{' '}
              <Link href="/contact" className="text-primary hover:underline">
                support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
