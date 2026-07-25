import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COUPONS, 
  INITIAL_ORDERS, 
  INITIAL_BULK_ENQUIRIES,
  INITIAL_COMPLAINTS,
  HOTLINE_NUMBER,
  ADMIN_MOBILE_NUMBERS
} from './src/data/mockData';
import { Product, Order, Coupon, BulkEnquiry, ProductReview, CategoryItem, Complaint } from './src/types';
import { supabaseServer, syncToSupabase, fetchFromSupabase, SUPABASE_CONFIG } from './server/supabaseServer';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State
let products: Product[] = [...INITIAL_PRODUCTS];
let categories: CategoryItem[] = [...INITIAL_CATEGORIES];
let coupons: Coupon[] = [...INITIAL_COUPONS];
let orders: Order[] = [...INITIAL_ORDERS];
let bulkEnquiries: BulkEnquiry[] = [...INITIAL_BULK_ENQUIRIES];
let complaints: Complaint[] = [...INITIAL_COMPLAINTS];

// OTP Store: phone -> { code: string, expiresAt: number }
const otpStore: Record<string, { code: string; expiresAt: number }> = {};

// Sync initial seed data to Supabase in background
async function initializeSupabaseData() {
  console.log(`[Supabase Initializer] Connecting to project: ${SUPABASE_CONFIG.projectId}`);
  
  // Try fetching orders from Supabase if table exists
  const remoteOrders = await fetchFromSupabase('orders');
  if (remoteOrders && Array.isArray(remoteOrders) && remoteOrders.length > 0) {
    console.log(`[Supabase Initializer] Hydrated ${remoteOrders.length} orders from Supabase.`);
    orders = remoteOrders.map((ro: any) => ({
      ...ro,
      customerPhone: ro.customer_phone || ro.customerPhone,
      customerName: ro.customer_name || ro.customerName,
      shippingAddress: typeof ro.shipping_address === 'string' ? JSON.parse(ro.shipping_address) : (ro.shipping_address || ro.shippingAddress),
      items: typeof ro.items === 'string' ? JSON.parse(ro.items) : ro.items,
      subtotal: Number(ro.subtotal),
      discountAmount: Number(ro.discount_amount || ro.discountAmount || 0),
      shippingFee: Number(ro.shipping_fee || ro.shippingFee || 0),
      totalAmount: Number(ro.total_amount || ro.totalAmount),
      paymentMethod: ro.payment_method || ro.paymentMethod,
      paymentStatus: ro.payment_status || ro.paymentStatus,
      paymentId: ro.payment_id || ro.paymentId,
      orderStatus: ro.order_status || ro.orderStatus,
      timeline: typeof ro.timeline === 'string' ? JSON.parse(ro.timeline) : ro.timeline,
      createdAt: ro.created_at || ro.createdAt,
      estimatedDelivery: ro.estimated_delivery || ro.estimatedDelivery
    }));
  } else {
    // Seed existing orders to Supabase
    for (const ord of INITIAL_ORDERS) {
      await syncToSupabase('orders', {
        id: ord.id,
        order_number: ord.orderNumber,
        customer_phone: ord.customerPhone,
        customer_name: ord.customerName,
        shipping_address: JSON.stringify(ord.shippingAddress),
        items: JSON.stringify(ord.items),
        subtotal: ord.subtotal,
        discount_amount: ord.discountAmount,
        coupon_code: ord.couponCode,
        shipping_fee: ord.shippingFee,
        total_amount: ord.totalAmount,
        payment_method: ord.paymentMethod,
        payment_status: ord.paymentStatus,
        payment_id: ord.paymentId,
        order_status: ord.orderStatus,
        timeline: JSON.stringify(ord.timeline),
        created_at: ord.createdAt,
        estimated_delivery: ord.estimatedDelivery
      });
    }
  }

  // Sync bulk enquiries
  const remoteBulk = await fetchFromSupabase('bulk_enquiries');
  if (remoteBulk && Array.isArray(remoteBulk) && remoteBulk.length > 0) {
    console.log(`[Supabase Initializer] Hydrated ${remoteBulk.length} bulk enquiries from Supabase.`);
    bulkEnquiries = remoteBulk.map((rb: any) => ({
      ...rb,
      companyName: rb.company_name || rb.companyName,
      estimatedQuantity: rb.estimated_quantity || rb.estimatedQuantity,
      createdAt: rb.created_at || rb.createdAt
    }));
  } else {
    for (const b of INITIAL_BULK_ENQUIRIES) {
      await syncToSupabase('bulk_enquiries', {
        id: b.id,
        name: b.name,
        email: b.email,
        phone: b.phone,
        company_name: b.companyName,
        category: b.category,
        estimated_quantity: b.estimatedQuantity,
        message: b.message,
        status: b.status,
        created_at: b.createdAt
      });
    }
  }

  // Sync complaints
  const remoteComplaints = await fetchFromSupabase('complaints');
  if (remoteComplaints && Array.isArray(remoteComplaints) && remoteComplaints.length > 0) {
    console.log(`[Supabase Initializer] Hydrated ${remoteComplaints.length} complaints from Supabase.`);
    complaints = remoteComplaints.map((rc: any) => ({
      ...rc,
      ticketNumber: rc.ticket_number || rc.ticketNumber,
      customerPhone: rc.customer_phone || rc.customerPhone,
      customerName: rc.customer_name || rc.customerName,
      orderNumber: rc.order_number || rc.orderNumber,
      adminResponse: rc.admin_response || rc.adminResponse,
      createdAt: rc.created_at || rc.createdAt,
      updatedAt: rc.updated_at || rc.updatedAt
    }));
  } else {
    for (const cmp of INITIAL_COMPLAINTS) {
      await syncToSupabase('complaints', {
        id: cmp.id,
        ticket_number: cmp.ticketNumber,
        customer_phone: cmp.customerPhone,
        customer_name: cmp.customerName,
        order_number: cmp.orderNumber,
        category: cmp.category,
        subject: cmp.subject,
        description: cmp.description,
        status: cmp.status,
        priority: cmp.priority,
        admin_response: cmp.adminResponse,
        created_at: cmp.createdAt,
        updated_at: cmp.updatedAt
      });
    }
  }
}

