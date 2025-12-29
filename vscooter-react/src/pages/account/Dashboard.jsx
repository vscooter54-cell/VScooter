import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Dashboard() {
  const { currentLang } = useLanguage();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    {
      title: currentLang === 'en' ? 'Orders' : 'Bestellungen',
      description: currentLang === 'en' ? 'View and track your orders' : 'Bestellungen anzeigen und verfolgen',
      link: '/account/orders',
      icon: '📦'
    },
    {
      title: currentLang === 'en' ? 'Profile' : 'Profil',
      description: currentLang === 'en' ? 'Manage your account information' : 'Kontoinformationen verwalten',
      link: '/account/profile',
      icon: '👤'
    },
    {
      title: currentLang === 'en' ? 'Addresses' : 'Adressen',
      description: currentLang === 'en' ? 'Manage shipping addresses' : 'Lieferadressen verwalten',
      link: '/account/addresses',
      icon: '📍'
    },
    {
      title: currentLang === 'en' ? 'Security' : 'Sicherheit',
      description: currentLang === 'en' ? 'Change your password' : 'Passwort ändern',
      link: '/account/security',
      icon: '🔒'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {currentLang === 'en' ? 'My Account' : 'Mein Konto'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {currentLang === 'en' ? 'Welcome back' : 'Willkommen zurück'}, {user?.firstName}!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.link}
              to={item.link}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {item.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {item.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'en' ? 'Account Information' : 'Kontoinformationen'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {currentLang === 'en' ? 'Name' : 'Name'}
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {user?.firstName} {user?.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {currentLang === 'en' ? 'Email' : 'E-Mail'}
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {user?.email}
              </p>
            </div>

            {user?.phone && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {currentLang === 'en' ? 'Phone' : 'Telefon'}
                </p>
                <p className="text-gray-900 dark:text-white font-medium">
                  {user.phone}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {currentLang === 'en' ? 'Member Since' : 'Mitglied seit'}
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {new Date(user?.createdAt).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'de-DE')}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
            >
              {currentLang === 'en' ? 'Sign Out' : 'Abmelden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
