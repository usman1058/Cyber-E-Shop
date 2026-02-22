'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingCart, Star, RefreshCw } from 'lucide-react'
import { useSession } from '@/hooks/use-session'
import { useCart } from '@/hooks/use-cart'
import { useCurrency } from '@/hooks/use-currency'

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  images?: string[]
  rating?: number
  reviewCount?: number
  isNew?: boolean
  discount?: number
  stock?: number
  category?: string
  brand?: string
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  comparePrice,
  image,
  images,
  rating = 0,
  reviewCount = 0,
  isNew = false,
  discount = 0,
  stock = 0,
  category,
  brand,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()
  const { session, guestId } = useSession()
  const { addItem, loading: cartLoading } = useCart()
  const { formatPrice } = useCurrency()

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!session?.user?.id && !guestId) return
      
      try {
        const response = await fetch(`/api/wishlist?userId=${session?.user?.id || ''}&sessionId=${guestId || ''}&productId=${id}`)
        const data = await response.json()
        if (data.success && data.wishlist && data.wishlist.length > 0) {
          setIsWishlisted(true)
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error)
      }
    }

    checkWishlistStatus()
  }, [id, session?.user?.id, guestId])

  const allImages = images && images.length > 0 ? images : [image]
  const discountPercentage = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : discount

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAdding(true)
    await addItem({
      id,
      name,
      slug,
      price,
      images: [image],
      stock,
    })
    setIsAdding(false)
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-0">
        {/* Product Image */}
        <Link href={`/product/${slug}`}>
          <div
            className="relative aspect-square overflow-hidden bg-muted"
            onMouseEnter={() => images && images.length > 1 && setCurrentImageIndex(1)}
            onMouseLeave={() => setCurrentImageIndex(0)}
          >
            <img
              src={allImages[currentImageIndex]}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Badges */}
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {isNew && (
                <Badge variant="secondary" className="bg-primary text-primary-foreground">
                  NEW
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 bg-white/90 hover:bg-white"
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                
                const newStatus = !isWishlisted
                setIsWishlisted(newStatus)

                try {
                  if (newStatus) {
                    await fetch('/api/wishlist', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        userId: session?.user?.id,
                        sessionId: guestId,
                        productId: id,
                      }),
                    })
                    toast.success('Added to wishlist')
                  } else {
                    await fetch(`/api/wishlist?userId=${session?.user?.id || ''}&sessionId=${guestId || ''}&productId=${id}`, {
                      method: 'DELETE',
                    })
                    toast.success('Removed from wishlist')
                  }
                } catch (error) {
                  console.error('Wishlist toggle error:', error)
                  setIsWishlisted(!newStatus)
                  toast.error('Failed to update wishlist')
                }
              }}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </Button>

            {/* Stock Status */}
            {stock === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {category && (
            <Link href={`/category/${typeof category === 'object' ? (category as any).slug || (category as any).name?.toLowerCase() : category.toLowerCase()}`}>
              <p className="text-xs text-muted-foreground hover:text-primary">
                {typeof category === 'object' ? (category as any).name : category}
              </p>
            </Link>
          )}
          
          <Link href={`/product/${slug}`}>
            <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
              {name}
            </h3>
          </Link>

          {/* Rating */}
          {rating > 0 && (
            <div className="flex items-center gap-2">
              {renderStars(rating)}
              <span className="text-xs text-muted-foreground">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(price, 'USD')}
            </span>
            {comparePrice && comparePrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(comparePrice, 'USD')}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          loading={isAdding}
          disabled={stock === 0}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4" />
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
