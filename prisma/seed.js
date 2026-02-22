const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Comprehensive Seeding ---');

  // 1. CLEANUP (Order matters because of foreign keys)
  console.log('Cleaning existing data...');
  const tableNames = [
    'ChatMessage', 'ChatSession', 'TicketMessage', 'SupportTicket', 
    'Review', 'WishlistItem', 'PaymentMethod', 'Address', 
    'OrderItem', 'OrderAddress', 'Refund', 'Order', 
    'CartItem', 'Cart', 'Notification', 'SearchQuery', 
    'JobApplication', 'Job', 'BlogPost', 'NewsletterSubscription', 
    'ContactInquiry', 'StoreLocation', 'Deal', 'Product', 
    'Brand', 'Category', 'AdminRole', 'Session', 'User'
  ];

  for (const tableName of tableNames) {
    await prisma[tableName.charAt(0).toLowerCase() + tableName.slice(1)].deleteMany();
    console.log(`  - Cleared ${tableName}`);
  }

  // 2. ADMIN ROLES
  console.log('Creating Admin Roles...');
  const superAdminRole = await prisma.adminRole.create({
    data: {
      name: 'Super Admin',
      description: 'Full system access',
      permissions: JSON.stringify(['all']),
    }
  });

  const moderatorRole = await prisma.adminRole.create({
    data: {
      name: 'Moderator',
      description: 'Can manage products and support',
      permissions: JSON.stringify(['products.manage', 'support.view', 'reviews.manage']),
    }
  });

  // 3. USERS
  console.log('Creating Users...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@eshop.com',
      name: 'E-shop Admin',
      password: hashedPassword,
      role: 'admin',
      adminRoleId: superAdminRole.id,
      isActive: true,
      emailVerified: new Date(),
    }
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@eshop.com',
      name: 'John Doe',
      password: hashedPassword,
      role: 'customer',
      isActive: true,
      emailVerified: new Date(),
      phone: '+1 555-010-9999',
    }
  });

  const guest = await prisma.user.create({
    data: {
      email: 'test@eshop.com',
      name: 'Test Tester',
      password: hashedPassword,
      role: 'customer',
      isActive: true,
    }
  });

  // 4. ADDRESSES & PAYMENT METHODS
  console.log('Seeding User Details...');
  await prisma.address.create({
    data: {
      userId: customer.id,
      fullName: 'John Doe',
      address: '123 Tech Lane',
      apartment: 'Suite 404',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
      isDefault: true,
    }
  });

  await prisma.paymentMethod.create({
    data: {
      userId: customer.id,
      type: 'card',
      provider: 'Visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2026',
      isDefault: true,
    }
  });

  // 5. CATEGORIES
  console.log('Creating Category Hierarchy...');
  const cat_electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics', image: '/images/categories/electronics.jpg' }
  });

  const cat_computing = await prisma.category.create({
    data: { name: 'Computing', slug: 'computing', parentId: cat_electronics.id }
  });

  const cat_mobile = await prisma.category.create({
    data: { name: 'Mobile Devices', slug: 'mobiles', parentId: cat_electronics.id }
  });

  const cat_gaming = await prisma.category.create({
    data: { name: 'Gaming', slug: 'gaming', image: '/images/categories/gaming.jpg' }
  });

  const cat_audio = await prisma.category.create({
    data: { name: 'Audio', slug: 'audio', parentId: cat_electronics.id }
  });

  const cat_home = await prisma.category.create({
    data: { name: 'Smart Home', slug: 'smart-home' }
  });

  // 6. BRANDS
  console.log('Creating Brands...');
  const b_apple = await prisma.brand.create({ data: { name: 'Apple', slug: 'apple', story: 'Founded in a garage...' } });
  const b_samsung = await prisma.brand.create({ data: { name: 'Samsung', slug: 'samsung' } });
  const b_sony = await prisma.brand.create({ data: { name: 'Sony', slug: 'sony' } });
  const b_dell = await prisma.brand.create({ data: { name: 'Dell', slug: 'dell' } });
  const b_logitech = await prisma.brand.create({ data: { name: 'Logitech', slug: 'logitech' } });

  // 7. PRODUCTS (Generating 20+ diversified products)
  console.log('Populating Product Catalog...');
  const products = [
    { sku: 'APL-MBA-M3', name: 'MacBook Air M3 13"', slug: 'macbook-air-m3-13', price: 1099.99, cat: cat_computing.id, brand: b_apple.id, featured: true },
    { sku: 'APL-MBP-M3P', name: 'MacBook Pro 14" M3 Pro', slug: 'macbook-pro-14-m3-pro', price: 1999.00, cat: cat_computing.id, brand: b_apple.id, featured: true },
    { sku: 'SAM-S24U', name: 'Galaxy S24 Ultra', slug: 'galaxy-s24-ultra', price: 1299.99, cat: cat_mobile.id, brand: b_samsung.id, featured: true },
    { sku: 'SAM-S24', name: 'Galaxy S24', slug: 'galaxy-s24', price: 799.99, cat: cat_mobile.id, brand: b_samsung.id, isNew: true },
    { sku: 'SON-WH1000', name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5', price: 399.00, cat: cat_audio.id, brand: b_sony.id },
    { sku: 'SON-PS5-SLIM', name: 'PlayStation 5 Slim', slug: 'ps5-slim', price: 499.99, cat: cat_gaming.id, brand: b_sony.id, featured: true },
    { sku: 'DEL-XPS13', name: 'Dell XPS 13', slug: 'dell-xps-13', price: 999.00, cat: cat_computing.id, brand: b_dell.id },
    { sku: 'LOG-MXM3', name: 'MX Master 3S Mouse', slug: 'logitech-mx-master-3s', price: 99.00, cat: cat_computing.id, brand: b_logitech.id },
    { sku: 'APL-IP15P', name: 'iPhone 15 Pro', slug: 'iphone-15-pro', price: 999.00, cat: cat_mobile.id, brand: b_apple.id, isNew: true },
    { sku: 'SAM-WATCH6', name: 'Galaxy Watch 6', slug: 'galaxy-watch-6', price: 299.00, cat: cat_mobile.id, brand: b_samsung.id },
    { sku: 'LOG-G915', name: 'G915 TKL Keyboard', slug: 'logitech-g915-tkl', price: 229.00, cat: cat_gaming.id, brand: b_logitech.id },
    { sku: 'SON-BRAV-A80', name: 'Sony BRAVIA XR A80L 65"', slug: 'sony-bravia-xr-65', price: 2199.00, cat: cat_electronics.id, brand: b_sony.id },
    { sku: 'APL-AW9', name: 'Apple Watch Series 9', slug: 'apple-watch-9', price: 399.00, cat: cat_mobile.id, brand: b_apple.id },
    { sku: 'SAM-BUDS2P', name: 'Galaxy Buds2 Pro', slug: 'galaxy-buds2-pro', price: 189.00, cat: cat_audio.id, brand: b_samsung.id },
    { sku: 'DEL-U2723', name: 'Dell UltraSharp 27"', slug: 'dell-ultrasharp-27', price: 599.00, cat: cat_computing.id, brand: b_dell.id },
  ];

  const prodRecords = [];
  for (const p of products) {
    const record = await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: `High quality ${p.name} with premium features and reliable performance. Ideal for professional and personal use.`,
        price: p.price,
        comparePrice: p.price * 1.2,
        categoryId: p.cat,
        brandId: p.brand,
        images: JSON.stringify(['/placeholder.svg', '/placeholder.svg']),
        specs: JSON.stringify({ "Brand": "Tech", "Warranty": "2 Years", "Condition": "New" }),
        stock: Math.floor(Math.random() * 100) + 10,
        rating: 4 + Math.random(),
        reviewCount: Math.floor(Math.random() * 50),
        salesCount: Math.floor(Math.random() * 200),
        featured: p.featured || false,
        isNew: p.isNew || false,
        active: true,
      }
    });
    prodRecords.push(record);
  }

  // 8. ORDERS (Generating history: pending, shipped, delivered)
  console.log('Creating Order History...');
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-1001',
      userId: customer.id,
      status: 'delivered',
      total: 1099.99,
      subtotal: 1000.00,
      tax: 80.00,
      shippingCost: 19.99,
      shippingMethod: 'Express',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid',
      trackingNumber: 'TRK12345678',
      carrier: 'FedEx',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      items: {
        create: {
          productId: prodRecords[0].id,
          productName: prodRecords[0].name,
          productSlug: prodRecords[0].slug,
          quantity: 1,
          unitPrice: 1099.99,
          totalPrice: 1099.99
        }
      },
      address: {
        create: {
          fullName: 'John Doe',
          address: '123 Tech Lane',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'USA'
        }
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-1002',
      userId: customer.id,
      status: 'processing',
      total: 799.99,
      subtotal: 750.00,
      tax: 40.00,
      shippingCost: 9.99,
      paymentMethod: 'PayPal',
      createdAt: new Date(),
      items: {
        create: {
          productId: prodRecords[3].id,
          productName: prodRecords[3].name,
          productSlug: prodRecords[3].slug,
          quantity: 1,
          unitPrice: 799.99,
          totalPrice: 799.99
        }
      },
      address: {
        create: {
          fullName: 'John Doe',
          address: '123 Tech Lane',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'USA'
        }
      }
    }
  });

  // 9. SUPPORT TICKETS
  console.log('Creating Support Tickets...');
  await prisma.supportTicket.create({
    data: {
      ticketId: 'TKT-101',
      userId: customer.id,
      subject: 'Delivery delay for order ORD-1002',
      category: 'Shipping',
      priority: 'high',
      status: 'open',
      messages: {
        create: [
          { senderId: customer.id, senderName: customer.name, message: 'My order is still processing. Any updates?' },
          { senderId: admin.id, senderName: admin.name, message: 'We are looking into this...', isAdmin: true }
        ]
      }
    }
  });

  // 10. REVIEWS & WISHLIST
  console.log('Creating Reviews & Wishlist items...');
  await prisma.review.create({
    data: {
      productId: prodRecords[0].id,
      productName: prodRecords[0].name,
      userId: customer.id,
      rating: 5,
      title: 'Amazing machine',
      content: 'The M3 chip is incredibly fast and the battery lasts all day.',
      verified: true,
    }
  });

  await prisma.wishlistItem.create({
    data: {
      userId: customer.id,
      productId: prodRecords[2].id,
      productName: prodRecords[2].name,
      productSlug: prodRecords[2].slug,
      productPrice: 1299.99
    }
  });

  // 11. BLOG POSTS
  console.log('Publishing Blog Posts...');
  await prisma.blogPost.create({
    data: {
      title: 'iPhone 15 Pro vs Galaxy S24 Ultra',
      slug: 'iphone-vs-galaxy-comparison',
      excerpt: 'Which flagship wins the 2024 battle?',
      content: 'Detailed comparison of cameras, performance and battery life...',
      author: 'Tech Guru',
      category: 'Comparisons',
      published: true,
      publishedAt: new Date(),
    }
  });

  // 12. STORE LOCATIONS
  console.log('Seeding Store Locations...');
  await prisma.storeLocation.create({
    data: {
      name: 'Tech City Flagship',
      address: '123 Cyber St',
      city: 'Silicon Valley',
      state: 'CA',
      postalCode: '94000',
      phone: '+1 555-TECH',
      hours: JSON.stringify({ Mon: '9am-9pm', Sat: '10am-6pm', Sun: 'Closed' }),
      active: true
    }
  });

  // 13. JOBS
  console.log('Creating Job Openings...');
  await prisma.job.create({
    data: {
      title: 'Frontend Developer (React)',
      slug: 'frontend-dev-react',
      location: 'Remote / SF',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Build amazing e-commerce experiences...',
      requirements: 'React, Next.js, TypeScript...',
      active: true
    }
  });

  // 14. DEALS
  console.log('Configuring Deals...');
  await prisma.deal.create({
    data: {
      name: 'Welcome Discount',
      slug: 'welcome-10',
      type: 'promo',
      discount: 10,
      discountType: 'percentage',
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      products: JSON.stringify(['all']),
    }
  });

  // 15. SEARCH QUERIES & NOTIFICATIONS
  console.log('Adding interaction history...');
  await prisma.searchQuery.create({ data: { query: 'macbook', resultsCount: 5, searchCount: 15 } });
  await prisma.searchQuery.create({ data: { query: 'galaxy', resultsCount: 8, searchCount: 22 } });

  await prisma.notification.create({
    data: {
      userId: customer.id,
      type: 'order',
      title: 'Order Completed',
      message: 'Your order ORD-1001 was delivered successfully.',
      link: '/account/orders/ORD-1001'
    }
  });

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
