import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { HOTLINE_NUMBER } from '../data/mockData';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  PhoneCall, 
  ShieldCheck, 
  Menu, 
  X, 
  Sparkles, 
  Package,
  Headphones,
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Building2
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    user, 
    cart, 
    wishlist, 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery,
    setIsOtpModalOpen,
    setOtpModalTargetRole,
    logoutUser,
    products,
    setSelectedProduct
  } = useShop();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const openCustomerLogin = () => {
    setOtpModalTargetRole('customer');
    setIsOtpModalOpen(true);
    setIsUserDropdownOpen(false);
  };

  const openAdminLogin = () => {
    setOtpModalTargetRole('admin');
    setIsOtpModalOpen(true);
    setIsUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-xs">
      {/* Top Banner with Toll Free Hotline & Bulk Purchase Info */}
      <div className="bg-zinc-900 text-zinc-100 text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-center md:text-left flex-wrap justify-center">
            <a 
              href={`tel:${HOTLINE_NUMBER}`} 
              className="flex items-center gap-1.5 font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Toll Free Hotline: <strong>{HOTLINE_NUMBER}</strong></span>
            </a>
            <span className="hidden md:inline text-zinc-600">|</span>
            <span className="flex items-center gap-1 text-zinc-300">
              <Headphones className="w-3.5 h-3.5 text-zinc-400" />
              <span>Complaints & Support: <strong>{HOTLINE_NUMBER}</strong></span>
            </span>
            <span className="hidden md:inline text-zinc-600">|</span>
            <button 
              onClick={() => handleNav('BulkPurchase')}
              className="text-amber-300 hover:underline flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Bulk Purchases & Wholesale Quotes</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <button 
              onClick={() => handleNav('Offers')} 
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Offers & Coupons</span>
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                if (user) handleNav('Orders');
                else openCustomerLogin();
              }}
              className="hover:text-zinc-200 transition-colors flex items-center gap-1"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Orders</span>
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                if (user) handleNav('Orders');
                else openCustomerLogin();
              }}
              className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-zinc-700 hover:text-zinc-900 focus:outline-hidden"
          aria-label="Toggle Navigation"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('Home')}>
          <div className="w-10 h-10 bg-zinc-900 text-amber-400 rounded-sm flex items-center justify-center font-serif font-bold text-xl tracking-wider border border-amber-500/30 shadow-xs">
            LS
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-black tracking-widest text-zinc-900 block leading-none">
              LONDON STYLE
            </span>
            <span className="text-[10px] tracking-wider text-amber-700 font-medium uppercase block mt-1">
              Dress Smart. Live in Style.
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm tracking-wide text-zinc-700">
          {[
            { id: 'Home', label: 'Home' },
            { id: 'Shop', label: 'Shop Catalog' },
            { id: 'Categories', label: 'Categories' },
            { id: 'Orders', label: 'Customer Dashboard' },
            { id: 'Offers', label: 'Deals & Offers' },
            { id: 'BulkPurchase', label: 'Bulk Enquiries' },
            { id: 'About', label: 'About Us' },
            { id: 'Contact', label: 'Contact' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`py-2 border-b-2 transition-all ${
                activeTab === item.id 
                  ? 'border-amber-600 text-zinc-900 font-semibold' 
                  : 'border-transparent hover:border-zinc-300 hover:text-zinc-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop Search Bar */}
          <div className="relative hidden md:block w-56 lg:w-72">
            <input
              type="text"
              placeholder="Search shirts, blazers, shoes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'Shop') setActiveTab('Shop');
              }}
              className="w-full bg-zinc-100 hover:bg-zinc-50 border border-zinc-200 rounded-full py-2 pl-9 pr-4 text-xs focus:outline-hidden focus:border-amber-600 focus:bg-white transition-all text-zinc-900"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />

            {/* Quick search autosuggest overlay */}
            {searchResults.length > 0 && searchQuery.length > 1 && (
              <div className="absolute top-full mt-2 w-full bg-white border border-zinc-200 rounded-lg shadow-xl py-2 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Quick Results
                </div>
                {searchResults.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setActiveTab('ProductDetails');
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-50 flex items-center gap-3 border-b border-zinc-100 last:border-none"
                  >
                    <img src={prod.images[0]} alt={prod.name} className="w-8 h-8 object-cover rounded-xs" />
                    <div className="overflow-hidden">
                      <div className="text-xs font-medium text-zinc-900 truncate">{prod.name}</div>
                      <div className="text-[11px] text-amber-700 font-semibold">₹{prod.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile search toggle */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-2 text-zinc-700 hover:text-zinc-900"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => handleNav('Wishlist')}
            className="relative p-2 text-zinc-700 hover:text-zinc-900 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => handleNav('Cart')}
            className="relative bg-zinc-900 text-white px-3.5 py-2 rounded-full hover:bg-zinc-800 transition-colors flex items-center gap-2 text-xs font-semibold shadow-xs"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">₹{cartSubtotal.toLocaleString()}</span>
            {cartItemsCount > 0 && (
              <span className="bg-amber-500 text-zinc-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Account / OTP Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-1.5 p-2 rounded-full hover:bg-zinc-100 text-zinc-800 transition-colors"
            >
              <div className="w-7 h-7 bg-zinc-200 rounded-full flex items-center justify-center text-zinc-700 font-bold text-xs">
                {user ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hidden sm:block" />
            </button>

            {/* Dropdown menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 rounded-xl shadow-xl py-2 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <div className="font-semibold text-xs text-zinc-900">{user.name}</div>
                      <div className="text-[11px] text-zinc-500">📞 {user.phone}</div>
                      <span className="inline-block mt-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                        {user.role === 'admin' ? 'Authorized Admin' : 'Customer Account'}
                      </span>
                    </div>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => { handleNav('Admin'); setIsUserDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={() => { handleNav('Orders'); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-amber-800 bg-amber-50/60 hover:bg-amber-100 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-amber-600" />
                      <span>Customer Dashboard</span>
                    </button>

                    <button
                      onClick={() => { handleNav('Wishlist'); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-zinc-500" />
                      <span>My Wishlist ({wishlist.length})</span>
                    </button>

                    <button
                      onClick={() => { logoutUser(); setIsUserDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-zinc-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-2 text-xs text-zinc-500 border-b border-zinc-100">
                      Welcome to London Style
                    </div>
                    <button
                      onClick={openCustomerLogin}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-amber-600" />
                      <span>Customer Login (OTP)</span>
                    </button>
                    <button
                      onClick={openAdminLogin}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      <span>Admin Portal Login</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {isSearchOpen && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-zinc-100 bg-zinc-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Search shirts, jeans, blazers, perfumes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'Shop') setActiveTab('Shop');
              }}
              className="w-full bg-white border border-zinc-300 rounded-lg py-2 pl-9 pr-4 text-xs text-zinc-900 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 py-3 space-y-2">
          {[
            { id: 'Home', label: 'Home' },
            { id: 'Shop', label: 'Shop Catalog' },
            { id: 'Categories', label: 'Categories' },
            { id: 'Orders', label: 'Customer Dashboard' },
            { id: 'Offers', label: 'Offers & Coupons' },
            { id: 'BulkPurchase', label: 'Bulk Purchases & Hotline' },
            { id: 'About', label: 'About Us' },
            { id: 'Contact', label: 'Contact Us' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === item.id ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
