'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Home, RefreshCw, ArrowLeft } from 'lucide-react';

export default function RateLimitPage() {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleRetry = () => {
    setCountdown(60);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <Clock className="h-10 w-10 text-yellow-600" />
          </div>

          <h1 className="text-4xl font-bold mb-2">Rate Limit Exceeded</h1>
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">
            429 Too Many Requests
          </h2>

          <p className="text-muted-foreground mb-4">
            You've made too many requests in a short period. Please wait before trying again.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-yellow-700">
              <Clock className="h-5 w-5" />
              <span className="text-2xl font-bold">{countdown}s</span>
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              until you can make another request
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              disabled={countdown > 0}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Now {countdown > 0 && `(${countdown}s)`}
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
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
              Rate limits help protect our service from abuse. If you continue to experience issues, please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
