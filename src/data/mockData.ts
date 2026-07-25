import { Product, CategoryItem, Coupon, Order, BulkEnquiry, ProductReview, Complaint } from '../types';

export const HOTLINE_NUMBER = '9507457956';
export const ADMIN_MOBILE_NUMBERS = ['9507457956', '9876543210', '9123456789', '9999999999'];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Shirts',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
    description: 'Crisp formal, oxford, and casual linen shirts tailored for modern gentlemen.',
    itemCount: 42
  },
  {
    id: 'cat-2',
    name: 'T-Shirts',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    description: 'Premium Pima cotton crewnecks, slim polos, and relaxed graphic tees.',
    itemCount: 38
  },
  {
    id: 'cat-3',
    name: 'Jeans',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
    description: 'Selvedge denim, slim taper, and vintage washed stretch jeans.',
    itemCount: 29
  },
  {
    id: 'cat-4',
    name: 'Trousers',
    icon: 'Scissors',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=800',
    description: 'Pleated dress trousers, casual chinos, and sharp Savile Row trousers.',
    itemCount: 24
  },
  {
    id: 'cat-5',
    name: 'Hoodies',
    icon: 'Flame',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    description: 'Heavyweight fleece hoodies, zip-ups, and urban streetwear layers.',
    itemCount: 18
  },
  {
    id: 'cat-6',
    name: 'Jackets',
    icon: 'Wind',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
    description: 'Genuine leather biker jackets, bomber jackets, and trench coats.',
    itemCount: 22
  },
  {
    id: 'cat-7',
    name: 'Blazers',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    description: 'Double-breasted navy blazers, tweed dinner jackets, and linen tuxedos.',
    itemCount: 15
  },
  {
    id: 'cat-8',
    name: 'Shoes',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800',
    description: 'Handcrafted Italian leather Oxfords, Chelsea boots, and minimalist sneakers.',
    itemCount: 31
  },
  {
    id: 'cat-9',
    name: 'Accessories',
    icon: 'Smile',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800',
    description: 'Silk pocket squares, cufflinks, wool scarves, and polarized sunglasses.',
    itemCount: 19
  },
  {
    id: 'cat-10',
    name: 'Watches',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    description: 'Chronograph luxury timepieces, automatic leather watches, and steel bracelets.',
    itemCount: 14
  },
  {
    id: 'cat-11',
    name: 'Belts',
    icon: 'Disc',
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800',
    description: 'Reversible full-grain leather belts with brushed nickel buckles.',
    itemCount: 12
  },
  {
    id: 'cat-12',
    name: 'Wallets',
    icon: 'Wallet',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800',
    description: 'RFID-blocking bifold wallets, slim cardholders, and passport covers.',
    itemCount: 16
  },
  {
    id: 'cat-13',
    name: 'Perfumes',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
    description: 'Long-lasting luxury Eau de Parfum, woody cedar, and fresh amber fragrances.',
    itemCount: 11
  }
];

