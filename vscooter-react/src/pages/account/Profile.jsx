import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { authAPI } from '../../services/api';

export default function Profile() {
  const { currentLang } = useLanguage();
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // GDPR states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const t = (key) => {
    const translations = {
      en: {
        profileSettings: 'Profile Settings',
        backToAccount: 'Back to Account',
        email: 'Email',
        emailCannotChange: 'Email cannot be changed',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone (optional)',
        saving: 'Saving...',
        saveChanges: 'Save Changes',
        profileUpdated: 'Profile updated successfully!',
        accountInfo: 'Account Information',
        emailVerified: 'Email Verified',
        yes: 'Yes',
        no: 'No',
        verifyEmail: 'Verify Email',
        memberSince: 'Member Since',
        accountStatus: 'Account Status',
        active: 'Active',
        inactive: 'Inactive',
        privacyData: 'Privacy & Data',
        privacyDataDesc: 'Manage your personal data and privacy settings according to GDPR',
        exportData: 'Export Your Data',
        exportDataDesc: 'Download a copy of all your personal data (GDPR Art. 20)',
        exportButton: 'Download My Data',
        exporting: 'Exporting...',
        deleteAccount: 'Delete Account',
        deleteAccountDesc: 'Permanently delete your account and all associated data (GDPR Art. 17)',
        deleteButton: 'Delete My Account',
        deleteWarning: 'Warning: This action cannot be undone!',
        deleteModalTitle: 'Delete Account',
        deleteModalDesc: 'Are you absolutely sure you want to delete your account? This will permanently remove all your data including orders, reviews, and wishlist.',
        deleteModalNote: 'Note: Order data will be anonymized but retained for 10 years for tax compliance (German law).',
        enterPassword: 'Enter your password to confirm',
        typeDelete: 'Type "DELETE MY ACCOUNT" to confirm',
        cancel: 'Cancel',
        confirmDelete: 'Delete Forever',
        deleting: 'Deleting...',
        passwordRequired: 'Password is required',
        confirmRequired: 'Please type "DELETE MY ACCOUNT" to confirm',
      },
      de: {
        profileSettings: 'Profileinstellungen',
        backToAccount: 'Zurück zum Konto',
        email: 'E-Mail',
        emailCannotChange: 'E-Mail kann nicht geändert werden',
        firstName: 'Vorname',
        lastName: 'Nachname',
        phone: 'Telefon (optional)',
        saving: 'Speichern...',
        saveChanges: 'Änderungen speichern',
        profileUpdated: 'Profil erfolgreich aktualisiert!',
        accountInfo: 'Kontoinformationen',
        emailVerified: 'E-Mail verifiziert',
        yes: 'Ja',
        no: 'Nein',
        verifyEmail: 'E-Mail verifizieren',
        memberSince: 'Mitglied seit',
        accountStatus: 'Kontostatus',
        active: 'Aktiv',
        inactive: 'Inaktiv',
        privacyData: 'Datenschutz & Daten',
        privacyDataDesc: 'Verwalten Sie Ihre persönlichen Daten und Datenschutzeinstellungen gemäß DSGVO',
        exportData: 'Daten exportieren',
        exportDataDesc: 'Laden Sie eine Kopie aller Ihrer persönlichen Daten herunter (DSGVO Art. 20)',
        exportButton: 'Meine Daten herunterladen',
        exporting: 'Exportiere...',
        deleteAccount: 'Konto löschen',
        deleteAccountDesc: 'Löschen Sie Ihr Konto und alle zugehörigen Daten dauerhaft (DSGVO Art. 17)',
        deleteButton: 'Mein Konto löschen',
        deleteWarning: 'Warnung: Diese Aktion kann nicht rückgängig gemacht werden!',
        deleteModalTitle: 'Konto löschen',
        deleteModalDesc: 'Sind Sie absolut sicher, dass Sie Ihr Konto löschen möchten? Dies entfernt dauerhaft alle Ihre Daten einschließlich Bestellungen, Bewertungen und Wunschliste.',
        deleteModalNote: 'Hinweis: Bestelldaten werden anonymisiert, aber für 10 Jahre aus steuerlichen Gründen aufbewahrt (deutsches Recht).',
        enterPassword: 'Geben Sie Ihr Passwort zur Bestätigung ein',
        typeDelete: 'Geben Sie "DELETE MY ACCOUNT" ein, um zu bestätigen',
        cancel: 'Abbrechen',
        confirmDelete: 'Für immer löschen',
        deleting: 'Lösche...',
        passwordRequired: 'Passwort erforderlich',
        confirmRequired: 'Bitte geben Sie "DELETE MY ACCOUNT" ein, um zu bestätigen',
      }
    };
    return translations[currentLang][key] || key;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleExportData = async () => {
    setExportLoading(true);
    setError('');

    try {
      const response = await authAPI.exportUserData();

      // Create a blob and download
      const dataStr = JSON.stringify(response.data.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vscooter-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError(t('passwordRequired'));
      return;
    }
    if (deleteConfirm !== 'DELETE MY ACCOUNT') {
      setError(t('confirmRequired'));
      return;
    }

    setDeleteLoading(true);
    setError('');

    try {
      await authAPI.deleteAccount({
        password: deletePassword,
        confirmDelete: deleteConfirm
      });

      // Logout and redirect
      await logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {language === 'en' ? 'Profile Settings' : 'Profileinstellungen'}
          </h1>
          <Link
            to="/account"
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            {language === 'en' ? 'Back to Account' : 'Zurück zum Konto'}
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-800 dark:text-green-200">
                {t('profileUpdated')}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('emailCannotChange')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('firstName')}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('lastName')}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('phone')}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'en' ? 'Account Information' : 'Kontoinformationen'}
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('emailVerified')}
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user?.emailVerified ? t('yes') : t('no')}
                </p>
              </div>
              {!user?.emailVerified && (
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {t('verifyEmail')}
                </button>
              )}
            </div>

            <div className="py-3 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('memberSince')}
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(user?.createdAt).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="py-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('accountStatus')}
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {user?.isActive ? t('active') : t('inactive')}
              </p>
            </div>
          </div>
        </div>

        {/* Privacy & Data (GDPR) */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {t('privacyData')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {t('privacyDataDesc')}
          </p>

          <div className="space-y-6">
            {/* Export Data */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('exportData')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('exportDataDesc')}
                  </p>
                  <button
                    onClick={handleExportData}
                    disabled={exportLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {exportLoading ? t('exporting') : t('exportButton')}
                  </button>
                </div>
              </div>
            </div>

            {/* Delete Account */}
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t('deleteAccount')}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t('deleteAccountDesc')}
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-4">
                    {t('deleteWarning')}
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    {t('deleteButton')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0">
                  <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('deleteModalTitle')}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t('deleteModalDesc')}
              </p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  {t('deleteModalNote')}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('enterPassword')}
                  </label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('typeDelete')}
                  </label>
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-mono"
                    placeholder="DELETE MY ACCOUNT"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                    setDeleteConfirm('');
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? t('deleting') : t('confirmDelete')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
