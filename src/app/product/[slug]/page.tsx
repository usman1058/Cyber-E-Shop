'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { useSession } from '@/hooks/use-session'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/shop/product-card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  ShoppingCart,
  Heart,
  Bell,
  Star,
  Check,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Types for product and related data
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  stock: number
  sku: string
  rating: number
  reviewCount: number
  isNew: boolean
  specs?: Record<string, any>
  category: {
    id: string
    name: string
    slug: string
  }
  brand: {
    id: string
    name: string
    slug: string
  }
}

interface Review {
  id: string
  author: string
  rating: number
  title: string
  comment: string
  createdAt: string
}

interface Question {
  id: string
  author: string
  question: string
  createdAt: string
  answers: {
    answer: string
    createdAt: string
  }[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { session } = useSession()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('overview')

  // States for interactive features
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isPriceAlertSet, setIsPriceAlertSet] = useState(false)
  const [isStockAlertSet, setIsStockAlertSet] = useState(false)
  const [showGallery, setShowGallery] = useState(false)

  // Reviews and Q&A state
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  })

  const [questions, setQuestions] = useState<Question[]>([])
  const [questionForm, setQuestionForm] = useState('')

  useEffect(() => {
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/products/${slug}`)
      if (!response.ok) throw new Error('Product not found')
      const data = await response.json()

      if (data.product) {
        setProduct(data.product)
        if (data.product.images && data.product.images.length > 0) {
          setSelectedImage(0)
        }

        // Fetch related products (same category)
        const relatedRes = await fetch(`/api/products?category=${data.product.category.slug}&limit=4`)
        const relatedData = await relatedRes.json()
        if (relatedData.products) {
          setRelatedProducts(relatedData.products.filter((p: any) => p.id !== data.product.id))
        }

        // Fetch reviews
        const reviewsRes = await fetch(`/api/products/${slug}/reviews`)
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          setReviews(reviewsData.reviews || [])
        }

        // Check if in wishlist
        if (session?.isAuthenticated && session.user) {
          const wlRes = await fetch(`/api/wishlist?userId=${session.user.id}`)
          const wlData = await wlRes.json()
          if (wlData.success) {
            const inWishlist = wlData.wishlist.some((item: any) => item.productId === data.product.id)
            setIsWishlisted(inWishlist)

            const wishlistItem = wlData.wishlist.find((item: any) => item.productId === data.product.id)
            if (wishlistItem) {
              setIsPriceAlertSet(wishlistItem.priceDrop)
              setIsStockAlertSet(wishlistItem.stockAlert)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: quantity,
          userId: session?.user?.id,
          sessionId: 'guest-session', // In a real app, this would be a persistent cookie-based session
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success(`'${product.name}' added to cart!`)
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to add to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('Something went wrong')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleWishlist = async () => {
    if (!session?.isAuthenticated) {
      toast.error('Please login to manage your wishlist')
      return
    }

    try {
      if (isWishlisted) {
        const res = await fetch(`/api/wishlist?userId=${session.user?.id}&productId=${product?.id}`, {
          method: 'DELETE',
        })
        if (res.ok) {
          setIsWishlisted(false)
          toast.success('Removed from wishlist')
        }
      } else {
        const res = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user?.id,
            productId: product?.id,
          }),
        })
        if (res.ok) {
          setIsWishlisted(true)
          toast.success('Added to wishlist')
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      toast.error('Failed to update wishlist')
    }
  }

  const handlePriceAlert = async () => {
    if (!session?.isAuthenticated) {
      toast.error('Please login to set price alerts')
      return
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user?.id,
          productId: product?.id,
          priceAlert: !isPriceAlertSet
        }),
      })
      if (res.ok) {
        setIsPriceAlertSet(!isPriceAlertSet)
        toast.success(!isPriceAlertSet ? 'Price alert set!' : 'Price alert removed')
      }
    } catch (error) {
      console.error('Price alert error:', error)
    }
  }

  const handleStockAlert = async () => {
    if (!session?.isAuthenticated) {
      toast.error('Please login to set stock alerts')
      return
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user?.id,
          productId: product?.id,
          stockAlert: !isStockAlertSet
        }),
      })
      if (res.ok) {
        setIsStockAlertSet(!isStockAlertSet)
        toast.success(!isStockAlertSet ? 'Stock alert set!' : 'Stock alert removed')
      }
    } catch (error) {
      console.error('Stock alert error:', error)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.isAuthenticated) {
      toast.error('Please login to submit a review')
      return
    }

    setIsSubmittingReview(true)
    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reviewForm,
          userId: session.user?.id
        }),
      })

      const data = await res.json()
      if (data.success) {
        toast.success('Review submitted successfully!')
        setReviewForm({ rating: 5, title: '', comment: '' })
        // Refresh reviews
        const reviewsRes = await fetch(`/api/products/${slug}/reviews`)
        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json()
          setReviews(reviewsData.reviews || [])
        }
      } else {
        toast.error(data.error || 'Failed to submit review')
      }
    } catch (error) {
      console.error('Review submission error:', error)
      toast.error('Something went wrong')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const handleImageNavigation = (direction: 'next' | 'prev') => {
    if (!product?.images) return
    if (direction === 'next') {
      setSelectedImage((prev) => (prev + 1) % product.images.length)
    } else {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-6 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-12 bg-muted animate-pulse rounded w-1/3" />
              <div className="h-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </PageLayout>
    )
  }

  const images = product.images || ['/images/products/placeholder.jpg']
  const discountPercentage = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <PageLayout>
      {/* Breadcrumb */}
      <div className="bg-muted/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Home</span>
            <span className="text-muted-foreground">/</span>
            <a href={`/category/${product.category.slug}`} className="text-muted-foreground hover:text-primary">
              {product.category.name}
            </a>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">{product.brand.name}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in"
                onClick={() => setShowGallery(true)}
              />

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleImageNavigation('prev') }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleImageNavigation('next') }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-primary">NEW</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">-{discountPercentage}%</Badge>
                )}
              </div>

              {/* Out of Stock Overlay */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-primary' : 'border-transparent'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <a href={`/brand/${product.brand.slug}`} className="text-primary hover:underline">
              {product.brand.name}
            </a>

            {/* Title */}
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              {renderStars(product.rating)}
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.comparePrice.toFixed(2)}
                    </span>
                    <Badge variant="destructive">
                      Save {discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
              {product.comparePrice && (
                <p className="text-sm text-muted-foreground">
                  You save ${(product.comparePrice - product.price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2">
              <Check className={`h-5 w-5 ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`} />
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* SKU */}
            <p className="text-sm text-muted-foreground">
              SKU: {product.sku}
            </p>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                    className="w-24 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                disabled={product.stock === 0 || isAddingToCart}
                onClick={handleAddToCart}
              >
                {isAddingToCart ? (
                  <>Processing...</>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlist}
              >
                <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </Button>
            </div>

            {/* Additional Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePriceAlert}
                className={isPriceAlertSet ? 'text-primary' : ''}
              >
                <Bell className="mr-2 h-4 w-4" />
                {isPriceAlertSet ? 'Alert Set' : 'Price Alert'}
              </Button>
              {product.stock === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStockAlert}
                  className={isStockAlertSet ? 'text-primary' : ''}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  {isStockAlertSet ? 'Notified' : 'Stock Alert'}
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-start gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-muted-foreground">On orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Secure Checkout</p>
                  <p className="text-muted-foreground">SSL encrypted</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-muted-foreground">30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="qa">Q&A</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Product Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'Experience the latest in technology with this premium product. Designed for performance and reliability, it delivers exceptional quality for all your needs.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                {product.specs ? (
                  <div className="space-y-3">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-4 py-2 border-b">
                        <span className="font-medium text-muted-foreground">{key}</span>
                        <span className="text-right">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Specifications will be updated soon.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-8">
                {/* Rating Summary */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-primary">{product.rating}</div>
                      <div className="flex items-center justify-center gap-1 my-2">
                        {renderStars(product.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground">{product.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm w-3">{star}</span>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${(star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-10">
                            {star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Review Form */}
                <div>
                  <h4 className="font-semibold mb-4">Write a Review</h4>
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <Label>Rating</Label>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-6 w-6 ${star <= reviewForm.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="review-title">Title</Label>
                      <Input
                        id="review-title"
                        placeholder="Summarize your review"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="review-comment">Review</Label>
                      <Textarea
                        id="review-comment"
                        placeholder="Share your experience with this product"
                        rows={4}
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        required
                      />
                    </div>
                    <Button
                      onClick={handleReviewSubmit}
                      disabled={isSubmittingReview}
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.author}</span>
                              <Badge variant="secondary">Verified Purchase</Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-muted-foreground">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <h5 className="font-medium">{review.title}</h5>
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No reviews yet. Be the first to review this product!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qa" className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-8">
                {/* Ask Question Form */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Questions & Answers</h3>
                  <div className="space-y-4 max-w-2xl">
                    <div>
                      <Label htmlFor="question">Have a question?</Label>
                      <Textarea
                        id="question"
                        placeholder="Type your question here..."
                        rows={3}
                        value={questionForm}
                        onChange={(e) => setQuestionForm(e.target.value)}
                      />
                    </div>
                    <Button>Submit Question</Button>
                  </div>
                </div>

                <Separator />

                {/* Questions List */}
                <div className="space-y-6">
                  {questions.length > 0 ? (
                    questions.map((q: any) => (
                      <div key={q.id} className="space-y-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{q.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(q.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-foreground">{q.question}</p>
                        </div>
                        {q.answers && q.answers.length > 0 && (
                          <div className="ml-4 pl-4 border-l-2 border-primary space-y-3">
                            {q.answers.map((answer: any, idx: number) => (
                              <div key={idx}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="secondary">Official Answer</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(answer.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-muted-foreground">{answer.answer}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No questions yet. Be the first to ask!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Free Shipping</h4>
                    <p>On all orders over $50 within the continental US.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Standard Shipping</h4>
                    <p>5-7 business days - $5.99</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Express Shipping</h4>
                    <p>2-3 business days - $12.99</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Next Day Delivery</h4>
                    <p>1 business day - $24.99</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-foreground mb-2">International Shipping</h4>
                    <p>Available to select countries. Shipping calculated at checkout.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} {...p} image={p.images[0]} category={p.category.name} brand={p.brand.name} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {showGallery && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setShowGallery(false)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); handleImageNavigation('prev') }}
            className="absolute left-4 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <img
            src={images[selectedImage]}
            alt={product.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); handleImageNavigation('next') }}
            className="absolute right-4 p-4 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </PageLayout>
  )
}