export const SAMPLE_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    userName: 'Vikram Malhotra',
    userPhone: '98****1234',
    rating: 5,
    comment: 'Impeccable fitting! The cotton quality feels exceptionally premium, just like authentic Jermyn Street shirts.',
    date: '2026-07-12',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    userName: 'Rohan Sharma',
    userPhone: '97****5678',
    rating: 5,
    comment: 'Prompt delivery within 2 days to Mumbai. The blazer padding and lining quality exceeded my expectations.',
    date: '2026-07-18',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    userName: 'Aditya Kapoor',
    userPhone: '91****8899',
    rating: 4,
    comment: 'Great shade of navy blue and comfortable stretch fabric. Slightly long in length but overall worth every rupee.',
    date: '2026-07-20',
    verifiedPurchase: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    name: 'Savile Row Royal Oxford Shirt',
    category: 'Shirts',
    brand: 'London Style Signature',
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    stock: 28,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Crisp White', 'Sky Blue', 'Gentle Pink'],
    description: 'Tailored from 100% Egyptian Giza cotton with a structured spread collar, mother-of-pearl finish buttons, and double-button cuffs.',
    specifications: {
      'Fabric': '100% Egyptian Oxford Cotton',
      'Fit': 'Slim Tailored Fit',
      'Collar': 'English Spread Collar',
      'Sleeve': 'Long Sleeve with Convertible Cuffs',
      'Care': 'Machine Wash Cold or Dry Clean'
    },
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 84,
    reviews: SAMPLE_REVIEWS,
    isTrending: true,
    isNewArrival: true,
    isBestSeller: true,
    isTodayDeal: true,
    createdAt: '2026-07-01'
  },
  {
    id: 'prod-102',
    name: 'Mayfair Wool-Blend Navy Blazer',
    category: 'Blazers',
    brand: 'London Style Luxe',
    price: 6999,
    originalPrice: 9999,
    discount: 30,
    stock: 15,
    sizes: ['38', '40', '42', '44'],
    colors: ['Midnight Navy', 'Charcoal Grey'],
    description: 'A classic British single-breasted blazer crafted from breathable Italian wool blend. Features soft structured shoulders and pocket flap styling.',
    specifications: {
      'Material': '70% Australian Merino Wool, 30% Silk Touch Viscose',
      'Lining': 'Custom Jacquard Silk Lining',
      'Buttons': 'Real Horn Buttons',
      'Vent': 'Double Side Vents'
    },
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 46,
    reviews: SAMPLE_REVIEWS,
    isTrending: true,
    isBestSeller: true,
    createdAt: '2026-06-15'
  },
  {
    id: 'prod-103',
    name: 'Westminster Supima Heavyweight T-Shirt',
    category: 'T-Shirts',
    brand: 'Kensington Basics',
    price: 999,
    originalPrice: 1599,
    discount: 37,
    stock: 45,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Off-White', 'Olive Green', 'Navy'],
    description: '240 GSM ultra-soft Supima cotton crewneck with shape-retaining ribbed collar and clean boxy cut.',
    specifications: {
      'Weight': '240 GSM Heavyweight Cotton',
      'Fabric': '100% Organic Supima Cotton',
      'Neckline': 'Crew Neck',
      'Wash': 'Pre-shrunk Garment Wash'
    },
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 112,
    isNewArrival: true,
    isTrending: true,
    createdAt: '2026-07-10'
  },
  {
    id: 'prod-104',
    name: 'Piccadilly Hand-Finished Leather Oxfords',
    category: 'Shoes',
    brand: 'Churchill & Co.',
    price: 5499,
    originalPrice: 7999,
    discount: 31,
    stock: 12,
    sizes: ['7', '8', '9', '10', '11'],
    colors: ['Cognac Tan', 'Black Onyx'],
    description: 'Hand-burnished full-grain Italian calf leather with Goodyear welted construction and cushioned orthotic insoles.',
    specifications: {
      'Upper': 'Full Grain Italian Calfskin',
      'Sole': 'Leather Sole with Anti-slip Rubber Heel',
      'Construction': 'Goodyear Welted',
      'Lining': 'Breathable Genuine Leather'
    },
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 38,
    isBestSeller: true,
    isTodayDeal: true,
    createdAt: '2026-05-20'
  },
  {
    id: 'prod-105',
    name: 'SOHO Raw Selvedge Slim Stretch Jeans',
    category: 'Jeans',
    brand: 'London Denim Lab',
    price: 2999,
    originalPrice: 4499,
    discount: 33,
    stock: 22,
    sizes: ['M', 'L', 'XL'],
    colors: ['Deep Indigo', 'Washed Charcoal'],
    description: '13.5 oz Japanese selvedge denim woven with 2% elastane for seamless mobility without losing structure.',
    specifications: {
      'Weight': '13.5 oz Selvedge Denim',
      'Stretch': '2% Spandex Stretch',
      'Closure': 'Heavy Duty Brass Zip Fly',
      'Pockets': '5-Pocket Classic Layout'
    },
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542272604-780c36856842?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 65,
    isTrending: true,
    createdAt: '2026-06-28'
  },
  {
    id: 'prod-106',
    name: 'Bond Street Lambskin Biker Leather Jacket',
    category: 'Jackets',
    brand: 'London Style Heritage',
    price: 8999,
    originalPrice: 12999,
    discount: 30,
    stock: 8,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Distressed Black', 'Espresso Brown'],
    description: '100% genuine supple lambskin leather jacket with silver YKK zippers, asymmetric zip closure, and quilted shoulder panels.',
    specifications: {
      'Leather': '100% Genuine Lambskin',
      'Hardware': 'Heavy Gunmetal YKK Zippers',
      'Lining': 'Thermal Quilted Satin',
      'Pockets': '3 Outer Zip Pockets, 2 Inner Chest Pockets'
    },
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 5.0,
    reviewCount: 29,
    isBestSeller: true,
    isNewArrival: true,
    createdAt: '2026-07-05'
  },
  {
    id: 'prod-107',
    name: 'Greenwich Automatic Chronograph Watch',
    category: 'Watches',
    brand: 'Thames Horology',
    price: 7999,
    originalPrice: 11999,
    discount: 33,
    stock: 14,
    sizes: ['M'],
    colors: ['Silver Blue', 'Rose Gold Black'],
    description: 'Self-winding Japanese automatic movement with exhibition case back, sapphire crystal coating, and genuine Italian leather strap.',
    specifications: {
      'Movement': 'Automatic Self-Winding (21 Jewels)',
      'Glass': 'Scratch-resistant Sapphire Crystal',
      'Water Resistance': '50M / 5 ATM',
      'Strap Width': '22mm Genuine Calfskin'
    },
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 31,
    isTodayDeal: true,
    createdAt: '2026-06-10'
  },
  {
    id: 'prod-108',
    name: 'Chelsea Tailored Flat-Front Stretch Chinos',
    category: 'Trousers',
    brand: 'Kensington Basics',
    price: 1899,
    originalPrice: 2799,
    discount: 32,
    stock: 35,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Khaki Beige', 'Olive Drab', 'Navy Blue'],
    description: 'Versatile cotton-twill chinos engineered for work and weekend wear with interior elastic waistband stay.',
    specifications: {
      'Fabric': '98% Cotton Twill, 2% Elastane',
      'Rise': 'Mid Rise Fit',
      'Pockets': 'Welt Back Pockets with Button'
    },
    images: [
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.5,
    reviewCount: 54,
    createdAt: '2026-06-01'
  },
  {
    id: 'prod-109',
    name: 'Hydra Park Cedarwood & Gold Amber Eau De Parfum',
    category: 'Perfumes',
    brand: 'London Apothecary',
    price: 2199,
    originalPrice: 2999,
    discount: 26,
    stock: 40,
    sizes: ['M'],
    colors: ['Amber Glass'],
    description: '100ml long-lasting niche fragrance with top notes of bergamot, heart notes of Virginia cedarwood, and rich base notes of smoky vetiver.',
    specifications: {
      'Volume': '100ml / 3.4 fl oz',
      'Concentration': 'Eau De Parfum (20% Essential Oils)',
      'Longevity': '10-12 Hours Active Wear'
    },
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 77,
    isTrending: true,
    createdAt: '2026-07-15'
  },
  {
    id: 'prod-110',
    name: 'Regent Leather Bifold Wallet with RFID Shield',
    category: 'Wallets',
    brand: 'Churchill & Co.',
    price: 1299,
    originalPrice: 1999,
    discount: 35,
    stock: 50,
    sizes: ['S'],
    colors: ['Chestnut Brown', 'Matte Black'],
    description: 'Slim vegetable-tanned leather wallet with 8 card slots, double cash compartment, and embedded RFID signal blocker.',
    specifications: {
      'Material': '100% Vegetable-Tanned Leather',
      'Capacity': '8 Card Slots, 2 Currency Slots',
      'Protection': 'Military-Grade RFID Blocking'
    },
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 42,
    createdAt: '2026-05-12'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'NEW10',
    discountPercent: 10,
    minPurchase: 999,
    description: '10% OFF on your first purchase above ₹999',
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    code: 'SAVE20',
    discountPercent: 20,
    minPurchase: 2999,
    description: '20% INSTANT DISCOUNT on orders above ₹2,999',
    expiryDate: '2026-12-31',
    isActive: true
  },
  {
    code: 'FREESHIP',
    discountPercent: 100, // Special flag for free shipping discount
    minPurchase: 499,
    description: '100% FREE EXPRESS DELIVERY on orders above ₹499',
    expiryDate: '2026-12-31',
    isActive: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8001',
    orderNumber: 'LS-2026-8001',
    customerPhone: '9876543210',
    customerName: 'Aman Varma',
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Aman Varma',
      phone: '9876543210',
      street: '402, Royal Residency, Marine Lines',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400020',
      addressType: 'Home'
    },
    items: [
      {
        productId: 'prod-101',
        productName: 'Savile Row Royal Oxford Shirt',
        productImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
        brand: 'London Style Signature',
        price: 2499,
        selectedSize: 'L',
        selectedColor: 'Crisp White',
        quantity: 1
      }
    ],
    subtotal: 2499,
    discountAmount: 250,
    couponCode: 'NEW10',
    shippingFee: 0,
    totalAmount: 2249,
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    paymentId: 'pay_UPI_9832148912',
    orderStatus: 'Out For Delivery',
    timeline: [
      { status: 'Pending', timestamp: '2026-07-23 10:15 AM', completed: true },
      { status: 'Confirmed', timestamp: '2026-07-23 10:18 AM', completed: true },
      { status: 'Packed', timestamp: '2026-07-24 09:30 AM', completed: true },
      { status: 'Shipped', timestamp: '2026-07-24 04:00 PM', completed: true },
      { status: 'Out For Delivery', timestamp: '2026-07-25 08:30 AM', note: 'Out for delivery via BlueDart Express', completed: true },
      { status: 'Delivered', timestamp: 'Estimated Today by 5 PM', completed: false }
    ],
    createdAt: '2026-07-23T10:15:00Z',
    estimatedDelivery: 'Today by 5:00 PM'
  },
  {
    id: 'ord-8002',
    orderNumber: 'LS-2026-8002',
    customerPhone: '9507457956',
    customerName: 'Karan Singhania',
    shippingAddress: {
      id: 'addr-2',
      fullName: 'Karan Singhania',
      phone: '9507457956',
      street: '12-B Park Street, Near Victoria Memorial',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700016',
      addressType: 'Work'
    },
    items: [
      {
        productId: 'prod-102',
        productName: 'Mayfair Wool-Blend Navy Blazer',
        productImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
        brand: 'London Style Luxe',
        price: 6999,
        selectedSize: '40',
        selectedColor: 'Midnight Navy',
        quantity: 1
      },
      {
        productId: 'prod-109',
        productName: 'Hydra Park Cedarwood Perfume',
        productImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800',
        brand: 'London Apothecary',
        price: 2199,
        selectedSize: 'M',
        selectedColor: 'Amber Glass',
        quantity: 1
      }
    ],
    subtotal: 9198,
    discountAmount: 1839,
    couponCode: 'SAVE20',
    shippingFee: 0,
    totalAmount: 7359,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    paymentId: 'pay_CC_771829301',
    orderStatus: 'Delivered',
    timeline: [
      { status: 'Pending', timestamp: '2026-07-19 02:20 PM', completed: true },
      { status: 'Confirmed', timestamp: '2026-07-19 02:22 PM', completed: true },
      { status: 'Packed', timestamp: '2026-07-20 11:00 AM', completed: true },
      { status: 'Shipped', timestamp: '2026-07-20 06:00 PM', completed: true },
      { status: 'Out For Delivery', timestamp: '2026-07-22 09:00 AM', completed: true },
      { status: 'Delivered', timestamp: '2026-07-22 01:45 PM', note: 'Handed to customer', completed: true }
    ],
    createdAt: '2026-07-19T14:20:00Z',
    estimatedDelivery: 'Delivered on July 22'
  }
];

