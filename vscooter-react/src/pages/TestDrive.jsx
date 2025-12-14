import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function TestDrive() {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    region: '',
    city: '',
    address: '',
    preferredDate: '',
    preferredTime: '',
    model: '',
    message: ''
  });

  const regions = [
    { value: 'zurich', label: currentLang === 'en' ? 'Zurich' : 'Zürich' },
    { value: 'bern', label: 'Bern' },
    { value: 'geneva', label: currentLang === 'en' ? 'Geneva' : 'Genf' },
    { value: 'basel', label: 'Basel' },
    { value: 'lucerne', label: currentLang === 'en' ? 'Lucerne' : 'Luzern' },
    { value: 'lausanne', label: 'Lausanne' },
    { value: 'other', label: currentLang === 'en' ? 'Other' : 'Andere' }
  ];

  const models = [
    { value: 'falcon-500', label: 'Falcon 500' },
    { value: 'mars', label: 'Mars' },
    { value: 'pit', label: 'Pit' },
    { value: 'any', label: currentLang === 'en' ? 'Any Model' : 'Beliebiges Modell' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Test drive booking:', formData);
      setSuccess(true);

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        setSuccess(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting test drive request:', error);
      alert(currentLang === 'en' ? 'Failed to book test drive. Please try again.' : 'Fehler beim Buchen der Probefahrt. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'en' ? 'Booking Confirmed!' : 'Buchung bestätigt!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLang === 'en'
              ? 'Thank you for booking a test drive with VScooter. We will contact you shortly to confirm your appointment.'
              : 'Vielen Dank für die Buchung einer Probefahrt bei VScooter. Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um Ihren Termin zu bestätigen.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'en' ? 'Book a Test Drive' : 'Probefahrt buchen'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {currentLang === 'en'
              ? 'Experience the thrill of riding a VScooter. Fill out the form below and our team will contact you to schedule your test drive.'
              : 'Erleben Sie den Nervenkitzel, einen VScooter zu fahren. Füllen Sie das untenstehende Formular aus und unser Team wird Sie kontaktieren, um Ihre Probefahrt zu vereinbaren.'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">person</span>
                {currentLang === 'en' ? 'Personal Information' : 'Persönliche Informationen'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'First Name' : 'Vorname'} *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Email' : 'E-Mail'} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Phone' : 'Telefon'} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">location_on</span>
                {currentLang === 'en' ? 'Location' : 'Standort'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Region' : 'Region'} *
                  </label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  >
                    <option value="">
                      {currentLang === 'en' ? 'Select Region' : 'Region auswählen'}
                    </option>
                    {regions.map((region) => (
                      <option key={region.value} value={region.value}>
                        {region.label}
                      </option>
                    ))}
                  </select>
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
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Address' : 'Adresse'} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder={currentLang === 'en' ? 'Street, Number, Postal Code' : 'Straße, Hausnummer, Postleitzahl'}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Test Drive Details */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">event</span>
                {currentLang === 'en' ? 'Test Drive Details' : 'Probefahrt Details'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Preferred Model' : 'Bevorzugtes Modell'} *
                  </label>
                  <select
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  >
                    <option value="">
                      {currentLang === 'en' ? 'Select Model' : 'Modell auswählen'}
                    </option>
                    {models.map((model) => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Preferred Date' : 'Bevorzugtes Datum'}
                  </label>
                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Preferred Time' : 'Bevorzugte Uhrzeit'}
                  </label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <option value="">
                      {currentLang === 'en' ? 'Select Time' : 'Uhrzeit auswählen'}
                    </option>
                    <option value="morning">
                      {currentLang === 'en' ? 'Morning (9:00 - 12:00)' : 'Vormittag (9:00 - 12:00)'}
                    </option>
                    <option value="afternoon">
                      {currentLang === 'en' ? 'Afternoon (12:00 - 17:00)' : 'Nachmittag (12:00 - 17:00)'}
                    </option>
                    <option value="evening">
                      {currentLang === 'en' ? 'Evening (17:00 - 20:00)' : 'Abend (17:00 - 20:00)'}
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Additional Message' : 'Zusätzliche Nachricht'}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder={currentLang === 'en' ? 'Any special requests or questions...' : 'Besondere Wünsche oder Fragen...'}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold"
              >
                {currentLang === 'en' ? 'Cancel' : 'Abbrechen'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-white px-6 py-4 rounded-lg hover:shadow-xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    {currentLang === 'en' ? 'Booking...' : 'Buchung läuft...'}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    {currentLang === 'en' ? 'Book Test Drive' : 'Probefahrt buchen'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              {currentLang === 'en' ? 'Flexible Scheduling' : 'Flexible Terminplanung'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLang === 'en'
                ? 'Choose a time that works best for you. We accommodate your schedule.'
                : 'Wählen Sie eine Zeit, die am besten für Sie passt. Wir richten uns nach Ihrem Zeitplan.'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">verified</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              {currentLang === 'en' ? 'Expert Guidance' : 'Expertenberatung'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLang === 'en'
                ? 'Our knowledgeable staff will guide you through every feature.'
                : 'Unser kompetentes Personal führt Sie durch jede Funktion.'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">
              {currentLang === 'en' ? 'Multiple Locations' : 'Mehrere Standorte'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentLang === 'en'
                ? 'Test drive at a location convenient for you across Switzerland.'
                : 'Probefahrt an einem für Sie günstigen Ort in der ganzen Schweiz.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
