import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { OtpModal } from './components/OtpModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { OffersPage } from './pages/OffersPage';
import { BulkPurchasePage } from './pages/BulkPurchasePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

const MainContent: React.FC = () => {
  const { activeTab } = useShop();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const renderTab = () => {
    switch (activeTab) {
      case 'Home':
        return <HomePage />;
      case 'Shop':
        return <ShopPage />;
      case 'ProductDetails':
        return <ProductDetailsPage />;
      case 'Cart':
        return <CartPage />;
      case 'Checkout':
        return <CheckoutPage />;
      case 'CustomerDashboard':
      case 'Orders':
        return <OrdersPage />;
      case 'Wishlist':
        return <WishlistPage />;
      case 'Categories':
        return <CategoriesPage />;
      case 'Offers':
        return <OffersPage />;
      case 'BulkPurchase':
        return <BulkPurchasePage />;
      case 'About':
        return <AboutPage />;
      case 'Contact':
        return <ContactPage />;
      case 'Admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 font-sans selection:bg-amber-500 selection:text-zinc-950">
      <Header />
      <main className="flex-1">
        {renderTab()}
      </main>
      <Footer />
      <OtpModal />
    </div>
  );
};

export function App() {
  return (
    <ShopProvider>
      <MainContent />
    </ShopProvider>
  );
}

export default App;
