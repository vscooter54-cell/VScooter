import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { currentLang, switchLanguage } = useLanguage();

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop Footer */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <img src="/logo.png" alt="Vscooter Logo" className="h-20 w-auto" />
            </div>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">{currentLang === 'en' ? 'Premium Electric Scooters for Modern Mobility' : 'Premium-Elektroroller für moderne Mobilität'}</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{currentLang === 'en' ? 'Products' : 'Produkte'}</h3>
              <ul className="mt-4 space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{currentLang === 'en' ? 'Model X' : 'Modell X'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{currentLang === 'en' ? 'Model Y' : 'Modell Y'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{currentLang === 'en' ? 'Model Z' : 'Modell Z'}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{currentLang === 'en' ? 'Company' : 'Unternehmen'}</h3>
              <ul className="mt-4 space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{currentLang === 'en' ? 'About Us' : 'Über uns'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{currentLang === 'en' ? 'Careers' : 'Karriere'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{currentLang === 'en' ? 'Press' : 'Presse'}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{currentLang === 'en' ? 'Support' : 'Unterstützung'}</h3>
              <ul className="mt-4 space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{currentLang === 'en' ? 'Contact' : 'Kontakt'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{currentLang === 'en' ? 'FAQ' : 'FAQ'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{currentLang === 'en' ? 'Warranty' : 'Garantie'}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{currentLang === 'en' ? 'Legal' : 'Rechtliches'}</h3>
              <ul className="mt-4 space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/impressum">{currentLang === 'en' ? 'Impressum' : 'Impressum'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/privacy-policy">{currentLang === 'en' ? 'Privacy Policy' : 'Datenschutz'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/terms-conditions">{currentLang === 'en' ? 'Terms & Conditions' : 'AGB'}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="md:hidden">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Vscooter Logo" className="h-32 w-auto" />
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{currentLang === 'en' ? 'Products' : 'Produkte'}</h3>
              <ul className="space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{currentLang === 'en' ? 'Model X' : 'Modell X'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{currentLang === 'en' ? 'Model Y' : 'Modell Y'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{currentLang === 'en' ? 'Model Z' : 'Modell Z'}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{currentLang === 'en' ? 'Company' : 'Unternehmen'}</h3>
              <ul className="space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{currentLang === 'en' ? 'About Us' : 'Über uns'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{currentLang === 'en' ? 'Careers' : 'Karriere'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{currentLang === 'en' ? 'Press' : 'Presse'}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{currentLang === 'en' ? 'Support' : 'Unterstützung'}</h3>
              <ul className="space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{currentLang === 'en' ? 'Contact' : 'Kontakt'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{currentLang === 'en' ? 'FAQ' : 'FAQ'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{currentLang === 'en' ? 'Warranty' : 'Garantie'}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{currentLang === 'en' ? 'Legal' : 'Rechtliches'}</h3>
              <ul className="space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/impressum">{currentLang === 'en' ? 'Impressum' : 'Impressum'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/privacy-policy">{currentLang === 'en' ? 'Privacy Policy' : 'Datenschutz'}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/terms-conditions">{currentLang === 'en' ? 'Terms & Conditions' : 'AGB'}</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Media Icons - Larger */}
          <div className="flex justify-center gap-6 mb-6">
            {/* TikTok */}
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#" aria-label="TikTok">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#" aria-label="Instagram">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2.163 C7.691,2.163 7.333,2.176 6.32,2.22 C5.307,2.264 4.561,2.417 3.882,2.68 C3.167,2.956 2.584,3.315 1.998,3.902 C1.411,4.488 1.053,5.071 0.776,5.786 C0.5,6.465 0.35,7.211 0.304,8.224 C0.258,9.237 0.245,9.595 0.245,12 C0.245,14.405 0.258,14.763 0.304,15.776 C0.35,16.789 0.5,17.535 0.776,18.214 C1.053,18.929 1.411,19.512 1.998,20.098 C2.584,20.685 3.167,21.043 3.882,21.32 C4.561,21.583 5.307,21.737 6.32,21.78 C7.333,21.824 7.691,21.837 12,21.837 C16.309,21.837 16.667,21.824 17.68,21.78 C18.693,21.737 19.439,21.583 20.118,21.32 C20.833,21.043 21.416,20.685 22.002,20.098 C22.589,19.512 22.947,18.929 23.224,18.214 C23.5,17.535 23.65,16.789 23.696,15.776 C23.742,14.763 23.755,14.405 23.755,12 C23.755,9.595 23.742,9.237 23.696,8.224 C23.65,7.211 23.5,6.465 23.224,5.786 C22.947,5.071 22.589,4.488 22.002,3.902 C21.416,3.315 20.833,2.956 20.118,2.68 C19.439,2.417 18.693,2.264 17.68,2.22 C16.667,2.176 16.309,2.163 12,2.163 M12,0 C16.393,0 16.762,0.015 17.765,0.063 C18.78,0.11 19.673,0.27 20.48,0.574 C21.305,0.887 22.012,1.29 22.61,1.887 C23.208,2.485 23.611,3.192 23.924,4.017 C24.228,4.825 24.388,5.717 24.436,6.732 C24.485,7.735 24.5,8.104 24.5,12 C24.5,15.897 24.485,16.265 24.436,17.268 C24.388,18.283 24.228,19.175 23.924,19.983 C23.611,20.808 23.208,21.515 22.61,22.113 C22.012,22.71 21.305,23.113 20.48,23.426 C19.673,23.73 18.78,23.89 17.765,23.938 C16.762,23.985 16.393,24 12,24 C7.607,24 7.238,23.985 6.235,23.938 C5.22,23.89 4.327,23.73 3.52,23.426 C2.695,23.113 1.988,22.71 1.39,22.113 C0.792,21.515 0.389,20.808 0.076,19.983 C-0.228,19.175 -0.388,18.283 -0.436,17.268 C-0.485,16.265 -0.5,15.897 -0.5,12 C-0.5,8.104 -0.485,7.735 -0.436,6.732 C-0.388,5.717 -0.228,4.825 0.076,4.017 C0.389,3.192 0.792,2.485 1.39,1.887 C1.988,1.29 2.695,0.887 3.52,0.574 C4.327,0.27 5.22,0.11 6.235,0.063 C7.238,0.015 7.607,0 12,0 M12,5.838 C8.601,5.838 5.838,8.601 5.838,12 C5.838,15.399 8.601,18.162 12,18.162 C15.399,18.162 18.162,15.399 18.162,12 C18.162,8.601 15.399,5.838 12,5.838 M12,16.317 C9.624,16.317 7.683,14.376 7.683,12 C7.683,9.624 9.624,7.683 12,7.683 C14.376,7.683 16.317,9.624 16.317,12 C16.317,14.376 14.376,16.317 12,16.317 M19.404,5.92 C18.665,5.92 18.056,6.529 18.056,7.268 C18.056,8.006 18.665,8.615 19.404,8.615 C20.142,8.615 20.751,8.006 20.751,7.268 C20.751,6.529 20.142,5.92 19.404,5.92"/>
              </svg>
            </a>
            {/* Facebook */}
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#" aria-label="Facebook">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>

          {/* Language Dropdown */}
          <div className="flex justify-center mb-6">
            <select
              value={currentLang}
              onChange={(e) => switchLanguage(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Payment Methods */}
          <div className="flex justify-center items-center gap-4 flex-wrap">
            <span className="text-sm text-gray-500 dark:text-gray-400">{currentLang === 'en' ? 'Payment Methods:' : 'Zahlungsmethoden:'}</span>
            <div className="flex items-center gap-3">
              {/* Visa */}
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="32" rx="4" fill="#1434CB"/>
                <path d="M20.5 11L17.5 21H15L13 13.5C12.9 13.1 12.7 12.9 12.3 12.7C11.6 12.4 10.5 12.1 9.5 11.9L9.6 11H13.5C14.2 11 14.8 11.5 14.9 12.3L15.8 17.8L18.1 11H20.5ZM31.5 18.3C31.5 16 28.5 15.8 28.5 14.7C28.5 14.3 28.9 13.9 29.7 13.8C30.1 13.7 31.2 13.7 32.4 14.2L32.8 12C32.1 11.7 31.2 11.5 30.1 11.5C27.8 11.5 26.2 12.7 26.2 14.4C26.2 15.7 27.4 16.4 28.3 16.8C29.2 17.2 29.5 17.5 29.5 17.8C29.5 18.4 28.8 18.6 28.1 18.6C27.1 18.6 26.5 18.4 25.7 18.1L25.3 20.2C26.1 20.5 27.5 20.7 28.9 20.7C31.4 20.7 32.9 19.5 31.5 18.3ZM38.5 21H40.5L38.7 11H36.8C36.2 11 35.7 11.4 35.5 11.9L32 21H34.4L34.9 19.5H37.9L38.5 21ZM35.6 17.5L36.6 14.3L37.3 17.5H35.6ZM24.5 11L22.6 21H20.2L22.1 11H24.5Z" fill="white"/>
              </svg>
              {/* Mastercard */}
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="32" rx="4" fill="#EB001B"/>
                <circle cx="18" cy="16" r="9" fill="#FF5F00"/>
                <circle cx="30" cy="16" r="9" fill="#F79E1B"/>
                <path d="M24 8.5C22.1 10 21 12.3 21 15C21 17.7 22.1 20 24 21.5C25.9 20 27 17.7 27 15C27 12.3 25.9 10 24 8.5Z" fill="#FF5F00"/>
              </svg>
              {/* PayPal */}
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="32" rx="4" fill="#003087"/>
                <path d="M19 10C19 9.5 19.4 9 20 9H25C27.2 9 29 10.8 29 13C29 15.2 27.2 17 25 17H22L21 21H18L19 10Z" fill="#009CDE"/>
                <path d="M22 14H25C26.1 14 27 13.1 27 12C27 10.9 26.1 10 25 10H22L21 14H22Z" fill="#012169"/>
              </svg>
              {/* Klarna */}
              <svg className="h-6 w-auto" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="32" rx="4" fill="#FFB3C7"/>
                <path d="M14 10H16V22H14V10ZM21 10C23.2 10 25 11.8 25 14C25 15.3 24.4 16.4 23.5 17.2L26 22H23.5L21.5 18H21V22H19V10H21ZM21 12V16H21.5C22.3 16 23 15.3 23 14C23 12.9 22.3 12 21.5 12H21ZM28 10H30L33 22H31L30.5 20H27.5L27 22H25L28 10ZM28.5 18H29.5L29 15L28.5 18Z" fill="#000000"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Desktop Copyright and Social */}
        <div className="hidden md:flex mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{currentLang === 'en' ? '© 2024 VScooter. All rights reserved.' : '© 2024 VScooter. Alle Rechte vorbehalten.'}</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {/* TikTok */}
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#" aria-label="TikTok">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#" aria-label="Instagram">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2.163 C7.691,2.163 7.333,2.176 6.32,2.22 C5.307,2.264 4.561,2.417 3.882,2.68 C3.167,2.956 2.584,3.315 1.998,3.902 C1.411,4.488 1.053,5.071 0.776,5.786 C0.5,6.465 0.35,7.211 0.304,8.224 C0.258,9.237 0.245,9.595 0.245,12 C0.245,14.405 0.258,14.763 0.304,15.776 C0.35,16.789 0.5,17.535 0.776,18.214 C1.053,18.929 1.411,19.512 1.998,20.098 C2.584,20.685 3.167,21.043 3.882,21.32 C4.561,21.583 5.307,21.737 6.32,21.78 C7.333,21.824 7.691,21.837 12,21.837 C16.309,21.837 16.667,21.824 17.68,21.78 C18.693,21.737 19.439,21.583 20.118,21.32 C20.833,21.043 21.416,20.685 22.002,20.098 C22.589,19.512 22.947,18.929 23.224,18.214 C23.5,17.535 23.65,16.789 23.696,15.776 C23.742,14.763 23.755,14.405 23.755,12 C23.755,9.595 23.742,9.237 23.696,8.224 C23.65,7.211 23.5,6.465 23.224,5.786 C22.947,5.071 22.589,4.488 22.002,3.902 C21.416,3.315 20.833,2.956 20.118,2.68 C19.439,2.417 18.693,2.264 17.68,2.22 C16.667,2.176 16.309,2.163 12,2.163 M12,0 C16.393,0 16.762,0.015 17.765,0.063 C18.78,0.11 19.673,0.27 20.48,0.574 C21.305,0.887 22.012,1.29 22.61,1.887 C23.208,2.485 23.611,3.192 23.924,4.017 C24.228,4.825 24.388,5.717 24.436,6.732 C24.485,7.735 24.5,8.104 24.5,12 C24.5,15.897 24.485,16.265 24.436,17.268 C24.388,18.283 24.228,19.175 23.924,19.983 C23.611,20.808 23.208,21.515 22.61,22.113 C22.012,22.71 21.305,23.113 20.48,23.426 C19.673,23.73 18.78,23.89 17.765,23.938 C16.762,23.985 16.393,24 12,24 C7.607,24 7.238,23.985 6.235,23.938 C5.22,23.89 4.327,23.73 3.52,23.426 C2.695,23.113 1.988,22.71 1.39,22.113 C0.792,21.515 0.389,20.808 0.076,19.983 C-0.228,19.175 -0.388,18.283 -0.436,17.268 C-0.485,16.265 -0.5,15.897 -0.5,12 C-0.5,8.104 -0.485,7.735 -0.436,6.732 C-0.388,5.717 -0.228,4.825 0.076,4.017 C0.389,3.192 0.792,2.485 1.39,1.887 C1.988,1.29 2.695,0.887 3.52,0.574 C4.327,0.27 5.22,0.11 6.235,0.063 C7.238,0.015 7.607,0 12,0 M12,5.838 C8.601,5.838 5.838,8.601 5.838,12 C5.838,15.399 8.601,18.162 12,18.162 C15.399,18.162 18.162,15.399 18.162,12 C18.162,8.601 15.399,5.838 12,5.838 M12,16.317 C9.624,16.317 7.683,14.376 7.683,12 C7.683,9.624 9.624,7.683 12,7.683 C14.376,7.683 16.317,9.624 16.317,12 C16.317,14.376 14.376,16.317 12,16.317 M19.404,5.92 C18.665,5.92 18.056,6.529 18.056,7.268 C18.056,8.006 18.665,8.615 19.404,8.615 C20.142,8.615 20.751,8.006 20.751,7.268 C20.751,6.529 20.142,5.92 19.404,5.92"/>
              </svg>
            </a>
            {/* Facebook */}
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#" aria-label="Facebook">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
