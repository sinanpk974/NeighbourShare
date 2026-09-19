import {
  CalendarDays,
  Clock,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  User,
} from "lucide-react";

function RequestCard({
  request,
  type = "borrower",
  onAccept,
  onReject,
  onReturn,
  loading = false,
}) {
  const isBorrower = type === "borrower";
  const isOwner = type === "owner";

  const item = request?.item;
  const borrower = request?.borrower;
  const owner = request?.owner;

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Accepted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Returned":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!request) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">

      {}
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Package size={21} />
          </div>

          <div>
            <h3 className="font-bold text-text">
              {item?.title || "Item"}
            </h3>

            <p className="mt-1 text-xs text-muted">
              {item?.category || "Item request"}
            </p>
          </div>

        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
            request.status
          )}`}
        >
          {request.status}
        </span>

      </div>


      {}
      <div className="p-5">

        {}
        <div className="flex gap-4">

          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-background">

            {item?.image ? (
              <img
                src={item.image}
                alt={item.title || "Item"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted">
                <Package size={28} />
              </div>
            )}

          </div>

          <div className="min-w-0">

            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Requested Item
            </p>

            <h4 className="mt-1 truncate text-lg font-bold text-text">
              {item?.title || "Unknown item"}
            </h4>

            {item?.condition && (
              <p className="mt-1 text-sm text-muted">
                Condition:{" "}
                <span className="font-medium text-text">
                  {item.condition}
                </span>
              </p>
            )}

          </div>

        </div>


        {}
        <div className="mt-6 rounded-xl bg-background p-4">

          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {isBorrower ? "Item Owner" : "Borrower"}
          </p>


          {}
          {isBorrower && owner && (

            <div className="mt-3 flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <User size={19} />
              </div>

              <div className="min-w-0">

                <p className="font-semibold text-text">
                  {owner.name || "Community member"}
                </p>

                {owner.village && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <MapPin size={13} />
                    {owner.village}
                  </p>
                )}

              </div>

            </div>

          )}


          {}
          {isOwner && borrower && (

            <div className="mt-3">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User size={19} />
                </div>

                <div className="min-w-0">

                  <p className="font-semibold text-text">
                    {borrower.name || "Borrower"}
                  </p>

                  {borrower.village && (
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                      <MapPin size={13} />
                      {borrower.village}
                    </p>
                  )}

                </div>

              </div>


              {}
              {(borrower.phone ||
                borrower.email ||
                borrower.address) && (

                <div className="mt-4 space-y-2 border-t border-border pt-4">

                  {borrower.phone && (
                    <p className="flex items-center gap-2 text-sm text-muted">
                      <Phone
                        size={15}
                        className="text-primary"
                      />
                      {borrower.phone}
                    </p>
                  )}

                  {borrower.email && (
                    <p className="flex items-center gap-2 break-all text-sm text-muted">
                      <MessageSquare
                        size={15}
                        className="shrink-0 text-primary"
                      />
                      {borrower.email}
                    </p>
                  )}

                  {borrower.address && (
                    <p className="flex items-start gap-2 text-sm leading-5 text-muted">
                      <MapPin
                        size={15}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      {borrower.address}
                    </p>
                  )}

                </div>

              )}

            </div>

          )}

        </div>


        {}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">

          <div className="rounded-xl border border-border p-4">

            <div className="flex items-center gap-2">

              <CalendarDays
                size={16}
                className="text-primary"
              />

              <p className="text-xs font-semibold text-muted">
                Expected Return
              </p>

            </div>

            <p className="mt-2 text-sm font-semibold text-text">
              {formatDate(request.expectedReturnDate)}
            </p>

          </div>


          <div className="rounded-xl border border-border p-4">

            <div className="flex items-center gap-2">

              <Clock
                size={16}
                className="text-primary"
              />

              <p className="text-xs font-semibold text-muted">
                Requested On
              </p>

            </div>

            <p className="mt-2 text-sm font-semibold text-text">
              {formatDate(request.createdAt)}
            </p>

          </div>

        </div>


        {}
        {request.message && (

          <div className="mt-5 rounded-xl border border-border p-4">

            <div className="flex items-center gap-2">

              <MessageSquare
                size={16}
                className="text-primary"
              />

              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Message
              </p>

            </div>

            <p className="mt-2 text-sm leading-6 text-muted">
              {request.message}
            </p>

          </div>

        )}


        {}
        {isOwner && request.status === "Pending" && (

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              disabled={loading}
              onClick={() => onAccept?.(request._id)}
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Accept Request"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => onReject?.(request._id)}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject Request
            </button>

          </div>

        )}


        {}
        {isOwner && request.status === "Accepted" && (

          <button
            type="button"
            disabled={loading}
            onClick={() => onReturn?.(request._id)}
            className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Confirm Item Returned"}
          </button>

        )}


        {}
        {isBorrower && request.status === "Pending" && (

          <div className="mt-6 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
            Your request is waiting for the owner to respond.
          </div>

        )}

        {isBorrower && request.status === "Accepted" && (

          <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            Your request has been accepted. You can now proceed with the borrowing arrangement.
          </div>

        )}

        {isBorrower && request.status === "Rejected" && (

          <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            The owner has rejected this request.
          </div>

        )}

        {request.status === "Returned" && (

          <div className="mt-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-700">
            This borrowing has been completed and the item has been returned.
          </div>

        )}

      </div>

    </div>
  );
}

export default RequestCard;