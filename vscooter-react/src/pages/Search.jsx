import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../context/LanguageContext';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currentLang } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('q') || '',
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    inStock: searchParams.get('inStock') === 'true',
    featured: searchParams.get('featured') === 'true',
    premium: searchParams.get('premium') === 'true',
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.rating) params.set('rating', filters.rating);
    if (filters.inStock) params.set('inStock', 'true');
    if (filters.featured) params.set('featured', 'true');
    if (filters.premium) params.set('premium', 'true');
    if (sortBy) params.set('sort', sortBy);
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      rating: '',
      inStock: false,
      featured: false,
      premium: false,
    });
    setSortBy('featured');
  };

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      alert(currentLang === 'en' ? 'Added to cart!' : 'Zum Warenkorb hinzugefügt!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(currentLang === 'en' ? 'Failed to add to cart' : 'Fehler beim Hinzufügen zum Warenkorb');
    }
  };

  // Apply filters to products
  let filteredProducts = products.filter((product) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName =
        product.name.en.toLowerCase().includes(searchLower) ||
        product.name.de.toLowerCase().includes(searchLower);
      const matchesDesc =
        product.description.en.toLowerCase().includes(searchLower) ||
        product.description.de.toLowerCase().includes(searchLower);
      const matchesTags = product.tags?.some((tag) => tag.toLowerCase().includes(searchLower));
      if (!matchesName && !matchesDesc && !matchesTags) return false;
    }

    // Category filter
    if (filters.category !== 'all' && product.category !== filters.category) return false;

    // Price filter
    if (filters.minPrice && product.pricing.usd < parseFloat(filters.minPrice)) return false;
    if (filters.maxPrice && product.pricing.usd > parseFloat(filters.maxPrice)) return false;

    // Rating filter
    if (filters.rating && (product.rating?.average || 0) < parseFloat(filters.rating))
      return false;

    // Stock filter
    if (filters.inStock && product.inventory.stock === 0) return false;

    // Featured filter
    if (filters.featured && !product.isFeatured) return false;

    // Premium filter
    if (filters.premium && !product.isPremium) return false;

    return true;
  });

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.pricing.usd - b.pricing.usd;
      case 'price-desc':
        return b.pricing.usd - a.pricing.usd;
      case 'rating':
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'name':
        return a.name.en.localeCompare(b.name.en);
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

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

  return (
    <main className="flex-grow bg-gray-50 dark:bg-gray-950 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentLang === 'en' ? 'Filters' : 'Filter'}
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  {currentLang === 'en' ? 'Clear All' : 'Alle löschen'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Search' : 'Suche'}
                  </label>
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder={currentLang === 'en' ? 'Search products...' : 'Produkte suchen...'}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Category' : 'Kategorie'}
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">{currentLang === 'en' ? 'All' : 'Alle'}</option>
                    <option value="scooter">{currentLang === 'en' ? 'Scooters' : 'Roller'}</option>
                    <option value="accessory">
                      {currentLang === 'en' ? 'Accessories' : 'Zubehör'}
                    </option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Price Range (USD)' : 'Preisspanne (USD)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      placeholder="Min"
                      className="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      placeholder="Max"
                      className="w-1/2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Minimum Rating' : 'Mindestbewertung'}
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">{currentLang === 'en' ? 'Any' : 'Beliebig'}</option>
                    <option value="4">4+ ⭐</option>
                    <option value="3">3+ ⭐</option>
                    <option value="2">2+ ⭐</option>
                    <option value="1">1+ ⭐</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {currentLang === 'en' ? 'In Stock Only' : 'Nur auf Lager'}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={(e) => handleFilterChange('featured', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {currentLang === 'en' ? 'Featured Only' : 'Nur Vorgestellt'}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.premium}
                      onChange={(e) => handleFilterChange('premium', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {currentLang === 'en' ? 'Premium Only' : 'Nur Premium'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600 dark:text-gray-400">
                {filteredProducts.length} {currentLang === 'en' ? 'products found' : 'Produkte gefunden'}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLang === 'en' ? 'Sort by:' : 'Sortieren nach:'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="featured">
                    {currentLang === 'en' ? 'Featured' : 'Vorgestellt'}
                  </option>
                  <option value="price-asc">
                    {currentLang === 'en' ? 'Price: Low to High' : 'Preis: Niedrig bis Hoch'}
                  </option>
                  <option value="price-desc">
                    {currentLang === 'en' ? 'Price: High to Low' : 'Preis: Hoch bis Niedrig'}
                  </option>
                  <option value="rating">
                    {currentLang === 'en' ? 'Highest Rated' : 'Höchstbewertet'}
                  </option>
                  <option value="newest">{currentLang === 'en' ? 'Newest' : 'Neueste'}</option>
                  <option value="name">{currentLang === 'en' ? 'Name' : 'Name'}</option>
                </select>
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-105"
                  >
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center p-4">
                      <img
                        src={`/${product.images[0]?.url}`}
                        alt={product.name[currentLang]}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        {product.name[currentLang]}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description[currentLang]}
                      </p>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`material-symbols-outlined text-sm ${
                                i < Math.round(product.rating?.average || 0)
                                  ? 'text-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            >
                              star
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          ({product.rating?.count || 0})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.pricing.originalPrice && (
                            <span className="text-sm text-gray-400 line-through mr-2">
                              ${product.pricing.originalPrice.usd}
                            </span>
                          )}
                          <span className="text-xl font-bold text-primary">
                            ${product.pricing.usd}
                          </span>
                        </div>
                        {product.inventory.stock > 0 ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product._id);
                            }}
                            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-semibold"
                          >
                            {currentLang === 'en' ? 'Add' : 'Hinzufügen'}
                          </button>
                        ) : (
                          <span className="text-sm text-red-600">
                            {currentLang === 'en' ? 'Out of Stock' : 'Nicht auf Lager'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
                <span className="material-symbols-outlined text-gray-400 text-6xl mb-4 block">
                  search_off
                </span>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentLang === 'en' ? 'No products found' : 'Keine Produkte gefunden'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {currentLang === 'en'
                    ? 'Try adjusting your filters or search terms'
                    : 'Versuchen Sie, Ihre Filter oder Suchbegriffe anzupassen'}
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90"
                >
                  {currentLang === 'en' ? 'Clear Filters' : 'Filter löschen'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
