import { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function ProductReviews({ productId }) {
  const { currentLang } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getByProduct(productId);
      setReviews(response.data.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      alert(currentLang === 'en' ? 'Please login to submit a review' : 'Bitte melden Sie sich an, um eine Bewertung abzugeben');
      return;
    }

    setSubmitting(true);
    try {
      await reviewAPI.create({
        product: productId,
        ...formData,
      });

      alert(currentLang === 'en' ? 'Review submitted successfully!' : 'Bewertung erfolgreich eingereicht!');
      setFormData({ rating: 5, title: '', comment: '' });
      setShowReviewForm(false);
      fetchReviews();
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || (currentLang === 'en' ? 'Failed to submit review' : 'Bewertung konnte nicht eingereicht werden'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (!isAuthenticated) {
      alert(currentLang === 'en' ? 'Please login to mark as helpful' : 'Bitte melden Sie sich an, um als hilfreich zu markieren');
      return;
    }

    try {
      await reviewAPI.markHelpful(reviewId);
      fetchReviews();
    } catch (err) {
      console.error('Error marking review as helpful:', err);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: reviews.length > 0
      ? ((reviews.filter((r) => r.rating === rating).length / reviews.length) * 100).toFixed(0)
      : 0,
  }));

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {currentLang === 'en' ? 'Customer Reviews' : 'Kundenbewertungen'}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 dark:text-white">{averageRating}</div>
            <div className="flex justify-center my-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`material-symbols-outlined text-2xl ${
                    i < Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  star
                </span>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {currentLang === 'en' ? 'Based on' : 'Basierend auf'} {reviews.length}{' '}
              {currentLang === 'en' ? 'reviews' : 'Bewertungen'}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.rating}
                  </span>
                  <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                </div>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            {currentLang === 'en' ? 'Write a Review' : 'Bewertung schreiben'}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {currentLang === 'en' ? 'Write Your Review' : 'Schreiben Sie Ihre Bewertung'}
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {currentLang === 'en' ? 'Rating' : 'Bewertung'}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating })}
                    className="focus:outline-none"
                  >
                    <span
                      className={`material-symbols-outlined text-3xl ${
                        rating <= formData.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {currentLang === 'en' ? 'Review Title' : 'Bewertungstitel'}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={currentLang === 'en' ? 'Summarize your experience' : 'Fassen Sie Ihre Erfahrung zusammen'}
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {currentLang === 'en' ? 'Your Review' : 'Ihre Bewertung'}
              </label>
              <textarea
                required
                rows="4"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={currentLang === 'en' ? 'Share your thoughts about this product...' : 'Teilen Sie Ihre Gedanken zu diesem Produkt...'}
              />
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? currentLang === 'en'
                    ? 'Submitting...'
                    : 'Wird eingereicht...'
                  : currentLang === 'en'
                  ? 'Submit Review'
                  : 'Bewertung abschicken'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {currentLang === 'en' ? 'Cancel' : 'Abbrechen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {currentLang === 'en' ? 'All Reviews' : 'Alle Bewertungen'}
        </h3>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`material-symbols-outlined text-lg ${
                            i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                          }`}
                        >
                          star
                        </span>
                      ))}
                    </div>
                    {review.isVerifiedPurchase && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                        {currentLang === 'en' ? 'Verified Purchase' : 'Verifizierter Kauf'}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{review.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {review.user?.firstName} {review.user?.lastName} •{' '}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{review.comment}</p>

              {/* Helpful Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleHelpful(review._id)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">thumb_up</span>
                  {currentLang === 'en' ? 'Helpful' : 'Hilfreich'} ({review.helpfulCount || 0})
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {currentLang === 'en'
                ? 'No reviews yet. Be the first to review this product!'
                : 'Noch keine Bewertungen. Seien Sie der Erste, der dieses Produkt bewertet!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
