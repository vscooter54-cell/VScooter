import { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    products: "Products",
    features: "Features",
    support: "Support",
    buyNow: "Buy Now",
    home: "Home",
    hero: {
      title: "Vscooter",
      subtitle: "The Future of Urban Mobility. Experience the thrill of electric scooters with our innovative designs. Eco-friendly, efficient, and fun.",
      button: "Explore Models"
    },
    featuredModels: "Featured Models",
    modelX: "Falcon 500",
    modelXDesc: "The ultimate urban commuter",
    modelY: "Mars",
    modelYDesc: "Compact and agile for city navigation",
    modelZ: "Amiga",
    modelZDesc: "High-performance for longer rides",
    whyChoose: "Why Choose Vscooter?",
    whyChooseDesc: "Our electric scooters are packed with features designed for your convenience and safety.",
    battery: "Long-Lasting Battery",
    batteryDesc: "Ride further with our extended battery life, perfect for your daily adventures.",
    performance: "High Performance",
    performanceDesc: "Smooth acceleration and top speeds for an efficient and exhilarating commute.",
    eco: "Eco-Friendly",
    ecoDesc: "Reduce your carbon footprint and contribute to a greener planet with every ride.",
    testimonials: "What Our Riders Say",
    review1: "I love my Vscooter! It's perfect for my daily commute and saves me so much time and money.",
    review2: "Great for city living. Easy to maneuver and park. The ride can be a bit bumpy on uneven surfaces.",
    review3: "Exceeded my expectations. The performance is outstanding, and it's incredibly fun to ride.",
    company: "Company",
    aboutUs: "About Us",
    careers: "Careers",
    press: "Press",
    contact: "Contact",
    faq: "FAQ",
    warranty: "Warranty",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    accessories: "Accessories",
    footerTagline: "The future of urban mobility is here.",
    copyright: "© 2023 Vscooter. All rights reserved.",
    // Features page
    featuresPage: {
      title: "Advanced Features",
      subtitle: "Discover what makes our electric scooters the best choice for urban mobility",
      cta: "Explore Our Models"
    },
    smartTech: {
      title: "Smart Technology",
      subtitle: "Connected riding experience with advanced features",
      appControl: "Mobile App Control",
      appControlDesc: "Full control over your scooter with our intuitive mobile app. Track rides, check battery status, lock/unlock remotely, and customize settings.",
      gpsTracking: "GPS Tracking",
      gpsTrackingDesc: "Real-time location tracking and anti-theft protection. Get instant notifications if your scooter is moved without permission.",
      diagnostics: "Smart Diagnostics",
      diagnosticsDesc: "Advanced self-diagnostics system monitors performance and alerts you to maintenance needs before issues occur."
    },
    safety: {
      title: "Safety First",
      subtitle: "Advanced safety systems for confident riding",
      braking: "Dual Braking System",
      brakingDesc: "Electronic and mechanical braking system provides maximum stopping power and control in all conditions.",
      lighting: "LED Lighting System",
      lightingDesc: "High-visibility LED headlight and taillight with automatic brightness adjustment for optimal visibility day and night.",
      stability: "Enhanced Stability",
      stabilityDesc: "Advanced gyroscopic sensors and stability control system help maintain balance and prevent accidents."
    },
    performanceFeatures: {
      title: "Superior Performance",
      subtitle: "Engineering excellence for the ultimate riding experience",
      motor: "High-Efficiency Motor",
      motorDesc: "Brushless DC motor delivers smooth, quiet operation with minimal maintenance and maximum efficiency.",
      battery: "Long-Range Battery",
      batteryDesc: "Lithium-ion battery technology provides extended range with fast charging capabilities and long lifespan.",
      suspension: "Advanced Suspension",
      suspensionDesc: "Front and rear shock absorbers provide smooth rides over bumps and uneven surfaces."
    },
    comfort: {
      title: "Comfort & Convenience",
      subtitle: "Designed for your daily comfort",
      ergonomic: "Ergonomic Design",
      ergonomicDesc: "Carefully designed handlebar height and deck width provide comfortable riding position for extended journeys.",
      folding: "Quick-Fold System",
      foldingDesc: "Patented folding mechanism allows for easy storage and transport in seconds without tools.",
      display: "Digital Display",
      displayDesc: "Clear LCD display shows speed, battery level, riding mode, and trip information at a glance."
    },
    // Products page
    productsPage: {
      title: "Our Electric Scooters",
      subtitle: "Choose the perfect scooter for your urban adventures",
      compareBtn: "Compare Models",
      orderBtn: "Order Now"
    },
    modelXPrice: "$899",
    modelXSpecs: {
      range: "35 miles",
      speed: "25 mph",
      weight: "26 lbs",
      charge: "4 hours"
    },
    modelXFeatures: ["Premium LED Display", "Dual Braking System", "Shock Absorption", "Mobile App Integration"],
    modelYPrice: "$699",
    modelYSpecs: {
      range: "28 miles",
      speed: "20 mph",
      weight: "24 lbs",
      charge: "3.5 hours"
    },
    modelYFeatures: ["Compact Design", "Quick Fold Mechanism", "LED Headlight", "Anti-theft Lock"],
    modelZPrice: "$1199",
    modelZSpecs: {
      range: "45 miles",
      speed: "30 mph",
      weight: "32 lbs",
      charge: "5 hours"
    },
    modelZFeatures: ["Long Range Battery", "High Performance Motor", "All-terrain Tires", "Advanced Suspension"],
    specs: "Specifications",
    range: "Range",
    maxSpeed: "Max Speed",
    weight: "Weight",
    chargingTime: "Charging Time",
    keyFeatures: "Key Features",
    helmet: "Safety Helmet",
    helmetDesc: "Professional grade helmet with LED indicators",
    helmetPrice: "$89",
    lock: "Security Lock",
    lockDesc: "Smart Bluetooth lock with mobile app control",
    lockPrice: "$45",
    charger: "Fast Charger",
    chargerDesc: "Rapid charging dock for all models",
    chargerPrice: "$129",
    bag: "Storage Bag",
    bagDesc: "Waterproof carrying bag with extra compartments",
    bagPrice: "$69",
    // Support page
    supportPage: {
      title: "Customer Support",
      subtitle: "We're here to help with all your Vscooter needs",
      contactTitle: "Get in Touch",
      contactSubtitle: "Send us a message and we'll respond within 24 hours"
    },
    contactForm: {
      name: "Full Name",
      email: "Email Address",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      phone: "+1 (555) 123-4567",
      emailAddress: "support@vscooter.com",
      address: "123 Electric Avenue, Tech City, TC 12345",
      hours: "Mon-Fri: 9AM-6PM PST"
    },
    faqSection: {
      title: "Frequently Asked Questions",
      q1: "What is the maximum range of Vscooter models?",
      a1: "Our Model Z offers the longest range at 45 miles on a single charge. Model X provides 35 miles, and Model Y offers 28 miles of range.",
      q2: "How long does it take to fully charge the battery?",
      a2: "Charging times vary by model: Model Y takes 3.5 hours, Model X takes 4 hours, and Model Z takes 5 hours for a full charge.",
      q3: "Are Vscooters waterproof?",
      a3: "All our scooters have IPX4 water resistance rating, meaning they can handle light rain and splashes but should not be submerged in water.",
      q4: "What is the maximum weight capacity?",
      a4: "All Vscooter models can safely support riders up to 220 lbs (100 kg) while maintaining optimal performance.",
      q5: "Do you offer international shipping?",
      a5: "Currently, we ship to the US, Canada, and most European countries. Contact support for specific international shipping options.",
      q6: "What's included in the warranty?",
      a6: "We offer a 2-year limited warranty covering manufacturing defects, battery, and motor. Normal wear and tear is not covered."
    },
    quickHelp: {
      title: "Quick Help",
      userManual: "User Manual",
      userManualDesc: "Complete guide for setup, operation, and maintenance",
      warranty: "Warranty Registration",
      warrantyDesc: "Register your scooter for warranty coverage",
      troubleshooting: "Troubleshooting",
      troubleshootingDesc: "Common issues and solutions",
      parts: "Replacement Parts",
      partsDesc: "Order genuine Vscooter replacement parts"
    },
    // Welcome Modal
    welcomeModal: {
      title: "Welcome to Vscooter!",
      subtitle: "The Future of Urban Mobility",
      ecoFriendly: "Eco-Friendly",
      ecoFriendlyDesc: "Zero emissions",
      highPerformance: "High Performance",
      highPerformanceDesc: "Up to 30 mph",
      longRange: "Long Range",
      longRangeDesc: "Up to 45 miles",
      warranty: "2-Year Warranty",
      warrantyDesc: "Full coverage",
      exploreBtn: "Explore Models",
      learnMoreBtn: "Learn More",
      specialOffer: "🎉 Limited Time Offer: Get 10% off your first purchase!"
    },
    // Legal pages
    impressum: "Imprint",
    withdrawalRight: "Right of Withdrawal",
    companyInformation: "Company Information",
    address: "Address",
    registrationDetails: "Registration Details",
    responsibleForContent: "Responsible for Content",
    disputeResolution: "Dispute Resolution",
    liabilityForContent: "Liability for Content",
    liabilityForLinks: "Liability for Links",
    copyright: "Copyright"
  },
  de: {
    products: "Produkte",
    features: "Funktionen",
    support: "Support",
    buyNow: "Jetzt kaufen",
    home: "Startseite",
    hero: {
      title: "Vscooter",
      subtitle: "Die Zukunft der urbanen Mobilität. Erleben Sie den Nervenkitzel von Elektrorollern mit unseren innovativen Designs. Umweltfreundlich, effizient und Spaß.",
      button: "Modelle entdecken"
    },
    featuredModels: "Vorgestellte Modelle",
    modelX: "Falcon 500",
    modelXDesc: "Der ultimative urbane Pendler",
    modelY: "Mars",
    modelYDesc: "Kompakt und wendig für die Stadtnavigation",
    modelZ: "Amiga",
    modelZDesc: "Hochleistung für längere Fahrten",
    whyChoose: "Warum Vscooter wählen?",
    whyChooseDesc: "Unsere Elektroroller sind voller Funktionen, die für Ihre Bequemlichkeit und Sicherheit entwickelt wurden.",
    battery: "Langlebiger Akku",
    batteryDesc: "Fahren Sie weiter mit unserer verlängerten Akkulaufzeit, perfekt für Ihre täglichen Abenteuer.",
    performance: "Hohe Leistung",
    performanceDesc: "Sanfte Beschleunigung und Höchstgeschwindigkeiten für einen effizienten und aufregenden Arbeitsweg.",
    eco: "Umweltfreundlich",
    ecoDesc: "Reduzieren Sie Ihren CO2-Fußabdruck und tragen Sie mit jeder Fahrt zu einem grüneren Planeten bei.",
    testimonials: "Was unsere Fahrer sagen",
    review1: "Ich liebe meinen Vscooter! Er ist perfekt für meinen täglichen Arbeitsweg und spart mir so viel Zeit und Geld.",
    review2: "Großartig für das Stadtleben. Einfach zu manövrieren und zu parken. Die Fahrt kann auf unebenen Oberflächen etwas holprig sein.",
    review3: "Hat meine Erwartungen übertroffen. Die Leistung ist hervorragend und es macht unglaublich viel Spaß zu fahren.",
    company: "Unternehmen",
    aboutUs: "Über uns",
    careers: "Karriere",
    press: "Presse",
    contact: "Kontakt",
    faq: "FAQ",
    warranty: "Garantie",
    legal: "Rechtliches",
    privacy: "Datenschutz",
    terms: "Bedingungen",
    accessories: "Zubehör",
    footerTagline: "Die Zukunft der urbanen Mobilität ist hier.",
    copyright: "© 2023 Vscooter. Alle Rechte vorbehalten.",
    // Features page
    featuresPage: {
      title: "Erweiterte Funktionen",
      subtitle: "Entdecken Sie, was unsere Elektroroller zur besten Wahl für urbane Mobilität macht",
      cta: "Entdecken Sie unsere Modelle"
    },
    smartTech: {
      title: "Smart-Technologie",
      subtitle: "Vernetztes Fahrerlebnis mit erweiterten Funktionen",
      appControl: "Mobile App-Steuerung",
      appControlDesc: "Vollständige Kontrolle über Ihren Roller mit unserer intuitiven mobilen App. Verfolgen Sie Fahrten, prüfen Sie den Batteriestand, ver-/entriegeln Sie ferngesteuert und passen Sie Einstellungen an.",
      gpsTracking: "GPS-Verfolgung",
      gpsTrackingDesc: "Echtzeit-Standortverfolgung und Diebstahlschutz. Erhalten Sie sofortige Benachrichtigungen, wenn Ihr Roller ohne Berechtigung bewegt wird.",
      diagnostics: "Smart-Diagnose",
      diagnosticsDesc: "Erweiterte Selbstdiagnosesystem überwacht die Leistung und warnt Sie vor Wartungsbedarf, bevor Probleme auftreten."
    },
    safety: {
      title: "Sicherheit zuerst",
      subtitle: "Erweiterte Sicherheitssysteme für sicheres Fahren",
      braking: "Duales Bremssystem",
      brakingDesc: "Elektronisches und mechanisches Bremssystem bietet maximale Bremskraft und Kontrolle unter allen Bedingungen.",
      lighting: "LED-Beleuchtungssystem",
      lightingDesc: "Hoch sichtbare LED-Scheinwerfer und Rücklicht mit automatischer Helligkeitsanpassung für optimale Sichtbarkeit bei Tag und Nacht.",
      stability: "Erweiterte Stabilität",
      stabilityDesc: "Erweiterte gyroskopische Sensoren und Stabilitätskontrollsystem helfen beim Gleichgewicht und verhindern Unfälle."
    },
    performanceFeatures: {
      title: "Überlegene Leistung",
      subtitle: "Ingenieursexzellenz für das ultimative Fahrerlebnis",
      motor: "Hocheffizienter Motor",
      motorDesc: "Bürstenloser DC-Motor bietet ruhigen, leisen Betrieb mit minimaler Wartung und maximaler Effizienz.",
      battery: "Langstrecken-Batterie",
      batteryDesc: "Lithium-Ionen-Batterietechnologie bietet erweiterte Reichweite mit schnellen Lademöglichkeiten und langer Lebensdauer.",
      suspension: "Erweiterte Federung",
      suspensionDesc: "Vorder- und Hinter-Stoßdämpfer sorgen für ruhige Fahrten über Unebenheiten und unebene Oberflächen."
    },
    comfort: {
      title: "Komfort & Bequemlichkeit",
      subtitle: "Für Ihren täglichen Komfort entwickelt",
      ergonomic: "Ergonomisches Design",
      ergonomicDesc: "Sorgfältig gestaltete Lenkerhöhe und Deckbreite bieten komfortable Fahrposition für längere Fahrten.",
      folding: "Schnell-Faltsystem",
      foldingDesc: "Patentierter Faltmechanismus ermöglicht einfache Lagerung und Transport in Sekunden ohne Werkzeug.",
      display: "Digitale Anzeige",
      displayDesc: "Klares LCD-Display zeigt Geschwindigkeit, Batteriestand, Fahrmodus und Fahrtinformationen auf einen Blick."
    },
    // Products page
    productsPage: {
      title: "Unsere Elektroroller",
      subtitle: "Wählen Sie den perfekten Roller für Ihre urbanen Abenteuer",
      compareBtn: "Modelle vergleichen",
      orderBtn: "Jetzt bestellen"
    },
    modelXPrice: "899€",
    modelXSpecs: {
      range: "56 km",
      speed: "40 km/h",
      weight: "12 kg",
      charge: "4 Stunden"
    },
    modelXFeatures: ["Premium LED Display", "Duales Bremssystem", "Stoßdämpfung", "Mobile App Integration"],
    modelYPrice: "699€",
    modelYSpecs: {
      range: "45 km",
      speed: "32 km/h",
      weight: "11 kg",
      charge: "3,5 Stunden"
    },
    modelYFeatures: ["Kompaktes Design", "Schnell-Faltmechanismus", "LED Scheinwerfer", "Diebstahlsicherung"],
    modelZPrice: "1199€",
    modelZSpecs: {
      range: "72 km",
      speed: "48 km/h",
      weight: "15 kg",
      charge: "5 Stunden"
    },
    modelZFeatures: ["Langstrecken Akku", "Hochleistungsmotor", "All-Terrain Reifen", "Erweiterte Federung"],
    specs: "Spezifikationen",
    range: "Reichweite",
    maxSpeed: "Höchstgeschwindigkeit",
    weight: "Gewicht",
    chargingTime: "Ladezeit",
    keyFeatures: "Hauptfunktionen",
    helmet: "Sicherheitshelm",
    helmetDesc: "Professioneller Helm mit LED-Anzeigen",
    helmetPrice: "89€",
    lock: "Sicherheitsschloss",
    lockDesc: "Smart Bluetooth Schloss mit App-Steuerung",
    lockPrice: "45€",
    charger: "Schnellladegerät",
    chargerDesc: "Schnelles Ladedock für alle Modelle",
    chargerPrice: "129€",
    bag: "Tragetasche",
    bagDesc: "Wasserdichte Tasche mit zusätzlichen Fächern",
    bagPrice: "69€",
    // Support page
    supportPage: {
      title: "Kundensupport",
      subtitle: "Wir sind hier, um bei all Ihren Vscooter-Bedürfnissen zu helfen",
      contactTitle: "Kontakt aufnehmen",
      contactSubtitle: "Senden Sie uns eine Nachricht und wir antworten innerhalb von 24 Stunden"
    },
    contactForm: {
      name: "Vollständiger Name",
      email: "E-Mail-Adresse",
      subject: "Betreff",
      message: "Nachricht",
      send: "Nachricht senden",
      phone: "+49 (0) 30 123-4567",
      emailAddress: "support@vscooter.de",
      address: "Elektrische Straße 123, Tech City, 12345 Berlin",
      hours: "Mo-Fr: 9-18 Uhr MEZ"
    },
    faqSection: {
      title: "Häufig gestellte Fragen",
      q1: "Was ist die maximale Reichweite der Vscooter-Modelle?",
      a1: "Unser Modell Z bietet die längste Reichweite mit 72 km bei einer einzigen Ladung. Modell X bietet 56 km und Modell Y bietet 45 km Reichweite.",
      q2: "Wie lange dauert es, die Batterie vollständig zu laden?",
      a2: "Die Ladezeiten variieren je nach Modell: Modell Y dauert 3,5 Stunden, Modell X dauert 4 Stunden und Modell Z dauert 5 Stunden für eine vollständige Ladung.",
      q3: "Sind Vscooter wasserdicht?",
      a3: "Alle unsere Roller haben eine IPX4-Wasserdichtigkeitsbewertung, das bedeutet, sie können leichten Regen und Spritzer verarbeiten, sollten aber nicht in Wasser getaucht werden.",
      q4: "Was ist die maximale Gewichtskapazität?",
      a4: "Alle Vscooter-Modelle können Fahrer bis zu 100 kg sicher tragen und dabei optimale Leistung beibehalten.",
      q5: "Bieten Sie internationalen Versand an?",
      a5: "Derzeit versenden wir in die USA, Kanada und die meisten europäischen Länder. Kontaktieren Sie den Support für spezifische internationale Versandoptionen.",
      q6: "Was ist in der Garantie enthalten?",
      a6: "Wir bieten eine 2-jährige eingeschränkte Garantie, die Herstellungsfehler, Batterie und Motor abdeckt. Normaler Verschleiß ist nicht abgedeckt."
    },
    quickHelp: {
      title: "Schnelle Hilfe",
      userManual: "Benutzerhandbuch",
      userManualDesc: "Vollständige Anleitung für Setup, Betrieb und Wartung",
      warranty: "Garantieregistrierung",
      warrantyDesc: "Registrieren Sie Ihren Roller für Garantieabdeckung",
      troubleshooting: "Fehlerbehebung",
      troubleshootingDesc: "Häufige Probleme und Lösungen",
      parts: "Ersatzteile",
      partsDesc: "Bestellen Sie echte Vscooter-Ersatzteile"
    },
    // Welcome Modal
    welcomeModal: {
      title: "Willkommen bei Vscooter!",
      subtitle: "Die Zukunft der urbanen Mobilität",
      ecoFriendly: "Umweltfreundlich",
      ecoFriendlyDesc: "Null Emissionen",
      highPerformance: "Hohe Leistung",
      highPerformanceDesc: "Bis zu 48 km/h",
      longRange: "Lange Reichweite",
      longRangeDesc: "Bis zu 72 km",
      warranty: "2 Jahre Garantie",
      warrantyDesc: "Vollständige Abdeckung",
      exploreBtn: "Modelle entdecken",
      learnMoreBtn: "Mehr erfahren",
      specialOffer: "🎉 Zeitlich begrenztes Angebot: 10% Rabatt auf Ihren ersten Kauf!"
    },
    // Legal pages
    impressum: "Impressum",
    withdrawalRight: "Widerrufsrecht",
    companyInformation: "Firmeninformationen",
    address: "Anschrift",
    registrationDetails: "Registrierungsdetails",
    responsibleForContent: "Verantwortlich für den Inhalt",
    disputeResolution: "Streitbeilegung",
    liabilityForContent: "Haftung für Inhalte",
    liabilityForLinks: "Haftung für Links",
    copyright: "Urheberrecht"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState('de');

  const switchLanguage = (lang) => {
    setCurrentLang(lang);
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[currentLang];
    keys.forEach(k => value = value?.[k]);
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ currentLang, switchLanguage, t, translations: translations[currentLang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
