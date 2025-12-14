import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function UserManual() {
  const { currentLang } = useLanguage();
  const [selectedModel, setSelectedModel] = useState('');

  const scooterModels = [
    {
      id: 'falcon-500',
      name: 'Falcon 500',
      manuals: [
        { lang: 'en', name: 'User Manual (English)', size: '2.5 MB', url: '/manuals/falcon-500-en.pdf' },
        { lang: 'de', name: 'Benutzerhandbuch (Deutsch)', size: '2.5 MB', url: '/manuals/falcon-500-de.pdf' }
      ]
    },
    {
      id: 'mars',
      name: 'Mars',
      manuals: [
        { lang: 'en', name: 'User Manual (English)', size: '2.2 MB', url: '/manuals/mars-en.pdf' },
        { lang: 'de', name: 'Benutzerhandbuch (Deutsch)', size: '2.2 MB', url: '/manuals/mars-de.pdf' }
      ]
    },
    {
      id: 'amiga',
      name: 'Amiga',
      manuals: [
        { lang: 'en', name: 'User Manual (English)', size: '2.8 MB', url: '/manuals/amiga-en.pdf' },
        { lang: 'de', name: 'Benutzerhandbuch (Deutsch)', size: '2.8 MB', url: '/manuals/amiga-de.pdf' }
      ]
    }
  ];

  const selectedModelData = scooterModels.find(m => m.id === selectedModel);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-white to-accent/10 dark:from-primary/5 dark:via-gray-950 dark:to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full mb-6">
            <span className="material-symbols-outlined text-primary text-4xl">description</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {currentLang === 'en' ? 'User Manuals' : 'Benutzerhandbücher'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {currentLang === 'en'
              ? 'Download comprehensive user manuals for your VScooter model. Get detailed instructions, safety guidelines, and maintenance tips.'
              : 'Laden Sie umfassende Benutzerhandbücher für Ihr VScooter-Modell herunter. Erhalten Sie detaillierte Anweisungen, Sicherheitsrichtlinien und Wartungstipps.'}
          </p>
        </div>
      </section>

      {/* Manual Selection */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-900/50 rounded-2xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              {currentLang === 'en' ? 'Select Your Scooter Model' : 'Wählen Sie Ihr Roller-Modell'}
            </h2>

            {/* Model Selection */}
            <div className="grid gap-4 md:grid-cols-3 mb-12">
              {scooterModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedModel === model.id
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {model.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {currentLang === 'en' ? 'Select model' : 'Modell wählen'}
                  </div>
                </button>
              ))}
            </div>

            {/* Download Section */}
            {selectedModelData && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {currentLang === 'en'
                    ? `${selectedModelData.name} User Manuals`
                    : `${selectedModelData.name} Benutzerhandbücher`}
                </h3>

                <div className="space-y-4">
                  {selectedModelData.manuals.map((manual, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {manual.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            PDF • {manual.size}
                          </div>
                        </div>
                      </div>
                      <a
                        href={manual.url}
                        download
                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined">download</span>
                        {currentLang === 'en' ? 'Download' : 'Herunterladen'}
                      </a>
                    </div>
                  ))}
                </div>

                {/* What's Included */}
                <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                    {currentLang === 'en' ? "What's included in the manual:" : 'Was im Handbuch enthalten ist:'}
                  </h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                      {currentLang === 'en' ? 'Assembly and first-time setup instructions' : 'Montage- und Erstinstallationsanweisungen'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                      {currentLang === 'en' ? 'Safety guidelines and riding tips' : 'Sicherheitsrichtlinien und Fahrtipps'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                      {currentLang === 'en' ? 'Maintenance and care instructions' : 'Wartungs- und Pflegeanweisungen'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                      {currentLang === 'en' ? 'Technical specifications' : 'Technische Spezifikationen'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                      {currentLang === 'en' ? 'Troubleshooting guide' : 'Fehlerbehebungsleitfaden'}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                      {currentLang === 'en' ? 'Warranty information' : 'Garantie-Informationen'}
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {!selectedModel && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-20">touch_app</span>
                <p>{currentLang === 'en' ? 'Select a model to view available manuals' : 'Wählen Sie ein Modell, um verfügbare Handbücher anzuzeigen'}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'en' ? 'Need Additional Help?' : 'Benötigen Sie zusätzliche Hilfe?'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {currentLang === 'en'
              ? "Can't find what you're looking for? Our support team is here to help."
              : 'Können Sie nicht finden, was Sie suchen? Unser Support-Team hilft Ihnen gerne weiter.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/support" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined">support_agent</span>
              {currentLang === 'en' ? 'Contact Support' : 'Support kontaktieren'}
            </a>
            <a href="/support/troubleshooting" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors">
              <span className="material-symbols-outlined">build</span>
              {currentLang === 'en' ? 'Troubleshooting' : 'Fehlerbehebung'}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
