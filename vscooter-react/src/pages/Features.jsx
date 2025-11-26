import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

export default function Features() {
  const { t } = useLanguage();

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-black dark:to-red-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {t('featuresPage.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            {t('featuresPage.subtitle')}
          </p>
          <Link
            to="/products"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg text-base font-bold hover:bg-primary/90 transition-all"
          >
            {t('featuresPage.cta')}
          </Link>
        </div>
      </section>

      {/* Smart Technology */}
      <section className="py-16 md:py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('smartTech.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('smartTech.subtitle')}
            </p>
          </div>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">smartphone</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('smartTech.appControl')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('smartTech.appControlDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">gps_fixed</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('smartTech.gpsTracking')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('smartTech.gpsTrackingDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">analytics</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('smartTech.diagnostics')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('smartTech.diagnosticsDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Features */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('safety.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('safety.subtitle')}
            </p>
          </div>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">security</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('safety.braking')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('safety.brakingDesc')}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('safety.lighting')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('safety.lightingDesc')}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-8 shadow-lg">
              <div className="w-16 h-16 mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">balance</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('safety.stability')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('safety.stabilityDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Features */}
      <section className="py-16 md:py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('performanceFeatures.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('performanceFeatures.subtitle')}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">electric_bolt</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('performanceFeatures.motor')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('performanceFeatures.motorDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">battery_horiz_075</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('performanceFeatures.battery')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('performanceFeatures.batteryDesc')}</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-4xl">tune</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('performanceFeatures.suspension')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('performanceFeatures.suspensionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comfort Features */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-red-50 via-white to-red-100 dark:from-red-950/20 dark:via-black dark:to-red-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('comfort.title')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('comfort.subtitle')}
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">design_services</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('comfort.ergonomic')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('comfort.ergonomicDesc')}</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">unfold_less</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('comfort.folding')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('comfort.foldingDesc')}</p>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mb-6 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">display_settings</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('comfort.display')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t('comfort.displayDesc')}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
