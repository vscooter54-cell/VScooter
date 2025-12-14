import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { currentLang, switchLanguage, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle ESC key to close menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b-2 border-primary/20 dark:border-primary/30 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between py-2">
          <div className="flex items-center">
            <Link to="/">
              <img src="/logo.png" alt="Vscooter Logo" className="h-[88px] w-auto" />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              className={`text-base font-semibold transition-colors ${
                isActive('/') ? 'text-primary' : 'hover:text-primary'
              }`}
              to="/"
            >
              {t('home')}
            </Link>
            <Link
              className={`text-base font-semibold transition-colors ${
                isActive('/products') ? 'text-primary' : 'hover:text-primary'
              }`}
              to="/products"
            >
              {t('products')}
            </Link>
            <Link
              className={`text-base font-semibold transition-colors ${
                isActive('/features') ? 'text-primary' : 'hover:text-primary'
              }`}
              to="/features"
            >
              {t('features')}
            </Link>
            <Link
              className={`text-base font-semibold transition-colors ${
                isActive('/support') ? 'text-primary' : 'hover:text-primary'
              }`}
              to="/support"
            >
              {t('support')}
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <button
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  currentLang === 'de'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => switchLanguage('de')}
              >
                DE
              </button>
              <button
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  currentLang === 'en'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => switchLanguage('en')}
              >
                EN
              </button>
            </div>

            {/* Wishlist Icon */}
            <Link to="/wishlist" className="relative hover:text-primary transition-colors" title="Wishlist">
              <span className="material-symbols-outlined">favorite</span>
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="relative hover:text-primary transition-colors" title="Cart">
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth buttons */}
            {isAuthenticated ? (
              <Link
                to="/account"
                className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                {user?.firstName || t('account')}
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                {t('login') || 'Login'}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Menu Backdrop Overlay */}
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
        mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setMobileMenuOpen(false)}
      aria-hidden="true"
    />

    {/* Mobile Menu Drawer */}
    <div
      className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-out md:hidden ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <img src="/logo.png" alt="Vscooter Logo" className="h-16 w-auto" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2">
            {[
              { path: '/', label: t('home') },
              { path: '/products', label: t('products') },
              { path: '/features', label: t('features') },
              { path: '/support', label: t('support') },
            ].map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-6 py-4 rounded-xl text-lg font-semibold transition-all ${
                  isActive(item.path)
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                style={{
                  animation: mobileMenuOpen ? `slideInRight 0.3s ease-out ${index * 0.05}s both` : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-200 dark:border-gray-800" />

          {/* Quick Action Buttons */}
          <div className="space-y-3 px-2">
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">favorite</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {t('wishlist') || 'Wishlist'}
              </span>
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-4 px-6 py-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-primary">shopping_cart</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {t('cart') || 'Cart'}
                {cartCount > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>
          </div>
        </nav>

        {/* Footer Section with Language & Auth */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
          {/* Language Switcher */}
          <div className="flex gap-2">
            <button
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentLang === 'de'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => switchLanguage('de')}
            >
              DE
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentLang === 'en'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              onClick={() => switchLanguage('en')}
            >
              EN
            </button>
          </div>

          {/* Auth Button */}
          {isAuthenticated ? (
            <Link
              to="/account"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-gradient-to-r from-primary to-accent text-white px-5 py-4 rounded-lg text-center font-bold hover:shadow-lg transition-all"
            >
              {user?.firstName || t('account')}
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-gradient-to-r from-primary to-accent text-white px-5 py-4 rounded-lg text-center font-bold hover:shadow-lg transition-all"
            >
              {t('login') || 'Login'}
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
