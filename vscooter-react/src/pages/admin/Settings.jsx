import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      setSettings(response.data.data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      // Set default settings if none exist
      setSettings({
        general: {
          siteName: 'VScooter',
          siteDescription: 'Premium E-Scooters in Switzerland',
          contactEmail: 'info@vscooter.ch',
          contactPhone: '+41 XX XXX XX XX',
          address: 'Zürich, Switzerland',
        },
        theme: {
          primaryColor: '#10B981',
          secondaryColor: '#3B82F6',
          accentColor: '#8B5CF6',
          darkMode: true,
          fontFamily: 'Inter',
        },
        ecommerce: {
          currency: 'CHF',
          taxRate: 7.7,
          freeShippingThreshold: 500,
          defaultShippingCost: 29,
          lowStockThreshold: 5,
        },
        notifications: {
          orderConfirmation: true,
          shippingUpdates: true,
          promotionalEmails: false,
          lowStockAlerts: true,
        },
        social: {
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: '',
        },
        seo: {
          metaTitle: 'VScooter - Premium E-Scooters',
          metaDescription: 'High-quality electric scooters for urban mobility',
          googleAnalyticsId: '',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminAPI.updateSettings(settings);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: 'settings' },
    { id: 'theme', name: 'Appearance', icon: 'palette' },
    { id: 'ecommerce', name: 'E-Commerce', icon: 'shopping_cart' },
    { id: 'notifications', name: 'Notifications', icon: 'notifications' },
    { id: 'social', name: 'Social Media', icon: 'share' },
    { id: 'seo', name: 'SEO', icon: 'search' },
  ];

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Configure your store settings and preferences
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">save</span>
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general?.siteName || ''}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.general?.contactEmail || ''}
                      onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={settings.general?.contactPhone || ''}
                      onChange={(e) => updateSetting('general', 'contactPhone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={settings.general?.address || ''}
                      onChange={(e) => updateSetting('general', 'address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.general?.siteDescription || ''}
                      onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Theme/Appearance Settings */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance Settings</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.theme?.primaryColor || '#10B981'}
                        onChange={(e) => updateSetting('theme', 'primaryColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={settings.theme?.primaryColor || '#10B981'}
                        onChange={(e) => updateSetting('theme', 'primaryColor', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.theme?.secondaryColor || '#3B82F6'}
                        onChange={(e) => updateSetting('theme', 'secondaryColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={settings.theme?.secondaryColor || '#3B82F6'}
                        onChange={(e) => updateSetting('theme', 'secondaryColor', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Accent Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.theme?.accentColor || '#8B5CF6'}
                        onChange={(e) => updateSetting('theme', 'accentColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600"
                      />
                      <input
                        type="text"
                        value={settings.theme?.accentColor || '#8B5CF6'}
                        onChange={(e) => updateSetting('theme', 'accentColor', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Font Family
                    </label>
                    <select
                      value={settings.theme?.fontFamily || 'Inter'}
                      onChange={(e) => updateSetting('theme', 'fontFamily', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.theme?.darkMode || false}
                        onChange={(e) => updateSetting('theme', 'darkMode', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Enable Dark Mode by Default
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* E-Commerce Settings */}
            {activeTab === 'ecommerce' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">E-Commerce Settings</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.ecommerce?.currency || 'CHF'}
                      onChange={(e) => updateSetting('ecommerce', 'currency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="USD">USD - US Dollar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.ecommerce?.taxRate || 7.7}
                      onChange={(e) => updateSetting('ecommerce', 'taxRate', parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Free Shipping Threshold
                    </label>
                    <input
                      type="number"
                      value={settings.ecommerce?.freeShippingThreshold || 500}
                      onChange={(e) => updateSetting('ecommerce', 'freeShippingThreshold', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Shipping Cost
                    </label>
                    <input
                      type="number"
                      value={settings.ecommerce?.defaultShippingCost || 29}
                      onChange={(e) => updateSetting('ecommerce', 'defaultShippingCost', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      value={settings.ecommerce?.lowStockThreshold || 5}
                      onChange={(e) => updateSetting('ecommerce', 'lowStockThreshold', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order Confirmations</p>
                      <p className="text-sm text-gray-500">Send email when order is placed</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.orderConfirmation || false}
                      onChange={(e) => updateSetting('notifications', 'orderConfirmation', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Shipping Updates</p>
                      <p className="text-sm text-gray-500">Send email when order status changes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.shippingUpdates || false}
                      onChange={(e) => updateSetting('notifications', 'shippingUpdates', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Promotional Emails</p>
                      <p className="text-sm text-gray-500">Send marketing and promotional emails</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.promotionalEmails || false}
                      onChange={(e) => updateSetting('notifications', 'promotionalEmails', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Low Stock Alerts</p>
                      <p className="text-sm text-gray-500">Alert admin when stock is low</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications?.lowStockAlerts || false}
                      onChange={(e) => updateSetting('notifications', 'lowStockAlerts', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Social Media Settings */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Social Media Links</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={settings.social?.facebook || ''}
                      onChange={(e) => updateSetting('social', 'facebook', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      placeholder="https://instagram.com/..."
                      value={settings.social?.instagram || ''}
                      onChange={(e) => updateSetting('social', 'instagram', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter/X
                    </label>
                    <input
                      type="url"
                      placeholder="https://twitter.com/..."
                      value={settings.social?.twitter || ''}
                      onChange={(e) => updateSetting('social', 'twitter', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      YouTube
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={settings.social?.youtube || ''}
                      onChange={(e) => updateSetting('social', 'youtube', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SEO Settings */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SEO Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={settings.seo?.metaTitle || ''}
                      onChange={(e) => updateSetting('seo', 'metaTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {(settings.seo?.metaTitle || '').length}/60 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={settings.seo?.metaDescription || ''}
                      onChange={(e) => updateSetting('seo', 'metaDescription', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {(settings.seo?.metaDescription || '').length}/160 characters
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      placeholder="G-XXXXXXXXXX"
                      value={settings.seo?.googleAnalyticsId || ''}
                      onChange={(e) => updateSetting('seo', 'googleAnalyticsId', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
