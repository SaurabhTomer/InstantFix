import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar, FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';

const RatingModal = ({ 
  isOpen, 
  onClose, 
  requestId, 
  electricianName, 
  serviceType,
  onRatingSubmitted 
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${serverUrl}/api/ratings/${requestId}`,
        { rating, review },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Rating submitted successfully!');
        onRatingSubmitted(response.data.rating);
        onClose();
        // Reset form
        setRating(0);
        setReview('');
      } else {
        toast.error(response.data.message || 'Failed to submit rating');
      }
    } catch (error) {
      console.error('Rating submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center my-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(rating)}
            className="text-3xl transition-colors duration-200"
          >
            {star <= (hover || rating) ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-300 hover:text-yellow-200" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const getRatingText = () => {
    if (rating === 0) return 'Please select a rating';
    if (rating === 1) return 'Poor';
    if (rating === 2) return 'Fair';
    if (rating === 3) return 'Good';
    if (rating === 4) return 'Very Good';
    if (rating === 5) return 'Excellent';
    return '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Rate Service</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="mb-2">
            <span className="text-sm text-gray-600">Service:</span>
            <span className="ml-2 font-medium text-gray-800">{serviceType}</span>
          </div>
          <div className="mb-4">
            <span className="text-sm text-gray-600">Electrician:</span>
            <span className="ml-2 font-medium text-gray-800">{electricianName}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
              How was your service?
            </label>
            {renderStars()}
            <p className="text-center text-sm font-medium text-gray-600 mt-2">
              {getRatingText()}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              rows="4"
              placeholder="Share your experience with this service..."
              maxLength="500"
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {review.length}/500
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-yellow-400 text-gray-800 px-4 py-2 rounded-lg hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="w-4 h-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Rating'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
