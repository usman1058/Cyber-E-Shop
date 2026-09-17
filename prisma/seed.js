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
    data: { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80' }
  });

  const cat_computing = await prisma.category.create({
    data: { name: 'Computing', slug: 'computing', parentId: cat_electronics.id, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80' }
  });

  const cat_mobile = await prisma.category.create({
    data: { name: 'Mobile Devices', slug: 'mobiles', parentId: cat_electronics.id, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80' }
  });

  const cat_gaming = await prisma.category.create({
    data: { name: 'Gaming', slug: 'gaming', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80' }
  });

  const cat_audio = await prisma.category.create({
    data: { name: 'Audio', slug: 'audio', parentId: cat_electronics.id, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' }
  });

  const cat_home = await prisma.category.create({
    data: { name: 'Smart Home', slug: 'smart-home', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80' }
  });

  const cat_accessories = await prisma.category.create({
    data: { name: 'Accessories', slug: 'accessories', parentId: cat_electronics.id, image: 'https://images.unsplash.com/photo-1586370693256-949594d1d4a7?w=400&q=80' }
  });

  const cat_wearables = await prisma.category.create({
    data: { name: 'Wearables', slug: 'wearables', parentId: cat_electronics.id, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' }
  });

  // 6. BRANDS
  console.log('Creating Brands...');
  const b_apple = await prisma.brand.create({ 
    data: { 
      name: 'Apple', 
      slug: 'apple', 
      story: 'Founded in a garage in 1976, Apple revolutionized personal technology with the Macintosh, iPod, iPhone, and iPad.',
      logo: 'https://images.unsplash.com/photo-1518698281533-5f897ff02aa9?w=200&q=80',
      description: 'Innovation leader in consumer electronics, software, and services.'
    } 
  });
  const b_samsung = await prisma.brand.create({ 
    data: { 
      name: 'Samsung', 
      slug: 'samsung',
      logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&q=80',
      description: 'Global leader in mobile communications, semiconductors, and displays.'
    } 
  });
  const b_sony = await prisma.brand.create({ 
    data: { 
      name: 'Sony', 
      slug: 'sony',
      logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80',
      description: 'Japanese multinational known for gaming, audio, imaging, and entertainment.'
    } 
  });
  const b_dell = await prisma.brand.create({ 
    data: { 
      name: 'Dell', 
      slug: 'dell',
      logo: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80',
      description: 'American computer technology company offering laptops, desktops, and monitors.'
    } 
  });
  const b_logitech = await prisma.brand.create({ 
    data: { 
      name: 'Logitech', 
      slug: 'logitech',
      logo: 'https://images.unsplash.com/photo-1586370693256-949594d1d4a7?w=200&q=80',
      description: 'Swiss manufacturer of computer peripherals and accessories.'
    } 
  });

  // 7. PRODUCTS (Generating 20+ diversified products)
  console.log('Populating Product Catalog...');
  const products = [
    { 
      sku: 'APL-MBA-M3', 
      name: 'MacBook Air M3 13"', 
      slug: 'macbook-air-m3-13', 
      price: 1099.99, 
      comparePrice: 1299.99,
      cat: cat_computing.id, 
      brand: b_apple.id, 
      featured: true,
      imageSeed: '1611186871348-b1ce696e52c9',
      imageSeed2: '1541807084-5c52b6b3adef',
      description: 'The MacBook Air with M3 chip delivers incredible performance and up to 18 hours of battery life in a super-portable design. Features a stunning 13.6" Liquid Retina display, 8GB unified memory, and 256GB SSD storage.',
      specs: { "Chip": "Apple M3", "Display": "13.6\" Liquid Retina", "Memory": "8GB Unified", "Storage": "256GB SSD", "Battery": "Up to 18 hours", "Weight": "2.7 lbs" },
      stock: 25,
      rating: 4.8,
      reviewCount: 124,
      salesCount: 342,
    },
    { 
      sku: 'APL-MBP-M3P', 
      name: 'MacBook Pro 14" M3 Pro', 
      slug: 'macbook-pro-14-m3-pro', 
      price: 1999.00, 
      comparePrice: 2299.00,
      cat: cat_computing.id, 
      brand: b_apple.id, 
      featured: true,
      imageSeed: '1517336714731-489689fd1ca8',
      imageSeed2: '1629654297-8854f6e391e3',
      description: 'MacBook Pro with M3 Pro chip. 14.2" Liquid Retina XDR display, 18GB unified memory, 512GB SSD. Built for demanding workflows with pro-level performance.',
      specs: { "Chip": "Apple M3 Pro", "Display": "14.2\" Liquid Retina XDR", "Memory": "18GB Unified", "Storage": "512GB SSD", "Battery": "Up to 18 hours", "Weight": "3.5 lbs" },
      stock: 18,
      rating: 4.9,
      reviewCount: 89,
      salesCount: 156,
    },
    { 
      sku: 'SAM-S24U', 
      name: 'Galaxy S24 Ultra', 
      slug: 'galaxy-s24-ultra', 
      price: 1299.99, 
      comparePrice: 1419.99,
      cat: cat_mobile.id, 
      brand: b_samsung.id, 
      featured: true,
      imageSeed: '1610945265064-0e34e5519bbf',
      imageSeed2: '1610945415295-d9bbf067e59c',
      description: 'Samsung Galaxy S24 Ultra with 6.8" Dynamic AMOLED 2X display, 200MP camera system, built-in S Pen, and Snapdragon 8 Gen 3. 256GB storage, 12GB RAM.',
      specs: { "Display": "6.8\" Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "Camera": "200MP + 50MP + 12MP + 10MP", "Memory": "12GB RAM", "Storage": "256GB", "Battery": "5000 mAh" },
      stock: 42,
      rating: 4.7,
      reviewCount: 267,
      salesCount: 543,
    },
    { 
      sku: 'SAM-S24', 
      name: 'Galaxy S24', 
      slug: 'galaxy-s24', 
      price: 799.99, 
      comparePrice: 899.99,
      cat: cat_mobile.id, 
      brand: b_samsung.id, 
      isNew: true,
      imageSeed: '1610945265064-0e34e5519bbf',
      imageSeed2: '1610945415295-d9bbf067e59c',
      description: 'Compact flagship with 6.2" Dynamic AMOLED 2X, 50MP triple camera, Snapdragon 8 Gen 3, 128GB storage, 8GB RAM.',
      specs: { "Display": "6.2\" Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "Camera": "50MP + 12MP + 10MP", "Memory": "8GB RAM", "Storage": "128GB", "Battery": "4000 mAh" },
      stock: 35,
      rating: 4.5,
      reviewCount: 98,
      salesCount: 234,
    },
    { 
      sku: 'SON-WH1000', 
      name: 'Sony WH-1000XM5', 
      slug: 'sony-wh-1000xm5', 
      price: 399.00, 
      comparePrice: 449.99,
      cat: cat_audio.id, 
      brand: b_sony.id,
      imageSeed: '1618366712010-f4ae9c647dcb',
      imageSeed2: '1484704849700-f032a568e944',
      description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life, multipoint connection, and speak-to-chat technology.',
      specs: { "Type": "Over-ear Wireless", "Noise Cancellation": "Industry-leading", "Battery": "30 hours (ANC on)", "Charging": "3 min = 1 hour playback", "Drivers": "30mm", "Weight": "250g" },
      stock: 56,
      rating: 4.8,
      reviewCount: 445,
      salesCount: 892,
    },
    { 
      sku: 'SON-PS5-SLIM', 
      name: 'PlayStation 5 Slim', 
      slug: 'ps5-slim', 
      price: 499.99, 
      comparePrice: 549.99,
      cat: cat_gaming.id, 
      brand: b_sony.id, 
      featured: true,
      imageSeed: '1606813907032-1b8e2e7d9b9f',
      imageSeed2: '1593508512-1b8e2e7d9b9f',
      description: 'PS5 Slim with 1TB SSD, ray tracing, 4K gaming up to 120fps, and ultra-high speed SSD. Includes DualSense controller.',
      specs: { "Storage": "1TB SSD", "Graphics": "4K @ 120fps, Ray Tracing", "CPU": "AMD Ryzen Zen 2", "GPU": "AMD RDNA 2", "Ports": "USB-C, USB-A, HDMI 2.1", "Weight": "3.2 kg" },
      stock: 31,
      rating: 4.8,
      reviewCount: 312,
      salesCount: 678,
    },
    { 
      sku: 'DEL-XPS13', 
      name: 'Dell XPS 13', 
      slug: 'dell-xps-13', 
      price: 999.00, 
      comparePrice: 1149.99,
      cat: cat_computing.id, 
      brand: b_dell.id,
      imageSeed: '1593642702821-c8da6771f0c6',
      imageSeed2: '1593642702821-c8da6771f0c6',
      description: 'Ultra-portable 13.4" InfinityEdge display, Intel Core i7-1360P, 16GB LPDDR5, 512GB SSD. Premium aluminum chassis.',
      specs: { "Display": "13.4\" FHD+ InfinityEdge", "Processor": "Intel Core i7-1360P", "Memory": "16GB LPDDR5", "Storage": "512GB SSD", "Graphics": "Intel Iris Xe", "Weight": "2.59 lbs" },
      stock: 22,
      rating: 4.6,
      reviewCount: 156,
      salesCount: 289,
    },
    { 
      sku: 'LOG-MXM3', 
      name: 'MX Master 3S Mouse', 
      slug: 'logitech-mx-master-3s', 
      price: 99.00, 
      comparePrice: 119.99,
      cat: cat_computing.id, 
      brand: b_logitech.id,
      imageSeed: '1615663245857-ac93bb7c4f0b',
      imageSeed2: '1615663245857-ac93bb7c4f0b',
      description: 'Advanced wireless mouse with 8000 DPI sensor, MagSpeed wheel, ergonomic design, and 70-day battery life. Works on any surface including glass.',
      specs: { "Sensor": "8000 DPI Darkfield", "Battery": "70 days", "Connectivity": "Bluetooth / USB Receiver", "Buttons": "7 programmable", "Weight": "141g", "Scroll": "MagSpeed wheel" },
      stock: 67,
      rating: 4.7,
      reviewCount: 234,
      salesCount: 567,
    },
    { 
      sku: 'APL-IP15P', 
      name: 'iPhone 15 Pro', 
      slug: 'iphone-15-pro', 
      price: 999.00, 
      comparePrice: 1099.00,
      cat: cat_mobile.id, 
      brand: b_apple.id, 
      isNew: true,
      imageSeed: '1591337676887-a217a6970a8a',
      imageSeed2: '1630024205496-2c494c5f1c22',
      description: 'iPhone 15 Pro with A17 Pro chip, 6.1" Super Retina XDR, 48MP Main camera with ProRAW, titanium design, USB-C, 128GB storage.',
      specs: { "Chip": "A17 Pro", "Display": "6.1\" Super Retina XDR", "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto", "Storage": "128GB", "Build": "Titanium", "Battery": "Up to 23 hours video" },
      stock: 48,
      rating: 4.7,
      reviewCount: 189,
      salesCount: 412,
    },
    { 
      sku: 'SAM-WATCH6', 
      name: 'Galaxy Watch 6', 
      slug: 'galaxy-watch-6', 
      price: 299.00, 
      comparePrice: 349.99,
      cat: cat_mobile.id, 
      brand: b_samsung.id,
      imageSeed: '1579586337278-3befd40fd17a',
      imageSeed2: '1546868871702-955d8c8b6b7b',
      description: 'Samsung Galaxy Watch 6 with 44mm display, advanced sleep tracking, body composition analysis, 40-hour battery, Wear OS 4.',
      specs: { "Display": "1.5\" Super AMOLED", "Size": "44mm", "Battery": "40 hours", "OS": "Wear OS 4", "Sensors": "BioActive, GPS, ECG", "Water Resistance": "5ATM + IP68" },
      stock: 41,
      rating: 4.5,
      reviewCount: 178,
      salesCount: 345,
    },
    { 
      sku: 'LOG-G915', 
      name: 'G915 TKL Keyboard', 
      slug: 'logitech-g915-tkl', 
      price: 229.00, 
      comparePrice: 279.99,
      cat: cat_gaming.id, 
      brand: b_logitech.id,
      imageSeed: '1615663245857-ac93bb7c4f0b',
      imageSeed2: '1587827925756-845c6c8c8c8c',
      description: 'Low-profile mechanical gaming keyboard with GL Tactile switches, LIGHTSPEED wireless, RGB lighting, 40-hour battery.',
      specs: { "Switches": "GL Tactile (Low Profile)", "Connectivity": "LIGHTSPEED / Bluetooth", "Battery": "40 hours (RGB on)", "Lighting": "Per-key RGB", "Layout": "TKL", "Height": "22mm" },
      stock: 29,
      rating: 4.6,
      reviewCount: 134,
      salesCount: 289,
    },
    { 
      sku: 'SON-BRAV-A80', 
      name: 'Sony BRAVIA XR A80L 65"', 
      slug: 'sony-bravia-xr-65', 
      price: 2199.00, 
      comparePrice: 2499.99,
      cat: cat_electronics.id, 
      brand: b_sony.id,
      imageSeed: '1593784991095-a205069470b6',
      imageSeed2: '1593784991095-a205069470b6',
      description: '65" BRAVIA XR OLED 4K HDR with Cognitive Processor XR, XR OLED Contrast Pro, Acoustic Surface Audio+, Google TV.',
      specs: { "Display": "65\" 4K OLED", "Processor": "Cognitive Processor XR", "HDR": "XR OLED Contrast Pro", "Audio": "Acoustic Surface Audio+", "OS": "Google TV", "HDMI": "4x HDMI 2.1" },
      stock: 12,
      rating: 4.8,
      reviewCount: 87,
      salesCount: 156,
    },
    { 
      sku: 'APL-AW9', 
      name: 'Apple Watch Series 9', 
      slug: 'apple-watch-9', 
      price: 399.00, 
      comparePrice: 429.00,
      cat: cat_mobile.id, 
      brand: b_apple.id,
      imageSeed: '1434492163284-7e6c3d3f7c3f',
      imageSeed2: '1434492163284-7e6c3d3f7c3f',
      description: 'Apple Watch Series 9 with S9 chip, 45mm Always-On Retina display, Double Tap gesture, 36-hour battery, carbon neutral.',
      specs: { "Chip": "S9 SiP", "Display": "45mm Always-On Retina", "Battery": "36 hours", "Health": "ECG, Blood O2, Temperature", "Build": "Aluminum", "Water Resistance": "50m" },
      stock: 38,
      rating: 4.7,
      reviewCount: 211,
      salesCount: 456,
    },
    { 
      sku: 'SAM-BUDS2P', 
      name: 'Galaxy Buds2 Pro', 
      slug: 'galaxy-buds2-pro', 
      price: 189.00, 
      comparePrice: 229.99,
      cat: cat_audio.id, 
      brand: b_samsung.id,
      imageSeed: '1590658268037-6bf12165a8df',
      imageSeed2: '1590658268037-6bf12165a8df',
      description: 'Samsung Galaxy Buds2 Pro with 24-bit Hi-Fi audio, Intelligent ANC, 360 Audio, 29-hour battery with case, IPX7 water resistance.',
      specs: { "Audio": "24-bit Hi-Fi", "ANC": "Intelligent ANC", "Battery": "5h buds / 29h case", "Charging": "Wireless / USB-C", "Water": "IPX7", "Drivers": "10mm + 5.3mm" },
      stock: 54,
      rating: 4.6,
      reviewCount: 198,
      salesCount: 423,
    },
    { 
      sku: 'DEL-U2723', 
      name: 'Dell UltraSharp 27"', 
      slug: 'dell-ultrasharp-27', 
      price: 599.00, 
      comparePrice: 749.99,
      cat: cat_computing.id, 
      brand: b_dell.id,
      imageSeed: '1593642702821-c8da6771f0c6',
      imageSeed2: '1527443285096-478071b3ae1e',
      description: '27" 4K USB-C hub monitor with IPS Black panel, 99% sRGB, 98% DCI-P3, 120Hz, KVM switch, 90W power delivery.',
      specs: { "Display": "27\" 4K IPS Black", "Color": "99% sRGB, 98% DCI-P3", "Refresh": "120Hz", "Ports": "USB-C 90W PD, HDMI, DP, USB-A", "Features": "KVM, PIP/PBP", "Ergonomics": "Height, tilt, swivel, pivot" },
      stock: 19,
      rating: 4.7,
      reviewCount: 112,
      salesCount: 234,
    },
  ];

  const prodRecords = [];
  for (const p of products) {
    const record = await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description || `High quality ${p.name} with premium features and reliable performance. Ideal for professional and personal use.`,
        price: p.price,
        comparePrice: p.comparePrice || p.price * 1.2,
        categoryId: p.cat,
        brandId: p.brand,
        images: JSON.stringify(p.images || [
          `https://images.unsplash.com/photo-${p.imageSeed || '1517336714731-489689fd1ca8'}?w=800&q=80`,
          `https://images.unsplash.com/photo-${p.imageSeed2 || '1517336714731-489689fd1ca8'}?w=800&q=80&crop=entropy&cs=tinysrgb`
        ]),
        specs: JSON.stringify(p.specs || { "Brand": "Tech", "Warranty": "2 Years", "Condition": "New" }),
        stock: p.stock || Math.floor(Math.random() * 100) + 10,
        rating: p.rating || 4 + Math.random(),
        reviewCount: p.reviewCount || Math.floor(Math.random() * 50),
        salesCount: p.salesCount || Math.floor(Math.random() * 200),
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
      title: 'iPhone 15 Pro vs Galaxy S24 Ultra: Which Flagship Wins?',
      slug: 'iphone-vs-galaxy-comparison',
      excerpt: 'We compare the latest flagships from Apple and Samsung across camera, performance, battery, and value.',
      content: `## iPhone 15 Pro vs Galaxy S24 Ultra: The Ultimate Flagship Battle

In 2024, the smartphone market is dominated by two titans: Apple's iPhone 15 Pro and Samsung's Galaxy S24 Ultra. Both represent the pinnacle of mobile technology, but they take fundamentally different approaches.

### Design & Build
The iPhone 15 Pro features a **titanium frame** – a first for iPhone – making it lighter than ever at 187g. The Galaxy S24 Ultra uses **Armor Aluminum 2.0** with Gorilla Glass Armor, weighing 232g.

### Camera Systems
**iPhone 15 Pro**: 48MP Main + 12MP Ultra Wide + 12MP 3x Telephoto
**Galaxy S24 Ultra**: 200MP Main + 12MP Ultra Wide + 50MP 5x Telephoto + 10MP 3x Telephoto

The S24 Ultra's 200MP sensor captures incredible detail, while the iPhone's 48MP sensor with Photonic Engine excels in low light.

### Performance
- **iPhone 15 Pro**: A17 Pro (3nm) – 6-core CPU, 6-core GPU
- **Galaxy S24 Ultra**: Snapdragon 8 Gen 3 (4nm) – 8-core CPU, Adreno 750 GPU

Both handle gaming and multitasking effortlessly, but the A17 Pro holds a slight edge in single-core performance.

### Battery & Charging
- **iPhone 15 Pro**: Up to 23 hours video, 20W wired, 15W MagSafe
- **Galaxy S24 Ultra**: 5000mAh, 45W wired, 15W wireless, 4.5W reverse

Samsung wins on charging speed and battery capacity.

### Verdict
Choose **iPhone 15 Pro** for: iOS ecosystem, video quality, resale value, compact size.
Choose **Galaxy S24 Ultra** for: Camera versatility, S Pen, charging speed, customization.`,
      author: 'Sarah Chen',
      category: 'Comparisons',
      image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80',
      published: true,
      publishedAt: new Date(),
    }
  });

  await prisma.blogPost.create({
    data: {
      title: 'Best Wireless Headphones 2024: Top Picks for Every Budget',
      slug: 'best-wireless-headphones-2024',
      excerpt: 'From noise-canceling champions to budget-friendly options, we tested 20+ models.',
      content: `## Best Wireless Headphones 2024

After testing over 20 models, here are our top picks.

### 🏆 Best Overall: Sony WH-1000XM5
Industry-leading ANC, 30-hour battery, exceptional comfort.
**Price: $399**

### 🥈 Best for Apple Users: AirPods Max
Seamless iOS integration, spatial audio, premium build.
**Price: $549**

### 🥉 Best Value: Soundcore Space Q45
Great ANC, 50-hour battery, under $150.
**Price: $149**

### 🎮 Best for Gaming: SteelSeries Arctis Nova Pro Wireless
Dual battery system, GameDAC, retractable mic.
**Price: $349**

### Key Factors to Consider
1. **Noise Cancellation** – Sony and Bose lead
2. **Battery Life** – 30+ hours standard
3. **Comfort** – Weight, clamp force, ear cup depth
4. **Codec Support** – LDAC, aptX, AAC

### Our Testing Methodology
We test in real-world conditions: commuting, office, travel, and home.`,
      author: 'Mike Rodriguez',
      category: 'Reviews',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
      published: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    }
  });

  await prisma.blogPost.create({
    data: {
      title: 'Building the Ultimate Gaming Setup on a Budget',
      slug: 'budget-gaming-setup-2024',
      excerpt: 'Create a pro-level gaming station without breaking the bank.',
      content: `## Budget Gaming Setup 2024

You don't need $5000 for a great gaming experience. Here's our $1500 build.

### PC Build (~$900)
- **CPU**: AMD Ryzen 5 7600 ($200)
- **GPU**: RTX 4060 Ti 8GB ($400)
- **RAM**: 32GB DDR5-6000 ($100)
- **SSD**: 1TB NVMe ($80)
- **Motherboard**: B650 ($150)
- **PSU**: 650W Bronze ($70)

### Peripherals (~$400)
- **Monitor**: 27" 1440p 144Hz ($250)
- **Keyboard**: Logitech G915 TKL ($229)
- **Mouse**: Logitech G502 X ($80)
- **Headset**: HyperX Cloud Alpha ($100)

### Total: ~$1,380
Leaves room for upgrades!`,
      author: 'Alex Thompson',
      category: 'Guides',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
      published: true,
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    }
  });

  await prisma.blogPost.create({
    data: {
      title: 'MacBook Air M3 Review: The Perfect Laptop for Most People',
      slug: 'macbook-air-m3-review',
      excerpt: 'Apple\'s latest fanless wonder delivers pro performance in an ultraportable package.',
      content: `## MacBook Air M3 Review

After two weeks with the M3 MacBook Air, it's clear: this is the laptop most people should buy.

### Performance
The M3 chip brings **20% faster CPU** and **15% faster GPU** over M2. Real-world tasks like video export, code compilation, and photo editing are noticeably snappier.

### Battery Life
**18+ hours** of real-world usage. I got through a full workday with 40% remaining. The fanless design means zero noise – ever.

### Display
13.6" Liquid Retina with 500 nits brightness, P3 wide color. Not XDR, but excellent for most users.

### Verdict
At $1099, the M3 Air hits the perfect balance of performance, portability, and price. Unless you need sustained heavy workloads (video rendering, 3D), this is the one.`,
      author: 'Sarah Chen',
      category: 'Reviews',
      image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
      published: true,
      publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
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
      hours: JSON.stringify({ Mon: '9am-9pm', Tue: '9am-9pm', Wed: '9am-9pm', Thu: '9am-9pm', Fri: '9am-9pm', Sat: '10am-6pm', Sun: 'Closed' }),
      latitude: 37.3875,
      longitude: -122.0575,
      active: true,
      email: 'flagship@cybershop.com'
    }
  });

  await prisma.storeLocation.create({
    data: {
      name: 'Downtown Seattle',
      address: '456 Pike St',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      phone: '+1 206-555-0199',
      hours: JSON.stringify({ Mon: '10am-8pm', Tue: '10am-8pm', Wed: '10am-8pm', Thu: '10am-8pm', Fri: '10am-8pm', Sat: '10am-7pm', Sun: '11am-5pm' }),
      latitude: 47.6062,
      longitude: -122.3321,
      active: true,
      email: 'seattle@cybershop.com'
    }
  });

  await prisma.storeLocation.create({
    data: {
      name: 'Austin Domain',
      address: '11400 Burnet Rd Ste 100',
      city: 'Austin',
      state: 'TX',
      postalCode: '78758',
      phone: '+1 512-555-0123',
      hours: JSON.stringify({ Mon: '10am-9pm', Tue: '10am-9pm', Wed: '10am-9pm', Thu: '10am-9pm', Fri: '10am-9pm', Sat: '10am-8pm', Sun: '12pm-6pm' }),
      latitude: 30.3842,
      longitude: -97.7223,
      active: true,
      email: 'austin@cybershop.com'
    }
  });

  // 13. JOBS
  console.log('Creating Job Openings...');
  await prisma.job.create({
    data: {
      title: 'Frontend Developer (React/Next.js)',
      slug: 'frontend-dev-react',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      department: 'Engineering',
      description: 'We\'re looking for a passionate Frontend Developer to join our growing team. You\'ll work on our e-commerce platform, building features that millions of customers interact with daily.',
      requirements: '3+ years React/Next.js experience, TypeScript proficiency, experience with Tailwind CSS, understanding of REST APIs and GraphQL, strong problem-solving skills',
      salary: '$130,000 - $180,000',
      active: true
    }
  });

  await prisma.job.create({
    data: {
      title: 'Senior Backend Engineer (Node.js/PostgreSQL)',
      slug: 'senior-backend-engineer',
      location: 'Remote / Austin',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Design and build scalable backend services for our e-commerce platform. Work with Prisma, PostgreSQL, and modern Node.js.',
      requirements: '5+ years Node.js, PostgreSQL expertise, Prisma ORM experience, API design, Docker/Kubernetes, system architecture',
      salary: '$150,000 - $210,000',
      active: true
    }
  });

  await prisma.job.create({
    data: {
      title: 'UX/UI Designer',
      slug: 'ux-ui-designer',
      location: 'Hybrid / Seattle',
      type: 'Full-time',
      department: 'Design',
      description: 'Create intuitive, beautiful user experiences for our customer-facing products. Work closely with product and engineering teams.',
      requirements: '3+ years product design, Figma expertise, design systems, user research, prototyping, portfolio required',
      salary: '$110,000 - $150,000',
      active: true
    }
  });

  // 14. DEALS
  console.log('Configuring Deals...');
  await prisma.deal.create({
    data: {
      name: 'Welcome Discount',
      slug: 'welcome-10',
      type: 'percentage',
      value: 10,
      description: '10% off your first order',
      scope: 'global',
      minPurchase: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      products: JSON.stringify(['all']),
      banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
      active: true
    }
  });

  await prisma.deal.create({
    data: {
      name: 'Student Discount',
      slug: 'student-15',
      type: 'percentage',
      value: 15,
      description: '15% off for verified students',
      scope: 'global',
      minPurchase: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      products: JSON.stringify(['all']),
      banner: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
      active: true
    }
  });

  await prisma.deal.create({
    data: {
      name: 'MacBook Pro Sale',
      slug: 'macbook-pro-sale',
      type: 'fixed',
      value: 200,
      description: '$200 off MacBook Pro models',
      scope: 'category',
      scopeValue: cat_computing.id,
      minPurchase: 1500,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      products: JSON.stringify([prodRecords.find(p => p.slug?.includes('macbook-pro'))?.id].filter(Boolean)),
      banner: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=80',
      active: true
    }
  });

  await prisma.deal.create({
    data: {
      name: 'Weekend Flash Sale',
      slug: 'weekend-flash',
      type: 'percentage',
      value: 20,
      description: '20% off Audio & Gaming this weekend only',
      scope: 'category',
      scopeValue: cat_audio.id,
      minPurchase: 100,
      startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      products: JSON.stringify(['all']),
      banner: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80',
      active: true
    }
  });

  await prisma.deal.create({
    data: {
      name: 'Free Shipping Weekend',
      slug: 'free-shipping-weekend',
      type: 'free_shipping',
      value: 0,
      description: 'Free shipping on all orders this weekend',
      scope: 'global',
      minPurchase: 0,
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      products: JSON.stringify(['all']),
      banner: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=80',
      active: true
    }
  });

  // 15. SEARCH QUERIES & NOTIFICATIONS
  console.log('Adding interaction history...');
  await prisma.searchQuery.create({ data: { query: 'macbook', resultsCount: 5, searchCount: 15 } });
  await prisma.searchQuery.create({ data: { query: 'galaxy', resultsCount: 8, searchCount: 22 } });
  await prisma.searchQuery.create({ data: { query: 'sony headphones', resultsCount: 12, searchCount: 45 } });
  await prisma.searchQuery.create({ data: { query: 'gaming laptop', resultsCount: 18, searchCount: 67 } });
  await prisma.searchQuery.create({ data: { query: 'iphone 15', resultsCount: 22, searchCount: 89 } });
  await prisma.searchQuery.create({ data: { query: 'mechanical keyboard', resultsCount: 8, searchCount: 34 } });

  await prisma.notification.create({
    data: {
      userId: customer.id,
      type: 'order',
      title: 'Order Completed',
      message: 'Your order ORD-1001 was delivered successfully.',
      link: '/account/orders/ORD-1001'
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer.id,
      type: 'deal',
      title: 'Flash Sale Starting Soon!',
      message: '20% off Audio & Gaming this weekend. Don\'t miss out!',
      link: '/deals'
    }
  });

  await prisma.notification.create({
    data: {
      userId: customer.id,
      type: 'price_drop',
      title: 'Price Drop Alert',
      message: 'Galaxy S24 Ultra is now $100 off!',
      link: '/product/galaxy-s24-ultra'
    }
  });

  // 16. ADDITIONAL REVIEWS
  console.log('Adding more reviews...');
  for (let i = 0; i < Math.min(5, prodRecords.length); i++) {
    const product = prodRecords[i];
    for (let j = 0; j < 3; j++) {
      await prisma.review.create({
        data: {
          productId: product.id,
          productName: product.name,
          userId: customer.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          title: ['Great product!', 'Highly recommended', 'Exceeded expectations', 'Perfect for my needs', 'Best purchase this year'][j % 5],
          content: ['This product exceeded my expectations in every way. The build quality is exceptional and performance is top-notch.', 'I\'ve been using this for a few weeks now and it\'s been flawless. Highly recommend to anyone in the market.', 'Fast shipping, great packaging, product works perfectly. Will definitely buy from here again.', 'The features are exactly what I needed. Great value for the price point.', 'Best purchase I\'ve made this year. Quality is outstanding and customer service was helpful.'][j % 5],
          verified: true,
          helpful: Math.floor(Math.random() * 20),
        }
      });
    }
  }

  // 17. ADDITIONAL WISHLIST ITEMS
  console.log('Adding more wishlist items...');
  for (let i = 0; i < Math.min(8, prodRecords.length); i++) {
    await prisma.wishlistItem.upsert({
      where: {
        userId_productId: {
          userId: customer.id,
          productId: prodRecords[i].id,
        },
      },
      update: {
        priceDrop: Math.random() > 0.5,
        stockAlert: Math.random() > 0.7,
      },
      create: {
        userId: customer.id,
        productId: prodRecords[i].id,
        productName: prodRecords[i].name,
        productSlug: prodRecords[i].slug,
        productPrice: prodRecords[i].price,
        priceDrop: Math.random() > 0.5,
        stockAlert: Math.random() > 0.7,
      }
    });
  }

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
