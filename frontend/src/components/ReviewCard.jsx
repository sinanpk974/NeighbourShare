import { Star, Package, User } from "lucide-react";

function ReviewCard({
  request,
  reviewType,
  onReview,
}) {

  const isItemReview = reviewType === "item";
  const isBorrowerReview = reviewType === "borrower";

  const item = request?.item;

  const borrower = request?.borrower;
  const owner = request?.owner;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">

      {}
      {}
      {}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          {}

          <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden shrink-0">

            {isItemReview && item?.image ? (

              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />

            ) : (

              <User
                size={22}
                className="text-primary"
              />

            )}

          </div>

          {}

          <div>

            <p className="text-xs text-muted uppercase tracking-wide">
              {isItemReview
                ? "Review Item"
                : "Review Borrower"}
            </p>

            <h3 className="font-bold text-text mt-0.5">

              {isItemReview
                ? item?.title || "Borrowed Item"
                : borrower?.name || "Borrower"}

            </h3>

          </div>

        </div>


        {}

        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-background border border-border text-success">
          Returned
        </span>

      </div>


      {}
      {}
      {}

      <div className="mt-5">

        {isItemReview && (

          <p className="text-sm text-muted">
            How was your experience with this item?
          </p>

        )}

        {isBorrowerReview && (

          <p className="text-sm text-muted">
            How was your experience with this borrower?
          </p>

        )}

      </div>


      {}
      {}
      {}

      <button
        onClick={() => onReview(request, reviewType)}
        className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition"
      >

        <Star
          size={18}
          fill="currentColor"
        />

        {isItemReview
          ? "Review Item"
          : "Review Borrower"}

      </button>

    </div>
  );
}

export default ReviewCard;