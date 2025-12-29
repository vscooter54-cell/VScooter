import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { orderAPI } from '../../services/api';

export default function Orders() {
  const { currentLang } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
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
          {currentLang === 'en' ? 'Loading...' : 'Laden...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentLang === 'en' ? 'My Orders' : 'Meine Bestellungen'}
          </h1>
          <Link
            to="/account"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            {currentLang === 'en' ? 'Back to Account' : 'Zurück zum Konto'}
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {currentLang === 'en' ? 'You haven\'t placed any orders yet.' : 'Sie haben noch keine Bestellungen aufgegeben.'}
            </p>
            <Link
              to="/products"
              className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              {currentLang === 'en' ? 'Start Shopping' : 'Mit dem Einkaufen beginnen'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {currentLang === 'en' ? 'Order' : 'Bestellung'} #{order.orderNumber}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'de-DE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-gray-900 dark:text-white">
                      <span className="font-semibold">
                        {order.pricing.currency} {order.pricing.total.toFixed(2)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 ml-2">
                        ({order.items.length} {currentLang === 'en' ? 'item' : 'Artikel'}{order.items.length !== 1 && 's'})
                      </span>
                    </div>
                    <Link
                      to={`/account/orders/${order._id}`}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                    >
                      {currentLang === 'en' ? 'View Details' : 'Details anzeigen'} →
                    </Link>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item._id} className="flex items-center space-x-4">
                        <img
                          src={`/${item.image || 'placeholder.jpg'}`}
                          alt={item.name[language] || item.name.en}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.name[language] || item.name.en}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {currentLang === 'en' ? 'Qty' : 'Menge'}: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
                        +{order.items.length - 3} {currentLang === 'en' ? 'more' : 'weitere'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
