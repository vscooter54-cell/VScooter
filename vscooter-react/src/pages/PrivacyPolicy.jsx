import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Datenschutzerklärung / Privacy Policy
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            {/* IMPORTANT: This is a TEMPLATE - Must be reviewed by lawyer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-8">
              <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                ⚠️ TEMPLATE - Must be reviewed and approved by legal counsel specializing in German GDPR compliance before production
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                1. Datenschutz auf einen Blick
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Allgemeine Hinweise
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen
                Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit
                denen Sie persönlich identifiziert werden können.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                2. Verantwortliche Stelle
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Verantwortlich für die Datenverarbeitung auf dieser Website gemäß Art. 4 Abs. 7 DSGVO:
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                [Company Name]<br />
                [Street Address]<br />
                [Postal Code City]<br />
                <br />
                Telefon: [Phone]<br />
                E-Mail: [Email]<br />
                <br />
                Geschäftsführer: [Name(s)]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                3. Datenschutzbeauftragter
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Falls gesetzlich erforderlich (Unternehmen mit mehr als 20 Mitarbeitern, die
                personenbezogene Daten verarbeiten):<br />
                <br />
                [Data Protection Officer Name]<br />
                E-Mail: [DPO Email]
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                4. Welche Daten erfassen wir?
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4.1 Bestelldaten
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Bei einer Bestellung erfassen wir:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Name und Vorname</li>
                <li>E-Mail-Adresse</li>
                <li>Lieferadresse</li>
                <li>Rechnungsadresse</li>
                <li>Telefonnummer (optional)</li>
                <li>Bestellhistorie</li>
                <li>Zahlungsinformationen (verschlüsselt über Stripe verarbeitet)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4.2 Kundenkonto-Daten
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Registrierungsdaten (Name, E-Mail, Passwort)</li>
                <li>Profilinformationen</li>
                <li>Gespeicherte Adressen</li>
                <li>Wunschliste</li>
                <li>Produktbewertungen</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4.3 Technische Daten
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>IP-Adresse</li>
                <li>Browser-Typ und -Version</li>
                <li>Betriebssystem</li>
                <li>Zugriffszeitpunkt</li>
                <li>Referrer URL</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                5. Zweck der Datenverarbeitung
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Wir verwenden Ihre Daten für folgende Zwecke:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Abwicklung und Erfüllung von Bestellungen (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Kommunikation bezüglich Ihrer Bestellungen (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Verwaltung Ihres Kundenkontos (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Zahlungsabwicklung (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Bearbeitung von Support-Anfragen (Art. 6 Abs. 1 lit. b DSGVO)</li>
                <li>Verbesserung unserer Website und Dienstleistungen (Art. 6 Abs. 1 lit. f DSGVO)</li>
                <li>Marketing-E-Mails (nur mit Ihrer Einwilligung, Art. 6 Abs. 1 lit. a DSGVO)</li>
                <li>Erfüllung rechtlicher Verpflichtungen (Art. 6 Abs. 1 lit. c DSGVO)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                6. Weitergabe von Daten
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Wir geben Ihre Daten nur an folgende Dritte weiter:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                6.1 Zahlungsdienstleister
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>Stripe, Inc.</strong><br />
                510 Townsend Street, San Francisco, CA 94103, USA<br />
                Zweck: Sichere Zahlungsabwicklung<br />
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)<br />
                Datenschutzerklärung: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">https://stripe.com/privacy</a>
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                6.2 Versanddienstleister
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                [Name des Versanddienstleisters]<br />
                Zweck: Zustellung Ihrer Bestellung<br />
                Übermittelte Daten: Name, Lieferadresse, ggf. Telefonnummer
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                6.3 E-Mail-Versand
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                [E-Mail Service Provider - z.B. SendGrid/AWS SES]<br />
                Zweck: Versand von Bestellbestätigungen und Benachrichtigungen
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                7. Cookies
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät
                gespeichert werden. Wir unterscheiden zwischen:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                7.1 Technisch notwendige Cookies
              </h3>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Session-Management</li>
                <li>Warenkorb-Funktionalität</li>
                <li>Authentifizierung</li>
                <li>Spracheinstellung</li>
                <li>Dark Mode Präferenz</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                7.2 Analyse-Cookies (nur mit Einwilligung)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Werden nur nach Ihrer Zustimmung gesetzt.<br />
                Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                8. Speicherdauer
              </h2>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>Bestelldaten: 10 Jahre (steuerrechtliche Aufbewahrungspflicht nach HGB/AO)</li>
                <li>Kundenkonto: Bis zur Löschung durch den Nutzer oder Inaktivität</li>
                <li>Marketing-Einwilligungen: Bis zum Widerruf</li>
                <li>Technische Logs: 7 Tage</li>
                <li>Support-Tickets: 3 Jahre nach Abschluss</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                9. Ihre Rechte gemäß DSGVO
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über Ihre gespeicherten Daten verlangen</li>
                <li><strong>Berichtigungsrecht (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger Daten verlangen</li>
                <li><strong>Löschungsrecht (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen</li>
                <li><strong>Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung verlangen</li>
                <li><strong>Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in einem strukturierten Format erhalten</li>
                <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen</li>
                <li><strong>Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):</strong> Sie können Ihre Einwilligung jederzeit widerrufen</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter: [Email Address]<br />
                Oder nutzen Sie die Funktionen in Ihrem <Link to="/account/profile" className="text-blue-600 dark:text-blue-400 hover:underline">Benutzerprofil</Link>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                10. Beschwerderecht
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung
                Ihrer personenbezogenen Daten zu beschweren.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Zuständige Aufsichtsbehörde in Deutschland:<br />
                <a href="https://www.bfdi.bund.de" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                11. Datensicherheit
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Wir verwenden geeignete technische und organisatorische Sicherheitsmaßnahmen zum Schutz
                Ihrer Daten:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                <li>SSL/TLS-Verschlüsselung der Website</li>
                <li>Verschlüsselte Passwort-Speicherung (bcrypt)</li>
                <li>Sichere Zahlungsabwicklung über Stripe (PCI-DSS konform)</li>
                <li>Regelmäßige Sicherheitsupdates</li>
                <li>Zugriffskontrollen und Authentifizierung</li>
                <li>Regelmäßige Backups</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                12. Änderungen dieser Datenschutzerklärung
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den
                aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen
                in der Datenschutzerklärung umzusetzen.
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

export default PrivacyPolicy;
