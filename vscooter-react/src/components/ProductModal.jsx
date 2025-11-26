import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function ProductModal({ product, isOpen, onClose }) {
  const { t, translations, currentLang } = useLanguage();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isOpen) return null;
  if (!product) return null;

  // Product images - using the main image multiple times as placeholder for gallery
  const productImages = [
    product.image,
    product.image,
    product.image
  ];

  // Get features safely
  const features = translations?.[currentLang]?.[product.featuresKey] || [];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleBuyNow = () => {
    alert(`Buying ${quantity} x ${t(product.nameKey)} now!`);
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} x ${t(product.nameKey)} to cart!`);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto transition-all duration-300 ${
        isAnimating ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">close</span>
          </button>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Left Side - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/30 rounded-xl overflow-hidden h-96 flex items-center justify-center">
                <img
                  src={productImages[currentImageIndex]}
                  alt={t(product.nameKey)}
                  className="w-full h-full object-contain p-4"
                />

                {/* Navigation Arrows */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 rounded-full p-2 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {productImages.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? 'border-primary shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${t(product.nameKey)} view ${index + 1}`}
                      className="w-full h-24 object-contain bg-gradient-to-br from-primary/5 to-primary/15 p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Product Details */}
            <div className="space-y-6">
              {/* Product Name & Price */}
              <div>
                {product.isPremium && (
                  <span className="inline-block bg-primary text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                    PREMIUM MODEL
                  </span>
                )}
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {t(product.nameKey)}
                </h2>
                <p className="text-3xl font-bold text-primary">{t(product.priceKey)}</p>
              </div>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {t(product.descKey)}
              </p>

              {/* Specifications */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xl">{t('specs')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('range')}</span>
                    <p className="font-semibold text-lg">{t(`${product.specsKey}.range`)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('maxSpeed')}</span>
                    <p className="font-semibold text-lg">{t(`${product.specsKey}.speed`)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('weight')}</span>
                    <p className="font-semibold text-lg">{t(`${product.specsKey}.weight`)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('chargingTime')}</span>
                    <p className="font-semibold text-lg">{t(`${product.specsKey}.charge`)}</p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-xl">{t('keyFeatures')}</h3>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary mt-0.5 text-xl">check_circle</span>
                      <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg p-2 transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg p-2 transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {t('buyNow')}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-4 rounded-xl text-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
