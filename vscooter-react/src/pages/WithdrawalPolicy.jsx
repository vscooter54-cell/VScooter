import { useLanguage } from '../context/LanguageContext';

const WithdrawalPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Widerrufsbelehrung
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            {/* IMPORTANT: This is a TEMPLATE based on German law - Must be reviewed by lawyer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                ⚠️ TEMPLATE - Must be reviewed and approved by legal counsel before production
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Widerrufsrecht
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter
                Dritter, der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben bzw. hat.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  [Firmenname]<br />
                  [Straße und Hausnummer]<br />
                  [PLZ und Ort]<br />
                  E-Mail: [E-Mail-Adresse]<br />
                  Telefon: [Telefonnummer]
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder E-Mail) über
                Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte
                Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des
                Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Folgen des Widerrufs
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten
                haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus
                ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste
                Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
                zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen
                Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart;
                in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis
                Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches
                der frühere Zeitpunkt ist.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag,
                an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu
                übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen
                absenden.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Rücksendeanschrift:</strong>
              </p>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300">
                  [Firmenname]<br />
                  [Straße und Hausnummer]<br />
                  [PLZ und Ort]
                </p>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sie tragen die unmittelbaren Kosten der Rücksendung der Waren. Die geschätzten Kosten belaufen
                sich auf maximal etwa [X] EUR.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf
                einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht
                notwendigen Umgang mit ihnen zurückzuführen ist.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Ausschluss bzw. vorzeitiges Erlöschen des Widerrufsrechts
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Das Widerrufsrecht besteht nicht bei folgenden Verträgen:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>
                  Verträge zur Lieferung von Waren, die nicht vorgefertigt sind und für deren Herstellung eine
                  individuelle Auswahl oder Bestimmung durch den Verbraucher maßgeblich ist oder die eindeutig
                  auf die persönlichen Bedürfnisse des Verbrauchers zugeschnitten sind;
                </li>
                <li>
                  Verträge zur Lieferung versiegelter Waren, die aus Gründen des Gesundheitsschutzes oder der
                  Hygiene nicht zur Rückgabe geeignet sind, wenn ihre Versiegelung nach der Lieferung entfernt wurde;
                </li>
                <li>
                  Verträge zur Lieferung von Waren, wenn diese nach der Lieferung auf Grund ihrer Beschaffenheit
                  untrennbar mit anderen Gütern vermischt wurden.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Muster-Widerrufsformular
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden
                  Sie es zurück:
                </p>
                <div className="border-2 border-gray-300 dark:border-gray-600 p-6 rounded bg-white dark:bg-gray-800">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    An:<br />
                    [Firmenname]<br />
                    [Straße und Hausnummer]<br />
                    [PLZ und Ort]<br />
                    E-Mail: [E-Mail-Adresse]
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf
                    der folgenden Waren (*) / die Erbringung der folgenden Dienstleistung (*)
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    - Bestellt am (*) / erhalten am (*):<br />
                    _______________________________________________________
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    - Name des/der Verbraucher(s):<br />
                    _______________________________________________________
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    - Anschrift des/der Verbraucher(s):<br />
                    _______________________________________________________<br />
                    _______________________________________________________
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    - Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):<br />
                    _______________________________________________________
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    - Datum:<br />
                    _______________________________________________________
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mt-4">
                    (*) Unzutreffendes streichen
                  </p>
                </div>
              </div>
              <a
                href="/downloads/widerrufsformular.pdf"
                download
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Widerrufsformular als PDF herunterladen
              </a>
            </section>

            <section className="mb-8">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                <strong>Stand:</strong> {new Date().toLocaleDateString('de-DE')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalPolicy;
