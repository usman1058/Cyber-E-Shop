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

export function HeroDealSlider({ deals }: HeroDealSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  return (
    <div className="relative w-full max-w-[320px] mx-auto md:mx-0">
      {/* Compact deal card */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex" style={{ transform: `translateX(-${scrollProgress * 100}%)` }}>
          {deals.slice(0, 5).map((deal) => (
            <div key={deal.id} className="flex-[0_0_100%] min-w-0" style={{ minWidth: '280px' }}>
              <DealCard {...deal} className="h-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation - compact */}
      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={scrollPrev}
          className="p-1.5 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm border border-border transition-colors"
          aria-label="Previous deal"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {deals.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-primary'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={scrollNext}
          className="p-1.5 rounded-full bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm border border-border transition-colors"
          aria-label="Next deal"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}