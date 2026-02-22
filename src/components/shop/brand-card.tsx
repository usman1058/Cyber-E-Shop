'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BrandCardProps {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  productCount?: number
}

export function BrandCard({
  name,
  slug,
  logo,
  description,
  productCount,
}: BrandCardProps) {
  return (
    <Link href={`/brand/${slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="h-16 w-16 flex-shrink-0 flex items-center justify-center rounded-lg bg-muted">
              {logo ? (
                <img
                  src={logo}
                  alt={`${name} logo`}
                  className="h-12 w-12 object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-primary/50">
                  {name.substring(0, 2).toUpperCase()}
                </span>
              )}
            </div>

            {/* Brand Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {name}
              </h3>
              {description && (
                <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                  {description}
                </p>
              )}
              {productCount !== undefined && (
                <Badge variant="secondary" className="mt-2">
                  {productCount} products
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
