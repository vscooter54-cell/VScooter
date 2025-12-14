import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function WarrantyRegistration() {
  const { currentLang } = useLanguage();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',

    // Vehicle Information
    model: '',
    serialNumber: '',
    purchaseDate: '',
    dealer: '',
    invoiceNumber: '',

    // Additional
    marketingConsent: false
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Warranty registration:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="flex-grow">
        <section className="py-24 md:py-32 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full mb-8">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">check_circle</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {currentLang === 'en' ? 'Registration Successful!' : 'Registrierung erfolgreich!'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {currentLang === 'en'
                ? `Thank you for registering your ${formData.model}. You will receive a confirmation email shortly with your warranty details.`
                : `Vielen Dank für die Registrierung Ihres ${formData.model}. Sie erhalten in Kürze eine Bestätigungs-E-Mail mit Ihren Garantiedetails.`}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined">home</span>
                {currentLang === 'en' ? 'Back to Home' : 'Zurück zur Startseite'}
              </a>
              <a href="/support" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 dark:border-gray-700 hover:border-primary transition-colors">
                <span className="material-symbols-outlined">support</span>
                {currentLang === 'en' ? 'Support Center' : 'Support-Center'}
              </a>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-950/20 dark:via-gray-950 dark:to-blue-950/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-6">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-4xl">verified_user</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            {currentLang === 'en' ? 'Warranty Registration' : 'Garantieregistrierung'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {currentLang === 'en'
              ? 'Register your VScooter to activate your 2-year warranty coverage and receive important product updates.'
              : 'Registrieren Sie Ihren VScooter, um Ihre 2-jährige Garantieabdeckung zu aktivieren und wichtige Produktaktualisierungen zu erhalten.'}
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-900/50 rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  {currentLang === 'en' ? 'Personal Information' : 'Persönliche Informationen'}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'First Name' : 'Vorname'} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Last Name' : 'Nachname'} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Email Address' : 'E-Mail-Adresse'} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Phone Number' : 'Telefonnummer'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Street Address' : 'Straßenadresse'} *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'City' : 'Stadt'} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Postal Code' : 'Postleitzahl'} *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Country' : 'Land'} *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{currentLang === 'en' ? 'Select Country' : 'Land wählen'}</option>
                      <option value="DE">Deutschland</option>
                      <option value="AT">Österreich</option>
                      <option value="CH">Schweiz</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">electric_scooter</span>
                  {currentLang === 'en' ? 'Vehicle Information' : 'Fahrzeuginformationen'}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Scooter Model' : 'Roller-Modell'} *
                    </label>
                    <select
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">{currentLang === 'en' ? 'Select Model' : 'Modell wählen'}</option>
                      <option value="Falcon 500">Falcon 500</option>
                      <option value="Mars">Mars</option>
                      <option value="Amiga">Amiga</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Serial Number' : 'Seriennummer'} *
                    </label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      required
                      placeholder="e.g., VS-2024-12345"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Purchase Date' : 'Kaufdatum'} *
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Dealer/Store Name' : 'Händler/Geschäftsname'}
                    </label>
                    <input
                      type="text"
                      name="dealer"
                      value={formData.dealer}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Invoice/Order Number' : 'Rechnungs-/Bestellnummer'}
                    </label>
                    <input
                      type="text"
                      name="invoiceNumber"
                      value={formData.invoiceNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-base mt-0.5">info</span>
                    {currentLang === 'en'
                      ? 'The serial number can be found on the bottom of your scooter deck or in the battery compartment.'
                      : 'Die Seriennummer finden Sie auf der Unterseite des Roller-Decks oder im Batteriefach.'}
                  </p>
                </div>
              </div>

              {/* Consent */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {currentLang === 'en'
                      ? 'I would like to receive product updates, maintenance tips, and special offers from VScooter via email.'
                      : 'Ich möchte Produktaktualisierungen, Wartungstipps und Sonderangebote von VScooter per E-Mail erhalten.'}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">verified_user</span>
                  {currentLang === 'en' ? 'Register Warranty' : 'Garantie registrieren'}
                </button>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                  {currentLang === 'en'
                    ? 'By submitting this form, you agree to our warranty terms and conditions.'
                    : 'Mit dem Absenden dieses Formulars stimmen Sie unseren Garantiebedingungen zu.'}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Warranty Benefits */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {currentLang === 'en' ? 'Your 2-Year Warranty Includes:' : 'Ihre 2-Jahres-Garantie umfasst:'}
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">build</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {currentLang === 'en' ? 'Parts & Labor' : 'Teile & Arbeit'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLang === 'en'
                    ? 'Free replacement of defective parts and labor costs'
                    : 'Kostenloser Ersatz defekter Teile und Arbeitskosten'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">support_agent</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {currentLang === 'en' ? 'Priority Support' : 'Prioritäts-Support'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLang === 'en'
                    ? 'Fast-track customer service for registered products'
                    : 'Schneller Kundenservice für registrierte Produkte'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">battery_charging_full</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {currentLang === 'en' ? 'Battery Coverage' : 'Batterieabdeckung'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLang === 'en'
                    ? 'Battery performance guaranteed for 2 years'
                    : 'Batterieleistung für 2 Jahre garantiert'}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">local_shipping</span>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {currentLang === 'en' ? 'Free Shipping' : 'Kostenloser Versand'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentLang === 'en'
                    ? 'No shipping costs for warranty repairs'
                    : 'Keine Versandkosten für Garantiereparaturen'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
