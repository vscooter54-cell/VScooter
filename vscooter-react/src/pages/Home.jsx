import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function Home() {
  const navigate = useNavigate();
  const { currentLang } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  const mobileCtaRef = useRef(null);
  const featuredRef = useRef(null);
  const whyChooseRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Scroll animation for all devices
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set(prev).add(entry.target.dataset.section));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = [mobileCtaRef, featuredRef, whyChooseRef, testimonialsRef];
    sections.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      sections.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      // Get only featured scooters
      const data = response?.data?.data || [];
      const featured = data.filter(
        (p) => p.category === 'scooter' && p.isFeatured && p.isActive
      );
      setProducts(featured);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      alert(currentLang === 'en' ? 'Added to cart!' : 'Zum Warenkorb hinzugefügt!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert(currentLang === 'en' ? 'Failed to add to cart' : 'Fehler beim Hinzufügen zum Warenkorb');
    }
  };

  const testimonials = [
    {
      name: 'Ethan Carter',
      time: currentLang === 'en' ? '2 months ago' : 'Vor 2 Monaten',
      rating: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfCyJnibJRoybyNUuJ6z8qkaBFaUNDV2c6K5w0mhKd5c5EMySXPBmweaQKt5T2wL3VUg9TWPK3OZeTKyU_mRpcRfZ1d1BurZwaxXWbpG2ei0ui3oml21H_Xd5JFe2Cmw0_ruQsJN_PlkELdjdS-kZtPJfV6lLHeYLWhy0gstZ6DaHyHLeYvRTTlLX60MoKrvtVjR8jMEEtlnBSuDQuNSiBZ9-xZV5vKCBDDLu05usm1HnotKHtJ-354jeHELM6DVG-9yDbkP8eLgE6',
      text: currentLang === 'en'
        ? 'Best purchase I\'ve made this year! The Falcon 500 is incredibly smooth and the battery life exceeds expectations.'
        : 'Bester Kauf, den ich dieses Jahr getätigt habe! Der Falcon 500 ist unglaublich geschmeidig und die Akkulaufzeit übertrifft die Erwartungen.'
    },
    {
      name: 'Olivia Bennett',
      time: currentLang === 'en' ? '3 months ago' : 'Vor 3 Monaten',
      rating: 4,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA83Bzx4n_92X3mKUkXvkGOTWzN7RjgVSQy38_k-g4RRZc6roDyyoUZ8mnWr5gtAFiskl6AixthGSCJznykL9ZGdjJoh9btg0cNm8F57YsIMp29kcw0rIWrXUyWDOEulTtoYvyRvG7fmDpvd5odfnasJoUw_NzLJk9DD53V2x9YVK0mA5t34U6Yp6Lg9v0lg6cR1g9hli2QCFpq_flpfje3RitNNS1CT6Oxl_lRBriZU6ejtT6DrLmycLONdpD1M-hXDMzAbAU4JSA0',
      text: currentLang === 'en'
        ? 'Great scooter for daily commuting. Very reliable and the customer service was excellent.'
        : 'Toller Roller für den täglichen Pendelverkehr. Sehr zuverlässig und der Kundenservice war ausgezeichnet.'
    },
    {
      name: 'Noah Thompson',
      time: currentLang === 'en' ? '4 months ago' : 'Vor 4 Monaten',
      rating: 5,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMkKqA5887PyEvMoAoMGbHHQk-Rh_q2cRtzfXC0qx-aTsH5YTspd7j5aYqFbdgaN6R5T1fVrp9MmpUPpYOUSN-IfVcNDarmQb9_fTjeBiGDONL6h16LRJjS1L9iaVPhoZCPH29tDsqpXs4tLslrkG9Jn_L_d8NyBGt49IbljYSjy-gwLtrjleFDcrdUvV71tCnkGEHrA7Eh1xj9e3tYHrks_9-IUuh4lLy9Sj-OF0rGZ5DD8nHxNm12eq-5mZCHd4Ns5BZnyaIpZE_',
      text: currentLang === 'en'
        ? 'The Amiga is absolutely worth the investment. Premium quality and incredible performance!'
        : 'Der Amiga ist die Investition absolut wert. Premium-Qualität und unglaubliche Leistung!'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <main className="flex-grow">
      <style>{`
        .mobile-animate {
          opacity: 0;
          transform: scale(0.8) translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .mobile-animate.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      `}</style>

      {/* Hero Section - Single Banner */}
      <section className="relative h-auto md:h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Mobile Banner - Portrait */}
        <div className="block md:hidden w-full relative">
          <img
            src="/banner-mobile.webp"
            alt="VScooter Hero Banner Mobile"
            className="w-full h-auto"
          />
          {/* Dark overlay for better text/button visibility */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Desktop Banner - Landscape */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <img
            src="/banner2.webp"
            alt="VScooter Hero Banner Desktop"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for better text/button visibility */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* CTA Buttons - Positioned at bottom */}
        <div className="absolute bottom-12 left-0 right-0 z-10 hidden md:flex gap-4 justify-center px-4">
          <button
            onClick={() => navigate('/test-drive')}
            className="bg-white/20 dark:bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-primary hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-white/30"
          >
            <span className="material-symbols-outlined text-xl">directions_car</span>
            {currentLang === 'en' ? 'Book a Test Drive' : 'Probefahrt buchen'}
          </button>
          <button
            onClick={() => navigate('/contact?callback=true')}
            className="bg-white/20 dark:bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold text-base hover:bg-accent hover:border-accent hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-white/30"
          >
            <span className="material-symbols-outlined text-xl">call</span>
            {currentLang === 'en' ? 'Get a Call' : 'Rückruf erhalten'}
          </button>
        </div>
      </section>

      {/* Mobile CTA - Book a Test Drive */}
      <div
        ref={mobileCtaRef}
        data-section="mobileCta"
        className={`md:hidden bg-gradient-to-b from-red-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 py-4 px-4 mobile-animate ${visibleSections.has('mobileCta') ? 'visible' : ''}`}
      >
        <button
          onClick={() => navigate('/test-drive')}
          className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-lg font-semibold text-base hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-xl">directions_car</span>
          {currentLang === 'en' ? 'Book a Test Drive' : 'Probefahrt buchen'}
        </button>
      </div>

      {/* Featured Models */}
      <section
        ref={featuredRef}
        data-section="featured"
        className={`py-16 md:py-24 bg-gradient-to-b from-red-50 to-orange-50 dark:from-gray-950 dark:to-gray-900 mobile-animate ${visibleSections.has('featured') ? 'visible' : ''}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            {currentLang === 'en' ? 'Featured Models' : 'Ausgewählte Modelle'}
          </h2>
          {loading ? (
            <div className="mt-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {currentLang === 'en' ? 'Loading products...' : 'Produkte werden geladen...'}
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => handleProductClick(product._id)}
                  className="bg-white dark:bg-gray-900/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer hover:scale-105"
                >
                  <div className="h-64 w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30">
                    <img
                      alt={product.name[currentLang]}
                      className="w-full h-full object-contain object-center"
                      src={`/${product.primaryImage?.url || product.images[0]?.url}`}
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {product.name[currentLang]}
                      </h3>
                      {product.isPremium && (
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                          PREMIUM
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {product.description[currentLang]}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        {product.pricing.originalPrice && (
                          <span className="text-sm text-gray-400 line-through mr-2">
                            €{product.pricing.originalPrice.eur}
                          </span>
                        )}
                        <span className="text-2xl font-bold text-primary">€{product.pricing.eur}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="mt-4 w-full bg-gradient-to-r from-primary to-accent text-white py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      {currentLang === 'en' ? 'Add to Cart' : 'In den Warenkorb'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Vscooter */}
      <section
        ref={whyChooseRef}
        data-section="whyChoose"
        className={`py-16 md:py-24 bg-gradient-to-br from-white via-red-50/30 to-orange-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 mobile-animate ${visibleSections.has('whyChoose') ? 'visible' : ''}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentLang === 'en' ? 'Why Choose VScooter?' : 'Warum VScooter wählen?'}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              {currentLang === 'en'
                ? 'Experience the best in electric mobility with our premium features'
                : 'Erleben Sie das Beste in elektrischer Mobilität mit unseren Premium-Funktionen'}
            </p>
          </div>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center size-12 mx-auto bg-primary/20 dark:bg-primary/30 rounded-full text-primary">
                <span className="material-symbols-outlined">battery_horiz_075</span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                {currentLang === 'en' ? 'Long Battery Life' : 'Lange Akkulaufzeit'}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {currentLang === 'en'
                  ? 'Travel up to 45 miles on a single charge with our advanced battery technology'
                  : 'Fahren Sie bis zu 72 km mit einer einzigen Ladung dank unserer fortschrittlichen Batterietechnologie'}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center size-12 mx-auto bg-primary/20 dark:bg-primary/30 rounded-full text-primary">
                <span className="material-symbols-outlined">speed</span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                {currentLang === 'en' ? 'High Performance' : 'Hohe Leistung'}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {currentLang === 'en'
                  ? 'Powerful motors deliver smooth acceleration and top speeds up to 30 mph'
                  : 'Leistungsstarke Motoren bieten sanfte Beschleunigung und Höchstgeschwindigkeiten bis zu 48 km/h'}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center size-12 mx-auto bg-primary/20 dark:bg-primary/30 rounded-full text-primary">
                <span className="material-symbols-outlined">eco</span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                {currentLang === 'en' ? 'Eco-Friendly' : 'Umweltfreundlich'}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {currentLang === 'en'
                  ? 'Zero emissions and sustainable transportation for a greener future'
                  : 'Null Emissionen und nachhaltige Fortbewegung für eine grünere Zukunft'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        ref={testimonialsRef}
        data-section="testimonials"
        className={`relative py-16 md:py-24 overflow-hidden mobile-animate ${visibleSections.has('testimonials') ? 'visible' : ''}`}
      >
        {/* Banner1 Background */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/banner1.webp"
            alt="Customer testimonials background"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold text-center text-white drop-shadow-lg">
            {currentLang === 'en' ? 'What Our Customers Say' : 'Was unsere Kunden sagen'}
          </h2>

          {/* Mobile Slideshow */}
          <div className="md:hidden mt-12 relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <img
                          alt={testimonial.name}
                          className="size-12 rounded-full object-cover"
                          src={testimonial.image}
                        />
                        <div>
                          <p className="font-bold text-white drop-shadow">{testimonial.name}</p>
                          <p className="text-sm text-white/80 drop-shadow">{testimonial.time}</p>
                        </div>
                      </div>
                      <div className="flex mt-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-primary text-lg">star</span>
                        ))}
                        {[...Array(5 - testimonial.rating)].map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-lg">star</span>
                        ))}
                      </div>
                      <p className="mt-4 text-white drop-shadow">{testimonial.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Previous testimonial"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
              aria-label="Next testimonial"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-primary w-8' : 'bg-white/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid mt-12 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <img
                    alt={testimonial.name}
                    className="size-12 rounded-full object-cover"
                    src={testimonial.image}
                  />
                  <div>
                    <p className="font-bold text-white drop-shadow">{testimonial.name}</p>
                    <p className="text-sm text-white/80 drop-shadow">{testimonial.time}</p>
                  </div>
                </div>
                <div className="flex mt-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-primary text-lg">star</span>
                  ))}
                  {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-gray-400 dark:text-gray-600 text-lg">star</span>
                  ))}
                </div>
                <p className="mt-4 text-white drop-shadow">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
