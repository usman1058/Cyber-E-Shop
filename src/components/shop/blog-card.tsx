'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, User } from 'lucide-react'

interface BlogCardProps {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  image?: string
  author?: string
  category?: string
  publishedAt?: Date
  readTime?: number
}

export function BlogCard({
  id,
  title,
  slug,
  excerpt,
  content,
  image,
  author,
  category,
  publishedAt,
  readTime = 5,
}: BlogCardProps) {
  const displayDate = publishedAt 
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Coming soon'

  const displayExcerpt = excerpt || content.substring(0, 150) + '...'

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      {/* Image */}
      <Link href={`/blog/${slug}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <span className="text-6xl font-bold text-primary/20">
                {title[0]}
              </span>
            </div>
          )}
          
          {/* Category Badge */}
          {category && (
            <Badge className="absolute left-4 top-4">
              {category}
            </Badge>
          )}
        </div>
      </Link>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-2">
          {author && (
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {author}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {displayDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readTime} min read
          </span>
        </div>
        
        <Link href={`/blog/${slug}`}>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {displayExcerpt}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Link
          href={`/blog/${slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read More →
        </Link>
      </CardFooter>
    </Card>
  )
}
