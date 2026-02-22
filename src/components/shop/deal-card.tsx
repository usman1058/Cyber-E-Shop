'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, ShoppingCart } from 'lucide-react'

interface DealCardProps {
  id: string
  name: string
  slug: string
  image: string
  originalPrice: number
  discountedPrice: number
  discount: number
  endDate?: Date
  type?: string
  flash?: boolean
}

export function DealCard({
  id,
  name,
  slug,
  image,
  originalPrice = 0,
  discountedPrice = 0,
  discount = 0,
  endDate,
  type = 'promo',
  flash = false,
}: DealCardProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null)

  useEffect(() => {
    if (!endDate) return

    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime()

      if (difference > 0) {
        return {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return null
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg border-primary/20">
      <CardContent className="p-0">
        <div className="relative">
          {/* Image */}
          <Link href={`/product/${slug}`}>
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Flash Sale Badge */}
          {flash && (
            <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-500">
              FLASH SALE
            </Badge>
          )}

          {/* Discount Badge */}
          <Badge variant="destructive" className="absolute right-2 top-2">
            -{discount}%
          </Badge>

          {/* Countdown Timer for Flash Sales */}
          {flash && timeLeft && (
            <div className="absolute left-2 bottom-2 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center gap-1 text-white">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <Link href={`/product/${slug}`}>
            <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>

          {/* Prices */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              ${discountedPrice.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <Badge variant="secondary">
              Save ${(originalPrice - discountedPrice).toFixed(2)}
            </Badge>
          </div>

          {/* CTA Button */}
          <Link href={`/product/${slug}`}>
            <Button className="w-full">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Shop Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
