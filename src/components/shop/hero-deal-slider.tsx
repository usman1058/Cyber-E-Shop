'use client'

import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DealCard } from './deal-card'

interface HeroDealSliderProps {
  deals: Array<{
    id: string
    name: string
    slug: string
    image: string
    originalPrice: number
    discountedPrice: number
    discount: number
    flash?: boolean
  }>
}

// Abstract blob clip-path points for organic shape
const BLOB_CLIP_PATH = 'polygon(25% 0%, 75% 0%, 100% 20%, 100% 80%, 75% 100%, 25% 100%, 0% 80%, 0% 20%)'
const BLOB_CLIP_PATH_HOVER = 'polygon(20% 0%, 80% 0%, 100% 15%, 100% 85%, 80% 100%, 20% 100%, 0% 85%, 0% 15%)'

export function HeroDealSlider({ deals }: HeroDealSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const api = emblaApi
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    const onScroll = () => setScrollProgress(api.scrollProgress())
    api.on('select', onSelect)
    api.on('scroll', onScroll)
    return () => {
      api.off('select', onSelect)
      api.off('scroll', onScroll)
    }
  }, [emblaApi])

  if (deals.length === 0) return null

  const visibleDeals = deals.slice(0, 5)

  return (
    <div className="relative w-full max-w-[340px] mx-auto md:mx-0">
      {/* Abstract blob background */}
      <div
        className="absolute inset-0 -inset-4 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 blur-2xl opacity-60"
        style={{ clipPath: isHovered ? BLOB_CLIP_PATH_HOVER : BLOB_CLIP_PATH }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-hidden="true"
      />

      {/* Accent glow orbs */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/20 rounded-full blur-3xl opacity-50" aria-hidden="true" />
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-accent/20 rounded-full blur-3xl opacity-50" aria-hidden="true" />

      {/* Slider container with abstract shape */}
      <div
        className="relative z-10"
        style={{ clipPath: isHovered ? BLOB_CLIP_PATH_HOVER : BLOB_CLIP_PATH }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex" style={{ transform: `translateX(-${scrollProgress * 100}%)` }}>
            {visibleDeals.map((deal) => (
              <div key={deal.id} className="flex-[0_0_100%] min-w-0" style={{ minWidth: '300px' }}>
                <DealCard {...deal} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating navigation - organic positioning */}
      <div className="flex justify-center items-center gap-3 mt-5 relative z-20">
        <button
          onClick={scrollPrev}
          className="p-2 rounded-full bg-background/90 hover:bg-background backdrop-blur-md shadow-lg border border-border/50 transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Previous deal"
          style={{ clipPath: 'circle(50% at 50% 50%)' }}
        >
          <ChevronLeft className="h-5 w-5 text-primary" />
        </button>

        <div className="flex items-center gap-2">
          {visibleDeals.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-primary scale-125 shadow-lg shadow-primary/30'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="p-2 rounded-full bg-background/90 hover:bg-background backdrop-blur-md shadow-lg border border-border/50 transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Next deal"
          style={{ clipPath: 'circle(50% at 50% 50%)' }}
        >
          <ChevronRight className="h-5 w-5 text-primary" />
        </button>
      </div>

      {/* Subtle corner accents */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" aria-hidden="true" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" aria-hidden="true" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" aria-hidden="true" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/30 rounded-br-lg" aria-hidden="true" />
    </div>
  )
}