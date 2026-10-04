import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Package,
  Send,
  User,
  XCircle,
} from "lucide-react";

function BorrowRequest() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);

  const [message, setMessage] = useState("");
  const [expectedReturnDate, setExpectedReturnDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token || !itemId) {
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const itemResponse = await axios.get(
          `http://https://neighbourshare-i2wq.onrender.com/api/item/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const itemData = itemResponse.data.item;

        if (!itemData) {
          setError("Item not found.");
          return;
        }

        setItem(itemData);

        if (itemData.owner) {
          const ownerId =
            typeof itemData.owner === "object"
              ? itemData.owner._id
              : itemData.owner;

          const ownerResponse = await axios.get(
            `http://https://neighbourshare-i2wq.onrender.com/api/profilePublic/${ownerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setOwner(ownerResponse.data.profile);
        }
      } catch (err) {
        console.log("Borrow request fetch error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.message ||
            err.response?.data?.msg ||
            "Unable to load item details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [itemId, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    if (!expectedReturnDate) {
      setError("Please select an expected return date.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(expectedReturnDate);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Expected return date cannot be in the past.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await axios.post(
        `http://https://neighbourshare-i2wq.onrender.com/api/request/${itemId}`,
        {
          message,
          expectedReturnDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data?.msg ||
          "Borrow request sent successfully."
      );
      setTimeout(() => {
        navigate("/myRequests");
      }, 1000);

    } catch (err) {
      console.log("Borrow request error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          "Unable to send borrow request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

            <p className="mt-4 text-sm text-muted">
              Loading request details...
            </p>

          </div>

        </div>

      </main>
    );
  }

  if (error && !item) {
    return (
      <main className="min-h-screen bg-background">

        <div className="mx-auto max-w-3xl px-4 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <XCircle size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-text">
            Unable to continue
          </h1>

          <p className="mt-2 text-sm text-muted">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

        </div>

      </main>
    );
  }

  const isAvailable =
    item?.availability?.toLowerCase() === "available";

  return (
    <main className="min-h-screen bg-background">

      {/* =====================================
          BACK BUTTON
      ===================================== */}

      <section className="border-b border-border bg-white">

        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-primary"
          >
            <ArrowLeft size={18} />
            Back to item
          </button>

        </div>

      </section>


      {/* =====================================
          PAGE
      ===================================== */}

      <section className="py-8 sm:py-10">

        <div className="mx-auto max-w-5xl px-4 sm:px-6">

          {}

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              BORROW REQUEST
            </p>

            <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
              Request to borrow
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Send a request to the item owner. The owner will
              review your request before accepting it.
            </p>

          </div>


          {/* =====================================
              MAIN GRID
          ===================================== */}

          <div className="grid gap-6 lg:grid-cols-5">


            {/* ===================================
                LEFT - ITEM + OWNER
            =================================== */}

            <div className="space-y-6 lg:col-span-2">

              {}

              <div className="overflow-hidden rounded-3xl bg-white shadow-sm">

                <div className="aspect-[4/3] bg-background">

                  {item?.image ? (

                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center text-muted">
                      <Package size={55} />
                    </div>

                  )}

                </div>


                <div className="p-5">

                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {item?.category}
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-text">
                    {item?.title}
                  </h2>

                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-background p-3">

                      <p className="text-xs text-muted">
                        Condition
                      </p>

                      <p className="mt-1 text-sm font-semibold text-text">
                        {item?.condition || "Not specified"}
                      </p>

                    </div>

                    <div className="rounded-xl bg-background p-3">

                      <p className="text-xs text-muted">
                        Availability
                      </p>

                      <p
                        className={`mt-1 text-sm font-semibold ${
                          isAvailable
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {item?.availability}
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {}

              {owner && (

                <div className="rounded-3xl bg-white p-5 shadow-sm">

                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    ITEM OWNER
                  </p>

                  <div className="mt-4 flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-primary/10 text-primary">

                      {owner.profileImage ? (

                        <img
                          src={owner.profileImage}
                          alt={owner.name}
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <User size={25} />

                      )}

                    </div>

                    <div>

                      <h3 className="font-bold text-text">
                        {owner.name}
                      </h3>

                      {owner.village && (

                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                          <MapPin size={13} />
                          {owner.village}
                        </p>

                      )}

                    </div>

                  </div>

                  <p className="mt-4 text-xs leading-5 text-muted">
                    Only public information is shown here.
                    Private contact details will remain protected.
                  </p>

                </div>

              )}

            </div>


            {/* ===================================
                RIGHT - REQUEST FORM
            =================================== */}

            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">

              <div className="mb-7">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Send size={23} />
                </div>

                <h2 className="mt-4 text-2xl font-bold text-text">
                  Borrow request
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Tell the owner why you need the item and
                  when you expect to return it.
                </p>

              </div>


              {}

              {error && (

                <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">

                  <XCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{error}</span>

                </div>

              )}


              {}

              {success && (

                <div className="mb-5 flex gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-5 text-green-700">

                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{success}</span>

                </div>

              )}


              {}

              {!isAvailable && (

                <div className="mb-5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-4 text-sm text-orange-700">
                  This item is currently not available for
                  borrowing.
                </div>

              )}


              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-text">
                    Message to owner
                  </label>

                  <div className="relative">

                    <MessageSquare
                      size={18}
                      className="absolute left-4 top-4 text-muted"
                    />

                    <textarea
                      value={message}
                      onChange={(e) =>
                        setMessage(e.target.value)
                      }
                      placeholder="Tell the owner why you need this item..."
                      rows={5}
                      maxLength={500}
                      className="w-full resize-none rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />

                  </div>

                  <p className="mt-1 text-right text-xs text-muted">
                    {message.length}/500
                  </p>

                </div>


                {}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-text">
                    Expected return date
                  </label>

                  <div className="relative">

                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      type="date"
                      value={expectedReturnDate}
                      onChange={(e) =>
                        setExpectedReturnDate(
                          e.target.value
                        )
                      }
                      min={
                        new Date()
                          .toISOString()
                          .split("T")[0]
                      }
                      className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                    />

                  </div>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    Choose the date by which you expect to
                    return the item.
                  </p>

                </div>


                {}

                <div className="rounded-2xl bg-primary/5 p-4">

                  <div className="flex gap-3">

                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-primary"
                    />

                    <div>

                      <p className="text-sm font-semibold text-text">
                        Before you send
                      </p>

                      <p className="mt-1 text-xs leading-5 text-muted">
                        The owner will receive your request
                        along with your contact details and
                        can decide whether to accept or reject
                        the request.
                      </p>

                    </div>

                  </div>

                </div>


                {}

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    !isAvailable ||
                    !!success
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {submitting ? (

                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending Request...
                    </>

                  ) : (

                    <>
                      <Send size={18} />
                      Send Borrow Request
                    </>

                  )}

                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default BorrowRequest;