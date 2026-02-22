# Project Analysis & Structure

This document provides a detailed overview of the e-shop project, including its pages, API endpoints, and potential areas for optimization.

## Project Overview
- **Framework**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS 4, Shadcn/UI
- **Database**: Prisma with `bcryptjs` and `next-auth` for authentication
- **State Management**: Zustand, React Query
- **Utilities**: Lucide Icons, Date-fns, Zod, Framer Motion

---

## Page Structure (`/src/app`)

### 🛒 E-commerce Core
| Page Path | Description |
| :--- | :--- |
| `/` (`page.tsx`) | Homepage with dynamic content |
| `/product` | Product details and listing |
| `/cart` | Shopping cart overview |
| `/checkout` | User checkout process |
| `/guest-checkout` | Checkout process for unauthenticated users |
| `/wishlist` | User's saved favorite products |
| `/save-for-later` | Alternative list for items to buy later |
| `/compare` | Product comparison tool |
| `/search` | Product search results |
| `/brands` / `/brand` | Brand listing and specific brand pages |
| `/category` | Product category listings |
| `/best-sellers` | Trending products |
| `/new-arrivals` | Recently added items |
| `/deals` / `/promotions` | Discounted items and offers |

### 🔐 User & Authentication
| Page Path | Description |
| :--- | :--- |
| `/login` | User sign-in |
| `/register` | User sign-up |
| `/verify-email` | Email verification flow |
| `/forgot-password` | Initial password recovery request |
| `/reset-password` | Final password reset with token |
| `/oauth` | Social login handling |
| `/mfa` | Multi-factor authentication |
| `/account` | User profile, settings, and orders |

### 🛠️ Administrative
| Page Path | Description |
| :--- | :--- |
| `/admin` | Main admin dashboard (38+ sub-routes including orders, products, users management) |

### ℹ️ Information & Support
| Page Path | Description |
| :--- | :--- |
| `/about` | Company information |
| `/blog` | Articles and news |
| `/contact` | Contact form |
| `/help-center` | FAQ and documentation |
| `/support` | Customer support portal |
| `/careers` | Job openings |
| `/locations` | Physical store or shipping locations |
| `/newsletter` | Subscription management |

### ⚖️ Legal & Compliance
| Page Path | Description |
| :--- | :--- |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/cookie` | Cookie policy |
| `/legal-consent` | Consent tracking |
| `/returns` | Return & refund policy |
| `/warranty` | Product warranty info |
| `/user-agreement` | Extended user agreement |
| `/age-gate` | Age verification |

### ⚠️ System & Error Pages
| Page Path | Description |
| :--- | :--- |
| `/403` / `/access-denied` | Permission errors |
| `/account-locked` | Security lockout |
| `/account-reactivation`| Reactivation workflow |
| `/maintenance` | Downtime notice |
| `/rate-limit` | API throttling notice |
| `/session-expired` | Automatic logout notice |
| `/data-load-failure` | Generic data fetching error |
| `/captcha` | BOT check page |
| `/compatibility-checker`| Browser/System check |
| `/error` | Generic system error |
| `not-found.tsx` | Custom 404 page |

---

## API Architecture (`/src/app/api`)

### Core Services
- `/api/auth`: NextAuth handling (login, logout, session)
- `/api/products`: CRUD for product data
- `/api/cart`: Cart state persistence
- `/api/orders`: Order placement and history
- `/api/checkout`: Payment processing integration
- `/api/search`: Search indexing and querying
- `/api/user`: User profile updates

### Supporting Services
- `/api/brands` / `/api/categories`: Taxonomy management
- `/api/reviews` / `/api/qa`: Social proof and engagement
- `/api/newsletter` / `/api/contact`: Communication
- `/api/notifications`: System alerts
- `/api/promotions`: Discount logic
- `/api/locations`: Geo-data for stores
- `/api/jobs`: Career listings management

---

## Analysis & Redundancy Insights

### 🔍 Potential Duplicates/Redundancies
1. **Legal Consent vs Cookie Policy**: Some logic might be overlapping between `/legal-consent` and `/cookie`.
2. **Wishlist vs Save-for-Later**: These are functionally very similar; consider merging unless there's a specific UX distinction.
3. **Error Page Bloat**: Having separate pages for `/403`, `/access-denied`, `/error`, `/data-load-failure`, and `/rate-limit` might be excessive. A unified error handling component with dynamic messages might be cleaner.
4. **Checkout Flows**: `/checkout` uses a multi-step structured flow (address, payment, etc.), while `/guest-checkout` is a consolidated single-page experience. These could potentially be unified into a single component with conditional logic.
5. **Support vs Help Center**: Similar intent; could be consolidated.

### 🧩 Structural Recommendations
- **Consolidation**: Group all legal pages under `/legal/[slug]` to clean up the root `app` folder.
- **Brand Routing**: Currently `/brands` is the list and `/brand/[slug]` is the detail. These are often grouped under `/brands` and `/brands/[slug]` for cleaner routing.
- **Component Reusability**: Ensure `src/components/ui` items are fully leveraged in `src/components/shop` to avoid CSS fragmentation.
