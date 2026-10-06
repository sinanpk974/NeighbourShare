import { useEffect, useState } from "react";
import axios from "axios";
import {
  Star,
  Trash2,
  Eye,
  X,
  User,
  Package,
  MessageSquare,
  Search,
} from "lucide-react";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("reviewed");
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const REVIEWS_PER_PAGE = 10;

  const token = localStorage.getItem("token");

  const searchParams = new URLSearchParams(
    window.location.search
  );

  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "https://neighbourshare-i2wq.onrender.com/api/admin/reviews",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        let allReviews = response.data.reviews || [];

        if (userId) {
          allReviews = allReviews.filter((review) => {
            const reviewForId =
              review.reviewFor?._id ||
              review.reviewFor;

            return (
              review.type === "borrower" &&
              reviewForId === userId
            );
          });
        }

        setReviews(allReviews);
        setCurrentPage(1);
      } catch (error) {
        console.log("Reviews loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await axios.delete(
        `https://neighbourshare-i2wq.onrender.com/api/admin/reviews/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews((prev) =>
        prev.filter((review) => review._id !== id)
      );

      if (selectedReview?._id === id) {
        setSelectedReview(null);
      }
    } catch (error) {
      console.log("Delete review error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete review."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const renderStars = (rating, size = 17) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= rating
                ? "text-accent"
                : "text-border"
            }
            fill={
              star <= rating
                ? "currentColor"
                : "none"
            }
          />
        ))}
      </div>
    );
  };

  const getReviewType = (type) => {
    if (type === "item") return "Item";
    if (type === "owner") return "Owner";
    if (type === "borrower") return "Borrower";

    return "Review";
  };

  const getReviewedName = (review) => {
    if (review.type === "item") {
      return review.item?.title || "Unknown Item";
    }

    return review.reviewFor?.name || "Unknown User";
  };

  const filteredReviews = reviews.filter((review) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    if (searchType === "reviewer") {
      const reviewerName =
        review.reviewer?.name?.toLowerCase() || "";

      return reviewerName.includes(searchText);
    }

    const reviewedName = getReviewedName(review);

    return reviewedName
      .toLowerCase()
      .includes(searchText);
  });

  const totalPages = Math.ceil(
    filteredReviews.length / REVIEWS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * REVIEWS_PER_PAGE;

  const paginatedReviews = filteredReviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            Loading reviews...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-8">
        <p className="text-sm font-semibold tracking-wide text-primary">
          COMMUNITY FEEDBACK
        </p>

        <h1 className="mt-1 text-3xl font-bold text-text">
          {userId ? "Borrower Reviews" : "Reviews"}
        </h1>

        <p className="mt-2 text-muted">
          {userId
            ? "Reviews received by this user as a borrower."
            : "Manage reviews submitted by NeighbourShare members."}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF7E6] text-accent">
            <MessageSquare size={21} />
          </div>

          <div>
            <p className="text-sm text-muted">
              Total Reviews
            </p>

            <p className="text-2xl font-bold text-text">
              {reviews.length}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 md:max-w-lg md:flex-row">

          <select
            value={searchType}
            onChange={(e) => {
              setSearchType(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            <option value="reviewed">
              Search Reviewed
            </option>

            <option value="reviewer">
              Search Reviewer
            </option>
          </select>

          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                searchType === "reviewer"
                  ? "Search by reviewer..."
                  : "Search by reviewed..."
              }
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <MessageSquare
            size={42}
            className="mx-auto text-muted"
          />

          <h2 className="mt-4 text-lg font-bold text-text">
            No reviews found
          </h2>

          <p className="mt-2 text-sm text-muted">
            {userId
              ? "This user has not received any borrower reviews yet."
              : "There are currently no reviews in the community."}
          </p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <Search
            size={42}
            className="mx-auto text-muted"
          />

          <h2 className="mt-4 text-lg font-bold text-text">
            No matching reviews
          </h2>

          <p className="mt-2 text-sm text-muted">
            No reviews found for "{search}".
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-card">

          <div className="hidden border-b border-border bg-background px-6 py-4 md:grid md:grid-cols-[1.15fr_0.7fr_1fr_1fr_1.4fr_auto] md:items-center md:gap-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Reviewer
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Type
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Reviewed
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Rating
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Review
            </p>

            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Action
            </p>
          </div>

          <div className="divide-y divide-border">

            {paginatedReviews.map((review) => (
              <div
                key={review._id}
                className="px-5 py-5 transition hover:bg-background sm:px-6"
              >

                <div className="hidden md:grid md:grid-cols-[1.15fr_0.7fr_1fr_1fr_1.4fr_auto] md:items-center md:gap-4">

                  <div className="min-w-0">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User size={19} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text">
                          {review.reviewer?.name ||
                            "Unknown User"}
                        </p>

                        <p className="truncate text-xs text-muted">
                          {review.reviewer?.email ||
                            "No email"}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div>
                    <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {getReviewType(review.type)}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">

                      {review.type === "item" ? (
                        <Package
                          size={17}
                          className="shrink-0 text-primary"
                        />
                      ) : (
                        <User
                          size={17}
                          className="shrink-0 text-primary"
                        />
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-text">
                          {getReviewedName(review)}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div>
                    {renderStars(review.rating, 16)}

                    <p className="mt-1 text-xs text-muted">
                      {review.rating}/5
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm text-text">
                      {review.review ||
                        "No review text"}
                    </p>

                    {review.review &&
                      review.review.length > 100 && (
                        <button
                          onClick={() =>
                            setSelectedReview(review)
                          }
                          className="mt-1 text-xs font-semibold text-primary hover:underline"
                        >
                          More
                        </button>
                      )}
                  </div>

                  <div className="flex items-center justify-end gap-2">

                    <button
                      onClick={() =>
                        setSelectedReview(review)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                      title="View review"
                    >
                      <Eye size={17} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(review._id)
                      }
                      disabled={
                        deletingId === review._id
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-danger/20 text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete review"
                    >
                      {deletingId === review._id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-danger/30 border-t-danger" />
                      ) : (
                        <Trash2 size={17} />
                      )}
                    </button>

                  </div>
                </div>

                <div className="md:hidden">

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User size={19} />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-text">
                          {review.reviewer?.name ||
                            "Unknown User"}
                        </p>

                        <p className="truncate text-xs text-muted">
                          {review.reviewer?.email ||
                            "No email"}
                        </p>

                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {getReviewType(review.type)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">

                    {review.type === "item" ? (
                      <Package
                        size={17}
                        className="text-primary"
                      />
                    ) : (
                      <User
                        size={17}
                        className="text-primary"
                      />
                    )}

                    <div>
                      <p className="text-xs text-muted">
                        Reviewed
                      </p>

                      <p className="font-semibold text-text">
                        {getReviewedName(review)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">

                    {renderStars(review.rating, 16)}

                    <p className="mt-1 text-xs text-muted">
                      {review.rating}/5
                    </p>
                  </div>

                  <div className="mt-3">

                    <p className="line-clamp-3 text-sm leading-6 text-text">
                      {review.review ||
                        "No review text"}
                    </p>

                    {review.review &&
                      review.review.length > 150 && (
                        <button
                          onClick={() =>
                            setSelectedReview(review)
                          }
                          className="mt-1 text-xs font-semibold text-primary hover:underline"
                        >
                          More
                        </button>
                      )}
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">

                    <button
                      onClick={() =>
                        setSelectedReview(review)
                      }
                      className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-muted transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(review._id)
                      }
                      disabled={
                        deletingId === review._id
                      }
                      className="flex items-center gap-2 rounded-xl border border-danger/20 px-3 py-2 text-sm font-semibold text-danger transition hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === review._id ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-danger/30 border-t-danger" />
                      ) : (
                        <Trash2 size={16} />
                      )}

                      Delete
                    </button>

                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>
      )}

      {filteredReviews.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.max(prev - 1, 1)
              )
            }
            disabled={currentPage === 1}
            className="px-5 py-2.5 rounded-xl border border-border bg-card text-text text-sm font-medium transition hover:bg-background disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium transition hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            More
          </button>

        </div>
      )}

      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between border-b border-border p-6">

              <div>
                <p className="text-sm font-semibold text-primary">
                  {getReviewType(
                    selectedReview.type
                  )}
                </p>

                <h2 className="mt-1 text-xl font-bold text-text">
                  Review Details
                </h2>
              </div>

              <button
                onClick={() => setSelectedReview(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition hover:bg-background hover:text-text"
              >
                <X size={20} />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="rounded-2xl border border-border bg-background p-4">

                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                  Reviewer
                </p>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User size={20} />
                  </div>

                  <div>

                    <p className="font-semibold text-text">
                      {selectedReview.reviewer?.name ||
                        "Unknown User"}
                    </p>

                    <p className="text-sm text-muted">
                      {selectedReview.reviewer?.email ||
                        "No email available"}
                    </p>

                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-4">

                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Reviewed
                </p>

                <div className="mt-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">

                    {selectedReview.type === "item" ? (
                      <Package size={19} />
                    ) : (
                      <User size={19} />
                    )}

                  </div>

                  <div>

                    <p className="font-semibold text-text">
                      {getReviewedName(selectedReview)}
                    </p>

                  </div>
                </div>
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Rating
                </p>

                <div className="mt-2 flex items-center gap-3">

                  {renderStars(
                    selectedReview.rating,
                    19
                  )}

                  <span className="font-semibold text-text">
                    {selectedReview.rating}/5
                  </span>

                </div>
              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Review
                </p>

                <div className="mt-2 rounded-2xl border border-border bg-background p-4">

                  <p className="whitespace-pre-wrap text-sm leading-6 text-text">
                    {selectedReview.review ||
                      "No review text provided."}
                  </p>

                </div>
              </div>

              <button
                onClick={() =>
                  handleDelete(selectedReview._id)
                }
                disabled={
                  deletingId === selectedReview._id
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-danger px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >

                {deletingId === selectedReview._id ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Trash2 size={18} />
                )}

                Delete Review

              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminReviews;