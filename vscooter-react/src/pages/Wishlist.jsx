import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Wishlist() {
  const { currentLang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      setWishlist(response.data.data);
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await wishlistAPI.removeItem(productId);
      fetchWishlist();
    } catch (err) {
      console.error('Error removing item:', err);
      alert(currentLang === 'en' ? 'Failed to remove item' : 'Fehler beim Entfernen des Artikels');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      await wishlistAPI.removeItem(productId);
      fetchWishlist();
      alert(currentLang === 'en' ? 'Moved to cart!' : 'Zum Warenkorb hinzugefügt!');
    } catch (err) {
      console.error('Error moving to cart:', err);
      alert(currentLang === 'en' ? 'Failed to move to cart' : 'Fehler beim Verschieben zum Warenkorb');
    }
  };

  const handleClearWishlist = async () => {
    if (!window.confirm(currentLang === 'en' ? 'Clear all items from wishlist?' : 'Alle Artikel aus der Wunschliste entfernen?')) {
      return;
    }

    try {
      await wishlistAPI.clear();
      fetchWishlist();
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      alert(currentLang === 'en' ? 'Failed to clear wishlist' : 'Fehler beim Leeren der Wunschliste');
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-center max-w-md mx-auto px-4">
          <span className="material-symbols-outlined text-gray-400 text-6xl mb-4">favorite</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'en' ? 'Sign in to view your wishlist' : 'Melden Sie sich an, um Ihre Wunschliste anzuzeigen'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {currentLang === 'en'
              ? 'Save your favorite products and never lose track of them'
              : 'Speichern Sie Ihre Lieblingsprodukte und verlieren Sie sie nie aus den Augen'}
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90"
          >
            {currentLang === 'en' ? 'Sign In' : 'Anmelden'}
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {currentLang === 'en' ? 'Loading wishlist...' : 'Wunschliste wird geladen...'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow bg-gray-50 dark:bg-gray-950 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentLang === 'en' ? 'My Wishlist' : 'Meine Wunschliste'}
          </h1>
          {wishlist && wishlist.items.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <span className="material-symbols-outlined">delete</span>
              {currentLang === 'en' ? 'Clear All' : 'Alle löschen'}
            </button>
          )}
        </div>

        {!wishlist || wishlist.items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">
              favorite_border
            </span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentLang === 'en' ? 'Your wishlist is empty' : 'Ihre Wunschliste ist leer'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {currentLang === 'en'
                ? 'Start adding products you love!'
                : 'Beginnen Sie, Produkte hinzuzufügen, die Sie lieben!'}
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90"
            >
              {currentLang === 'en' ? 'Browse Products' : 'Produkte durchsuchen'}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {wishlist.items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-6"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${item.product._id}`}
                  className="w-full md:w-48 h-48 bg-gradient-to-br from-primary/10 to-primary/30 rounded-lg flex items-center justify-center p-4"
                >
                  <img
                    src={`/${item.product.images[0]?.url}`}
                    alt={item.product.name[currentLang]}
                    className="w-full h-full object-contain"
                  />
                </Link>

                {/* Product Info */}
                <div className="flex-1">
                  <Link to={`/products/${item.product._id}`}>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary mb-2">
                      {item.product.name[currentLang]}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {item.product.description[currentLang]}
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-sm ${
                            i < Math.round(item.product.rating?.average || 0)
                              ? 'text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.product.rating?.average?.toFixed(1) || '0.0'} ({item.product.rating?.count || 0})
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      {item.product.pricing.originalPrice && (
                        <span className="text-gray-400 line-through text-sm mr-2">
                          €{item.product.pricing.originalPrice.eur}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-primary">
                        €{item.product.pricing.eur}
                      </span>
                    </div>

                    {item.product.inventory.stock > 0 ? (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        {currentLang === 'en' ? 'In Stock' : 'Auf Lager'}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">cancel</span>
                        {currentLang === 'en' ? 'Out of Stock' : 'Nicht auf Lager'}
                      </span>
                    )}
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    {currentLang === 'en' ? 'Added on' : 'Hinzugefügt am'}{' '}
                    {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col gap-3 md:w-48">
                  <button
                    onClick={() => handleMoveToCart(item.product._id)}
                    disabled={item.product.inventory.stock === 0}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">shopping_cart</span>
                    {currentLang === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.product._id)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    {currentLang === 'en' ? 'Remove' : 'Entfernen'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {wishlist && wishlist.items.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentLang === 'en' ? 'Total Items' : 'Gesamtartikel'}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {wishlist.items.length}
                </p>
              </div>
              <Link
                to="/products"
                className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90"
              >
                {currentLang === 'en' ? 'Continue Shopping' : 'Weiter einkaufen'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