initializeSupabaseData().catch(e => console.error('[Supabase Init Error]', e));

// ======================= API ROUTES =======================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    brand: 'London Style', 
    hotline: HOTLINE_NUMBER,
    supabaseConnected: true,
    supabaseProjectId: SUPABASE_CONFIG.projectId,
    supabaseUrl: SUPABASE_CONFIG.url
  });
});

app.get('/api/supabase/status', async (req, res) => {
  try {
    const { data: ordersCount, error: ordersErr } = await supabaseServer.from('orders').select('id', { count: 'exact', head: true });
    const { data: bulkCount, error: bulkErr } = await supabaseServer.from('bulk_enquiries').select('id', { count: 'exact', head: true });
    const { data: complaintCount, error: cmpErr } = await supabaseServer.from('complaints').select('id', { count: 'exact', head: true });

    res.json({
      status: 'online',
      projectId: SUPABASE_CONFIG.projectId,
      url: SUPABASE_CONFIG.url,
      keyConfigured: Boolean(SUPABASE_CONFIG.apiKey),
      counts: {
        ordersInMemory: orders.length,
        bulkEnquiriesInMemory: bulkEnquiries.length,
        complaintsInMemory: complaints.length
      },
      supabaseTables: {
        ordersError: ordersErr ? ordersErr.message : null,
        bulkEnquiriesError: bulkErr ? bulkErr.message : null,
        complaintsError: cmpErr ? cmpErr.message : null
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Supabase check failed' });
  }
});


// Products API
app.get('/api/products', (req, res) => {
  const { category, search, brand, minPrice, maxPrice, size, color, isTrending, isNewArrival, isBestSeller, isTodayDeal } = req.query;

  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (brand && brand !== 'All') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.colors.some(c => c.toLowerCase().includes(q)) ||
      p.sizes.some(s => s.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    filtered = filtered.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter(p => p.price <= Number(maxPrice));
  }

  if (size) {
    filtered = filtered.filter(p => p.sizes.includes(size as any));
  }

  if (color) {
    filtered = filtered.filter(p => p.colors.some(c => c.toLowerCase().includes((color as string).toLowerCase())));
  }

  if (isTrending === 'true') filtered = filtered.filter(p => p.isTrending);
  if (isNewArrival === 'true') filtered = filtered.filter(p => p.isNewArrival);
  if (isBestSeller === 'true') filtered = filtered.filter(p => p.isBestSeller);
  if (isTodayDeal === 'true') filtered = filtered.filter(p => p.isTodayDeal);

  res.json(filtered);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Add Product (Admin)
app.post('/api/products', (req, res) => {
  const newProduct: Product = {
    ...req.body,
    id: `prod-${Date.now()}`,
    rating: req.body.rating || 5.0,
    reviewCount: 0,
    reviews: [],
    createdAt: new Date().toISOString()
  };
  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// Edit Product (Admin)
app.put('/api/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// Delete Product (Admin)
app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Product deleted' });
});

// Add Review
app.post('/api/products/:id/reviews', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const newReview: ProductReview = {
    id: `rev-${Date.now()}`,
    userName: req.body.userName || 'Customer',
    userPhone: req.body.userPhone || '',
    rating: Number(req.body.rating) || 5,
    comment: req.body.comment || '',
    date: new Date().toISOString().split('T')[0],
    verifiedPurchase: true
  };

  if (!product.reviews) product.reviews = [];
  product.reviews.unshift(newReview);
  product.reviewCount = product.reviews.length;
  
  // Recalculate rating
  const avg = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
  product.rating = Number(avg.toFixed(1));

  res.status(201).json({ product, review: newReview });
});

// Categories API
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// OTP Auth API
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Invalid 10-digit mobile number' });
  }

  // Generate 4-digit OTP code (Demo shortcut: last 4 digits or fixed 4579 for fast testing)
  const code = phone.slice(-4) || '4579';
  otpStore[phone] = {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
  };

  const isAdmin = ADMIN_MOBILE_NUMBERS.includes(phone);

  res.json({ 
    success: true, 
    message: `OTP sent to ${phone}`,
    demoOtp: code, // Rendered in UI for convenient verification
    isAdmin
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const entry = otpStore[phone];

  // Allow test OTPs or last 4 digits
  const expectedOtp = entry ? entry.code : phone.slice(-4);
  
  if (otp !== expectedOtp && otp !== '1234' && otp !== '4579') {
    return res.status(400).json({ error: 'Incorrect OTP. Please enter valid 4-digit OTP.' });
  }

  const isAdmin = ADMIN_MOBILE_NUMBERS.includes(phone);

  res.json({
    success: true,
    user: {
      phone,
      name: isAdmin ? 'Admin Manager' : 'Valued Customer',
      role: isAdmin ? 'admin' : 'customer',
      joinedDate: '2026-01-01'
    }
  });
});

// Coupons API
app.get('/api/coupons', (req, res) => {
  res.json(coupons);
});

app.post('/api/coupons', (req, res) => {
  const newCoupon: Coupon = {
    ...req.body,
    isActive: true
  };
  coupons.push(newCoupon);
  res.status(201).json(newCoupon);
});

// Orders API
app.get('/api/orders', (req, res) => {
  const { phone } = req.query;
  if (phone) {
    const userOrders = orders.filter(o => o.customerPhone === phone);
    return res.json(userOrders);
  }
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const { customerPhone, customerName, shippingAddress, items, subtotal, discountAmount, couponCode, shippingFee, totalAmount, paymentMethod, paymentId } = req.body;

  const orderId = `ord-${Date.now()}`;
  const orderNumber = `LS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    customerPhone,
    customerName,
    shippingAddress,
    items,
    subtotal,
    discountAmount: discountAmount || 0,
    couponCode: couponCode || '',
    shippingFee: shippingFee || 0,
    totalAmount,
    paymentMethod,
    paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
    paymentId: paymentId || `pay_${Date.now()}`,
    orderStatus: 'Pending',
    timeline: [
      { status: 'Pending', timestamp: new Date().toLocaleString(), completed: true, note: 'Order placed successfully' },
      { status: 'Confirmed', timestamp: 'Processing...', completed: false },
      { status: 'Packed', timestamp: 'Pending', completed: false },
      { status: 'Shipped', timestamp: 'Pending', completed: false },
      { status: 'Out For Delivery', timestamp: 'Pending', completed: false },
      { status: 'Delivered', timestamp: 'Pending', completed: false }
    ],
    createdAt: new Date().toISOString(),
    estimatedDelivery: '3 to 5 Business Days'
  };

  // Reduce product stock
  items.forEach((item: any) => {
    const p = products.find(prod => prod.id === item.productId);
    if (p) {
      p.stock = Math.max(0, p.stock - item.quantity);
    }
  });

  orders.unshift(newOrder);

  // Sync to Supabase
  syncToSupabase('orders', {
    id: newOrder.id,
    order_number: newOrder.orderNumber,
    customer_phone: newOrder.customerPhone,
    customer_name: newOrder.customerName,
    shipping_address: JSON.stringify(newOrder.shippingAddress),
    items: JSON.stringify(newOrder.items),
    subtotal: newOrder.subtotal,
    discount_amount: newOrder.discountAmount,
    coupon_code: newOrder.couponCode,
    shipping_fee: newOrder.shippingFee,
    total_amount: newOrder.totalAmount,
    payment_method: newOrder.paymentMethod,
    payment_status: newOrder.paymentStatus,
    payment_id: newOrder.paymentId,
    order_status: newOrder.orderStatus,
    timeline: JSON.stringify(newOrder.timeline),
    created_at: newOrder.createdAt,
    estimated_delivery: newOrder.estimatedDelivery
  }).catch(e => console.error('[Supabase Order Sync Error]', e));

  res.status(201).json(newOrder);
});

// Admin Update Order Status
app.patch('/api/orders/:id/status', (req, res) => {
  const { orderStatus, note } = req.body;
  const order = orders.find(o => o.id === req.params.id);

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.orderStatus = orderStatus;
  
  // Update timeline
  const idx = order.timeline.findIndex(t => t.status === orderStatus);
  if (idx !== -1) {
    // Mark up to this status as completed
    for (let i = 0; i <= idx; i++) {
      order.timeline[i].completed = true;
      if (!order.timeline[i].timestamp || order.timeline[i].timestamp === 'Pending' || order.timeline[i].timestamp === 'Processing...') {
        order.timeline[i].timestamp = new Date().toLocaleString();
      }
    }
    if (note) order.timeline[idx].note = note;
  }

  // Sync updated status to Supabase
  syncToSupabase('orders', {
    id: order.id,
    order_number: order.orderNumber,
    customer_phone: order.customerPhone,
    customer_name: order.customerName,
    shipping_address: JSON.stringify(order.shippingAddress),
    items: JSON.stringify(order.items),
    subtotal: order.subtotal,
    discount_amount: order.discountAmount,
    coupon_code: order.couponCode,
    shipping_fee: order.shippingFee,
    total_amount: order.totalAmount,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    payment_id: order.paymentId,
    order_status: order.orderStatus,
    timeline: JSON.stringify(order.timeline),
    created_at: order.createdAt,
    estimated_delivery: order.estimatedDelivery
  }).catch(e => console.error('[Supabase Order Status Sync Error]', e));

  res.json(order);
});

// Bulk Enquiry API
app.post('/api/bulk-enquiry', (req, res) => {
  const enquiry: BulkEnquiry = {
    id: `bulk-${Date.now()}`,
    ...req.body,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  bulkEnquiries.unshift(enquiry);

  // Sync to Supabase
  syncToSupabase('bulk_enquiries', {
    id: enquiry.id,
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    company_name: enquiry.companyName,
    category: enquiry.category,
    estimated_quantity: enquiry.estimatedQuantity,
    message: enquiry.message,
    status: enquiry.status,
    created_at: enquiry.createdAt
  }).catch(e => console.error('[Supabase Bulk Enquiry Sync Error]', e));

  res.status(201).json(enquiry);
});

app.get('/api/bulk-enquiry', (req, res) => {
  const { phone } = req.query;
  if (phone) {
    const userBulk = bulkEnquiries.filter(b => b.phone === phone);
    return res.json(userBulk);
  }
  res.json(bulkEnquiries);
});

// Complaints & Support Issues API
app.get('/api/complaints', (req, res) => {
  const { phone } = req.query;
  if (phone) {
    const userComplaints = complaints.filter(c => c.customerPhone === phone);
    return res.json(userComplaints);
  }
  res.json(complaints);
});

app.post('/api/complaints', (req, res) => {
  const { customerPhone, customerName, orderNumber, category, subject, description, priority } = req.body;
  if (!customerPhone || !subject || !description) {
    return res.status(400).json({ error: 'Customer phone, subject, and description are required' });
  }

  const newTicketNumber = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newComplaint: Complaint = {
    id: `cmp-${Date.now()}`,
    ticketNumber: newTicketNumber,
    customerPhone,
    customerName: customerName || 'Valued Customer',
    orderNumber: orderNumber || undefined,
    category: category || 'General Issue',
    subject,
    description,
    status: 'Open',
    priority: priority || 'Medium',
    adminResponse: 'Your support ticket has been registered. Our customer care specialist will respond within 2 to 4 business hours.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  complaints.unshift(newComplaint);

  // Sync to Supabase
  syncToSupabase('complaints', {
    id: newComplaint.id,
    ticket_number: newComplaint.ticketNumber,
    customer_phone: newComplaint.customerPhone,
    customer_name: newComplaint.customerName,
    order_number: newComplaint.orderNumber,
    category: newComplaint.category,
    subject: newComplaint.subject,
    description: newComplaint.description,
    status: newComplaint.status,
    priority: newComplaint.priority,
    admin_response: newComplaint.adminResponse,
    created_at: newComplaint.createdAt,
    updated_at: newComplaint.updatedAt
  }).catch(e => console.error('[Supabase Complaint Sync Error]', e));

  res.status(201).json(newComplaint);
});

app.patch('/api/complaints/:id/status', (req, res) => {
  const { status, adminResponse, priority } = req.body;
  const complaint = complaints.find(c => c.id === req.params.id || c.ticketNumber === req.params.id);

  if (!complaint) {
    return res.status(404).json({ error: 'Complaint ticket not found' });
  }

  if (status) complaint.status = status;
  if (adminResponse !== undefined) complaint.adminResponse = adminResponse;
  if (priority) complaint.priority = priority;
  complaint.updatedAt = new Date().toISOString();

  // Sync to Supabase
  syncToSupabase('complaints', {
    id: complaint.id,
    ticket_number: complaint.ticketNumber,
    customer_phone: complaint.customerPhone,
    customer_name: complaint.customerName,
    order_number: complaint.orderNumber,
    category: complaint.category,
    subject: complaint.subject,
    description: complaint.description,
    status: complaint.status,
    priority: complaint.priority,
    admin_response: complaint.adminResponse,
    created_at: complaint.createdAt,
    updated_at: complaint.updatedAt
  }).catch(e => console.error('[Supabase Complaint Status Sync Error]', e));

  res.json(complaint);
});

// Admin Analytics API
app.get('/api/admin/analytics', (req, res) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
  const totalOrders = orders.length;
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const totalCustomers = new Set(orders.map(o => o.customerPhone)).size;

  const categoryMap: Record<string, number> = {};
  const productMap: Record<string, { name: string; category: string; unitsSold: number; revenue: number }> = {};

  orders.forEach(o => {
    o.items.forEach(item => {
      // Category sales
      const cat = item.brand || 'Apparel';
      categoryMap[cat] = (categoryMap[cat] || 0) + (item.price * item.quantity);

      // Product sales
      if (!productMap[item.productId]) {
        productMap[item.productId] = {
          name: item.productName,
          category: item.brand,
          unitsSold: 0,
          revenue: 0
        };
      }
      productMap[item.productId].unitsSold += item.quantity;
      productMap[item.productId].revenue += item.price * item.quantity;
    });
  });

  const categorySales = Object.entries(categoryMap).map(([category, sales]) => ({ category, sales }));
  const topSellingProducts = Object.values(productMap).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);

  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, orders: 12 },
    { month: 'Feb', revenue: 62000, orders: 18 },
    { month: 'Mar', revenue: 58000, orders: 15 },
    { month: 'Apr', revenue: 78000, orders: 22 },
    { month: 'May', revenue: 95000, orders: 28 },
    { month: 'Jun', revenue: 110000, orders: 34 },
    { month: 'Jul', revenue: totalRevenue || 125000, orders: totalOrders || 38 }
  ];

  res.json({
    totalRevenue,
    totalOrders,
    todayOrders,
    pendingOrders,
    deliveredOrders,
    totalCustomers,
    totalProducts: products.length,
    monthlyRevenue,
    categorySales,
    topSellingProducts
  });
});

// ======================= VITE MIDDLEWARE =======================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`London Style Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
