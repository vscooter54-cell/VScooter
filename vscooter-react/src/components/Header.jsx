import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header() {
  const navigate = useNavigate();
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
      <style>{`
        /* Hamburger Menu Animation */
        .hamburger {
          width: 24px;
          height: 18px;
          position: relative;
          cursor: pointer;
        }

        .hamburger span {
          display: block;
          position: absolute;
          height: 2px;
          width: 100%;
          background: #1a1a1a;
          border-radius: 2px;
          opacity: 1;
          left: 0;
          transition: all 0.3s ease;
        }

        .hamburger span:nth-child(1) {
          top: 0;
        }

        .hamburger span:nth-child(2) {
          top: 8px;
        }

        .hamburger.open span:nth-child(1) {
          top: 8px;
          transform: rotate(45deg);
        }

        .hamburger.open span:nth-child(2) {
          top: 8px;
          transform: rotate(-45deg);
        }

        /* Hide scrollbar for mobile menu */
        .mobile-menu-nav {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .mobile-menu-nav::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Mobile White Bar - Hidden on home page */}
      {!isActive('/') && (
        <div className="md:hidden relative px-5 pt-5 z-[70]">
          <div className={`rounded-lg px-4 py-3 flex items-center justify-between transition-all duration-300 ${
            mobileMenuOpen ? 'bg-transparent shadow-none' : 'bg-white shadow-lg'
          }`}>
            {/* VScooter Logo */}
            <Link to="/">
              <img
                src="/logo.png"
                alt="VScooter Logo"
                className={`h-12 w-auto transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
              />
            </Link>

            {/* Hamburger Menu Icon */}
            <div
              className={`hamburger ${mobileMenuOpen ? 'open' : ''} cursor-pointer relative z-[70]`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header - Only shown on desktop (md and above), completely hidden on mobile */}
      <div className="hidden md:block">
        <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b-2 border-primary/20 dark:border-primary/30 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-24 items-center justify-between py-2">
              <div className="flex items-center">
                <Link to="/">
                  <img src="/logo.png" alt="Vscooter Logo" className="h-[88px] w-auto" />
                </Link>
              </div>
              <nav className="flex items-center gap-8">
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
            <div className="hidden md:flex items-center gap-2 mr-2">
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
      </div>

    {/* Mobile Menu Backdrop */}
    <div
      className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
        mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => setMobileMenuOpen(false)}
      aria-hidden="true"
    />

    {/* Mobile Sliding Menu */}
    <div
      className={`md:hidden fixed top-0 right-0 bottom-0 w-full bg-white shadow-2xl z-[65] transform transition-transform duration-300 ease-out ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Menu Header with Logo */}
        <div className="p-5 flex items-center">
          <img src="/logo.png" alt="VScooter Logo" className="h-20 w-auto" />
        </div>

        {/* Divider */}
        <div className="border-b border-gray-200" />

        {/* Language Selector */}
        <div className="px-4 pt-6 pb-4">
          <div className="relative bg-gray-200 rounded-full p-1 flex items-center">
            <div
              className={`absolute top-1 left-1 h-8 bg-primary rounded-full transition-transform duration-300 ease-out ${
                currentLang === 'en' ? 'translate-x-full' : 'translate-x-0'
              }`}
              style={{ width: 'calc(50% - 4px)' }}
            />
            <button
              className={`relative z-10 flex-1 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                currentLang === 'de' ? 'text-white' : 'text-gray-700'
              }`}
              onClick={() => switchLanguage('de')}
            >
              DE
            </button>
            <button
              className={`relative z-10 flex-1 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                currentLang === 'en' ? 'text-white' : 'text-gray-700'
              }`}
              onClick={() => switchLanguage('en')}
            >
              EN
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 mobile-menu-nav">
          <div className="space-y-2">
            <button
              onClick={() => {
                navigate('/');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all"
            >
              {currentLang === 'en' ? 'Home' : 'Startseite'}
            </button>
            <button
              onClick={() => {
                navigate('/products');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all"
            >
              {currentLang === 'en' ? 'Products' : 'Produkte'}
            </button>
            <button
              onClick={() => {
                navigate('/support');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all"
            >
              {currentLang === 'en' ? 'Support' : 'Unterstützung'}
            </button>
            <button
              onClick={() => {
                navigate('/cart');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all"
            >
              {currentLang === 'en' ? 'Cart' : 'Warenkorb'}
            </button>
            <button
              onClick={() => {
                navigate('/wishlist');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all"
            >
              {currentLang === 'en' ? 'Wishlist' : 'Wunschliste'}
            </button>
          </div>
        </nav>

        {/* Login/Signup Buttons */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-lg font-semibold text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {currentLang === 'en' ? 'Login' : 'Anmelden'}
            </button>
            <button
              onClick={() => {
                navigate('/register');
                setMobileMenuOpen(false);
              }}
              className="flex-1 bg-white border-2 border-primary text-primary py-3 px-6 rounded-lg font-semibold text-base hover:bg-primary hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {currentLang === 'en' ? 'Sign Up' : 'Registrieren'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
