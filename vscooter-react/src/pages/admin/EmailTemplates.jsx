import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([
    {
      id: 'order-confirmation',
      name: 'Order Confirmation',
      description: 'Sent when a customer places an order',
      subject: 'Your VScooter Order #{{orderNumber}} Confirmed',
      lastUpdated: '2024-01-15',
      enabled: true,
    },
    {
      id: 'shipping-notification',
      name: 'Shipping Notification',
      description: 'Sent when order is shipped',
      subject: 'Your Order #{{orderNumber}} Has Shipped',
      lastUpdated: '2024-01-14',
      enabled: true,
    },
    {
      id: 'delivery-confirmation',
      name: 'Delivery Confirmation',
      description: 'Sent when order is delivered',
      subject: 'Your Order #{{orderNumber}} Has Been Delivered',
      lastUpdated: '2024-01-12',
      enabled: true,
    },
    {
      id: 'welcome-email',
      name: 'Welcome Email',
      description: 'Sent to new customers after registration',
      subject: 'Welcome to VScooter!',
      lastUpdated: '2024-01-10',
      enabled: true,
    },
    {
      id: 'password-reset',
      name: 'Password Reset',
      description: 'Sent when customer requests password reset',
      subject: 'Reset Your VScooter Password',
      lastUpdated: '2024-01-08',
      enabled: true,
    },
    {
      id: 'review-request',
      name: 'Review Request',
      description: 'Sent after delivery to request product review',
      subject: 'How was your VScooter purchase?',
      lastUpdated: '2024-01-05',
      enabled: false,
    },
    {
      id: 'abandoned-cart',
      name: 'Abandoned Cart',
      description: 'Sent when cart is abandoned',
      subject: 'You left something behind!',
      lastUpdated: '2024-01-03',
      enabled: false,
    },
  ]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleToggleEnabled = (id) => {
    setTemplates(prev => prev.map(t =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t =>
        t.id === editingTemplate.id ? { ...editingTemplate, lastUpdated: new Date().toISOString().split('T')[0] } : t
      ));
      setEditingTemplate(null);
      setMessage({ type: 'success', text: 'Template saved successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSendTest = (template) => {
    setMessage({ type: 'success', text: `Test email sent for "${template.name}"` });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const variablesList = [
    { name: '{{customerName}}', desc: 'Customer full name' },
    { name: '{{customerEmail}}', desc: 'Customer email' },
    { name: '{{orderNumber}}', desc: 'Order number' },
    { name: '{{orderTotal}}', desc: 'Order total amount' },
    { name: '{{trackingNumber}}', desc: 'Shipping tracking number' },
    { name: '{{siteName}}', desc: 'Your store name' },
    { name: '{{resetLink}}', desc: 'Password reset link' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Email Templates</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Customize automated email notifications
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

        {/* Templates List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Templates</h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {templates.map(template => (
              <div key={template.id} className="p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      template.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {template.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                  <p className="text-xs text-gray-400 mt-1">Subject: {template.subject}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">
                    Updated: {template.lastUpdated}
                  </span>
                  <button
                    onClick={() => handleSendTest(template)}
                    className="p-2 text-gray-500 hover:text-blue-500"
                    title="Send test email"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-2 text-gray-500 hover:text-primary"
                    title="Edit template"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={template.enabled}
                      onChange={() => handleToggleEnabled(template.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variables Reference */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Available Variables
          </h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {variablesList.map(v => (
              <div key={v.name} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <code className="text-sm font-mono text-primary">{v.name}</code>
                <span className="text-xs text-gray-500">- {v.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Template Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit: {editingTemplate.name}
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Body (HTML)
                </label>
                <textarea
                  rows={15}
                  value={editingTemplate.body || `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #10B981; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>VScooter</h1>
    </div>
    <div class="content">
      <p>Hello {{customerName}},</p>
      <p>Your email content here...</p>
    </div>
    <div class="footer">
      <p>© 2024 VScooter. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`}
                  onChange={(e) => setEditingTemplate(prev => ({ ...prev, body: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Tip:</strong> Use variables like {`{{customerName}}`} to personalize emails.
                  They will be replaced with actual values when the email is sent.
                </p>
              </div>
            </div>
            <div className="flex justify-between gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleSendTest(editingTemplate)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                Send Test
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
