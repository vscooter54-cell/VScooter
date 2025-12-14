import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function Troubleshooting() {
  const { currentLang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openIssue, setOpenIssue] = useState(null);

  const categories = [
    { id: 'all', name: currentLang === 'en' ? 'All Issues' : 'Alle Probleme', icon: 'list' },
    { id: 'power', name: currentLang === 'en' ? 'Power & Battery' : 'Strom & Batterie', icon: 'battery_alert' },
    { id: 'performance', name: currentLang === 'en' ? 'Performance' : 'Leistung', icon: 'speed' },
    { id: 'controls', name: currentLang === 'en' ? 'Controls' : 'Steuerungen', icon: 'settings_remote' },
    { id: 'mechanical', name: currentLang === 'en' ? 'Mechanical' : 'Mechanisch', icon: 'build' }
  ];

  const issues = [
    {
      category: 'power',
      question: currentLang === 'en' ? 'Scooter won\'t turn on' : 'Roller schaltet sich nicht ein',
      answer: currentLang === 'en'
        ? 'First, ensure the battery is charged. Press and hold the power button for 3 seconds. If it still doesn\'t turn on, check if the battery is properly connected and the charging port is clean. Try charging for at least 30 minutes before attempting to power on again.'
        : 'Stellen Sie zunächst sicher, dass die Batterie geladen ist. Halten Sie die Ein-/Aus-Taste 3 Sekunden lang gedrückt. Wenn es sich immer noch nicht einschaltet, überprüfen Sie, ob die Batterie richtig angeschlossen ist und der Ladeanschluss sauber ist. Versuchen Sie, mindestens 30 Minuten lang zu laden, bevor Sie erneut versuchen, das Gerät einzuschalten.',
      steps: [
        currentLang === 'en' ? 'Check battery charge level' : 'Batterieladezustand prüfen',
        currentLang === 'en' ? 'Hold power button for 3 seconds' : 'Ein-/Aus-Taste 3 Sekunden lang gedrückt halten',
        currentLang === 'en' ? 'Inspect battery connections' : 'Batterieanschlüsse überprüfen',
        currentLang === 'en' ? 'Clean charging port' : 'Ladeanschluss reinigen',
        currentLang === 'en' ? 'Try charging for 30 minutes' : '30 Minuten lang aufladen versuchen'
      ]
    },
    {
      category: 'power',
      question: currentLang === 'en' ? 'Battery drains too quickly' : 'Batterie entlädt sich zu schnell',
      answer: currentLang === 'en'
        ? 'Battery life can be affected by riding conditions, rider weight, terrain, and temperature. Ensure your tires are properly inflated (recommended: 50 PSI). Avoid riding in extremely cold weather. Turn off the scooter when not in use. If the battery is over 2 years old, it may need replacement.'
        : 'Die Batterielebensdauer kann durch Fahrbedingungen, Fahrergewicht, Gelände und Temperatur beeinflusst werden. Stellen Sie sicher, dass Ihre Reifen richtig aufgepumpt sind (empfohlen: 50 PSI). Vermeiden Sie Fahrten bei extrem kaltem Wetter. Schalten Sie den Roller aus, wenn Sie ihn nicht benutzen. Wenn die Batterie über 2 Jahre alt ist, muss sie möglicherweise ausgetauscht werden.',
      steps: [
        currentLang === 'en' ? 'Check tire pressure (50 PSI)' : 'Reifendruck prüfen (50 PSI)',
        currentLang === 'en' ? 'Avoid extreme temperatures' : 'Extreme Temperaturen vermeiden',
        currentLang === 'en' ? 'Turn off when not in use' : 'Bei Nichtgebrauch ausschalten',
        currentLang === 'en' ? 'Check battery age' : 'Batteriealter prüfen'
      ]
    },
    {
      category: 'performance',
      question: currentLang === 'en' ? 'Reduced top speed' : 'Reduzierte Höchstgeschwindigkeit',
      answer: currentLang === 'en'
        ? 'Check if your scooter is in eco mode - press the mode button to switch to sport mode. Ensure the battery is fully charged as speed decreases with lower battery levels. Check tire pressure (should be 50 PSI). Clean or lubricate the drivetrain if there\'s unusual resistance.'
        : 'Überprüfen Sie, ob Ihr Roller im Eco-Modus ist - drücken Sie die Modus-Taste, um in den Sport-Modus zu wechseln. Stellen Sie sicher, dass die Batterie vollständig geladen ist, da die Geschwindigkeit bei niedrigerem Batteriestand abnimmt. Überprüfen Sie den Reifendruck (sollte 50 PSI betragen). Reinigen oder schmieren Sie den Antriebsstrang, wenn ungewöhnlicher Widerstand vorhanden ist.',
      steps: [
        currentLang === 'en' ? 'Check riding mode (eco/sport)' : 'Fahrmodus prüfen (eco/sport)',
        currentLang === 'en' ? 'Verify battery charge' : 'Batterieladung überprüfen',
        currentLang === 'en' ? 'Check tire pressure' : 'Reifendruck prüfen',
        currentLang === 'en' ? 'Inspect and lubricate drivetrain' : 'Antriebsstrang inspizieren und schmieren'
      ]
    },
    {
      category: 'performance',
      question: currentLang === 'en' ? 'Motor makes unusual noise' : 'Motor macht ungewöhnliche Geräusche',
      answer: currentLang === 'en'
        ? 'Some noise is normal, but grinding or clicking sounds indicate a problem. Check for debris caught in the wheel or motor. Inspect the brake disc for rubbing. Tighten any loose screws or bolts. If the noise persists, the motor bearings may need service - contact support.'
        : 'Einige Geräusche sind normal, aber Schleif- oder Klickgeräusche deuten auf ein Problem hin. Überprüfen Sie, ob Schmutz im Rad oder Motor steckt. Überprüfen Sie die Bremsscheibe auf Reibung. Ziehen Sie alle losen Schrauben oder Bolzen fest. Wenn das Geräusch anhält, benötigen die Motorlager möglicherweise Wartung - kontaktieren Sie den Support.',
      steps: [
        currentLang === 'en' ? 'Check for debris in wheel/motor' : 'Auf Schmutz in Rad/Motor prüfen',
        currentLang === 'en' ? 'Inspect brake disc alignment' : 'Ausrichtung der Bremsscheibe prüfen',
        currentLang === 'en' ? 'Tighten loose components' : 'Lose Komponenten festziehen',
        currentLang === 'en' ? 'Contact support if issue persists' : 'Support kontaktieren, wenn Problem anhält'
      ]
    },
    {
      category: 'controls',
      question: currentLang === 'en' ? 'Throttle not responding' : 'Gaspedal reagiert nicht',
      answer: currentLang === 'en'
        ? 'Ensure the scooter is fully powered on and not in walk mode. Try turning it off and on again. Check if the brake lever is partially engaged (this prevents acceleration). Verify the throttle cable connection. If the display shows an error code, consult your manual or contact support.'
        : 'Stellen Sie sicher, dass der Roller vollständig eingeschaltet ist und sich nicht im Gehmodus befindet. Versuchen Sie, ihn aus- und wieder einzuschalten. Überprüfen Sie, ob der Bremshebel teilweise betätigt ist (dies verhindert die Beschleunigung). Überprüfen Sie die Verbindung des Gaskabels. Wenn das Display einen Fehlercode anzeigt, konsultieren Sie Ihr Handbuch oder kontaktieren Sie den Support.',
      steps: [
        currentLang === 'en' ? 'Verify scooter is in ride mode' : 'Prüfen, ob Roller im Fahrmodus ist',
        currentLang === 'en' ? 'Restart the scooter' : 'Roller neu starten',
        currentLang === 'en' ? 'Check brake lever position' : 'Position des Bremshebels prüfen',
        currentLang === 'en' ? 'Inspect throttle connections' : 'Gasverbindungen inspizieren'
      ]
    },
    {
      category: 'controls',
      question: currentLang === 'en' ? 'Display not working' : 'Display funktioniert nicht',
      answer: currentLang === 'en'
        ? 'Check if the display connector is properly attached behind the handlebar. Turn the scooter off and on. If the display remains blank, check if there\'s power (lights turn on). The display cable may be loose or damaged - this requires professional service.'
        : 'Überprüfen Sie, ob der Display-Stecker hinter dem Lenker richtig angebracht ist. Schalten Sie den Roller aus und ein. Wenn das Display leer bleibt, überprüfen Sie, ob Strom vorhanden ist (Lichter schalten sich ein). Das Displaykabel kann locker oder beschädigt sein - dies erfordert professionellen Service.',
      steps: [
        currentLang === 'en' ? 'Check display cable connection' : 'Displaykabelverbindung prüfen',
        currentLang === 'en' ? 'Restart scooter' : 'Roller neu starten',
        currentLang === 'en' ? 'Verify power to lights' : 'Stromversorgung der Lichter überprüfen',
        currentLang === 'en' ? 'Contact support for repair' : 'Support für Reparatur kontaktieren'
      ]
    },
    {
      category: 'mechanical',
      question: currentLang === 'en' ? 'Brakes not working properly' : 'Bremsen funktionieren nicht richtig',
      answer: currentLang === 'en'
        ? 'Check brake pad wear - they should be at least 2mm thick. Adjust the brake cable tension if brakes feel loose. For disc brakes, ensure the rotor is clean and not warped. Test brakes at low speed before riding. If brakes remain ineffective, they need professional service immediately.'
        : 'Überprüfen Sie den Verschleiß der Bremsbeläge - sie sollten mindestens 2 mm dick sein. Passen Sie die Spannung des Bremskabels an, wenn sich die Bremsen locker anfühlen. Stellen Sie bei Scheibenbremsen sicher, dass der Rotor sauber und nicht verzogen ist. Testen Sie die Bremsen bei niedriger Geschwindigkeit vor der Fahrt. Wenn die Bremsen ineffektiv bleiben, benötigen sie sofort professionellen Service.',
      steps: [
        currentLang === 'en' ? 'Inspect brake pad thickness (min 2mm)' : 'Dicke der Bremsbeläge prüfen (mind. 2mm)',
        currentLang === 'en' ? 'Adjust brake cable tension' : 'Bremskabelspannung anpassen',
        currentLang === 'en' ? 'Clean brake rotor' : 'Bremsrotor reinigen',
        currentLang === 'en' ? 'Test at low speed' : 'Bei niedriger Geschwindigkeit testen',
        currentLang === 'en' ? 'Seek immediate service if needed' : 'Bei Bedarf sofort Service aufsuchen'
      ]
    },
    {
      category: 'mechanical',
      question: currentLang === 'en' ? 'Flat tire' : 'Platter Reifen',
      answer: currentLang === 'en'
        ? 'If you have pneumatic tires: Remove the wheel, locate the puncture, patch or replace the inner tube, and reinflate to 50 PSI. For solid tires: Check for damage or excessive wear. Ensure the tire is properly seated on the rim. Consider upgrading to puncture-resistant inner tubes to prevent future flats.'
        : 'Bei Luftreifen: Rad entfernen, Loch lokalisieren, Schlauch flicken oder ersetzen und auf 50 PSI aufpumpen. Bei Vollgummireifen: Auf Beschädigung oder übermäßigen Verschleiß prüfen. Sicherstellen, dass der Reifen richtig auf der Felge sitzt. Erwägen Sie ein Upgrade auf pannensichere Schläuche, um zukünftige Pannen zu vermeiden.',
      steps: [
        currentLang === 'en' ? 'Remove wheel from scooter' : 'Rad vom Roller entfernen',
        currentLang === 'en' ? 'Locate puncture' : 'Loch lokalisieren',
        currentLang === 'en' ? 'Patch or replace tube' : 'Schlauch flicken oder ersetzen',
        currentLang === 'en' ? 'Reinflate to 50 PSI' : 'Auf 50 PSI aufpumpen',
        currentLang === 'en' ? 'Reinstall wheel' : 'Rad wieder einbauen'
      ]
    }
  ];

  const filteredIssues = selectedCategory === 'all'
    ? issues
    : issues.filter(issue => issue.category === selectedCategory);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-orange-950/20 dark:via-gray-950 dark:to-red-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-6">
            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-4xl">build</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {currentLang === 'en' ? 'Troubleshooting Guide' : 'Fehlerbehebungsleitfaden'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {currentLang === 'en'
              ? 'Find quick solutions to common issues. Select a category or browse all problems below.'
              : 'Finden Sie schnelle Lösungen für häufige Probleme. Wählen Sie eine Kategorie oder durchsuchen Sie alle Probleme unten.'}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Issues List */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-4">
            {filteredIssues.map((issue, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800"
              >
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  onClick={() => setOpenIssue(openIssue === index ? null : index)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary">help</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white text-lg">
                      {issue.question}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {openIssue === index ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {openIssue === index && (
                  <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-800 pt-6">
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      {issue.answer}
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">checklist</span>
                        {currentLang === 'en' ? 'Step-by-Step Solution:' : 'Schritt-für-Schritt-Lösung:'}
                      </h4>
                      <ol className="space-y-3">
                        {issue.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full text-sm font-bold flex-shrink-0">
                              {stepIndex + 1}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300 pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-20">search_off</span>
              <p>{currentLang === 'en' ? 'No issues found in this category' : 'Keine Probleme in dieser Kategorie gefunden'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'en' ? 'Still Need Help?' : 'Benötigen Sie noch Hilfe?'}
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {currentLang === 'en'
              ? "If you couldn't find a solution to your problem, our support team is ready to assist you."
              : 'Wenn Sie keine Lösung für Ihr Problem gefunden haben, steht Ihnen unser Support-Team gerne zur Verfügung.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/support" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined">support_agent</span>
              {currentLang === 'en' ? 'Contact Support' : 'Support kontaktieren'}
            </a>
            <a href="/support/user-manual" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-lg font-bold text-lg border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-colors">
              <span className="material-symbols-outlined">description</span>
              {currentLang === 'en' ? 'User Manuals' : 'Benutzerhandbücher'}
            </a>
          </div>

          <div className="mt-12 p-6 bg-white dark:bg-gray-900/50 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">
              {currentLang === 'en' ? 'Emergency Contact' : 'Notfallkontakt'}
            </h4>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p className="flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined text-primary">phone</span>
                +1 (555) 123-4567
              </p>
              <p className="flex items-center gap-2 justify-center">
                <span className="material-symbols-outlined text-primary">email</span>
                support@vscooter.com
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                {currentLang === 'en' ? 'Available 24/7 for urgent issues' : 'Für dringende Probleme 24/7 verfügbar'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
