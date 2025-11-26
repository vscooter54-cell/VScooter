import { useLanguage } from '../context/LanguageContext';

const Impressum = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            {t('impressum')}
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            {/* IMPORTANT: This is a TEMPLATE - Must be filled with actual company information */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                ⚠️ TEMPLATE - Replace with actual company information before production
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('companyInformation')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Firmenname:</strong> [Company Legal Name]<br />
                <strong>Rechtsform:</strong> [e.g., GmbH, AG, Einzelunternehmen]<br />
                <strong>Geschäftsführer:</strong> [Managing Director Name(s)]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('address')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                [Street Address]<br />
                [Postal Code] [City]<br />
                [Country]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('contact')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Telefon:</strong> [Phone Number]<br />
                <strong>E-Mail:</strong> [Contact Email]<br />
                <strong>Website:</strong> www.vscooter.com
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('registrationDetails')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Handelsregister:</strong> [e.g., Amtsgericht München]<br />
                <strong>Registernummer:</strong> [HRB Number]<br />
                <strong>Umsatzsteuer-ID:</strong> [VAT ID - e.g., DE123456789]<br />
                <strong>Steuernummer:</strong> [Tax Number if applicable]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('responsibleForContent')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br />
                [Name of Responsible Person]<br />
                [Address]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('disputeResolution')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
              </p>
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-4">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('liabilityForContent')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
                Tätigkeit hinweisen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('liabilityForLinks')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
                der Seiten verantwortlich.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('copyright')}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impressum;
