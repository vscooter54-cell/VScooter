import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../contexts/CartContext';

export default function ReplacementParts() {
  const { currentLang } = useLanguage();
  const { addToCart } = useCart();
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const scooterModels = [
    { id: 'all', name: currentLang === 'en' ? 'All Models' : 'Alle Modelle' },
    { id: 'falcon-500', name: 'Falcon 500' },
    { id: 'mars', name: 'Mars' },
    { id: 'amiga', name: 'Amiga' }
  ];

  const partCategories = [
    { id: 'all', name: currentLang === 'en' ? 'All Parts' : 'Alle Teile', icon: 'category' },
    { id: 'battery', name: currentLang === 'en' ? 'Battery & Charger' : 'Batterie & Ladegerät', icon: 'battery_charging_full' },
    { id: 'wheels', name: currentLang === 'en' ? 'Wheels & Tires' : 'Räder & Reifen', icon: 'trip_origin' },
    { id: 'brakes', name: currentLang === 'en' ? 'Brakes' : 'Bremsen', icon: 'speed' },
    { id: 'electronics', name: currentLang === 'en' ? 'Electronics' : 'Elektronik', icon: 'cable' }
  ];

  // Replacement parts data
  const replacementParts = [
    {
      id: 'bat-falcon-500',
      name: { en: 'Falcon 500 Battery Pack', de: 'Falcon 500 Batteriepaket' },
      model: 'falcon-500',
      category: 'battery',
      price: { eur: 149, usd: 159 },
      image: '/parts/battery-falcon.webp',
      description: {
        en: 'Original replacement battery for Falcon 500. 36V 10Ah capacity, 350+ charge cycles.',
        de: 'Original-Ersatzbatterie für Falcon 500. 36V 10Ah Kapazität, 350+ Ladezyklen.'
      },
      inStock: true
    },
    {
      id: 'bat-mars',
      name: { en: 'Mars Battery Pack', de: 'Mars Batteriepaket' },
      model: 'mars',
      category: 'battery',
      price: { eur: 129, usd: 139 },
      image: '/parts/battery-mars.webp',
      description: {
        en: 'Original replacement battery for Mars. 36V 7.5Ah capacity, 350+ charge cycles.',
        de: 'Original-Ersatzbatterie für Mars. 36V 7,5Ah Kapazität, 350+ Ladezyklen.'
      },
      inStock: true
    },
    {
      id: 'bat-amiga',
      name: { en: 'Amiga Pro Battery Pack', de: 'Amiga Pro Batteriepaket' },
      model: 'amiga',
      category: 'battery',
      price: { eur: 199, usd: 219 },
      image: '/parts/battery-amiga.webp',
      description: {
        en: 'Original replacement battery for Amiga. 48V 15Ah capacity, 500+ charge cycles.',
        de: 'Original-Ersatzbatterie für Amiga. 48V 15Ah Kapazität, 500+ Ladezyklen.'
      },
      inStock: true
    },
    {
      id: 'charger-universal',
      name: { en: 'Universal Fast Charger', de: 'Universal-Schnellladegerät' },
      model: 'all',
      category: 'battery',
      price: { eur: 45, usd: 49 },
      image: '/parts/charger.webp',
      description: {
        en: 'Compatible with all VScooter models. Charges 50% faster than standard charger.',
        de: 'Kompatibel mit allen VScooter-Modellen. Lädt 50% schneller als das Standardladegerät.'
      },
      inStock: true
    },
    {
      id: 'tire-8.5',
      name: { en: '8.5" Pneumatic Tire', de: '8,5" Luftreifen' },
      model: 'falcon-500',
      category: 'wheels',
      price: { eur: 25, usd: 27 },
      image: '/parts/tire.webp',
      description: {
        en: 'Premium pneumatic tire for Falcon 500. Includes inner tube. Sold individually.',
        de: 'Premium-Luftreifen für Falcon 500. Inklusive Schlauch. Einzeln verkauft.'
      },
      inStock: true
    },
    {
      id: 'tire-mars',
      name: { en: 'Mars Replacement Tire', de: 'Mars Ersatzreifen' },
      model: 'mars',
      category: 'wheels',
      price: { eur: 22, usd: 24 },
      image: '/parts/tire.webp',
      description: {
        en: 'Durable replacement tire for Mars model. Easy installation.',
        de: 'Langlebiger Ersatzreifen für Mars-Modell. Einfache Installation.'
      },
      inStock: true
    },
    {
      id: 'brake-pads',
      name: { en: 'Disc Brake Pads (Set)', de: 'Scheibenbremsen-Beläge (Satz)' },
      model: 'all',
      category: 'brakes',
      price: { eur: 18, usd: 20 },
      image: '/parts/brake-pads.webp',
      description: {
        en: 'High-performance brake pads. Compatible with all models. Set of 2 pads.',
        de: 'Hochleistungs-Bremsbeläge. Kompatibel mit allen Modellen. Satz mit 2 Belägen.'
      },
      inStock: true
    },
    {
      id: 'brake-cable',
      name: { en: 'Brake Cable', de: 'Bremskabel' },
      model: 'all',
      category: 'brakes',
      price: { eur: 12, usd: 13 },
      image: '/parts/cable.webp',
      description: {
        en: 'Universal brake cable for all VScooter models. Stainless steel construction.',
        de: 'Universal-Bremskabel für alle VScooter-Modelle. Edelstahlkonstruktion.'
      },
      inStock: true
    },
    {
      id: 'display-lcd',
      name: { en: 'LCD Display Unit', de: 'LCD-Anzeigeeinheit' },
      model: 'all',
      category: 'electronics',
      price: { eur: 65, usd: 70 },
      image: '/parts/display.webp',
      description: {
        en: 'Replacement LCD display with speed, battery, and mode indicators.',
        de: 'Ersatz-LCD-Display mit Geschwindigkeits-, Batterie- und Modusanzeigen.'
      },
      inStock: true
    },
    {
      id: 'throttle',
      name: { en: 'Throttle Assembly', de: 'Gasgriff-Baugruppe' },
      model: 'all',
      category: 'electronics',
      price: { eur: 35, usd: 38 },
      image: '/parts/throttle.webp',
      description: {
        en: 'Complete throttle assembly with cable. Easy plug-and-play installation.',
        de: 'Komplette Gasgriff-Baugruppe mit Kabel. Einfache Plug-and-Play-Installation.'
      },
      inStock: true
    },
    {
      id: 'controller',
      name: { en: 'Motor Controller', de: 'Motorsteuerung' },
      model: 'falcon-500',
      category: 'electronics',
      price: { eur: 85, usd: 92 },
      image: '/parts/controller.webp',
      description: {
        en: 'Electronic speed controller for Falcon 500. Professional installation recommended.',
        de: 'Elektronische Geschwindigkeitssteuerung für Falcon 500. Professionelle Installation empfohlen.'
      },
      inStock: false
    },
    {
      id: 'kickstand',
      name: { en: 'Folding Kickstand', de: 'Klappständer' },
      model: 'all',
      category: 'wheels',
      price: { eur: 15, usd: 16 },
      image: '/parts/kickstand.webp',
      description: {
        en: 'Durable aluminum kickstand. Fits all VScooter models.',
        de: 'Langlebiger Aluminium-Ständer. Passend für alle VScooter-Modelle.'
      },
      inStock: true
    }
  ];

  const filteredParts = replacementParts.filter(part => {
    const modelMatch = selectedModel === 'all' || part.model === selectedModel || part.model === 'all';
    const categoryMatch = selectedCategory === 'all' || part.category === selectedCategory;
    return modelMatch && categoryMatch;
  });

  const handleAddToCart = async (part) => {
    try {
      // For replacement parts, you might want to handle this differently
      // For now, showing an alert
      alert(currentLang === 'en'
        ? `${part.name[currentLang]} added to cart!`
        : `${part.name[currentLang]} wurde in den Warenkorb gelegt!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/20 dark:via-gray-950 dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-6">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-4xl">settings</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {currentLang === 'en' ? 'Replacement Parts' : 'Ersatzteile'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {currentLang === 'en'
              ? 'Original replacement parts for your VScooter. Keep your ride running smoothly with genuine components.'
              : 'Original-Ersatzteile für Ihren VScooter. Halten Sie Ihre Fahrt mit Originalkomponenten reibungslos am Laufen.'}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Model Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
              {currentLang === 'en' ? 'Select Your Model' : 'Wählen Sie Ihr Modell'}
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {scooterModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedModel === model.id
                      ? 'bg-primary text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {model.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
              {currentLang === 'en' ? 'Part Category' : 'Teilekategorie'}
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {partCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parts Grid */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredParts.map((part) => (
              <div
                key={part.id}
                className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
                  <div className="w-32 h-32 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-400 text-5xl">inventory_2</span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
                    {part.name[currentLang]}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {part.description[currentLang]}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">€{part.price.eur}</span>
                    {part.inStock ? (
                      <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        {currentLang === 'en' ? 'In Stock' : 'Auf Lager'}
                      </span>
                    ) : (
                      <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">cancel</span>
                        {currentLang === 'en' ? 'Out of Stock' : 'Nicht verfügbar'}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleAddToCart(part)}
                    disabled={!part.inStock}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      part.inStock
                        ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {part.inStock
                      ? (currentLang === 'en' ? 'Add to Cart' : 'In den Warenkorb')
                      : (currentLang === 'en' ? 'Out of Stock' : 'Nicht verfügbar')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredParts.length === 0 && (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-20">inventory_2</span>
              <p className="text-lg">{currentLang === 'en' ? 'No parts found for this selection' : 'Keine Teile für diese Auswahl gefunden'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Installation Help */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'en' ? 'Need Installation Help?' : 'Benötigen Sie Installationshilfe?'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {currentLang === 'en'
              ? 'All replacement parts come with installation instructions. For complex installations, we recommend professional service.'
              : 'Alle Ersatzteile werden mit Installationsanweisungen geliefert. Für komplexe Installationen empfehlen wir professionellen Service.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/support/user-manual" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined">description</span>
              {currentLang === 'en' ? 'View Manuals' : 'Handbücher ansehen'}
            </a>
            <a href="/support/troubleshooting" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-700 hover:border-primary transition-colors">
              <span className="material-symbols-outlined">build</span>
              {currentLang === 'en' ? 'Troubleshooting' : 'Fehlerbehebung'}
            </a>
            <a href="/support" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-700 hover:border-primary transition-colors">
              <span className="material-symbols-outlined">support_agent</span>
              {currentLang === 'en' ? 'Contact Support' : 'Support kontaktieren'}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
