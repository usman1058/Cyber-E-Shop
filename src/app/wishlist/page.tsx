'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { PageLayout } from '@/components/layout/page-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart, ShoppingCart, Trash2, Bell, Check, AlertCircle, Share2, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/shop/product-card'
import { useSession } from '@/hooks/use-session'
import { toast } from 'sonner'
import Link from 'next/link'

export default function WishlistPage() {
    const router = useRouter()
    const { session, guestId } = useSession()
    const [wishlist, setWishlist] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchWishlist = useCallback(async () => {
        if (!session?.user?.id && !guestId) return

        setLoading(true)
        try {
            const res = await fetch(`/api/wishlist?userId=${session?.user?.id || ''}&sessionId=${guestId || ''}`)
            const data = await res.json()
            if (data.success) {
                setWishlist(data.wishlist || []) // API returns .wishlist not .items
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error)
            toast.error('Failed to load wishlist')
        } finally {
            setLoading(false)
        }
    }, [session?.user?.id, guestId])

    useEffect(() => {
        fetchWishlist()
    }, [fetchWishlist])

    const handleRemoveFromWishlist = async (id: string, productId: string) => {
        setActionLoading(id)
        try {
            const res = await fetch(`/api/wishlist?id=${id}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success) {
                setWishlist(prev => prev.filter(item => item.id !== id))
                toast.success('Removed from wishlist')
            } else {
                toast.error(data.error || 'Failed to remove item')
            }
        } catch (error) {
            toast.error('Connection error')
        } finally {
            setActionLoading(null)
        }
    }

    const handleAddToCart = async (item: any) => {
        setActionLoading(item.id)
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    sessionId: guestId,
                    productId: item.productId,
                    quantity: 1
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Added to cart')
            } else {
                toast.error(data.error || 'Failed to add to cart')
            }
        } catch (error) {
            toast.error('Connection error')
        } finally {
            setActionLoading(null)
        }
    }

    return (
        <PageLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight mb-3">My Wishlist</h1>
                            <p className="text-lg text-muted-foreground">
                                Manage your saved products and track availability.
                            </p>
                        </div>
                        {wishlist.length > 0 && (
                            <Badge variant="secondary" className="px-4 py-1.5 text-sm w-fit mx-auto md:mx-0">
                                {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
                            </Badge>
                        )}
                    </div>

                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <Card key={i} className="animate-pulse h-80 bg-muted/50" />
                            ))}
                        </div>
                    ) : wishlist.length === 0 ? (
                        <Card className="border-dashed border-2 bg-muted/20">
                            <CardContent className="p-16 text-center">
                                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                                    <Heart className="h-12 w-12 text-muted-foreground" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">Your wishlist is empty</h3>
                                <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                                    See something you like? Tap the heart icon on any product to save it here for later.
                                </p>
                                <Link href="/">
                                    <Button size="lg" className="px-8 flex items-center gap-2">
                                        Start Shopping
                                        <ArrowRight className="h-5 w-5" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-8">
                            {/* Grid */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {wishlist.map((item) => (
                                    <Card key={item.id} className="group relative border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-card">
                                        {/* Status Badges */}
                                        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                                            {item.priceDrop && (
                                                <Badge variant="destructive" className="animate-bounce">
                                                    Price Dropped
                                                </Badge>
                                            )}
                                            {item.product?.stock === 0 && (
                                                <Badge variant="secondary">Out of Stock</Badge>
                                            )}
                                        </div>

                                        {/* Product Image & Info */}
                                        <Link href={`/product/${item.productSlug}`}>
                                            <div className="aspect-[4/5] bg-muted overflow-hidden relative">
                                                <img
                                                    src={item.productImage || '/placeholder.svg'}
                                                    alt={item.productName}
                                                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                            </div>
                                        </Link>

                                        <div className="p-5">
                                            <div className="mb-4">
                                                <Link href={`/product/${item.productSlug}`}>
                                                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                                                        {item.productName}
                                                    </h3>
                                                </Link>
                                                <p className="text-2xl font-bold mt-1 text-primary">
                                                    ${(item.productPrice || 0).toFixed(2)}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Button
                                                    onClick={() => handleAddToCart(item)}
                                                    className="w-full h-11 flex items-center gap-2"
                                                    disabled={item.product?.stock === 0 || actionLoading === item.id}
                                                >
                                                    {actionLoading === item.id ? (
                                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                                                    ) : (
                                                        <>
                                                            <ShoppingCart className="h-4 w-4" />
                                                            Add to Cart
                                                        </>
                                                    )}
                                                </Button>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="flex-1 h-10 hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                        onClick={() => handleRemoveFromWishlist(item.id, item.productId)}
                                                        disabled={actionLoading === item.id}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="flex-1 h-10"
                                                        asChild
                                                    >
                                                        <Link href={`/product/${item.productSlug}`}>
                                                            <ArrowRight className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {/* Tips Section */}
                            <div className="mt-16 grid md:grid-cols-3 gap-8 border-t pt-12">
                                <div className="flex flex-col items-center text-center p-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                        <Bell className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Price Drop Alerts</h4>
                                    <p className="text-sm text-muted-foreground">We'll notify you automatically if any items in your wishlist go on sale.</p>
                                </div>
                                <div className="flex flex-col items-center text-center p-4">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <Check className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Stock Sync</h4>
                                    <p className="text-sm text-muted-foreground">Real-time inventory tracking ensures you know exactly when items are available.</p>
                                </div>
                                <div className="flex flex-col items-center text-center p-4">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                        <Share2 className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-semibold mb-2">Shared Joy</h4>
                                    <p className="text-sm text-muted-foreground">Coming soon: Share your curated wishlist with friends and family for gifts.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    )
}
