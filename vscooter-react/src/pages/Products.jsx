import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import ProductModal from '../components/ProductModal';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function Products() {
  const { currentLang } = useLanguage();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();

      // Separate scooters and accessories
      const scooters = response.data.data.filter(p => p.category === 'scooter' && p.isActive);
      const accs = response.data.data.filter(p => p.category === 'accessory' && p.isActive);

      setProducts(scooters);
      setAccessories(accs);
      setError('');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
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
    <main className="flex-grow">
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
              {currentLang === 'en' ? 'Our Products' : 'Unsere Produkte'}
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {currentLang === 'en'
                ? 'Discover our range of premium electric scooters'
                : 'Entdecken Sie unsere Auswahl an Premium-Elektrorollern'}
            </p>
          </div>

          {/* Scooters Grid */}
          <div className="grid gap-12 lg:grid-cols-3 mb-16">
            {products.map((product) => (
              <Link
                to={`/products/${product._id}`}
                key={product._id}
                className={`bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer hover:scale-105 ${
                  product.isPremium ? 'border-2 border-primary' : ''
                }`}
              >
                {product.isPremium && (
                  <div className="bg-primary text-white text-center py-2 text-sm font-bold">PREMIUM MODEL</div>
                )}
                <div className="h-64 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center p-4">
                  <img
                    alt={product.name[currentLang]}
                    className="w-full h-full object-contain object-center"
                    src={`/${product.primaryImage?.url || product.images[0]?.url}`}
                  />
                </div>
                <div className="p-8 flex-grow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {product.name[currentLang]}
                    </h3>
                    <div className="text-right">
                      {product.pricing.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">
                          ${product.pricing.originalPrice.usd}
                        </div>
                      )}
                      <span className="text-2xl font-bold text-primary">${product.pricing.usd}</span>
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
            ))}
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
                    <div key={accessory._id} className="text-center">
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
                              ${accessory.pricing.originalPrice.usd}
                            </span>
                          )}
                          ${accessory.pricing.usd}
                        </div>
                        <button
                          onClick={() => handleAddToCart(accessory)}
                          className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
                        >
                          {currentLang === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
                        </button>
                      </div>
                    </div>
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
