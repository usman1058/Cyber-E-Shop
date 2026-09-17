'use client'

import { Button } from '@/components/ui/button'
import { Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Application Error</h2>
            <p className="mt-2 text-muted-foreground">
              An unexpected error occurred. The development team has been notified.
            </p>
            {error.digest && (
              <p className="mt-2 text-xs font-mono text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}
            <div className="mt-6 flex gap-3 justify-center">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}