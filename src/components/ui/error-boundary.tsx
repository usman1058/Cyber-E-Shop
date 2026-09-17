'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Something went wrong</h2>
            <p className="mt-2 text-muted-foreground">
              We encountered an unexpected error. Please try again.
            </p>
            {this.state.error && (
              <details className="mt-4 text-left text-sm text-muted-foreground">
                <summary className="cursor-pointer font-medium">Error details</summary>
                <pre className="mt-2 overflow-auto rounded bg-muted p-4">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="mt-6 flex gap-3 justify-center">
              <Button onClick={this.handleRetry} className="gap-2">
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
      )
    }

    return this.props.children
  }
}