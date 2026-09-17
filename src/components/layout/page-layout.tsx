import { Header } from './header'
import { Footer } from './footer'
import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  className?: string
  container?: boolean
  sectioned?: boolean
}

export function PageLayout({ 
  children, 
  className = '',
  container = true,
  sectioned = false
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col bg-background ${className}`}>
      <Header />
      <main className="flex-1 w-full">
        {container && (
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-[1400px]">
              {sectioned ? (
                <div className="space-y-16 md:space-y-20 lg:space-y-24">
                  {children}
                </div>
              ) : (
                children
              )}
            </div>
          </div>
        )}
        {!container && children}
      </main>
      <Footer />
    </div>
  )
}

export function Section({ 
  children, 
  className = '',
  size = 'md',
  fullWidth = false
}: { 
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
}) {
  const sizeClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16 lg:py-20',
    lg: 'py-16 md:py-20 lg:py-24',
    xl: 'py-20 md:py-28 lg:py-32',
  }
  
  const innerContent = fullWidth ? (
    children
  ) : (
    <div className="mx-auto max-w-[1400px]">
      {children}
    </div>
  )
  
  return (
    <section className={`${sizeClasses[size]} ${fullWidth ? 'w-full px-4 md:px-6 lg:px-8' : ''} ${className}`}>
      {innerContent}
    </section>
  )
}

export function Container({ 
  children, 
  className = '',
  size = 'lg'
}: { 
  children: ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }
  
  return (
    <div className={`mx-auto w-full px-4 md:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

export function Grid({ 
  children, 
  className = '',
  cols = 4,
  gap = 'md'
}: { 
  children: ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'tight' | 'md' | 'relaxed' | 'loose'
}) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  }
  
  const gapClasses = {
    tight: 'gap-3',
    md: 'gap-4 md:gap-6',
    relaxed: 'gap-6 lg:gap-8',
    loose: 'gap-8 lg:gap-12',
  }
  
  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
}

type Responsive<T> = T | { base?: T; sm?: T; md?: T; lg?: T; xl?: T }

function getResponsiveClass<T extends string>(
  value: Responsive<T> | undefined,
  classMap: Record<T, string>,
  defaultValue: T
): string {
  if (!value) return classMap[defaultValue]
  if (typeof value === 'string') return classMap[value]
  
  const classes: string[] = []
  if (value.base) classes.push(classMap[value.base])
  if (value.sm) classes.push(`sm:${classMap[value.sm]}`)
  if (value.md) classes.push(`md:${classMap[value.md]}`)
  if (value.lg) classes.push(`lg:${classMap[value.lg]}`)
  if (value.xl) classes.push(`xl:${classMap[value.xl]}`)
  return classes.join(' ') || classMap[defaultValue]
}

export function Flex({ 
  children, 
  className = '',
  direction = 'row',
  align = 'center',
  justify = 'between',
  gap = 'md',
  wrap = false
}: { 
  children: ReactNode
  className?: string
  direction?: Responsive<'row' | 'col' | 'row-reverse' | 'col-reverse'>
  align?: Responsive<'start' | 'center' | 'end' | 'stretch' | 'baseline'>
  justify?: Responsive<'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'>
  gap?: 'tight' | 'md' | 'relaxed' | 'loose'
  wrap?: boolean
}) {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  }
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  }
  
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  }
  
  const gapClasses = {
    tight: 'gap-3',
    md: 'gap-4 md:gap-6',
    relaxed: 'gap-6 lg:gap-8',
    loose: 'gap-8 lg:gap-12',
  }
  
  const directionClass = getResponsiveClass(direction, directionClasses, 'row')
  const alignClass = getResponsiveClass(align, alignClasses, 'center')
  const justifyClass = getResponsiveClass(justify, justifyClasses, 'between')
  
  return (
    <div className={`flex ${directionClass} ${alignClass} ${justifyClass} ${gapClasses[gap]} ${wrap ? 'flex-wrap' : ''} ${className}`}>
      {children}
    </div>
  )
}