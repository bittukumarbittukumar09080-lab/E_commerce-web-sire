export type CategoryType = 
  | 'Shirts' 
  | 'T-Shirts' 
  | 'Jeans' 
  | 'Trousers' 
  | 'Hoodies' 
  | 'Jackets' 
  | 'Blazers' 
  | 'Shoes' 
  | 'Accessories' 
  | 'Watches' 
  | 'Belts' 
  | 'Wallets' 
  | 'Perfumes';

export type SizeType = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '38' | '40' | '42' | '44' | '7' | '8' | '9' | '10' | '11';

export type OrderStatus = 'Pending' | 'Confirmed' | 'Packed' | 'Shipped' | 'Out For Delivery' | 'Delivered' | 'Cancelled' | 'Returned';

export type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Cash on Delivery';

export interface ProductReview {
  id: string;
  userName: string;
  userPhone?: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  images?: string[];
  verifiedPurchase?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number; // Percentage
  stock: number;
  sizes: SizeType[];
  colors: string[];
  description: string;
  specifications: Record<string, string>;
  images: string[];
  rating: number;
  reviewCount: number;
  reviews?: ProductReview[];
  isTrending?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTodayDeal?: boolean;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: CategoryType;
  icon: string;
  image: string;
  description: string;
  itemCount: number;
}

export interface CartItem {
  product: Product;
  selectedSize: SizeType;
  selectedColor: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minPurchase: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
  addressType: 'Home' | 'Work' | 'Other';
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  brand: string;
  price: number;
  selectedSize: SizeType;
  selectedColor: string;
  quantity: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerPhone: string;
  customerName: string;
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentId?: string;
  orderStatus: OrderStatus;
  timeline: OrderTimeline[];
  createdAt: string;
  estimatedDelivery: string;
}

export interface UserProfile {
  phone: string;
  name: string;
  email?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  joinedDate: string;
}

export interface BulkEnquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyName?: string;
  category: string;
  estimatedQuantity: number;
  message: string;
  status: 'Pending' | 'Contacted' | 'Closed';
  createdAt: string;
}

export type ComplaintCategory = 
  | 'Order Issue' 
  | 'Delivery Delay' 
  | 'Damaged / Defective Item' 
  | 'Wrong Size / Color' 
  | 'Refund & Payment' 
  | 'Bulk Order Inquiry' 
  | 'General Issue';

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Complaint {
  id: string;
  ticketNumber: string;
  customerPhone: string;
  customerName: string;
  orderNumber?: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  adminResponse?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalCustomers: number;
  totalProducts: number;
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  categorySales: { category: string; sales: number }[];
  topSellingProducts: { name: string; category: string; unitsSold: number; revenue: number }[];
}
