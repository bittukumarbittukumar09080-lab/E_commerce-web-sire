import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CategoryItem, CartItem, Coupon, Order, UserProfile, SizeType, Complaint, BulkEnquiry } from '../types';
import { HOTLINE_NUMBER } from '../data/mockData';

interface ShopContextType {
  user: UserProfile | null;
  cart: CartItem[];
  wishlist: Product[];
  products: Product[];
  categories: CategoryItem[];
  coupons: Coupon[];
  orders: Order[];
  complaints: Complaint[];
  userBulkEnquiries: BulkEnquiry[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (o: Order | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (c: string) => void;
  isOtpModalOpen: boolean;
  setIsOtpModalOpen: (open: boolean) => void;
  otpModalTargetRole: 'customer' | 'admin';
  setOtpModalTargetRole: (role: 'customer' | 'admin') => void;
  appliedCoupon: Coupon | null;

  // Actions
  addToCart: (product: Product, size: SizeType, color: string, qty?: number) => void;
  removeFromCart: (productId: string, size: SizeType, color: string) => void;
  updateCartQty: (productId: string, size: SizeType, color: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  placeOrder: (shippingAddress: any, paymentMethod: any, paymentId?: string) => Promise<Order | null>;
  loginUser: (phone: string, name?: string, role?: 'customer' | 'admin') => void;
  logoutUser: () => void;
  refreshProducts: () => void;
  refreshOrders: () => void;
  refreshComplaints: () => void;
  refreshUserBulkEnquiries: () => void;
  addProduct: (p: Partial<Product>) => Promise<boolean>;
  editProduct: (id: string, p: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: string, note?: string) => Promise<boolean>;
  submitBulkEnquiry: (data: any) => Promise<boolean>;
  submitComplaint: (data: Partial<Complaint>) => Promise<boolean>;
  updateComplaintStatus: (id: string, status: string, adminResponse?: string) => Promise<boolean>;
  addReviewToProduct: (productId: string, rating: number, comment: string, name?: string) => Promise<boolean>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('london_style_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('london_style_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('london_style_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [userBulkEnquiries, setUserBulkEnquiries] = useState<BulkEnquiry[]>([]);

  const [activeTab, setActiveTab] = useState<string>('Home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  const [isOtpModalOpen, setIsOtpModalOpen] = useState<boolean>(false);
  const [otpModalTargetRole, setOtpModalTargetRole] = useState<'customer' | 'admin'>('customer');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Sync state to local storage
  useEffect(() => {
    if (user) localStorage.setItem('london_style_user', JSON.stringify(user));
    else localStorage.removeItem('london_style_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('london_style_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('london_style_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Initial Fetch
  const refreshProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to fetch products', e);
    }
  };

  const refreshCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) {
      console.error('Failed to fetch categories', e);
    }
  };

  const refreshCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data);
      }
    } catch (e) {
      console.error('Failed to fetch coupons', e);
    }
  };

  const refreshOrders = async () => {
    try {
      const url = user?.role === 'admin' ? '/api/orders' : `/api/orders?phone=${user?.phone || ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
    }
  };

  const refreshComplaints = async () => {
    try {
      const url = user?.role === 'admin' ? '/api/complaints' : `/api/complaints?phone=${user?.phone || ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (e) {
      console.error('Failed to fetch complaints', e);
    }
  };

  const refreshUserBulkEnquiries = async () => {
    try {
      const url = user?.role === 'admin' ? '/api/bulk-enquiry' : `/api/bulk-enquiry?phone=${user?.phone || ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setUserBulkEnquiries(data);
      }
    } catch (e) {
      console.error('Failed to fetch bulk enquiries', e);
    }
  };

  useEffect(() => {
    refreshProducts();
    refreshCategories();
    refreshCoupons();
  }, []);

  useEffect(() => {
    if (user) {
      refreshOrders();
      refreshComplaints();
      refreshUserBulkEnquiries();
    }
  }, [user]);

  // Cart Management
  const addToCart = (product: Product, size: SizeType, color: string, qty = 1) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string, size: SizeType, color: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
    ));
  };

  const updateCartQty = (productId: string, size: SizeType, color: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === size && item.selectedColor === color) {
        return { ...item, quantity: qty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Coupon
  const applyCoupon = (code: string) => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    
    const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    if (cartSubtotal < found.minPurchase) {
      return { success: false, message: `Minimum purchase of ₹${found.minPurchase} required for coupon ${found.code}` };
    }

    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Place Order
  const placeOrder = async (shippingAddress: any, paymentMethod: any, paymentId?: string) => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    
    let discountAmount = 0;
    let shippingFee = subtotal > 1499 ? 0 : 99;

    if (appliedCoupon) {
      if (appliedCoupon.discountPercent === 100) { // FREESHIP
        shippingFee = 0;
      } else {
        discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    const payload = {
      customerPhone: user?.phone || shippingAddress.phone || '9507457956',
      customerName: user?.name || shippingAddress.fullName || 'Customer',
      shippingAddress,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.images[0],
        brand: item.product.brand,
        price: item.product.price,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        quantity: item.quantity
      })),
      subtotal,
      discountAmount,
      couponCode: appliedCoupon?.code || '',
      shippingFee,
      totalAmount,
      paymentMethod,
      paymentId
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const createdOrder: Order = await res.json();
        clearCart();
        refreshOrders();
        refreshProducts();
        setSelectedOrder(createdOrder);
        setActiveTab('OrderTracking');
        return createdOrder;
      }
    } catch (e) {
      console.error('Failed to place order', e);
    }
    return null;
  };

  // User Auth
  const loginUser = (phone: string, name?: string, role: 'customer' | 'admin' = 'customer') => {
    const profile: UserProfile = {
      phone,
      name: name || (role === 'admin' ? 'Admin Manager' : 'Valued Customer'),
      role,
      addresses: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setUser(profile);
    setIsOtpModalOpen(false);
  };

  const logoutUser = () => {
    setUser(null);
    setActiveTab('Home');
  };

  // Admin Actions
  const addProduct = async (p: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        refreshProducts();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const editProduct = async (id: string, p: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        refreshProducts();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        refreshProducts();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const updateOrderStatus = async (orderId: string, status: string, note?: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status, note })
      });
      if (res.ok) {
        refreshOrders();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const submitBulkEnquiry = async (data: any) => {
    try {
      const res = await fetch('/api/bulk-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        refreshUserBulkEnquiries();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const submitComplaint = async (data: Partial<Complaint>) => {
    try {
      const payload = {
        customerPhone: user?.phone || data.customerPhone || '9507457956',
        customerName: user?.name || data.customerName || 'Valued Customer',
        orderNumber: data.orderNumber,
        category: data.category || 'General Issue',
        subject: data.subject,
        description: data.description,
        priority: data.priority || 'Medium'
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        refreshComplaints();
        return true;
      }
    } catch (e) {
      console.error('Failed to submit complaint', e);
    }
    return false;
  };

  const updateComplaintStatus = async (id: string, status: string, adminResponse?: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminResponse })
      });
      if (res.ok) {
        refreshComplaints();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const addReviewToProduct = async (productId: string, rating: number, comment: string, name?: string) => {
    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment,
          userName: name || user?.name || 'Customer',
          userPhone: user?.phone || ''
        })
      });
      if (res.ok) {
        refreshProducts();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  return (
    <ShopContext.Provider value={{
      user,
      cart,
      wishlist,
      products,
      categories,
      coupons,
      orders,
      complaints,
      userBulkEnquiries,
      activeTab,
      setActiveTab,
      selectedProduct,
      setSelectedProduct,
      selectedOrder,
      setSelectedOrder,
      searchQuery,
      setSearchQuery,
      selectedCategoryFilter,
      setSelectedCategoryFilter,
      isOtpModalOpen,
      setIsOtpModalOpen,
      otpModalTargetRole,
      setOtpModalTargetRole,
      appliedCoupon,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      isInWishlist,
      applyCoupon,
      removeCoupon,
      placeOrder,
      loginUser,
      logoutUser,
      refreshProducts,
      refreshOrders,
      refreshComplaints,
      refreshUserBulkEnquiries,
      addProduct,
      editProduct,
      deleteProduct,
      updateOrderStatus,
      submitBulkEnquiry,
      submitComplaint,
      updateComplaintStatus,
      addReviewToProduct
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
