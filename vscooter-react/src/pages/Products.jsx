import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ProductModal from '../components/ProductModal';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function Products() {
  const navigate = useNavigate();
  const { currentLang, switchLanguage } = useLanguage();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
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

  // Not needed for continuous sliding effect

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products from API...');
      const response = await productAPI.getAll();
      console.log('API Response:', response);
      console.log('Response data:', response?.data);
      console.log('Response data.data:', response?.data?.data);

      // Separate scooters and accessories
      const data = response?.data?.data || [];
      console.log('Extracted data array:', data);
      const scooters = data.filter(p => p.category === 'scooter' && p.isActive);
      const accs = data.filter(p => p.category === 'accessory' && p.isActive);
      console.log('Scooters:', scooters.length, 'Accessories:', accs.length);

      setProducts(scooters);
      setAccessories(accs);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      console.error('Error details:', err.response || err.message);
      setError('Failed to load products. Please try again later.');
      setProducts([]);
      setAccessories([]);
    } finally {
      setLoading(false);
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
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

  const nextImage = (productId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] + 1) % totalImages
    }));
  };

  const prevImage = (productId, totalImages) => {
    setCurrentImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] - 1 + totalImages) % totalImages
    }));
  };

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {currentLang === 'en' ? 'Loading products...' : 'Produkte werden geladen...'}
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            {currentLang === 'en' ? 'Retry' : 'Erneut versuchen'}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow relative">
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

        /* Dual-layer Parallax Window Effect */
        .window-system {
          position: relative;
          overflow: hidden;
          height: 100%;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.2) 100%);
        }

        /* Outer layer: Moving window frames */
        .window-frames {
          display: flex;
          position: absolute;
          height: 100%;
          animation: moveFrames 8s linear infinite;
        }

        .window-frames:hover {
          animation-play-state: paused;
        }

        .window-frames:hover .image-reel {
          animation-play-state: paused;
        }

        .window-pane {
          width: 300px;
          height: 100%;
          border-right: 4px solid rgba(107, 114, 128, 0.3);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .window-pane:last-child {
          border-right: none;
        }

        /* Inner layer: Moving image reel (slower) */
        .image-reel {
          display: flex;
          position: absolute;
          height: 100%;
          animation: moveImages 20s linear infinite;
        }

        .reel-item {
          width: 300px;
          height: 100%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
        }

        .reel-item img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        @keyframes moveFrames {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1500px);
          }
        }

        @keyframes moveImages {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1800px);
          }
        }
      `}</style>

      {/* Banner Section - 50vh height from top */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden -mt-20 md:-mt-0">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/banner1.webp"
            alt="VScooter Products Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
            {currentLang === 'en' ? 'Our Products' : 'Unsere Produkte'}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-lg max-w-2xl mx-auto">
            {currentLang === 'en'
              ? 'Discover our range of premium electric scooters'
              : 'Entdecken Sie unsere Auswahl an Premium-Elektrorollern'}
          </p>
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
          <div className="p-5 flex items-center">
            <img src="/logo.png" alt="VScooter Logo" className="h-20 w-auto" />
          </div>
          <div className="border-b border-gray-200" />

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

          <nav className="flex-1 overflow-y-auto px-4">
            <div className="space-y-2">
              <button onClick={() => { navigate('/'); setMobileMenuOpen(false); }} className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all">
                {currentLang === 'en' ? 'Home' : 'Startseite'}
              </button>
              <button onClick={() => { navigate('/products'); setMobileMenuOpen(false); }} className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all">
                {currentLang === 'en' ? 'Products' : 'Produkte'}
              </button>
              <button onClick={() => { navigate('/features'); setMobileMenuOpen(false); }} className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all">
                {currentLang === 'en' ? 'Features' : 'Funktionen'}
              </button>
              <button onClick={() => { navigate('/support'); setMobileMenuOpen(false); }} className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all">
                {currentLang === 'en' ? 'Support' : 'Unterstützung'}
              </button>
              <button onClick={() => { navigate('/cart'); setMobileMenuOpen(false); }} className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all">
                {currentLang === 'en' ? 'Cart' : 'Warenkorb'}
              </button>
              <button onClick={() => { navigate('/wishlist'); setMobileMenuOpen(false); }} className="block w-full text-left px-6 py-4 rounded-xl text-lg font-semibold text-gray-900 hover:bg-gray-100 transition-all">
                {currentLang === 'en' ? 'Wishlist' : 'Wunschliste'}
              </button>
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-lg font-semibold text-base hover:shadow-xl hover:scale-105 transition-all duration-300">
                {currentLang === 'en' ? 'Login' : 'Anmelden'}
              </button>
              <button onClick={() => { navigate('/register'); setMobileMenuOpen(false); }} className="flex-1 bg-white border-2 border-primary text-primary py-3 px-6 rounded-lg font-semibold text-base hover:bg-primary hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300">
                {currentLang === 'en' ? 'Sign Up' : 'Registrieren'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Scooters Grid */}
          <div className="grid gap-12 lg:grid-cols-3 mb-16">
            {products.map((product) => {
              const images = product.images || [];
              // Duplicate images for smooth infinite loop
              const duplicatedImages = [...images, ...images, ...images];

              return (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer hover:scale-105"
              >
                {/* Dual-Layer Parallax Window System */}
                <div className="h-64 w-full window-system bg-gradient-to-br from-primary/10 to-primary/30">
                  {/* Outer Layer: 5 Moving Window Frames */}
                  <div className="window-frames">
                    {[0, 1, 2, 3, 4].map((frameIndex) => (
                      <div key={frameIndex} className="window-pane">
                        {/* Inner Layer: Slow-Moving Image Reel */}
                        <div className="image-reel">
                          {duplicatedImages.map((image, imgIndex) => (
                            <div key={imgIndex} className="reel-item">
                              <img
                                alt={`${product.name[currentLang]} - View ${imgIndex + 1}`}
                                src={`/${image.url}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {product.name[currentLang]}
                    </h3>
                    <div className="text-right">
                      {product.pricing.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          €{product.pricing.originalPrice.eur}
                        </div>
                      )}
                      <span className="text-2xl font-bold text-primary">€{product.pricing.eur}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                    {product.description[currentLang]}
                  </p>
                  {product.specifications && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        {currentLang === 'en' ? 'Specifications' : 'Spezifikationen'}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {currentLang === 'en' ? 'Range' : 'Reichweite'}
                          </span>
                          <p className="font-semibold">{product.specifications.range}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {currentLang === 'en' ? 'Max Speed' : 'Max. Geschwindigkeit'}
                          </span>
                          <p className="font-semibold">{product.specifications.maxSpeed}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {currentLang === 'en' ? 'Weight' : 'Gewicht'}
                          </span>
                          <p className="font-semibold">{product.specifications.weight}</p>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">
                            {currentLang === 'en' ? 'Charge Time' : 'Ladezeit'}
                          </span>
                          <p className="font-semibold">{product.specifications.chargeTime}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {product.features && product.features[currentLang] && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                        {currentLang === 'en' ? 'Key Features' : 'Hauptmerkmale'}
                      </h4>
                      <ul className="space-y-2">
                        {product.features[currentLang].slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm">
                            <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                              check_circle
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(product);
                      }}
                      className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      {currentLang === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
                    </button>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>

          {/* Accessories Section */}
          {accessories.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-8">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                {currentLang === 'en' ? 'Accessories' : 'Zubehör'}
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {accessories.map((accessory) => {
                  const iconMap = {
                    helmet: 'sports_motorsports',
                    lock: 'lock',
                    charger: 'battery_charging_full',
                    bag: 'shopping_bag',
                  };
                  const icon = iconMap[accessory.subcategory] || 'category';

                  return (
                    <Link
                      to={`/products/${accessory._id}`}
                      key={accessory._id}
                      className="text-center"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {accessory.name[currentLang]}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                          {accessory.description[currentLang]}
                        </p>
                        <div className="text-xl font-bold text-primary mt-4">
                          {accessory.pricing.originalPrice && (
                            <span className="text-sm text-gray-400 line-through mr-2">
                              €{accessory.pricing.originalPrice.eur}
                            </span>
                          )}
                          €{accessory.pricing.eur}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(accessory);
                          }}
                          className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                        >
                          {currentLang === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
                        </button>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={closeProductModal}
      />
    </main>
  );
}
