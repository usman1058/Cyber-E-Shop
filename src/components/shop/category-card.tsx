'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

interface CategoryCardProps {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount?: number
  featured?: boolean
}

export function CategoryCard({
  name,
  slug,
  description,
  image,
  productCount,
  featured = false,
}: CategoryCardProps) {
  return (
    <Link href={`/category/${slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-0">
          <div className={`relative overflow-hidden bg-muted ${featured ? 'aspect-[2/1]' : 'aspect-square'}`}>
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <span className="text-6xl font-bold text-primary/20">{name[0]}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {name}
                  </h3>
                  {description && (
                    <p className="text-sm text-white/80 line-clamp-1 hidden sm:block">
                      {description}
                    </p>
                  )}
                  {productCount !== undefined && (
                    <p className="text-sm text-white/60 mt-1">
                      {productCount} products
                    </p>
                  )}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-primary">
                  <ArrowRight className="h-5 w-5 text-white group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
