import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function Content() {
  const [activeTab, setActiveTab] = useState('banners');
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Summer Sale',
      subtitle: 'Up to 30% off on selected models',
      image: '/images/banner-summer.jpg',
      link: '/products?sale=true',
      active: true,
      position: 'hero',
    },
    {
      id: 2,
      title: 'Free Shipping',
      subtitle: 'On orders over CHF 500',
      image: '/images/banner-shipping.jpg',
      link: '/products',
      active: true,
      position: 'promo',
    },
  ]);
  const [homepage, setHomepage] = useState({
    heroTitle: 'Premium E-Scooters',
    heroSubtitle: 'Experience urban mobility at its finest',
    heroButtonText: 'Shop Now',
    heroButtonLink: '/products',
    featuredTitle: 'Featured Products',
    featuredSubtitle: 'Our most popular e-scooters',
    showTestimonials: true,
    showNewsletter: true,
  });
  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSaveBanner = () => {
    if (editingBanner) {
      if (editingBanner.id) {
        setBanners(prev => prev.map(b => b.id === editingBanner.id ? editingBanner : b));
      } else {
        setBanners(prev => [...prev, { ...editingBanner, id: Date.now() }]);
      }
      setEditingBanner(null);
      setMessage({ type: 'success', text: 'Banner saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleDeleteBanner = (id) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      setMessage({ type: 'success', text: 'Banner deleted!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSaveHomepage = async () => {
    try {
      setSaving(true);
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 500));
      setMessage({ type: 'success', text: 'Homepage content saved!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save' });
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'banners', name: 'Banners', icon: 'image' },
    { id: 'homepage', name: 'Homepage', icon: 'home' },
    { id: 'pages', name: 'Pages', icon: 'description' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Management</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Manage banners, homepage content, and static pages
          </p>
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
            <nav className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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
            {/* Banners Tab */}
            {activeTab === 'banners' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Promotional Banners</h3>
                  <button
                    onClick={() => setEditingBanner({ title: '', subtitle: '', image: '', link: '', active: true, position: 'hero' })}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Banner
                  </button>
                </div>

                <div className="grid gap-4">
                  {banners.map(banner => (
                    <div key={banner.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-32 h-20 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                        {banner.image ? (
                          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-gray-400">image</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{banner.title}</p>
                        <p className="text-sm text-gray-500">{banner.subtitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {banner.active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">{banner.position}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingBanner(banner)}
                          className="p-2 text-gray-500 hover:text-primary"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="p-2 text-gray-500 hover:text-red-500"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Homepage Tab */}
            {activeTab === 'homepage' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Homepage Content</h3>
                  <button
                    onClick={handleSaveHomepage}
                    disabled={saving}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hero Title
                    </label>
                    <input
                      type="text"
                      value={homepage.heroTitle}
                      onChange={(e) => setHomepage(prev => ({ ...prev, heroTitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hero Subtitle
                    </label>
                    <input
                      type="text"
                      value={homepage.heroSubtitle}
                      onChange={(e) => setHomepage(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hero Button Text
                    </label>
                    <input
                      type="text"
                      value={homepage.heroButtonText}
                      onChange={(e) => setHomepage(prev => ({ ...prev, heroButtonText: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hero Button Link
                    </label>
                    <input
                      type="text"
                      value={homepage.heroButtonLink}
                      onChange={(e) => setHomepage(prev => ({ ...prev, heroButtonLink: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Section Title
                    </label>
                    <input
                      type="text"
                      value={homepage.featuredTitle}
                      onChange={(e) => setHomepage(prev => ({ ...prev, featuredTitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Featured Section Subtitle
                    </label>
                    <input
                      type="text"
                      value={homepage.featuredSubtitle}
                      onChange={(e) => setHomepage(prev => ({ ...prev, featuredSubtitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium text-gray-900 dark:text-white">Section Visibility</h4>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homepage.showTestimonials}
                      onChange={(e) => setHomepage(prev => ({ ...prev, showTestimonials: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Testimonials Section</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homepage.showNewsletter}
                      onChange={(e) => setHomepage(prev => ({ ...prev, showNewsletter: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show Newsletter Section</span>
                  </label>
                </div>
              </div>
            )}

            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Static Pages</h3>
                <div className="grid gap-4">
                  {[
                    { name: 'About Us', path: '/about', updated: '2024-01-15' },
                    { name: 'Contact', path: '/contact', updated: '2024-01-10' },
                    { name: 'FAQ', path: '/faq', updated: '2024-01-08' },
                    { name: 'Privacy Policy', path: '/privacy-policy', updated: '2024-01-01' },
                    { name: 'Terms & Conditions', path: '/terms-conditions', updated: '2024-01-01' },
                  ].map(page => (
                    <div key={page.path} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{page.name}</p>
                        <p className="text-sm text-gray-500">{page.path}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">Updated: {page.updated}</span>
                        <button className="text-primary hover:text-primary/80">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Banner Edit Modal */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingBanner.id ? 'Edit Banner' : 'Add Banner'}
              </h3>
              <button onClick={() => setEditingBanner(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Image URL</label>
                <input
                  type="text"
                  value={editingBanner.image}
                  onChange={(e) => setEditingBanner(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Link</label>
                <input
                  type="text"
                  value={editingBanner.link}
                  onChange={(e) => setEditingBanner(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                  <select
                    value={editingBanner.position}
                    onChange={(e) => setEditingBanner(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="hero">Hero</option>
                    <option value="promo">Promo Bar</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingBanner.active}
                      onChange={(e) => setEditingBanner(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setEditingBanner(null)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBanner}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Save Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
