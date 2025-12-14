import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { orderAPI, addressAPI } from '../../services/api';

export default function Checkout() {
  const { language } = useLanguage();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Review & Place Order
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingData, setShippingData] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [saveAddress, setSaveAddress] = useState(false);

  useEffect(() => {
    if (!cart || !cart.items || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  useEffect(() => {
    // Load default address if exists
    if (user?.shippingAddresses && user.shippingAddresses.length > 0) {
      const defaultAddress = user.shippingAddresses.find(addr => addr.isDefault) || user.shippingAddresses[0];
      setShippingData({
        street: defaultAddress.street,
        city: defaultAddress.city,
        state: defaultAddress.state,
        postalCode: defaultAddress.postalCode,
        country: defaultAddress.country,
      });
    }
  }, [user]);

  const handleShippingChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinueToReview = () => {
    // Validate shipping data
    if (!shippingData.street || !shippingData.city || !shippingData.state || !shippingData.postalCode || !shippingData.country) {
      setError(language === 'en' ? 'Please fill in all shipping fields' : 'Bitte füllen Sie alle Versandfelder aus');
      return;
    }

    setError('');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // Save address if requested
      if (saveAddress) {
        await addressAPI.addAddress(shippingData);
      }

      // Create order
      const orderData = {
        shippingAddress: shippingData,
        paymentMethod: 'credit_card', // Simplified since we're skipping payment integration
        paymentDetails: {
          // In real implementation, this would come from payment gateway
          paymentIntentId: 'manual_payment'
        }
      };

      const response = await orderAPI.createOrder(orderData);

      // Clear cart
      await clearCart();

      // Navigate to order confirmation
      navigate(`/account/orders/${response.data.data._id}`, {
        state: { orderPlaced: true }
      });
    } catch (err) {
      console.error('Order error:', err);
      setError(err.response?.data?.message || (language === 'en' ? 'Failed to place order' : 'Bestellung fehlgeschlagen'));
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items) {
    return null;
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
          {language === 'en' ? 'Checkout' : 'Zur Kasse'}
        </h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto px-4">
          <div className="flex items-center min-w-max">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                1
              </div>
              <span className={`ml-2 text-sm sm:text-base whitespace-nowrap ${step >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {language === 'en' ? 'Shipping' : 'Versand'}
              </span>
            </div>

            <div className="w-16 sm:w-24 h-1 mx-2 sm:mx-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: step >= 2 ? '100%' : '0%' }}
              ></div>
            </div>

            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                2
              </div>
              <span className={`ml-2 text-sm sm:text-base whitespace-nowrap ${step >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {language === 'en' ? 'Review' : 'Überprüfen'}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            {step === 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {language === 'en' ? 'Shipping Address' : 'Lieferadresse'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'en' ? 'Street Address' : 'Straße'}
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={shippingData.street}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all touch-manipulation"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'en' ? 'City' : 'Stadt'}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all touch-manipulation"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'en' ? 'State / Province' : 'Bundesland'}
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all touch-manipulation"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'en' ? 'Postal Code' : 'Postleitzahl'}
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingData.postalCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all touch-manipulation"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'en' ? 'Country' : 'Land'}
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={shippingData.country}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all touch-manipulation"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center py-2">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary touch-manipulation"
                    />
                    <label htmlFor="saveAddress" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      {language === 'en' ? 'Save this address for future orders' : 'Diese Adresse für zukünftige Bestellungen speichern'}
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleContinueToReview}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all font-semibold touch-manipulation"
                  >
                    {language === 'en' ? 'Continue to Review' : 'Weiter zur Überprüfung'}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mb-24 sm:mb-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {language === 'en' ? 'Review Order' : 'Bestellung überprüfen'}
                </h2>

                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {language === 'en' ? 'Shipping Address' : 'Lieferadresse'}
                    </h3>
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                      {language === 'en' ? 'Edit' : 'Bearbeiten'}
                    </button>
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    <p>{shippingData.street}</p>
                    <p>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
                    <p>{shippingData.country}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {language === 'en' ? 'Order Items' : 'Bestellartikel'}
                  </h3>
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-3 sm:gap-4 mb-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <img
                        src={`/${item.product.images?.[0] || 'placeholder.jpg'}`}
                        alt={item.product.name?.[language] || item.product.name?.en}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-lg bg-gray-100 dark:bg-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                          {item.product.name?.[language] || item.product.name?.en}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {language === 'en' ? 'Qty' : 'Menge'}: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base whitespace-nowrap">
                        {currency} {((item.product.pricing?.salePrice?.[currency] || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="fixed sm:static bottom-0 left-0 right-0 mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-0 bg-white dark:bg-gray-800 border-t sm:border-t-0 border-gray-200 dark:border-gray-700 z-30">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold touch-manipulation"
                  >
                    {language === 'en' ? 'Back' : 'Zurück'}
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-white px-6 py-4 rounded-lg hover:shadow-xl transition-all disabled:opacity-50 font-semibold touch-manipulation"
                  >
                    {loading
                      ? (language === 'en' ? 'Placing Order...' : 'Bestellung wird aufgegeben...')
                      : (language === 'en' ? 'Place Order' : 'Bestellung aufgeben')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Order Summary' : 'Bestellübersicht'}
              </h2>

              <div className="space-y-3">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
