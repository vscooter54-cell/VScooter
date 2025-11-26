import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { productAPI } from '../../services/api';

export default function Cart() {
  const { language } = useLanguage();
  const { cart, loading, updateQuantity, removeFromCart, applyCoupon, removeCoupon, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, [cart]);

  const loadCartItems = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      setCartItems([]);
      setLoadingProducts(false);
      return;
    }

    try {
      setLoadingProducts(true);

      if (isAuthenticated) {
        // Cart already has populated product data from backend
        setCartItems(cart.items);
      } else {
        // Guest cart - need to fetch product details
        const productPromises = cart.items.map(item =>
          productAPI.getProduct(item.productId)
        );
        const productResponses = await Promise.all(productPromises);

        const itemsWithProducts = cart.items.map((item, index) => ({
          product: productResponses[index].data.data,
          quantity: item.quantity
        }));

        setCartItems(itemsWithProducts);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    await removeFromCart(productId);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!isAuthenticated) {
      setCouponError(language === 'en' ? 'Please sign in to use coupons' : 'Bitte melden Sie sich an, um Gutscheine zu verwenden');
      return;
    }

    const result = await applyCoupon(couponCode);
    if (result.success) {
      setCouponSuccess(true);
      setCouponCode('');
    } else {
      setCouponError(result.error);
    }
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setCouponSuccess(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (loading || loadingProducts) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          {language === 'en' ? 'Loading...' : 'Laden...'}
        </div>
      </div>
    );
  }

  if (!cart || !cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'en' ? 'Your cart is empty' : 'Ihr Warenkorb ist leer'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {language === 'en' ? 'Add some products to get started!' : 'Fügen Sie einige Produkte hinzu, um zu beginnen!'}
            </p>
            <Link
              to="/products"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              {language === 'en' ? 'Shop Now' : 'Jetzt einkaufen'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currency = cart.currency || 'USD';
  const calculations = cart.calculations || {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          {language === 'en' ? 'Shopping Cart' : 'Warenkorb'}
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <img
                    src={`/${item.product.images?.[0] || 'placeholder.jpg'}`}
                    alt={item.product.name?.[language] || item.product.name?.en}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.product.name?.[language] || item.product.name?.en}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {currency} {item.product.pricing?.salePrice?.[currency] || item.product.pricing?.regularPrice?.[currency]}
                    </p>

                    <div className="flex items-center mt-4 space-x-4">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 text-gray-900 dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          className="px-3 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {language === 'en' ? 'Remove' : 'Entfernen'}
                      </button>
                    </div>
                  </div>

                  <div className="ml-6 text-right">
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {currency} {((item.product.pricing?.salePrice?.[currency] || item.product.pricing?.regularPrice?.[currency]) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Order Summary' : 'Bestellübersicht'}
              </h2>

              {isAuthenticated && (
                <div className="mb-6">
                  <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder={language === 'en' ? 'Coupon code' : 'Gutscheincode'}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      {language === 'en' ? 'Apply' : 'Anwenden'}
                    </button>
                  </form>
                  {couponError && <p className="text-red-600 text-sm mt-2">{couponError}</p>}
                  {couponSuccess && (
                    <div className="flex items-center justify-between mt-2 text-green-600 text-sm">
                      <span>{language === 'en' ? 'Coupon applied!' : 'Gutschein angewendet!'}</span>
                      <button onClick={handleRemoveCoupon} className="underline">
                        {language === 'en' ? 'Remove' : 'Entfernen'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === 'en' ? 'Subtotal' : 'Zwischensumme'}</span>
                  <span>{currency} {calculations.subtotal?.toFixed(2) || '0.00'}</span>
                </div>

                {calculations.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{language === 'en' ? 'Discount' : 'Rabatt'}</span>
                    <span>-{currency} {calculations.discount?.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === 'en' ? 'Tax' : 'Steuer'}</span>
                  <span>{currency} {calculations.tax?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === 'en' ? 'Shipping' : 'Versand'}</span>
                  <span>{currency} {calculations.shipping?.toFixed(2) || '0.00'}</span>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>{language === 'en' ? 'Total' : 'Gesamt'}</span>
                  <span>{currency} {calculations.total?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {language === 'en' ? 'Proceed to Checkout' : 'Zur Kasse gehen'}
              </button>

              <Link
                to="/products"
                className="block text-center mt-4 text-red-600 hover:text-red-700"
              >
                {language === 'en' ? 'Continue Shopping' : 'Weiter einkaufen'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
