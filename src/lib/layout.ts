// Layout spacing tokens - 8px base unit
export const spacing = {
  // Base unit: 8px = 1 unit
  unit: 8,
  
  // Spacing scale (in rem, 1rem = 16px)
  xs: '0.25rem',    // 4px  - 0.5 unit
  sm: '0.5rem',     // 8px  - 1 unit
  md: '1rem',       // 16px - 2 units
  lg: '1.5rem',     // 24px - 3 units
  xl: '2rem',       // 32px - 4 units
  '2xl': '3rem',    // 48px - 6 units
  '3xl': '4rem',    // 64px - 8 units
  '4xl': '6rem',    // 96px - 12 units
  
  // Container max widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Section padding
  section: {
    sm: 'py-8 md:py-12',      // 32px / 48px
    md: 'py-12 md:py-16',     // 48px / 64px
    lg: 'py-16 md:py-24',     // 64px / 96px
    xl: 'py-24 md:py-32',     // 96px / 128px
  },
  
  // Container horizontal padding
  containerPad: {
    base: 'px-4',              // 16px
    md: 'px-4 md:px-6',        // 16px / 24px
    lg: 'px-4 md:px-8 lg:px-12', // 16px / 32px / 48px
  },
  
  // Grid gaps
  gap: {
    tight: 'gap-3',            // 12px
    normal: 'gap-4',           // 16px
    relaxed: 'gap-6',          // 24px
    loose: 'gap-8',            // 32px
  },
  
  // Component spacing
  component: {
    cardPad: 'p-4 md:p-6',     // 16px / 24px
    cardGap: 'gap-4 md:gap-6', // 16px / 24px
    formGap: 'space-y-4 md:space-y-6',
    sectionGap: 'space-y-8 md:space-y-12',
  },
} as const

// Tailwind class generators
export const layoutClasses = {
  // Page containers
  page: 'min-h-screen flex flex-col',
  main: 'flex-1 w-full',
  
  // Section wrapper
  section: 'w-full',
  sectionInner: 'mx-auto',
  
  // Container sizes
  containerSm: 'max-w-3xl mx-auto',
  containerMd: 'max-w-5xl mx-auto',
  containerLg: 'max-w-7xl mx-auto',
  containerXl: 'max-w-[1400px] mx-auto',
  
  // Common section layouts
  sectionBase: 'py-12 md:py-16 lg:py-20',
  sectionTight: 'py-8 md:py-12',
  sectionLoose: 'py-20 md:py-28 lg:py-32',
  
  // Horizontal padding
  padBase: 'px-4',
  padMd: 'px-4 md:px-6 lg:px-8',
  padWide: 'px-4 md:px-8 lg:px-12 xl:px-16',
  
  // Grid layouts
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8',
  grid4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6',
  grid5: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5',
  grid6: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
  
  // Flex layouts
  flexBetween: 'flex items-center justify-between',
  flexCenter: 'flex items-center justify-center',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',
  
  // Spacing utilities
  spaceY: {
    tight: 'space-y-3',
    normal: 'space-y-4 md:space-y-6',
    relaxed: 'space-y-8 md:space-y-12',
    loose: 'space-y-12 md:space-y-16',
  },
  
  // Content widths
  content: {
    narrow: 'max-w-2xl',
    normal: 'max-w-3xl',
    wide: 'max-w-5xl',
    full: 'max-w-full',
  },
  
  // Text alignment
  textCenter: 'text-center',
  textLeft: 'text-left',
  textRight: 'text-right',
} as const

export type SpacingScale = keyof typeof spacing
export type LayoutClassKey = keyof typeof layoutClasses