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
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
              1
            </div>
            <span className={`ml-2 ${step >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {language === 'en' ? 'Shipping' : 'Versand'}
            </span>
          </div>

          <div className="w-24 h-1 mx-4 bg-gray-300 dark:bg-gray-700">
            <div className={`h-full ${step >= 2 ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-700'}`} style={{ width: step >= 2 ? '100%' : '0%' }}></div>
          </div>

          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
              2
            </div>
            <span className={`ml-2 ${step >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              {language === 'en' ? 'Review' : 'Überprüfen'}
            </span>
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
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
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'en' ? 'City' : 'Stadt'}
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {language === 'en' ? 'Postal Code' : 'Postleitzahl'}
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingData.postalCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
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
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <label htmlFor="saveAddress" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {language === 'en' ? 'Save this address for future orders' : 'Diese Adresse für zukünftige Bestellungen speichern'}
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleContinueToReview}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {language === 'en' ? 'Continue to Review' : 'Weiter zur Überprüfung'}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {language === 'en' ? 'Review Order' : 'Bestellung überprüfen'}
                </h2>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {language === 'en' ? 'Shipping Address' : 'Lieferadresse'}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400">
                    <p>{shippingData.street}</p>
                    <p>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
                    <p>{shippingData.country}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-red-600 hover:text-red-700 text-sm mt-2"
                  >
                    {language === 'en' ? 'Edit' : 'Bearbeiten'}
                  </button>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    {language === 'en' ? 'Order Items' : 'Bestellartikel'}
                  </h3>
                  {cart.items.map((item) => (
                    <div key={item.product._id} className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          src={`/${item.product.images?.[0] || 'placeholder.jpg'}`}
                          alt={item.product.name?.[language] || item.product.name?.en}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.product.name?.[language] || item.product.name?.en}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {language === 'en' ? 'Qty' : 'Menge'}: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {currency} {((item.product.pricing?.salePrice?.[currency] || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {language === 'en' ? 'Back' : 'Zurück'}
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
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
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
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
