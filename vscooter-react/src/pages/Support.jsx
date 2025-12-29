import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Support() {
  const { t } = useLanguage();
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    { q: t('faqSection.q1'), a: t('faqSection.a1') },
    { q: t('faqSection.q2'), a: t('faqSection.a2') },
    { q: t('faqSection.q3'), a: t('faqSection.a3') },
    { q: t('faqSection.q4'), a: t('faqSection.a4') },
    { q: t('faqSection.q5'), a: t('faqSection.a5') },
    { q: t('faqSection.q6'), a: t('faqSection.a6') },
  ];

  return (
    <main className="flex-grow relative">
      {/* Banner Section - 50vh height from top */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden -mt-20 md:-mt-0">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/banner2.webp"
            alt="VScooter Support Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4">
            {t('supportPage.title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white drop-shadow-lg max-w-2xl mx-auto">
            {t('supportPage.subtitle')}
          </p>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            {t('quickHelp.title')}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/support/user-manual" className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">description</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('quickHelp.userManual')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('quickHelp.userManualDesc')}</p>
            </Link>
            <Link to="/support/warranty" className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('quickHelp.warranty')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('quickHelp.warrantyDesc')}</p>
            </Link>
            <Link to="/support/troubleshooting" className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">build</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('quickHelp.troubleshooting')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('quickHelp.troubleshootingDesc')}</p>
            </Link>
            <Link to="/support/replacement-parts" className="bg-white dark:bg-gray-800/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">settings</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {t('quickHelp.parts')}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('quickHelp.partsDesc')}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {t('supportPage.contactTitle')}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                {t('supportPage.contactSubtitle')}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">phone</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t('contactForm.phone')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('contactForm.hours')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">email</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {t('contactForm.emailAddress')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">24/7 Email Support</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{t('contactForm.address')}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Headquarters</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-8 shadow-lg">
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder={t('contactForm.name')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder={t('contactForm.email')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder={t('contactForm.subject')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    rows="5"
                    placeholder={t('contactForm.message')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
                >
                  {t('contactForm.send')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            {t('faqSection.title')}
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden shadow-lg"
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                  <span className="material-symbols-outlined text-primary">
                    {openFAQ === index ? 'remove' : 'add'}
                  </span>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
