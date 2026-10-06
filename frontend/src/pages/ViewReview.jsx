import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Loader2,
  Star,
  Package,
  User,
  CalendarDays,
} from "lucide-react";

function ViewReview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reviewId = searchParams.get("review");

  const token = localStorage.getItem("token");

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!reviewId) {
      setError("Review ID is missing.");
      setLoading(false);
      return;
    }

    const fetchReview = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `https://neighbourshare-i2wq.onrender.com/api/reviewById/${reviewId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReview(response.data);

      } catch (err) {
        console.log("Review error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.msg ||
            "Unable to load review."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [token, navigate, reviewId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <Loader2
              size={32}
              className="mx-auto animate-spin text-primary"
            />

            <p className="mt-4 text-sm text-muted">
              Loading review...
            </p>

          </div>

        </div>

      </main>
    );
  }

  if (error || !review) {
    return (
      <main className="min-h-screen bg-background">

        <div className="mx-auto max-w-3xl px-4 py-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-muted hover:text-primary"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm">

            <h2 className="text-xl font-bold text-text">
              Review not found
            </h2>

            <p className="mt-2 text-sm text-muted">
              {error ||
                "This review could not be found."}
            </p>

          </div>

        </div>

      </main>
    );
  }

  const isItemReview = review.type === "item";

  return (
    <main className="min-h-screen bg-background">

      {}

      <section className="border-b border-border bg-white">

        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-primary"
          >
            <ArrowLeft size={18} />
            Back
          </button>

        </div>

      </section>


      {}

      <section className="py-8 sm:py-12">

        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {}

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              COMMUNITY REVIEW
            </p>

            <h1 className="mt-2 text-3xl font-bold text-text">
              {isItemReview
                ? "Item Review"
                : "Borrower Review"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted">
              Review submitted for this borrowing.
            </p>

          </div>


          {}

          <div className="rounded-3xl bg-card border border-border shadow-sm overflow-hidden">

            {}

            <div className="p-6 sm:p-8 border-b border-border">

              <div className="flex items-start gap-4">

                {}

                <div className="w-14 h-14 rounded-2xl bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">

                  {isItemReview &&
                  review.item?.image ? (

                    <img
                      src={review.item.image}
                      alt={review.item.title}
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <User
                      size={26}
                      className="text-primary"
                    />

                  )}

                </div>


                {}

                <div className="flex-1">

                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {isItemReview
                      ? "Item"
                      : "Borrower"}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-text">

                    {isItemReview
                      ? review.item?.title ||
                        "Borrowed Item"
                      : review.reviewFor?.name ||
                        "Borrower"}

                  </h2>

                </div>

              </div>

            </div>


            {}

            <div className="p-6 sm:p-8">

              {}

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">

                  <User
                    size={19}
                    className="text-primary"
                  />

                </div>

                <div>

                  <p className="text-xs text-muted">
                    Reviewed by
                  </p>

                  <p className="font-semibold text-text">
                    {review.reviewer?.name ||
                      "User"}
                  </p>

                </div>

              </div>


              {}

              <div className="mt-6">

                <p className="text-sm font-medium text-text mb-3">
                  Rating
                </p>

                <div className="flex items-center gap-1">

                  {[1, 2, 3, 4, 5].map(
                    (star) => (

                      <Star
                        key={star}
                        size={26}
                        className={
                          star <= review.rating
                            ? "text-accent"
                            : "text-border"
                        }
                        fill={
                          star <= review.rating
                            ? "currentColor"
                            : "none"
                        }
                      />

                    )
                  )}

                  <span className="ml-2 text-sm font-semibold text-text">
                    {review.rating}/5
                  </span>

                </div>

              </div>


              {}

              <div className="mt-7">

                <p className="text-sm font-medium text-text mb-3">
                  Review
                </p>

                <div className="rounded-2xl bg-background border border-border p-5">

                  <p className="text-sm leading-7 text-text whitespace-pre-wrap">
                    {review.review ||
                      "No written review was provided."}
                  </p>

                </div>

              </div>


              {}

              {review.createdAt && (

                <div className="flex items-center gap-2 mt-6 text-sm text-muted">

                  <CalendarDays size={17} />

                  <span>
                    {new Date(
                      review.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>

                </div>

              )}

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default ViewReview;