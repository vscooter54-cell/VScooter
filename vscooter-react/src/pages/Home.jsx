import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function Home() {
  const navigate = useNavigate();
  const { currentLang, switchLanguage } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [advantageSlide1, setAdvantageSlide1] = useState(0);
  const [advantageSlide2, setAdvantageSlide2] = useState(0);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

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

  // Scroll animation for individual items
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const itemId = entry.target.dataset.animateId;
          if (itemId) {
            setVisibleItems((prev) => new Set(prev).add(itemId));
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      animateElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [products]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      // Get only featured scooters
      const data = response?.data?.data || [];
      const featured = data.filter(
        (p) => p.category === 'scooter' && p.isFeatured && p.isActive
      );
      setProducts(featured);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      alert(currentLang === 'en' ? 'Added to cart!' : 'Zum Warenkorb hinzugefügt!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(currentLang === 'en' ? 'Failed to add to cart' : 'Fehler beim Hinzufügen zum Warenkorb');
    }
  };

  const testimonials = [
    {
      name: 'Ethan Carter',
      time: currentLang === 'en' ? '2 months ago' : 'Vor 2 Monaten',
      rating: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfCyJnibJRoybyNUuJ6z8qkaBFaUNDV2c6K5w0mhKd5c5EMySXPBmweaQKt5T2wL3VUg9TWPK3OZeTKyU_mRpcRfZ1d1BurZwaxXWbpG2ei0ui3oml21H_Xd5JFe2Cmw0_ruQsJN_PlkELdjdS-kZtPJfV6lLHeYLWhy0gstZ6DaHyHLeYvRTTlLX60MoKrvtVjR8jMEEtlnBSuDQuNSiBZ9-xZV5vKCBDDLu05usm1HnotKHtJ-354jeHELM6DVG-9yDbkP8eLgE6',
      text: currentLang === 'en'
        ? 'Best purchase I\'ve made this year! The Falcon 500 is incredibly smooth and the battery life exceeds expectations.'
        : 'Bester Kauf, den ich dieses Jahr getätigt habe! Der Falcon 500 ist unglaublich geschmeidig und die Akkulaufzeit übertrifft die Erwartungen.'
    },
    {
      name: 'Olivia Bennett',
      time: currentLang === 'en' ? '3 months ago' : 'Vor 3 Monaten',
      rating: 4,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA83Bzx4n_92X3mKUkXvkGOTWzN7RjgVSQy38_k-g4RRZc6roDyyoUZ8mnWr5gtAFiskl6AixthGSCJznykL9ZGdjJoh9btg0cNm8F57YsIMp29kcw0rIWrXUyWDOEulTtoYvyRvG7fmDpvd5odfnasJoUw_NzLJk9DD53V2x9YVK0mA5t34U6Yp6Lg9v0lg6cR1g9hli2QCFpq_flpfje3RitNNS1CT6Oxl_lRBriZU6ejtT6DrLmycLONdpD1M-hXDMzAbAU4JSA0',
      text: currentLang === 'en'
        ? 'Great scooter for daily commuting. Very reliable and the customer service was excellent.'
        : 'Toller Roller für den täglichen Pendelverkehr. Sehr zuverlässig und der Kundenservice war ausgezeichnet.'
    },
    {
      name: 'Noah Thompson',
      time: currentLang === 'en' ? '4 months ago' : 'Vor 4 Monaten',
      rating: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMkKqA5887PyEvMoAoMGbHHQk-Rh_q2cRtzfXC0qx-aTsH5YTspd7j5aYqFbdgaN6R5T1fVrp9MmpUPpYOUSN-IfVcNDarmQb9_fTjeBiGDONL6h16LRJjS1L9iaVPhoZCPH29tDsqpXs4tLslrkG9Jn_L_d8NyBGt49IbljYSjy-gwLtrjleFDcrdUvV71tCnkGEHrA7Eh1xj9e3tYHrks_9-IUuh4lLy9Sj-OF0rGZ5DD8nHxNm12eq-5mZCHd4Ns5BZnyaIpZE_',
      text: currentLang === 'en'
        ? 'The Amiga is absolutely worth the investment. Premium quality and incredible performance!'
        : 'Der Amiga ist die Investition absolut wert. Premium-Qualität und unglaubliche Leistung!'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <main className="flex-grow">
      <style>{`
        .animate-on-scroll {
          opacity: 0;
          transform: scale(0.8) translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .animate-on-scroll.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

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

        .hamburger.open span {
          background: #1a1a1a;
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
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .mobile-menu-nav::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }

        /* Hide scrollbar on mobile devices */
        @media (max-width: 768px) {
          body {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
          }

          body::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }

          main {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          main::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      {/* Hero Section - Single Banner */}
      <section className="relative h-[100vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Banner Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          >
            <source src="/banner-video.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src="/banner2.webp"
              alt="VScooter Hero Banner"
              className="w-full h-full object-cover object-center"
            />
          </video>
        </div>

        {/* Mobile White Bar Overlay */}
        <div className="md:hidden absolute top-5 left-5 right-5 z-[70]">
          <div className={`rounded-lg px-4 py-3 flex items-center justify-between transition-all duration-300 ${
            mobileMenuOpen
              ? 'bg-transparent shadow-none'
              : 'bg-white shadow-lg'
          }`}>
            {/* VScooter Logo */}
            <img
              src="/logo.png"
              alt="VScooter Logo"
              className={`h-12 w-auto transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Right Side: Enquire Now + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Enquire Now Button */}
              <button
                onClick={() => navigate('/contact')}
                className={`bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                {currentLang === 'en' ? 'Enquire Now' : 'Jetzt anfragen'}
              </button>

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
        </div>

        {/* CTA Buttons - Positioned at bottom (Desktop Only) */}
        <div className="absolute bottom-12 left-0 right-0 z-10 hidden md:flex gap-4 justify-center px-4">
          <button
            onClick={() => navigate('/test-drive')}
            className="bg-white/20 dark:bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-primary hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-white/30"
          >
            <span className="material-symbols-outlined text-xl">directions_car</span>
            {currentLang === 'en' ? 'Book a Test Drive' : 'Probefahrt buchen'}
          </button>
          <button
            onClick={() => navigate('/contact?callback=true')}
            className="bg-white/20 dark:bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-accent hover:border-accent hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-white/30"
          >
            <span className="material-symbols-outlined text-xl">call</span>
            {currentLang === 'en' ? 'Get a Call' : 'Rückruf erhalten'}
          </button>
        </div>
      </section>

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
            {/* VScooter Logo */}
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

      {/* Quick Actions Section - Mobile Only */}
      <div className="md:hidden bg-gray-50 py-6 flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          {currentLang === 'en' ? 'Quick Actions' : 'Schnellzugriff'}
        </h2>
        <div className="flex flex-col gap-4 w-[90vw]">
          {/* Test Ride */}
          <button
            onClick={() => navigate('/test-drive')}
            className="flex items-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <span className="material-symbols-outlined text-primary text-3xl">directions_car</span>
            </div>
            <span className="text-base font-semibold text-gray-900">
              {currentLang === 'en' ? 'Test Ride' : 'Probefahrt'}
            </span>
          </button>

          {/* Compare Models */}
          <button
            onClick={() => navigate('/products')}
            className="flex items-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <span className="material-symbols-outlined text-primary text-3xl">compare_arrows</span>
            </div>
            <span className="text-base font-semibold text-gray-900">
              {currentLang === 'en' ? 'Compare Models' : 'Modelle vergleichen'}
            </span>
          </button>

          {/* Shop Now */}
          <button
            onClick={() => navigate('/products')}
            className="flex items-center bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <span className="material-symbols-outlined text-primary text-3xl">shopping_bag</span>
            </div>
            <span className="text-base font-semibold text-gray-900">
              {currentLang === 'en' ? 'Shop Now' : 'Jetzt kaufen'}
            </span>
          </button>
        </div>
      </div>

      {/* VScooter Electric Family */}
      <section className="py-16 md:py-24 bg-white dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {currentLang === 'en' ? 'VScooter Electric Family' : 'VScooter Elektro-Familie'}
          </h2>
          {loading ? (
            <div className="mt-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {currentLang === 'en' ? 'Loading products...' : 'Produkte werden geladen...'}
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Slideshow Container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {products.map((product) => (
                    <div key={product._id} className="w-full flex-shrink-0 px-4">
                      <div className="max-w-md mx-auto">
                        {/* Price Starting At */}
                        <p className="text-center text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                          {currentLang === 'en' ? 'Price Starting at' : 'Preis ab'}{' '}
                          <span className="text-2xl font-bold text-primary">€{product.pricing.eur}</span>
                        </p>

                        {/* Product Card */}
                        <div className="bg-white dark:bg-gray-900/50 rounded-2xl overflow-hidden shadow-xl">
                          {/* Image with Name Overlay */}
                          <div className="relative h-96 bg-gradient-to-br from-primary/10 to-primary/30">
                            <img
                              alt={product.name[currentLang]}
                              className="w-full h-full object-contain object-center"
                              src={`/${product.primaryImage?.url || product.images[0]?.url}`}
                            />
                            {/* Name at Top */}
                            <div className="absolute top-6 left-0 right-0 text-center">
                              <h3 className="text-3xl font-bold text-gray-900 dark:text-white drop-shadow-lg">
                                {product.name[currentLang]}
                              </h3>
                              {product.isPremium && (
                                <span className="inline-block mt-2 bg-primary text-white text-xs px-3 py-1 rounded-full font-bold">
                                  PREMIUM
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons at Bottom */}
                          <div className="p-6 flex gap-3">
                            <button
                              onClick={() => navigate('/test-drive')}
                              className="flex-1 bg-white border-2 border-primary text-primary py-3 px-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              {currentLang === 'en' ? 'Test Ride' : 'Probefahrt'}
                            </button>
                            <button
                              onClick={() => handleProductClick(product._id)}
                              className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                            >
                              {currentLang === 'en' ? `Explore ${product.name.en}` : `${product.name.de} erkunden`}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {products.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
                    aria-label="Previous"
                  >
                    <span className="material-symbols-outlined text-gray-900 dark:text-white">chevron_left</span>
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
                    aria-label="Next"
                  >
                    <span className="material-symbols-outlined text-gray-900 dark:text-white">chevron_right</span>
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {products.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {products.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        currentSlide === index ? 'bg-primary w-8' : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Advantages of owning a V */}
      <section className="py-16 md:py-24 bg-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {currentLang === 'en' ? (
                <>
                  Advantages of owning a{' '}
                  <span className="text-primary inline-block animate-pulse" style={{
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, bounce 1s ease-in-out infinite',
                    fontSize: '1.2em',
                    fontWeight: '900'
                  }}>
                    V
                  </span>
                </>
              ) : (
                <>
                  Vorteile eines{' '}
                  <span className="text-primary inline-block animate-pulse" style={{
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, bounce 1s ease-in-out infinite',
                    fontSize: '1.2em',
                    fontWeight: '900'
                  }}>
                    V
                  </span>
                  {' '}besitzen
                </>
              )}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              {currentLang === 'en'
                ? 'Experience the best in electric mobility with our premium features'
                : 'Erleben Sie das Beste in elektrischer Mobilität mit unseren Premium-Funktionen'}
            </p>
          </div>
          {/* Row 1 Slideshow */}
          <div className="mt-12 relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${advantageSlide1 * 100}%)` }}
              >
                {[
                  { name: 'One View Display', nameDE: 'Ein-Ansicht-Display' },
                  { name: 'Fast Charging', nameDE: 'Schnellladung' },
                  { name: 'Storage Space', nameDE: 'Stauraum' }
                ].map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0 flex justify-center px-4">
                    <div className="w-[90vw] h-[50vh] bg-gradient-to-br from-primary/10 to-primary/30 rounded-2xl shadow-xl flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentLang === 'en' ? item.name : item.nameDE}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows Row 1 */}
            <button
              onClick={() => setAdvantageSlide1((prev) => (prev === 0 ? 2 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
              aria-label="Previous"
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">chevron_left</span>
            </button>
            <button
              onClick={() => setAdvantageSlide1((prev) => (prev === 2 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
              aria-label="Next"
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">chevron_right</span>
            </button>

            {/* Dots Row 1 */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setAdvantageSlide1(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    advantageSlide1 === index ? 'bg-primary w-8' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Row 2 Slideshow */}
          <div className="mt-12 relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${advantageSlide2 * 100}%)` }}
              >
                {[
                  { name: 'Long Battery Life', nameDE: 'Lange Akkulaufzeit' },
                  { name: 'High Performance', nameDE: 'Hohe Leistung' },
                  { name: 'Eco-Friendly', nameDE: 'Umweltfreundlich' }
                ].map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0 flex justify-center px-4">
                    <div className="w-[90vw] h-[50vh] bg-gradient-to-br from-accent/10 to-accent/30 rounded-2xl shadow-xl flex items-center justify-center">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentLang === 'en' ? item.name : item.nameDE}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows Row 2 */}
            <button
              onClick={() => setAdvantageSlide2((prev) => (prev === 0 ? 2 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
              aria-label="Previous"
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">chevron_left</span>
            </button>
            <button
              onClick={() => setAdvantageSlide2((prev) => (prev === 2 ? 0 : prev + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
              aria-label="Next"
            >
              <span className="material-symbols-outlined text-gray-900 dark:text-white">chevron_right</span>
            </button>

            {/* Dots Row 2 */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setAdvantageSlide2(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    advantageSlide2 === index ? 'bg-primary w-8' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Banner1 Background */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/banner1.webp"
            alt="Customer testimonials background"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg">
            {currentLang === 'en' ? 'What Our Customers Say' : 'Was unsere Kunden sagen'}
          </h2>

          {/* Mobile Slideshow */}
          <div className="md:hidden mt-12 relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <img
                          alt={testimonial.name}
                          className="size-12 rounded-full object-cover"
                          src={testimonial.image}
                        />
                        <div>
                          <p className="font-bold text-white drop-shadow">{testimonial.name}</p>
                          <p className="text-sm text-white/80 drop-shadow">{testimonial.time}</p>
                        </div>
                      </div>
                      <div className="flex mt-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-primary text-lg">star</span>
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-lg">star</span>
                        ))}
                      </div>
                      <p className="mt-4 text-white drop-shadow">{testimonial.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous testimonial"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Next testimonial"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-primary w-8' : 'bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid mt-12 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                data-animate-id={`testimonial-${index}`}
                className={`rounded-xl p-6 animate-on-scroll ${visibleItems.has(`testimonial-${index}`) ? 'visible' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <img
                    alt={testimonial.name}
                    className="size-12 rounded-full object-cover"
                    src={testimonial.image}
                  />
                  <div>
                    <p className="font-bold text-white drop-shadow">{testimonial.name}</p>
                    <p className="text-sm text-white/80 drop-shadow">{testimonial.time}</p>
                  </div>
                </div>
                <div className="flex mt-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-primary text-lg">star</span>
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-lg">star</span>
                  ))}
                </div>
                <p className="mt-4 text-white drop-shadow">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
