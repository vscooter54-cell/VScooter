import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const { currentLang, switchLanguage, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
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
            <button className="md:hidden">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
