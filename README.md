
# E-Shop - Full-Stack E-Commerce Platform

A modern, feature-rich e-commerce platform built with Next.js 16, Prisma, and PostgreSQL for Cyber Legends. This application provides a complete online shopping experience with admin management, user authentication, and comprehensive product catalog.

## 🚀 Features

### Customer Features
- **Product Browsing**: Advanced filtering, sorting, and search functionality
- **Shopping Cart**: Real-time cart management with guest and authenticated user support
- **Wishlist**: Save favorite products with price drop alerts
- **Checkout Flow**: Multi-step checkout with address management and payment integration
- **Order Tracking**: Real-time order status updates with tracking numbers
- **User Accounts**: Profile management, order history, and saved addresses
- **Product Reviews**: Rate and review purchased products
- **Support System**: Ticket-based support with real-time chat
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### Admin Features
- **Dashboard**: Comprehensive analytics and sales metrics
- **Product Management**: Full CRUD operations for products, categories, and brands
- **Order Management**: Process orders, update statuses, and manage refunds
- **User Management**: View and manage customer accounts
- **Support Tickets**: Handle customer inquiries and support requests
- **Content Management**: Blog posts, deals, and promotional content
- **Store Locations**: Manage physical store information

### Technical Highlights
- **100% Database-Driven**: No mock data, all content from PostgreSQL
- **Guest Support**: Full shopping experience without registration
- **Session Management**: Secure JWT-based authentication
- **Type-Safe**: Full TypeScript implementation
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Optimized Performance**: Server-side rendering and static generation
- **SEO Friendly**: Proper meta tags and semantic HTML

## 📋 Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher
- **npm** or **yarn**: Latest version

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd eshop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eshop"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database with test data
npx prisma db seed
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🗄️ Database Seeding

The seed script populates the database with:
- **Admin User**: `admin@eshop.com` / `Password123!`
- **Customer User**: `customer@eshop.com` / `Password123!`
- **Test User**: `test@eshop.com` / `Password123!`
- **15+ Products** across multiple categories
- **Sample Orders** with various statuses
- **Support Tickets** and reviews
- **Store Locations** and blog posts

## 🏗️ Project Structure

```
eshop/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.js            # Database seeding script
├── src/
│   ├── app/               # Next.js app directory
│   │   ├── api/          # API routes
│   │   ├── admin/        # Admin pages
│   │   ├── account/      # User account pages
│   │   └── ...           # Public pages
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   └── shop/         # Shop-specific components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   └── styles/           # Global styles
└── public/               # Static assets
```

## 🔑 Default Credentials

### Admin Account
- **Email**: `admin@eshop.com`
- **Password**: `Password123!`
- **Access**: Full admin dashboard and management tools

### Customer Account
- **Email**: `customer@eshop.com`
- **Password**: `Password123!`
- **Access**: Standard user features with sample order history

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Variables for Production
Ensure all environment variables are properly set:
- Update `DATABASE_URL` to your production database
- Set `NODE_ENV` to `production`
- Use strong, unique values for `JWT_SECRET` and `NEXTAUTH_SECRET`
- Update `NEXT_PUBLIC_APP_URL` to your production domain

## 📦 Key Technologies

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: JWT + Custom Session Management
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

## 🎨 UI Components

The application uses [shadcn/ui](https://ui.shadcn.com/) for consistent, accessible components:
- Buttons, Forms, Inputs
- Dialogs, Modals, Alerts
- Tables, Cards, Badges
- Dropdowns, Selects, Checkboxes
- And many more...

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate dev  # Create and apply migrations
npx prisma db seed   # Seed the database
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists: `createdb eshop`

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Regenerate Prisma Client: `npx prisma generate`
- Clear node_modules: `rm -rf node_modules && npm install`

### Session/Authentication Issues
- Clear browser cookies and localStorage
- Verify `JWT_SECRET` is set in `.env`
- Check that the session API route is accessible

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support and questions, please use the in-app support ticket system or contact the development team.

---

**Built with ❤️ using Next.js and modern web technologies**
