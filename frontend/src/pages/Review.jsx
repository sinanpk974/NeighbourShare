import { useState } from "react";
import axios from "axios";
import { X, Star, Send } from "lucide-react";

function ReviewModal({
  request,
  reviewType,
  onClose,
  onSuccess,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const isItemReview = reviewType === "item";

  const title = isItemReview
    ? "Review Item"
    : "Review Borrower";

  const description = isItemReview
    ? "How was your experience with this item?"
    : "How was your experience with this borrower?";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `https://neighbourshare-i2wq.onrender.com/api/review/${request._id}`,
        {
          type: reviewType,
          rating,
          review: review.trim(),
        },
        {
          headers,
        }
      );

      /*
       * IMPORTANT:
       * Send the created review back to MyRequests.
       *
       * MyRequests will update its React state
       * and immediately change:
       *
       * Review Item
       *       ↓
       * View Review
       */

      if (onSuccess) {
        onSuccess(response.data);
      }

      /*
       * Do NOT call onClose() here.
       *
       * MyRequests handles the modal state after
       * receiving the successful review.
       */

    } catch (err) {
      console.log("Review submission error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      setError(
        err.response?.data?.msg ||
          "Unable to submit review"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-card rounded-3xl shadow-xl overflow-hidden">

        <div className="flex items-center justify-between px-6 py-5 border-b border-border">

          <div>

            <h2 className="text-xl font-bold text-text">
              {title}
            </h2>

            <p className="text-sm text-muted mt-1">
              {description}
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted hover:bg-background hover:text-text transition"
          >
            <X size={20} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          <div className="bg-background border border-border rounded-2xl p-4 mb-6">

            <p className="text-xs text-muted uppercase tracking-wide">
              {isItemReview
                ? "Item"
                : "Borrower"}
            </p>

            <p className="font-semibold text-text mt-1">

              {isItemReview
                ? request?.item?.title ||
                  "Borrowed Item"
                : request?.borrower?.name ||
                  "Borrower"}

            </p>

          </div>

          <div className="text-center">

            <p className="text-sm font-medium text-text">
              Give your rating
            </p>

            <div className="flex justify-center gap-2 mt-4">

              {[1, 2, 3, 4, 5].map(
                (star) => {

                  const active =
                    star <=
                    (hoverRating || rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setRating(star)
                      }
                      onMouseEnter={() =>
                        setHoverRating(star)
                      }
                      onMouseLeave={() =>
                        setHoverRating(0)
                      }
                      className="p-1 transition-transform hover:scale-110"
                    >

                      <Star
                        size={32}
                        className={
                          active
                            ? "text-accent"
                            : "text-border"
                        }
                        fill={
                          active
                            ? "currentColor"
                            : "none"
                        }
                      />

                    </button>
                  );
                }
              )}

            </div>

            <p className="text-sm text-muted mt-2">

              {rating === 0 &&
                "Select a rating"}

              {rating === 1 &&
                "Very poor"}

              {rating === 2 &&
                "Poor"}

              {rating === 3 &&
                "Good"}

              {rating === 4 &&
                "Very good"}

              {rating === 5 &&
                "Excellent"}

            </p>

          </div>

          <div className="mt-6">

            <label className="block text-sm font-medium text-text mb-2">
              Your review
            </label>

            <textarea
              value={review}
              onChange={(e) =>
                setReview(e.target.value)
              }
              rows="4"
              maxLength={500}
              placeholder={
                isItemReview
                  ? "Tell others about your experience with this item..."
                  : "Tell others about your experience with this borrower..."
              }
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-text outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
            />

            <div className="flex justify-end mt-1">

              <span className="text-xs text-muted">
                {review.length}/500
              </span>

            </div>

          </div>

          {error && (

            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-danger">
              {error}
            </div>

          )}

          <div className="flex gap-3 mt-6">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-border text-text hover:bg-background transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || rating === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >

              <Send size={17} />

              {loading
                ? "Submitting..."
                : "Submit Review"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ReviewModal;