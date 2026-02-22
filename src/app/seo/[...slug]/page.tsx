import { Metadata } from 'next'
import { db } from '@/lib/db'

interface SEOPageProps {
  params: {
    slug: string[]
  }
}

async function generateMetadata({ params }: SEOPageProps): Promise<Metadata> {
  const slug = params.slug?.join('/') || ''
  
  // This is a dynamic SEO landing page generator
  // It would handle category-specific or product-specific landing pages
  const title = slug
    ? `${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | CyberShop`
    : 'CyberShop - Your One-Stop Tech Shop'
  
  const description = slug
    ? `Discover the best ${slug.split('-').join(' ')} products at CyberShop. Shop the latest ${slug.split('-').join(' ')} with great prices and fast shipping.`
    : 'Shop the latest technology, electronics, gadgets, and accessories at CyberShop. Great prices, fast shipping, and exceptional customer service.'

  return {
    title,
    description,
    keywords: slug 
      ? [slug, slug.split('-').join(' '), 'tech', 'electronics', 'online store']
      : ['CyberShop', 'technology', 'electronics', 'gadgets', 'online shopping'],
    openGraph: {
      title,
      description,
      url: `https://cybershop.com/seo/${slug}`,
      siteName: 'CyberShop',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: slug ? `https://cybershop.com/seo/${slug}` : 'https://cybershop.com',
    },
  }
}

export default async function SEOLandingPage({ params }: SEOPageProps) {
  const slug = params.slug?.join('/') || ''
  
  // Fetch relevant products based on slug keywords
  let products: any[] = []
  let relatedCategory: any = null
  
  try {
    // Try to find matching category
    const category = await db.category.findFirst({
      where: {
        OR: [
          { slug: { contains: slug.toLowerCase() } },
          { name: { contains: slug } },
        ],
      },
    })

    if (category) {
      relatedCategory = category
      products = await db.product.findMany({
        where: {
          categoryId: category.id,
          active: true,
        },
        take: 12,
        include: { brand: true, category: true },
      })
    } else {
      // Search products by keywords
      products = await db.product.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: slug } },
            { description: { contains: slug } },
          ],
        },
        take: 12,
        include: { brand: true, category: true },
      })
    }
  } catch (error) {
    console.error('Error fetching SEO page data:', error)
  }

  const pageTitle = slug
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Featured Products'

  return (
    <main className="min-h-screen">
      {/* SEO-optimized Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {pageTitle}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {slug 
                ? `Discover the best ${slug.split('-').join(' ')} at unbeatable prices. Shop with confidence knowing you're getting quality products with fast, reliable shipping.`
                : 'Explore our handpicked selection of top-rated products. From cutting-edge electronics to everyday essentials, find everything you need.'
              }
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Free Shipping Over $50</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Authentic Products</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <a href={`/product/${product.slug}`} className="block">
                  <div className="aspect-square bg-muted">
                    {product.images && JSON.parse(product.images)[0] ? (
                      <img
                        src={JSON.parse(product.images)[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-muted/50">
                        <span className="text-4xl font-bold text-primary/20">
                          {product.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.comparePrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Products Coming Soon</h2>
              <p className="text-muted-foreground mb-6">
                We're adding new {slug.split('-').join(' ')} products regularly. Check back soon!
              </p>
              <a
                href="/category/electronics"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Browse All Categories
              </a>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">
              Why Shop {pageTitle} at CyberShop?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Unbeatable Prices</h3>
                <p className="text-muted-foreground">
                  We work directly with manufacturers to bring you the best prices on {slug.split('-').join(' ')} and all your tech needs. No middlemen, just savings.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Expert Support</h3>
                <p className="text-muted-foreground">
                  Our team of tech experts is here to help you find the perfect {slug.split('-').join(' ')} for your needs. Ask us anything!
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Fast, Free Shipping</h3>
                <p className="text-muted-foreground">
                  Get your {slug.split('-').join(' ')} delivered quickly with our reliable shipping. Free shipping on orders over $50.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">30-Day Returns</h3>
                <p className="text-muted-foreground">
                  Not satisfied? Return your {slug.split('-').join(' ')} within 30 days for a full refund. No questions asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemListPage',
            name: pageTitle,
            description: `Best ${slug.split('-').join(' ')} at CyberShop`,
            url: `https://cybershop.com/seo/${slug}`,
            itemListElement: products.map((product) => ({
              '@type': 'ListItem',
              position: 1,
              name: product.name,
              image: product.images ? JSON.parse(product.images)[0] : '',
              description: product.description,
              offers: {
                '@type': 'Offer',
                price: product.price,
                priceCurrency: 'USD',
                availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                url: `https://cybershop.com/product/${product.slug}`,
              },
            })),
          }),
        }}
      />
    </main>
  )
}
