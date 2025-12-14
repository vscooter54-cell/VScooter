import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../context/LanguageContext';
import ProductReviews from '../components/ProductReviews';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [compareProducts, setCompareProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  const imageContainerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    fetchProduct();
    fetchAllProducts();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(id);
      setProduct(response.data.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      alert(currentLang === 'en' ? 'Product not found' : 'Produkt nicht gefunden');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await productAPI.getAll();
      const data = response?.data?.data || [];
      setAllProducts(data.filter(p => p.category === 'scooter' && p.isActive));
    } catch (err) {
      console.error('Error fetching products:', err);
      setAllProducts([]);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      alert(currentLang === 'en' ? 'Added to cart!' : 'Zum Warenkorb hinzugefügt!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(currentLang === 'en' ? 'Failed to add to cart' : 'Fehler beim Hinzufügen zum Warenkorb');
    }
  };

  const toggleCompare = (productId) => {
    setCompareProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      }
      if (prev.length >= 3) {
        alert('Maximum 3 products can be compared');
        return prev;
      }
      return [...prev, productId];
    });
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setQuestions([...questions, {
        id: Date.now(),
        question: newQuestion,
        answer: '',
        date: new Date().toISOString(),
        user: 'You'
      }]);
      setNewQuestion('');
      alert('Your question has been submitted and will be answered soon!');
    }
  };

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {currentLang === 'en' ? 'Loading product...' : 'Produkt wird geladen...'}
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  const selectedProducts = allProducts.filter(p => compareProducts.includes(p._id));
  const compareSpecs = ['range', 'maxSpeed', 'weight', 'chargeTime', 'motorPower', 'batteryCapacity', 'maxLoad'];

  const faqItems = [
    {
      question: currentLang === 'en' ? 'How long does shipping take?' : 'Wie lange dauert der Versand?',
      answer: currentLang === 'en'
        ? 'Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business days delivery.'
        : 'Der Standardversand dauert 5-7 Werktage. Expressversand ist für eine Lieferung in 2-3 Werktagen verfügbar.'
    },
    {
      question: currentLang === 'en' ? 'What is the warranty period?' : 'Wie lang ist die Garantiezeit?',
      answer: currentLang === 'en'
        ? 'All scooters come with a 2-year manufacturer warranty covering defects in materials and workmanship.'
        : 'Alle Roller werden mit einer 2-jährigen Herstellergarantie geliefert, die Material- und Verarbeitungsfehler abdeckt.'
    },
    {
      question: currentLang === 'en' ? 'Can I test ride before purchasing?' : 'Kann ich vor dem Kauf eine Probefahrt machen?',
      answer: currentLang === 'en'
        ? 'Yes! Visit our showroom to schedule a test ride. Contact us for an appointment.'
        : 'Ja! Besuchen Sie unseren Showroom, um eine Probefahrt zu vereinbaren. Kontaktieren Sie uns für einen Termin.'
    },
    {
      question: currentLang === 'en' ? 'What payment methods do you accept?' : 'Welche Zahlungsmethoden akzeptieren Sie?',
      answer: currentLang === 'en'
        ? 'We accept credit cards, PayPal, bank transfer, and financing options are available.'
        : 'Wir akzeptieren Kreditkarten, PayPal, Banküberweisung und Finanzierungsmöglichkeiten sind verfügbar.'
    },
    {
      question: currentLang === 'en' ? 'Is the scooter waterproof?' : 'Ist der Roller wasserdicht?',
      answer: currentLang === 'en'
        ? 'Our scooters have IP54 water resistance rating, meaning they can handle light rain but should not be submerged.'
        : 'Unsere Roller haben eine IP54-Wasserschutzklasse, das bedeutet, sie können leichten Regen aushalten, sollten aber nicht eingetaucht werden.'
    }
  ];

  return (
    <main className="flex-grow bg-white dark:bg-gray-950">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              {currentLang === 'en' ? 'Home' : 'Startseite'}
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              {currentLang === 'en' ? 'Products' : 'Produkte'}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {product.name[currentLang]}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Section with Sticky Images */}
      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

            {/* Left Column - Sticky Image Gallery */}
            <div className="lg:sticky lg:top-24 lg:self-start" ref={imageContainerRef}>
              {/* Main Image */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 lg:p-8 mb-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                <img
                  src={`/${product.images[selectedImage]?.url}`}
                  alt={product.images[selectedImage]?.alt || product.name[currentLang]}
                  className="relative w-full h-[400px] lg:h-[500px] object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                  onClick={() => setZoomedImage(product.images[selectedImage]?.url)}
                />
                <button
                  onClick={() => setZoomedImage(product.images[selectedImage]?.url)}
                  className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined">zoom_in</span>
                </button>
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`bg-gray-100 dark:bg-gray-800 rounded-xl p-3 hover:ring-2 hover:ring-primary transition-all ${
                        selectedImage === index ? 'ring-2 ring-primary shadow-lg' : ''
                      }`}
                    >
                      <img
                        src={`/${image.url}`}
                        alt={image.alt}
                        className="w-full h-20 object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* 3D View Button */}
              <div className="mt-4">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl">
                  <span className="material-symbols-outlined text-2xl">view_in_ar</span>
                  <span>{currentLang === 'en' ? 'View in 3D' : '3D-Ansicht'}</span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Coming Soon</span>
                </button>
              </div>

              {/* Share & Wishlist */}
              <div className="flex gap-3 mt-4">
                <button className="flex-1 bg-gray-100 dark:bg-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">favorite_border</span>
                  <span>{currentLang === 'en' ? 'Wishlist' : 'Wunschliste'}</span>
                </button>
                <button className="flex-1 bg-gray-100 dark:bg-gray-800 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">share</span>
                  <span>{currentLang === 'en' ? 'Share' : 'Teilen'}</span>
                </button>
              </div>
            </div>

            {/* Right Column - Scrollable Content */}
            <div ref={contentRef} className="space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                      {product.name[currentLang]}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      {product.isPremium && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-3 py-1.5 rounded-full font-bold">
                          <span className="material-symbols-outlined text-sm">stars</span>
                          PREMIUM
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-3 py-1.5 rounded-full font-bold">
                          <span className="material-symbols-outlined text-sm">bolt</span>
                          FEATURED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`material-symbols-outlined text-xl ${
                          i < Math.round(product.rating?.average || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {product.rating?.average?.toFixed(1) || '0.0'}
                  </span>
                  <a href="#reviews" className="text-primary hover:underline font-medium">
                    ({product.rating?.count || 0} {currentLang === 'en' ? 'reviews' : 'Bewertungen'})
                  </a>
                </div>

                {/* Price */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-2xl p-6 mb-6">
                  {product.pricing.originalPrice && (
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                        €{product.pricing.originalPrice.eur}
                      </span>
                      {product.pricing.discount > 0 && (
                        <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                          -{product.pricing.discount}%
                        </span>
                      )}
                    </div>
                  )}
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    €{product.pricing.eur}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {currentLang === 'en' ? 'Tax included. Shipping calculated at checkout.' : 'Inkl. MwSt. Versand wird an der Kasse berechnet.'}
                  </p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {product.inventory.stock > 0 ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-xl">
                      <span className="material-symbols-outlined">check_circle</span>
                      <span className="font-semibold">
                        {currentLang === 'en' ? 'In Stock' : 'Auf Lager'} — {product.inventory.stock}{' '}
                        {currentLang === 'en' ? 'units available' : 'Einheiten verfügbar'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">
                      <span className="material-symbols-outlined">cancel</span>
                      <span className="font-semibold">
                        {currentLang === 'en' ? 'Out of Stock' : 'Nicht auf Lager'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="prose dark:prose-invert max-w-none mb-8">
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {product.description[currentLang]}
                  </p>
                </div>

                {/* Quick Specs */}
                {product.specifications && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {product.specifications.range && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary">route</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {currentLang === 'en' ? 'Range' : 'Reichweite'}
                          </p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {product.specifications.range}
                        </p>
                      </div>
                    )}
                    {product.specifications.maxSpeed && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary">speed</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {currentLang === 'en' ? 'Top Speed' : 'Max. Geschwindigkeit'}
                          </p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {product.specifications.maxSpeed}
                        </p>
                      </div>
                    )}
                    {product.specifications.weight && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary">scale</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {currentLang === 'en' ? 'Weight' : 'Gewicht'}
                          </p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {product.specifications.weight}
                        </p>
                      </div>
                    )}
                    {product.specifications.chargeTime && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary">battery_charging_full</span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            {currentLang === 'en' ? 'Charge Time' : 'Ladezeit'}
                          </p>
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {product.specifications.chargeTime}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Key Features */}
                {product.features && product.features[currentLang] && product.features[currentLang].length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {currentLang === 'en' ? 'Key Features' : 'Hauptmerkmale'}
                    </h3>
                    <ul className="space-y-3">
                      {product.features[currentLang].map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-primary text-xl mt-0.5 flex-shrink-0">
                            check_circle
                          </span>
                          <span className="text-gray-700 dark:text-gray-300 text-lg">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add to Cart Section */}
                <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 sticky bottom-4 shadow-xl">
                  <div className="flex gap-4 items-center mb-4">
                    <div className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="material-symbols-outlined">remove</span>
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 text-center border-x-2 border-gray-300 dark:border-gray-600 bg-transparent py-4 focus:outline-none text-lg font-semibold"
                        min="1"
                        max={product.inventory.stock}
                      />
                      <button
                        onClick={() => setQuantity(Math.min(product.inventory.stock, quantity + 1))}
                        className="px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      disabled={product.inventory.stock === 0}
                      className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 transform hover:scale-105 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-2xl">shopping_cart</span>
                      {currentLang === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    SKU: {product.inventory.sku}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Content Sections */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'specifications', label: currentLang === 'en' ? 'Specifications' : 'Spezifikationen', icon: 'table_chart' },
              { id: 'compare', label: currentLang === 'en' ? 'Compare' : 'Vergleichen', icon: 'compare_arrows' },
              { id: 'reviews', label: currentLang === 'en' ? 'Reviews' : 'Bewertungen', icon: 'star' },
              { id: 'qa', label: currentLang === 'en' ? 'Q&A' : 'Fragen & Antworten', icon: 'question_answer' },
              { id: 'faq', label: 'FAQ', icon: 'help' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-800 text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">

            {/* Specifications Tab */}
            {activeTab === 'specifications' && product.specifications && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {currentLang === 'en' ? 'Technical Specifications' : 'Technische Spezifikationen'}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </td>
                          <td className="py-4 px-4 text-gray-900 dark:text-white">
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Compare Tab */}
            {activeTab === 'compare' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {currentLang === 'en' ? 'Compare Models' : 'Modelle vergleichen'}
                </h2>

                {/* Product Selector */}
                <div className="mb-8">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {currentLang === 'en'
                      ? 'Select up to 3 models to compare (current model already selected)'
                      : 'Wählen Sie bis zu 3 Modelle zum Vergleichen aus (aktuelles Modell bereits ausgewählt)'}
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allProducts.map(p => (
                      <div
                        key={p._id}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                          compareProducts.includes(p._id) || p._id === product._id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                        }`}
                        onClick={() => p._id !== product._id && toggleCompare(p._id)}
                      >
                        <div className="flex items-center gap-3">
                          <img src={`/${p.images[0]?.url}`} alt={p.name[currentLang]} className="w-16 h-16 object-contain" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{p.name[currentLang]}</h4>
                            <p className="text-primary font-bold">€{p.pricing.eur}</p>
                          </div>
                          {(compareProducts.includes(p._id) || p._id === product._id) && (
                            <span className="material-symbols-outlined text-primary">check_circle</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison Table */}
                {selectedProducts.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                          <th className="py-4 px-4 text-left font-bold text-gray-900 dark:text-white">
                            {currentLang === 'en' ? 'Feature' : 'Eigenschaft'}
                          </th>
                          <th className="py-4 px-4 text-center font-bold text-gray-900 dark:text-white">
                            {product.name[currentLang]}
                            <div className="text-xs text-primary font-normal mt-1">
                              ({currentLang === 'en' ? 'Current' : 'Aktuell'})
                            </div>
                          </th>
                          {selectedProducts.map(p => (
                            <th key={p._id} className="py-4 px-4 text-center font-bold text-gray-900 dark:text-white">
                              {p.name[currentLang]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-4 px-4 font-semibold">
                            {currentLang === 'en' ? 'Price' : 'Preis'}
                          </td>
                          <td className="py-4 px-4 text-center text-primary font-bold">€{product.pricing.eur}</td>
                          {selectedProducts.map(p => (
                            <td key={p._id} className="py-4 px-4 text-center font-bold">€{p.pricing.eur}</td>
                          ))}
                        </tr>
                        {compareSpecs.map(spec => (
                          <tr key={spec} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="py-4 px-4 font-semibold capitalize">
                              {spec.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            <td className="py-4 px-4 text-center">{product.specifications?.[spec] || '-'}</td>
                            {selectedProducts.map(p => (
                              <td key={p._id} className="py-4 px-4 text-center">{p.specifications?.[spec] || '-'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div id="reviews">
                <ProductReviews productId={product._id} />
              </div>
            )}

            {/* Q&A Tab */}
            {activeTab === 'qa' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {currentLang === 'en' ? 'Customer Questions & Answers' : 'Kundenfragen & Antworten'}
                </h2>

                {/* Ask Question Form */}
                <form onSubmit={handleSubmitQuestion} className="mb-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                    {currentLang === 'en' ? 'Have a question? Ask us!' : 'Haben Sie eine Frage? Fragen Sie uns!'}
                  </label>
                  <textarea
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:outline-none"
                    rows="3"
                    placeholder={currentLang === 'en' ? 'Type your question here...' : 'Geben Sie hier Ihre Frage ein...'}
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-3 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">send</span>
                    {currentLang === 'en' ? 'Submit Question' : 'Frage absenden'}
                  </button>
                </form>

                {/* Questions List */}
                <div className="space-y-6">
                  {questions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-6xl mb-4 block">question_answer</span>
                      <p>{currentLang === 'en' ? 'No questions yet. Be the first to ask!' : 'Noch keine Fragen. Seien Sie der Erste, der fragt!'}</p>
                    </div>
                  ) : (
                    questions.map(q => (
                      <div key={q.id} className="border-l-4 border-primary pl-6 py-4">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="material-symbols-outlined text-primary">help</span>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{q.question}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {currentLang === 'en' ? 'Asked by' : 'Gefragt von'} {q.user} • {new Date(q.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {q.answer && (
                          <div className="flex items-start gap-3 ml-8 mt-3 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                            <span className="material-symbols-outlined text-green-600">verified</span>
                            <p className="text-gray-700 dark:text-gray-300">{q.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {currentLang === 'en' ? 'Frequently Asked Questions' : 'Häufig gestellte Fragen'}
                </h2>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <details key={index} className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <summary className="flex items-center justify-between cursor-pointer p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white pr-8">
                          {item.question}
                        </h3>
                        <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform flex-shrink-0">
                          expand_more
                        </span>
                      </summary>
                      <div className="px-6 pb-6 pt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all"
            onClick={() => setZoomedImage(null)}
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
          <img
            src={`/${zoomedImage}`}
            alt="Zoomed product"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
