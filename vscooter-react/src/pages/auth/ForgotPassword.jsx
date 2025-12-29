import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ForgotPassword() {
  const { currentLang } = useLanguage();
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {currentLang === 'en' ? 'Reset your password' : 'Setzen Sie Ihr Passwort zurück'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {currentLang === 'en' ? 'Remember your password?' : 'Erinnern Sie sich an Ihr Passwort?'}{' '}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
              {currentLang === 'en' ? 'Sign in' : 'Anmelden'}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    {currentLang === 'en'
                      ? 'Check your email for a password reset link.'
                      : 'Überprüfen Sie Ihre E-Mail für einen Link zum Zurücksetzen des Passworts.'}
                  </h3>
                </div>
              </div>
            </div>
          )}

          {!success && (
            <>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {currentLang === 'en' ? 'Email address' : 'E-Mail-Adresse'}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder={currentLang === 'en' ? 'you@example.com' : 'sie@beispiel.de'}
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading
                    ? (currentLang === 'en' ? 'Sending...' : 'Senden...')
                    : (currentLang === 'en' ? 'Send reset link' : 'Zurücksetzungslink senden')}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
