'use client'

import { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DealCard } from './deal-card'

interface DealSliderProps {
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

export function DealSlider({ deals }: DealSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', slidesToScroll: 1 })
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const api = emblaApi
    setScrollSnaps(api.scrollSnapList())
    const onInit = () => setScrollSnaps(api.scrollSnapList())
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap())
    const onScroll = () => setScrollProgress(api.scrollProgress())
    api.on('reInit', onInit)
    api.on('select', onSelect)
    api.on('scroll', onScroll)
    return () => {
      api.off('reInit', onInit)
      api.off('select', onSelect)
      api.off('scroll', onScroll)
    }
  }, [emblaApi])

  if (deals.length === 0) return null

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Flash Deals</h2>
          <p className="text-muted-foreground mt-1">Limited time offers - ends soon</p>
        </div>
      </div>

      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex" style={{ transform: `translateX(-${scrollProgress * 100}%)` }}>
            {deals.map((deal) => (
              <div key={deal.id} className="flex-[0_0_100%] min-w-0 px-2" style={{ minWidth: '280px' }}>
                <DealCard {...deal} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-background/90 hover:bg-background z-10 rounded-full shadow-lg"
          onClick={scrollPrev}
          aria-label="Previous deal"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-background/90 hover:bg-background z-10 rounded-full shadow-lg"
          onClick={scrollNext}
          aria-label="Next deal"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? 'bg-primary w-6'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}