export const INITIAL_BULK_ENQUIRIES: BulkEnquiry[] = [
  {
    id: 'bulk-01',
    name: 'Rajesh Sharma',
    phone: '9507457956',
    email: 'rajesh@luxcorp.in',
    companyName: 'LuxCorp Corporate Uniforms',
    category: 'Shirts & Blazers',
    estimatedQuantity: 250,
    message: 'Looking for custom tailored white Oxford shirts with subtle corporate logo embroidery on cuff for our 2026 annual meet.',
    status: 'Contacted',
    createdAt: '2026-07-22T09:30:00Z'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'cmp-01',
    ticketNumber: 'TKT-2026-8812',
    customerPhone: '9507457956',
    customerName: 'Valued Customer',
    orderNumber: 'LS-2026-1001',
    category: 'Wrong Size / Color',
    subject: 'Request size exchange from L to XL for Kensington Oxford Shirt',
    description: 'The Kensington Classic White Oxford Shirt in size L received yesterday is slightly snug on the shoulders. Requesting an exchange for size XL.',
    status: 'In Progress',
    priority: 'Medium',
    adminResponse: 'Our doorstep reverse pickup team has been scheduled for July 26. Replacement XL shirt is allocated and ready for dispatch.',
    createdAt: '2026-07-24T10:15:00Z',
    updatedAt: '2026-07-24T14:30:00Z'
  },
  {
    id: 'cmp-02',
    ticketNumber: 'TKT-2026-7204',
    customerPhone: '9507457956',
    customerName: 'Valued Customer',
    orderNumber: 'LS-2026-1002',
    category: 'Delivery Delay',
    subject: 'Inquiry regarding expected delivery date for Mayfair Navy Blazer',
    description: 'Ordered Mayfair Wool-Blend Blazer for an upcoming corporate event. Please expedite delivery or provide direct BlueDart tracking number.',
    status: 'Resolved',
    priority: 'High',
    adminResponse: 'Shipment handed over to BlueDart Express AWB# 8812039. Estimated arrival by tomorrow 2:00 PM.',
    createdAt: '2026-07-23T16:00:00Z',
    updatedAt: '2026-07-24T11:20:00Z'
  },
  {
    id: 'cmp-03',
    ticketNumber: 'TKT-2026-5190',
    customerPhone: '9507457956',
    customerName: 'Valued Customer',
    category: 'Bulk Order Inquiry',
    subject: 'Bulk discount quotation status for 250 White Shirts',
    description: 'Submitted bulk inquiry on July 22 for corporate uniform order. Requesting fabric sample swatches and wholesale price quote.',
    status: 'Resolved',
    priority: 'High',
    adminResponse: 'Fabric swatch sample booklet dispatched via courier. Account Manager Vikram Malhotra (+91 9507457956) has sent the quotation via email.',
    createdAt: '2026-07-22T11:00:00Z',
    updatedAt: '2026-07-23T09:15:00Z'
  }
];
