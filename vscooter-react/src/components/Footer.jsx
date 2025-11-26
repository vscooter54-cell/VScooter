import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <img src="/logo.png" alt="Vscooter Logo" className="h-20 w-auto" />
            </div>
            <p className="mt-3 text-gray-500 dark:text-gray-400 text-sm">{t('footerTagline')}</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('products')}</h3>
              <ul className="mt-4 space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{t('modelX')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{t('modelY')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{t('modelZ')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/products">{t('accessories')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('company')}</h3>
              <ul className="mt-4 space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{t('aboutUs')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{t('careers')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/">{t('press')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('support')}</h3>
              <ul className="mt-4 space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{t('contact')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{t('faq')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/support">{t('warranty')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('legal')}</h3>
              <ul className="mt-4 space-y-2">
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/impressum">{t('impressum')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/privacy-policy">{t('privacy')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/terms-conditions">{t('terms')}</Link></li>
                <li><Link className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary" to="/withdrawal-policy">{t('withdrawalRight')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('copyright')}</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46,6.56 C21.76,6.86 21.01,7.06 20.24,7.16 C21.06,6.66 21.68,5.86 22,4.96 C21.24,5.46 20.4,5.86 19.5,6.06 C18.79,5.29 17.74,4.79 16.58,4.79 C14.38,4.79 12.58,6.59 12.58,8.79 C12.58,9.09 12.61,9.39 12.68,9.69 C9.17,9.52 6.11,7.88 4.01,5.43 C3.64,6.04 3.42,6.77 3.42,7.56 C3.42,8.96 4.15,10.18 5.22,10.87 C4.56,10.85 3.95,10.68 3.41,10.39 L3.41,10.45 C3.41,12.44 4.82,14.1 6.74,14.48 C6.4,14.57 6.04,14.62 5.68,14.62 C5.42,14.62 5.16,14.6 4.92,14.55 C5.46,16.17 6.95,17.3 8.75,17.34 C7.35,18.42 5.61,19.09 3.72,19.09 C3.4,19.09 3.08,19.07 2.76,19.04 C4.58,20.18 6.72,20.79 9,20.79 C16.57,20.79 20.38,14.52 20.38,9.15 C20.38,8.95 20.37,8.75 20.36,8.55 C21.17,7.99 21.88,7.31 22.46,6.56 Z"></path>
              </svg>
            </a>
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2.163 C7.691,2.163 7.333,2.176 6.32,2.22 C5.307,2.264 4.561,2.417 3.882,2.68 C3.167,2.956 2.584,3.315 1.998,3.902 C1.411,4.488 1.053,5.071 0.776,5.786 C0.5,6.465 0.35,7.211 0.304,8.224 C0.258,9.237 0.245,9.595 0.245,12 C0.245,14.405 0.258,14.763 0.304,15.776 C0.35,16.789 0.5,17.535 0.776,18.214 C1.053,18.929 1.411,19.512 1.998,20.098 C2.584,20.685 3.167,21.043 3.882,21.32 C4.561,21.583 5.307,21.737 6.32,21.78 C7.333,21.824 7.691,21.837 12,21.837 C16.309,21.837 16.667,21.824 17.68,21.78 C18.693,21.737 19.439,21.583 20.118,21.32 C20.833,21.043 21.416,20.685 22.002,20.098 C22.589,19.512 22.947,18.929 23.224,18.214 C23.5,17.535 23.65,16.789 23.696,15.776 C23.742,14.763 23.755,14.405 23.755,12 C23.755,9.595 23.742,9.237 23.696,8.224 C23.65,7.211 23.5,6.465 23.224,5.786 C22.947,5.071 22.589,4.488 22.002,3.902 C21.416,3.315 20.833,2.956 20.118,2.68 C19.439,2.417 18.693,2.264 17.68,2.22 C16.667,2.176 16.309,2.163 12,2.163 M12,0 C16.393,0 16.762,0.015 17.765,0.063 C18.78,0.11 19.673,0.27 20.48,0.574 C21.305,0.887 22.012,1.29 22.61,1.887 C23.208,2.485 23.611,3.192 23.924,4.017 C24.228,4.825 24.388,5.717 24.436,6.732 C24.485,7.735 24.5,8.104 24.5,12 C24.5,15.897 24.485,16.265 24.436,17.268 C24.388,18.283 24.228,19.175 23.924,19.983 C23.611,20.808 23.208,21.515 22.61,22.113 C22.012,22.71 21.305,23.113 20.48,23.426 C19.673,23.73 18.78,23.89 17.765,23.938 C16.762,23.985 16.393,24 12,24 C7.607,24 7.238,23.985 6.235,23.938 C5.22,23.89 4.327,23.73 3.52,23.426 C2.695,23.113 1.988,22.71 1.39,22.113 C0.792,21.515 0.389,20.808 0.076,19.983 C-0.228,19.175 -0.388,18.283 -0.436,17.268 C-0.485,16.265 -0.5,15.897 -0.5,12 C-0.5,8.104 -0.485,7.735 -0.436,6.732 C-0.388,5.717 -0.228,4.825 0.076,4.017 C0.389,3.192 0.792,2.485 1.39,1.887 C1.988,1.29 2.695,0.887 3.52,0.574 C4.327,0.27 5.22,0.11 6.235,0.063 C7.238,0.015 7.607,0 12,0 M12,5.838 C8.601,5.838 5.838,8.601 5.838,12 C5.838,15.399 8.601,18.162 12,18.162 C15.399,18.162 18.162,15.399 18.162,12 C18.162,8.601 15.399,5.838 12,5.838 M12,16.317 C9.624,16.317 7.683,14.376 7.683,12 C7.683,9.624 9.624,7.683 12,7.683 C14.376,7.683 16.317,9.624 16.317,12 C16.317,14.376 14.376,16.317 12,16.317 M19.404,5.92 C18.665,5.92 18.056,6.529 18.056,7.268 C18.056,8.006 18.665,8.615 19.404,8.615 C20.142,8.615 20.751,8.006 20.751,7.268 C20.751,6.529 20.142,5.92 19.404,5.92"></path>
              </svg>
            </a>
            <a className="text-gray-500 dark:text-gray-400 hover:text-primary" href="#">
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2 C6.477,2 2,6.477 2,12 C2,17.523 6.477,22 12,22 C17.523,22 22,17.523 22,12 C22,6.477 17.523,2 12,2 M17,17 L17,14 C17,12.343 15.657,11 14,11 C12.343,11 11,12.343 11,14 L11,17 L9,17 L9,9 L11,9 L11,10.5 C11.583,9.556 12.723,9 14,9 C16.209,9 17,10.336 17,12 L17,17 M7,17 L7,9 L9,9 L9,17 L7,17 M8,7 C7.448,7 7,7.448 7,8 C7,8.552 7.448,9 8,9 C8.552,9 9,8.552 9,8 C9,7.448 8.552,7 8,7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
