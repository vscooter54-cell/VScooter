import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Check if this is a callback request from URL params
  const searchParams = new URLSearchParams(location.search);
  const isCallbackRequest = searchParams.get('callback') === 'true';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: isCallbackRequest ? (currentLang === 'en' ? 'Request Callback' : 'Rückruf anfordern') : '',
    message: '',
    preferredTime: '',
  });

  useEffect(() => {
    if (isCallbackRequest) {
      setFormData(prev => ({
        ...prev,
        subject: currentLang === 'en' ? 'Request Callback' : 'Rückruf anfordern'
      }));
    }
  }, [isCallbackRequest, currentLang]);

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

      console.log('Contact form submission:', formData);
      setSuccess(true);

      // Reset form after 3 seconds and redirect
      setTimeout(() => {
        setSuccess(false);
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert(currentLang === 'en' ? 'Failed to send message. Please try again.' : 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.');
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
            {currentLang === 'en' ? 'Message Sent!' : 'Nachricht gesendet!'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isCallbackRequest
              ? (currentLang === 'en'
                ? 'Thank you! We will call you back shortly during your preferred time.'
                : 'Vielen Dank! Wir rufen Sie in Kürze zu Ihrer bevorzugten Zeit zurück.')
              : (currentLang === 'en'
                ? 'Thank you for contacting VScooter. We will get back to you as soon as possible.'
                : 'Vielen Dank für Ihre Kontaktaufnahme mit VScooter. Wir werden uns so schnell wie möglich bei Ihnen melden.')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {isCallbackRequest
              ? (currentLang === 'en' ? 'Request a Callback' : 'Rückruf anfordern')
              : (currentLang === 'en' ? 'Contact Us' : 'Kontaktieren Sie uns')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {isCallbackRequest
              ? (currentLang === 'en'
                ? 'Fill out the form below and our team will call you at your preferred time.'
                : 'Füllen Sie das untenstehende Formular aus und unser Team wird Sie zu Ihrer bevorzugten Zeit anrufen.')
              : (currentLang === 'en'
                ? 'Have questions? We\'re here to help. Send us a message and we\'ll respond as soon as possible.'
                : 'Haben Sie Fragen? Wir sind hier um zu helfen. Senden Sie uns eine Nachricht und wir antworten so schnell wie möglich.')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">phone</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {currentLang === 'en' ? 'Phone' : 'Telefon'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">+41 44 123 45 67</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {currentLang === 'en' ? 'Mon-Fri: 9:00 - 18:00' : 'Mo-Fr: 9:00 - 18:00'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">email</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {currentLang === 'en' ? 'Email' : 'E-Mail'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">info@vscooter.ch</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {currentLang === 'en' ? 'We reply within 24 hours' : 'Wir antworten innerhalb von 24 Stunden'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                {currentLang === 'en' ? 'Office' : 'Büro'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Bahnhofstrasse 123<br />
                8001 Zürich<br />
                Switzerland
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                {currentLang === 'en' ? 'Follow Us' : 'Folgen Sie uns'}
              </h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">share</span>
                </a>
                <a href="#" className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">share</span>
                </a>
                <a href="#" className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-xl">share</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Name' : 'Name'} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  {isCallbackRequest && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {currentLang === 'en' ? 'Preferred Time' : 'Bevorzugte Zeit'}
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      >
                        <option value="">
                          {currentLang === 'en' ? 'Select Time' : 'Zeit auswählen'}
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
                  )}
                </div>

                {!isCallbackRequest && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {currentLang === 'en' ? 'Subject' : 'Betreff'} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      required={!isCallbackRequest}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {currentLang === 'en' ? 'Message' : 'Nachricht'} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder={
                      isCallbackRequest
                        ? (currentLang === 'en' ? 'Let us know what you\'d like to discuss...' : 'Lassen Sie uns wissen, worüber Sie sprechen möchten...')
                        : (currentLang === 'en' ? 'Your message...' : 'Ihre Nachricht...')
                    }
                    required
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
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
                        {currentLang === 'en' ? 'Sending...' : 'Wird gesendet...'}
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">send</span>
                        {isCallbackRequest
                          ? (currentLang === 'en' ? 'Request Callback' : 'Rückruf anfordern')
                          : (currentLang === 'en' ? 'Send Message' : 'Nachricht senden')}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
