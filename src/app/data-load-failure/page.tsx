'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw, ArrowLeft, HelpCircle } from 'lucide-react';

export default function DataLoadFailurePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-orange-600" />
          </div>

          <h1 className="text-4xl font-bold mb-2">Data Load Failed</h1>
          <h2 className="text-xl font-semibold text-muted-foreground mb-4">
            Unable to Load Data
          </h2>

          <p className="text-muted-foreground mb-4">
            We encountered an error while loading the requested data. This could be a temporary issue with our servers or your connection.
          </p>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-orange-700">
              <strong>Possible causes:</strong>
            </p>
            <ul className="text-sm text-orange-600 mt-2 text-left list-disc list-inside">
              <li>Temporary server issue</li>
              <li>Network connectivity problem</li>
              <li>Large data request timeout</li>
              <li>Maintenance in progress</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleRetry}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/help-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                Get Help
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
              If the problem persists, please{' '}
              <Link href="/contact" className="text-primary hover:underline">
                contact our support team
              </Link>{' '}
              for assistance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
