import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ItemCard({ item }) {
  const isAvailable = item?.availability === "Available";

  const navigate = useNavigate();
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      {}
      <div className="relative h-52 overflow-hidden bg-primary/5">

        {item?.image ? (
          <img
            src={item.image}
            alt={item.title || "Item"}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image available
          </div>
        )}

        {}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
        >
          <Heart
            size={18}
            strokeWidth={2}
            className="text-primary"
          />
        </button>

      </div>

      {}
      <div className="p-5">

        {}
        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h3 className="truncate text-lg font-bold text-text">
              {item?.title || "Untitled Item"}
            </h3>

            <p className="mt-1 text-sm text-muted">
              {item?.category || "Other"}
            </p>

          </div>

          {}
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
              isAvailable
                ? "bg-success/10 text-success"
                : "bg-accent/10 text-accent"
            }`}
          >
            {isAvailable ? "Available" : "Borrowed"}
          </span>

        </div>

        {}
        {item?.condition && (
          <p className="mt-4 text-sm text-muted">
            Condition:{" "}
            <span className="font-medium text-text">
              {item.condition}
            </span>
          </p>
        )}

        {}
        <button
  type="button"
  onClick={() => navigate(`/itemDetails/${item._id}`)}
  className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
>
  View Details

  <ArrowRight
    size={16}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</button>
      </div>

    </div>
  );
}

export default ItemCard;