import { useState, useEffect } from 'react';

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show modal after a short delay every time
    setTimeout(() => {
      setIsOpen(true);
      setIsAnimating(true);
    }, 500);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto transition-all duration-300 ${
        isAnimating ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative rounded-3xl shadow-2xl w-auto max-h-[90vh] overflow-hidden transition-all duration-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-700 dark:text-gray-300">close</span>
          </button>

          {/* Popup Modal Image */}
          <img
            src="/firstpopup.webp"
            alt="Vscooter Popup"
            className="w-auto max-h-[90vh] rounded-3xl object-contain"
          />

          {/* Explore Now Button */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <a
              href="/products"
              onClick={handleClose}
              className="inline-block bg-gradient-to-r from-primary to-accent text-white px-10 py-4 rounded-xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Explore Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
