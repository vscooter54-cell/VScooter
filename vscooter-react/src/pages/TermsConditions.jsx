import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            {/* IMPORTANT: This is a TEMPLATE - Must be reviewed by lawyer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                ⚠️ TEMPLATE - Must be reviewed and approved by legal counsel specializing in German e-commerce law before production
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 1 Geltungsbereich
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") der [Firmenname] (nachfolgend
                "Verkäufer") gelten für alle Verträge über die Lieferung von Waren, die ein Verbraucher oder
                Unternehmer (nachfolgend "Kunde") mit dem Verkäufer hinsichtlich der im Online-Shop des
                Verkäufers dargestellten Waren abschließt.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu
                Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen
                beruflichen Tätigkeit zugerechnet werden können.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                (3) Unternehmer im Sinne dieser AGB ist eine natürliche oder juristische Person oder eine
                rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer
                gewerblichen oder selbständigen beruflichen Tätigkeit handelt.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 2 Vertragsschluss
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (1) Die im Online-Shop des Verkäufers enthaltenen Produktbeschreibungen stellen keine
                verbindlichen Angebote seitens des Verkäufers dar, sondern dienen zur Abgabe eines
                verbindlichen Angebots durch den Kunden.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (2) Der Kunde kann das Angebot über das in den Online-Shop des Verkäufers integrierte
                Online-Bestellformular abgeben. Dabei gibt der Kunde, nachdem er die ausgewählten Waren in
                den virtuellen Warenkorb gelegt und den elektronischen Bestellprozess durchlaufen hat, durch
                Klicken des den Bestellvorgang abschließenden Buttons ein rechtlich verbindliches
                Vertragsangebot in Bezug auf die im Warenkorb enthaltenen Waren ab.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (3) Der Verkäufer kann das Angebot des Kunden innerhalb von fünf Tagen annehmen, indem er dem
                Kunden eine schriftliche Auftragsbestätigung oder eine Auftragsbestätigung in Textform
                (E-Mail) übermittelt oder indem er dem Kunden die bestellte Ware liefert.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                (4) Vor verbindlicher Abgabe der Bestellung über das Online-Bestellformular kann der Kunde
                Eingabefehler durch aufmerksames Lesen der auf dem Bildschirm dargestellten Informationen
                erkennen. Der Kunde kann seine Eingaben vor der verbindlichen Abgabe der Bestellung korrigieren.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 3 Preise und Zahlungsbedingungen
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (1) Alle Preise, die auf der Website des Verkäufers angegeben sind, verstehen sich
                einschließlich der jeweils gültigen gesetzlichen Umsatzsteuer.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (2) Zusätzlich zu den angegebenen Preisen berechnet der Verkäufer für die Lieferung
                Versandkosten. Die Versandkosten werden dem Käufer auf einer gesonderten Informationsseite und
                im Rahmen des Bestellvorgangs deutlich mitgeteilt.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (3) Dem Kunden stehen verschiedene Zahlungsmöglichkeiten zur Verfügung, die auf der Website
                des Verkäufers angegeben sind.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                (4) Bei Zahlung mittels Kreditkarte erfolgt die Belastung mit Vertragsschluss. Die
                Zahlungsabwicklung erfolgt über den Zahlungsdienstleister Stripe.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 4 Lieferung und Versandbedingungen
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (1) Die Lieferung von Waren erfolgt an die vom Kunden angegebene Lieferanschrift.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (2) Die Lieferzeit beträgt, soweit nicht anders angegeben, [X-Y] Werktage (Montag bis Freitag,
                keine gesetzlichen Feiertage).
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (3) Ist die Lieferung der Ware durch Verschulden des Kunden trotz dreimaligen
                Auslieferversuchs gescheitert, kann der Verkäufer vom Vertrag zurücktreten.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                (4) Wir liefern derzeit nur innerhalb Deutschlands. Ausnahmen sind gesondert gekennzeichnet.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 5 Widerrufsrecht für Verbraucher
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Verbraucher haben ein vierzehntägiges Widerrufsrecht. Die vollständigen Informationen zum
                Widerrufsrecht finden Sie in unserer{' '}
                <Link to="/withdrawal-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Widerrufsbelehrung
                </Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 6 Gewährleistung und Garantien
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (1) Es gelten die gesetzlichen Gewährleistungsrechte. Die Gewährleistungsfrist beträgt zwei
                Jahre ab Erhalt der Ware.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (2) Sofern vom Hersteller eine Garantie gewährt wird, sind die Garantiebedingungen dem
                jeweiligen Produkt beigefügt.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                (3) Im Falle eines Mangels stehen dem Kunden zunächst die Rechte auf Nacherfüllung
                (Nachbesserung oder Ersatzlieferung) zu. Schlägt die Nacherfüllung fehl, kann der Kunde nach
                seiner Wahl vom Vertrag zurücktreten oder den Kaufpreis mindern.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 7 Eigentumsvorbehalt
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Die gelieferte Ware bleibt bis zur vollständigen Bezahlung des Kaufpreises Eigentum des
                Verkäufers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 8 Haftung
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (1) Für Ansprüche aufgrund von Schäden, die durch uns, unsere gesetzlichen Vertreter oder
                Erfüllungsgehilfen verursacht wurden, haften wir stets unbeschränkt
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>bei Verletzung von Leben, Körper oder Gesundheit,</li>
                <li>bei vorsätzlicher oder grob fahrlässiger Pflichtverletzung,</li>
                <li>bei Garantieversprechen, soweit vereinbart,</li>
                <li>soweit der Anwendungsbereich des Produkthaftungsgesetzes eröffnet ist.</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (2) Bei Verletzung wesentlicher Vertragspflichten durch leichte Fahrlässigkeit von uns,
                unseren gesetzlichen Vertretern oder Erfüllungsgehilfen ist die Haftung der Höhe nach auf den
                bei Vertragsschluss vorhersehbaren Schaden begrenzt, mit dessen Entstehung typischerweise
                gerechnet werden muss.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                (3) Im Übrigen ist eine Haftung unsererseits ausgeschlossen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 9 Streitbeilegung
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (1) Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit,
                die Sie unter{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>{' '}
                finden.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                (2) Wir sind nicht bereit und nicht verpflichtet, an einem Streitbeilegungsverfahren vor
                einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 10 Datenschutz
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Die Verarbeitung personenbezogener Daten erfolgt gemäß den Bestimmungen unserer{' '}
                <Link to="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Datenschutzerklärung
                </Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                § 11 Schlussbestimmungen
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (1) Auf Verträge zwischen dem Verkäufer und dem Kunden findet das Recht der Bundesrepublik
                Deutschland unter Ausschluss des UN-Kaufrechts Anwendung. Bei Verbrauchern gilt diese
                Rechtswahl nur, soweit hierdurch der durch zwingende Bestimmungen des Rechts des Staates des
                gewöhnlichen Aufenthaltes des Verbrauchers gewährte Schutz nicht entzogen wird.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                (2) Sofern es sich beim Kunden um einen Kaufmann, eine juristische Person des öffentlichen
                Rechts oder um ein öffentlich-rechtliches Sondervermögen handelt, ist Gerichtsstand für alle
                Streitigkeiten aus Vertragsverhältnissen zwischen dem Kunden und dem Verkäufer der Sitz des
                Verkäufers.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                (3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit
                der übrigen Bestimmungen hiervon unberührt.
              </p>
            </section>

            <section className="mb-8">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Stand:</strong> {new Date().toLocaleDateString('de-DE')}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
