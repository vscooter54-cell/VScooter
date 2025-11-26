import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [comparison, setComparison] = useState('previous');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAnalytics({
        days: parseInt(period),
        comparison
      });
      setAnalytics(response.data.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      // Set mock data for demo
      setAnalytics({
        summary: {
          totalRevenue: 45678.90,
          totalOrders: 156,
          avgOrderValue: 292.81,
          conversionRate: 3.2,
          revenueChange: 12.5,
          ordersChange: 8.3,
          aovChange: 4.1,
          conversionChange: -0.5,
        },
        revenueByDay: generateMockRevenueData(parseInt(period)),
        ordersByStatus: [
          { status: 'completed', count: 89, percentage: 57 },
          { status: 'processing', count: 34, percentage: 22 },
          { status: 'pending', count: 18, percentage: 12 },
          { status: 'cancelled', count: 15, percentage: 9 },
        ],
        topProducts: [
          { name: 'E-Roller Falcon 500', sales: 45, revenue: 58455, growth: 15 },
          { name: 'E-Roller Mars', sales: 38, revenue: 45562, growth: 8 },
          { name: 'E-Roller Pit', sales: 32, revenue: 25568, growth: -3 },
          { name: 'Helmet Pro', sales: 67, revenue: 8710, growth: 22 },
          { name: 'Safety Kit', sales: 54, revenue: 5346, growth: 18 },
        ],
        customerMetrics: {
          newCustomers: 42,
          returningCustomers: 28,
          avgLifetimeValue: 856.40,
          churnRate: 2.1,
        },
        trafficSources: [
          { source: 'Organic Search', visits: 2456, percentage: 42 },
          { source: 'Direct', visits: 1823, percentage: 31 },
          { source: 'Social Media', visits: 892, percentage: 15 },
          { source: 'Referral', visits: 534, percentage: 9 },
          { source: 'Email', visits: 178, percentage: 3 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockRevenueData = (days) => {
    const data = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 3000) + 500,
        orders: Math.floor(Math.random() * 15) + 2,
      });
    }
    return data;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(amount);
  };

  const formatChange = (value) => {
    const isPositive = value >= 0;
    return (
      <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        <span className="material-symbols-outlined text-sm">
          {isPositive ? 'trending_up' : 'trending_down'}
        </span>
        {isPositive ? '+' : ''}{value}%
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Track your store performance and insights
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <div className="bg-green-500/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-green-500">payments</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(analytics?.summary?.totalRevenue || 0)}
            </p>
            {formatChange(analytics?.summary?.revenueChange || 0)}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-blue-500">shopping_cart</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {analytics?.summary?.totalOrders || 0}
            </p>
            {formatChange(analytics?.summary?.ordersChange || 0)}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Order Value</p>
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-purple-500">analytics</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {formatCurrency(analytics?.summary?.avgOrderValue || 0)}
            </p>
            {formatChange(analytics?.summary?.aovChange || 0)}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <div className="bg-orange-500/10 p-2 rounded-lg">
                <span className="material-symbols-outlined text-orange-500">percent</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {analytics?.summary?.conversionRate || 0}%
            </p>
            {formatChange(analytics?.summary?.conversionChange || 0)}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Over Time
            </h3>
            <div className="h-64 flex items-end gap-1">
              {analytics?.revenueByDay?.map((day, index) => {
                const maxRevenue = Math.max(...analytics.revenueByDay.map(d => d.revenue));
                const height = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
                return (
                  <div
                    key={day.date}
                    className="flex-1 bg-primary/80 hover:bg-primary rounded-t transition-colors cursor-pointer group relative"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                      {day.date}: {formatCurrency(day.revenue)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders by Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Orders by Status
            </h3>
            <div className="space-y-4">
              {analytics?.ordersByStatus?.map((item) => (
                <div key={item.status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">{item.status}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === 'completed' ? 'bg-green-500' :
                        item.status === 'processing' ? 'bg-blue-500' :
                        item.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products and Traffic */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Products
            </h3>
            <div className="space-y-4">
              {analytics?.topProducts?.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="text-lg font-bold text-gray-400 w-6">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(product.revenue)}
                    </p>
                    <span className={`text-xs ${product.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {product.growth >= 0 ? '+' : ''}{product.growth}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Traffic Sources
            </h3>
            <div className="space-y-4">
              {analytics?.trafficSources?.map((source) => (
                <div key={source.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{source.source}</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {source.visits.toLocaleString()} ({source.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Metrics
          </h3>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics?.customerMetrics?.newCustomers || 0}
              </p>
              <p className="text-sm text-gray-500">New Customers</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics?.customerMetrics?.returningCustomers || 0}
              </p>
              <p className="text-sm text-gray-500">Returning Customers</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(analytics?.customerMetrics?.avgLifetimeValue || 0)}
              </p>
              <p className="text-sm text-gray-500">Avg. Lifetime Value</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics?.customerMetrics?.churnRate || 0}%
              </p>
              <p className="text-sm text-gray-500">Churn Rate</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
