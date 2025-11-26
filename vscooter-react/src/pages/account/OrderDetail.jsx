import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { orderAPI } from '../../services/api';

export default function OrderDetail() {
  const { language } = useLanguage();
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orderPlaced = location.state?.orderPlaced;

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrder(id);
      setOrder(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
      delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  const formatStatus = (status) => {
    const statuses = {
      en: {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
      },
      de: {
        pending: 'Ausstehend',
        processing: 'In Bearbeitung',
        shipped: 'Versandt',
        delivered: 'Zugestellt',
        cancelled: 'Storniert',
      },
    };
    return statuses[language][status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">
          {language === 'en' ? 'Loading...' : 'Laden...'}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">{error || 'Order not found'}</p>
            <Link to="/account/orders" className="text-red-600 hover:text-red-700 mt-4 inline-block">
              {language === 'en' ? 'Back to Orders' : 'Zurück zu Bestellungen'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {orderPlaced && (
          <div className="mb-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              {language === 'en' ? '✓ Order Placed Successfully!' : '✓ Bestellung erfolgreich aufgegeben!'}
            </h2>
            <p className="text-green-700 dark:text-green-300">
              {language === 'en'
                ? 'Thank you for your order. We will send you a confirmation email shortly.'
                : 'Vielen Dank für Ihre Bestellung. Wir werden Ihnen in Kürze eine Bestätigungs-E-Mail senden.'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {language === 'en' ? 'Order Details' : 'Bestelldetails'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {language === 'en' ? 'Order' : 'Bestellung'} #{order.orderNumber}
            </p>
          </div>
          <Link
            to="/account/orders"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            {language === 'en' ? 'Back to Orders' : 'Zurück zu Bestellungen'}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Order Status' : 'Bestellstatus'}
              </h2>

              <div className="flex items-center justify-between mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {formatStatus(order.status)}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'de-DE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {order.shipping?.trackingNumber && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {language === 'en' ? 'Tracking Information' : 'Tracking-Informationen'}
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {order.shipping.carrier}: {order.shipping.trackingNumber}
                  </p>
                  {order.shipping.estimatedDelivery && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {language === 'en' ? 'Estimated Delivery' : 'Voraussichtliche Lieferung'}: {' '}
                      {new Date(order.shipping.estimatedDelivery).toLocaleDateString(language === 'en' ? 'en-US' : 'de-DE')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Items' : 'Artikel'}
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                    <img
                      src={`/${item.image || 'placeholder.jpg'}`}
                      alt={item.name[language] || item.name.en}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {item.name[language] || item.name.en}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {language === 'en' ? 'Quantity' : 'Menge'}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {order.pricing.currency} {item.price[order.pricing.currency].toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.pricing.currency} {(item.price[order.pricing.currency] * item.quantity).toFixed(2)} {language === 'en' ? 'total' : 'gesamt'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Shipping Address' : 'Lieferadresse'}
              </h2>
              <div className="text-gray-600 dark:text-gray-400">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {language === 'en' ? 'Order Summary' : 'Bestellübersicht'}
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === 'en' ? 'Subtotal' : 'Zwischensumme'}</span>
                  <span>{order.pricing.currency} {order.pricing.subtotal.toFixed(2)}</span>
                </div>

                {order.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{language === 'en' ? 'Discount' : 'Rabatt'}</span>
                    <span>-{order.pricing.currency} {order.pricing.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === 'en' ? 'Tax' : 'Steuer'}</span>
                  <span>{order.pricing.currency} {order.pricing.tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{language === 'en' ? 'Shipping' : 'Versand'}</span>
                  <span>{order.pricing.currency} {order.pricing.shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>{language === 'en' ? 'Total' : 'Gesamt'}</span>
                  <span>{order.pricing.currency} {order.pricing.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {language === 'en' ? 'Payment Method' : 'Zahlungsmethode'}
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {order.paymentMethod === 'credit_card' ? (language === 'en' ? 'Credit Card' : 'Kreditkarte') : order.paymentMethod}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 mb-2">
                  {language === 'en' ? 'Payment Status' : 'Zahlungsstatus'}
                </p>
                <p className={`font-medium ${order.payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.payment.status === 'paid'
                    ? (language === 'en' ? 'Paid' : 'Bezahlt')
                    : (language === 'en' ? 'Pending' : 'Ausstehend')}
                </p>
              </div>

              {order.status === 'pending' && (
                <button
                  onClick={() => {/* TODO: Implement cancel order */}}
                  className="w-full mt-6 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {language === 'en' ? 'Cancel Order' : 'Bestellung stornieren'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
