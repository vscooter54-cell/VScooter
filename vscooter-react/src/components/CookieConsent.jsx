import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const CookieConsent = () => {
  const { t, currentLang } = useLanguage();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyNecessary);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);

    // Trigger analytics or other scripts based on consent
    if (prefs.analytics) {
      // Enable analytics (e.g., Google Analytics)
      console.log('Analytics enabled');
    }
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
  };

  const handleToggle = (category) => {
    if (category === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className="fixed inset-x-0 bottom-0 z-50 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
            {!showSettings ? (
              /* Simple Banner */
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {currentLang === 'de' ? 'Cookie-Einstellungen' : 'Cookie Settings'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {currentLang === 'de'
                          ? 'Wir verwenden Cookies und ähnliche Technologien, um Ihnen das beste Erlebnis auf unserer Website zu bieten. Einige Cookies sind notwendig für den Betrieb der Website, während andere uns helfen, die Website und Ihr Erlebnis zu verbessern.'
                          : 'We use cookies and similar technologies to provide you with the best experience on our website. Some cookies are necessary for the operation of the website, while others help us improve the website and your experience.'
                        }
                      </p>
                      <Link
                        to="/privacy-policy"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                      >
                        {currentLang === 'de' ? 'Mehr erfahren' : 'Learn more'}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {currentLang === 'de' ? 'Einstellungen' : 'Settings'}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {currentLang === 'de' ? 'Nur notwendige' : 'Only Necessary'}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {currentLang === 'de' ? 'Alle akzeptieren' : 'Accept All'}
                  </button>
                </div>
              </div>
            ) : (
              /* Detailed Settings */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentLang === 'de' ? 'Cookie-Präferenzen' : 'Cookie Preferences'}
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {/* Necessary Cookies */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          {currentLang === 'de' ? 'Notwendige Cookies' : 'Necessary Cookies'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {currentLang === 'de'
                            ? 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden. Sie werden normalerweise nur als Reaktion auf Ihre Aktionen gesetzt, wie z.B. Spracheinstellung, Anmeldung oder Formularausfüllung.'
                            : 'These cookies are necessary for the basic functions of the website and cannot be disabled. They are usually only set in response to your actions, such as language setting, logging in, or filling out forms.'
                          }
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 h-6 bg-green-500 rounded-full flex items-center px-1">
                          <div className="w-4 h-4 bg-white rounded-full transform translate-x-6"></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                          {currentLang === 'de' ? 'Immer aktiv' : 'Always active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Functional Cookies */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          {currentLang === 'de' ? 'Funktionale Cookies' : 'Functional Cookies'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {currentLang === 'de'
                            ? 'Diese Cookies ermöglichen erweiterte Funktionalität und Personalisierung, wie Videos und Live-Chat. Sie können von uns oder von Drittanbietern gesetzt werden.'
                            : 'These cookies enable enhanced functionality and personalization, such as videos and live chat. They may be set by us or by third-party providers.'
                          }
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleToggle('functional')}
                          className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.functional ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                              preferences.functional ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          {currentLang === 'de' ? 'Analyse-Cookies' : 'Analytics Cookies'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {currentLang === 'de'
                            ? 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren. Alle Informationen, die diese Cookies sammeln, sind aggregiert und daher anonym.'
                            : 'These cookies help us understand how visitors interact with the website. All information collected by these cookies is aggregated and therefore anonymous.'
                          }
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleToggle('analytics')}
                          className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.analytics ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                              preferences.analytics ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          {currentLang === 'de' ? 'Marketing-Cookies' : 'Marketing Cookies'}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {currentLang === 'de'
                            ? 'Diese Cookies werden verwendet, um Werbung relevanter für Sie und Ihre Interessen zu gestalten. Sie können auch verwendet werden, um die Anzahl der Anzeigen zu begrenzen und die Effektivität von Werbekampagnen zu messen.'
                            : 'These cookies are used to make advertising more relevant to you and your interests. They may also be used to limit the number of times you see an ad and to measure the effectiveness of advertising campaigns.'
                          }
                        </p>
                      </div>
                      <div className="ml-4">
                        <button
                          onClick={() => handleToggle('marketing')}
                          className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                            preferences.marketing ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                              preferences.marketing ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          ></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    {currentLang === 'de' ? 'Alle ablehnen' : 'Reject All'}
                  </button>
                  <button
                    onClick={handleSavePreferences}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {currentLang === 'de' ? 'Auswahl speichern' : 'Save Selection'}
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                  >
                    {currentLang === 'de' ? 'Alle akzeptieren' : 'Accept All'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
    </>
  );
};

export default CookieConsent;
