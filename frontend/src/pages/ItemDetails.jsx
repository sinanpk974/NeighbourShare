import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import {
  ArrowLeft,
  MapPin,
  Star,
  Package,
  User,
  CheckCircle2,
  XCircle,
  Send,
} from "lucide-react";

function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [item, setItem] = useState(null);
  const [owner, setOwner] = useState(null);

  const [ownerRating, setOwnerRating] = useState(0);
  const [ownerReviewCount, setOwnerReviewCount] = useState(0);
  const [ownerItems, setOwnerItems] = useState([]);

  const [itemReviews, setItemReviews] = useState([]);
  const [itemRating, setItemRating] = useState(0);
  const [itemReviewCount, setItemReviewCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token || !id) {
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const itemResponse = await axios.get(
          `https://neighbourshare-i2wq.onrender.com/api/item/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const itemData = itemResponse.data.item;

        setItem(itemData);

        const reviewResponse = await axios.get(
          `https://neighbourshare-i2wq.onrender.com/api/itemReview/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setItemReviews(
          reviewResponse.data.reviews || []
        );

        setItemRating(
          reviewResponse.data.averageRating || 0
        );

        setItemReviewCount(
          reviewResponse.data.totalReviews || 0
        );

        if (itemData.owner) {
          const ownerId =
            typeof itemData.owner === "object"
              ? itemData.owner._id
              : itemData.owner;

          const ownerResponse = await axios.get(
            `https://neighbourshare-i2wq.onrender.com/api/profilePublic/${ownerId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setOwner(ownerResponse.data.profile);

          setOwnerRating(
            ownerResponse.data.averageRating || 0
          );

          setOwnerReviewCount(
            ownerResponse.data.totalReviews || 0
          );

          setOwnerItems(
            ownerResponse.data.items || []
          );
        }
      } catch (error) {
        console.log(
          "Item details error:",
          error
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError(
          error.response?.data?.message ||
            error.response?.data?.msg ||
            "Unable to load item details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, token, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">

        <div className="flex min-h-[70vh] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

            <p className="mt-4 text-sm text-muted">
              Loading item details...
            </p>

          </div>

        </div>

      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="min-h-screen bg-background">

        <div className="mx-auto max-w-3xl px-4 py-16 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">

            <XCircle size={30} />

          </div>

          <h1 className="mt-5 text-2xl font-bold text-text">
            Item not found
          </h1>

          <p className="mt-2 text-sm text-muted">
            {error || "This item may have been removed."}
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

  const ownerId =
    typeof item.owner === "object"
      ? item.owner?._id
      : item.owner;

  let currentUserId = null;

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    currentUserId =
      payload.UserID || payload.userId || payload.id;
  } catch (error) {
    console.log("Unable to read token");
  }

  const isOwnItem =
    currentUserId &&
    ownerId &&
    currentUserId === ownerId;

  const isAvailable =
    item.availability?.toLowerCase() ===
    "available";

  return (
    <main className="min-h-screen bg-background">

      {/* ==========================================
          BACK BUTTON
      ========================================== */}

      <section className="border-b border-border bg-white">

        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-primary"
          >
            <ArrowLeft size={18} />
            Back to items
          </button>

        </div>

      </section>


      {/* ==========================================
          ITEM DETAILS
      ========================================== */}

      <section className="py-8 sm:py-10">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-8 lg:grid-cols-2">

            {/* ====================================
                ITEM IMAGE
            ==================================== */}

            <div>

              <div className="relative overflow-hidden rounded-3xl bg-white shadow-sm">

                <div className="aspect-[4/3]">

                  {item.image ? (

                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-full items-center justify-center bg-background text-muted">

                      <Package size={60} />

                    </div>

                  )}

                </div>


                {}

                <div className="absolute right-4 top-4">

                  <span
                    className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold ${
                      isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >

                    {isAvailable ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <XCircle size={14} />
                    )}

                    {item.availability || "Available"}

                  </span>

                </div>

              </div>

            </div>


            {/* ====================================
                ITEM INFORMATION
            ==================================== */}

            <div>

              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                {item.category}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
                {item.title}
              </h1>


              {}

              <div className="mt-5 flex flex-wrap gap-3">

                <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

                  <p className="text-xs text-muted">
                    Condition
                  </p>

                  <p className="mt-1 text-sm font-semibold text-text">
                    {item.condition}
                  </p>

                </div>

                <div className="rounded-xl bg-white px-4 py-3 shadow-sm">

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
                    {item.availability}
                  </p>

                </div>

              </div>


              {}

              <div className="mt-7">

                <h2 className="text-lg font-bold text-text">
                  About this item
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted">
                  {item.description ||
                    "No description provided."}
                </p>

              </div>


              {/* ====================================
                  BORROW BUTTON
              ==================================== */}

              <div className="mt-8">

                {isOwnItem ? (

                  <div className="rounded-2xl border border-primary/10 bg-primary/5 px-5 py-4">

                    <p className="text-sm font-semibold text-primary">
                      This is your item
                    </p>

                    <p className="mt-1 text-xs leading-5 text-muted">
                      You cannot request your own item.
                    </p>

                  </div>

                ) : isAvailable ? (

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/borrowRequest/${item._id}`
                      )
                    }
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    <Send size={18} />
                    Request to Borrow
                  </button>

                ) : (

                  <button
                    type="button"
                    disabled
                    className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-200 px-5 text-sm font-semibold text-gray-500"
                  >
                    <XCircle size={18} />
                    Currently Borrowed
                  </button>

                )}

              </div>

            </div>

          </div>


          {/* ==========================================
              ITEM REVIEWS
          ========================================== */}

          <section className="mt-12">

            <div className="mb-5">

              <p className="text-sm font-semibold text-primary">
                ITEM REVIEWS
              </p>

              <h2 className="mt-1 text-2xl font-bold text-text">
                What borrowers say
              </h2>

            </div>


            <div className="rounded-3xl bg-white p-6 shadow-sm">

              {}

              <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">

                    <Star
                      size={23}
                      className="fill-primary text-primary"
                    />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="text-2xl font-bold text-text">
                        {itemRating}
                      </span>

                      <span className="text-sm text-muted">
                        / 5
                      </span>

                    </div>

                    <p className="text-xs text-muted">
                      {itemReviewCount} review
                      {itemReviewCount !== 1
                        ? "s"
                        : ""}
                    </p>

                  </div>

                </div>

              </div>


              {}

              {itemReviews.length === 0 ? (

                <div className="py-10 text-center">

                  <Star
                    size={30}
                    className="mx-auto text-muted"
                  />

                  <p className="mt-3 text-sm font-semibold text-text">
                    No reviews yet
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    This item hasn't received any reviews yet.
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-border">

                  {itemReviews.map((review) => (

                    <div
                      key={review._id}
                      className="py-5 first:pt-6 last:pb-2"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {review.reviewer?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>

                          <div>

                            <p className="text-sm font-semibold text-text">
                              {review.reviewer?.name ||
                                "Community member"}
                            </p>

                            <div className="mt-1 flex items-center gap-1">

                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <Star
                                    key={star}
                                    size={13}
                                    className={
                                      star <= review.rating
                                        ? "fill-primary text-primary"
                                        : "text-border"
                                    }
                                  />
                                )
                              )}

                            </div>

                          </div>

                        </div>

                        <span className="text-xs text-muted">
                          {review.rating}/5
                        </span>

                      </div>


                      {review.review && (

                        <p className="mt-3 text-sm leading-6 text-muted">
                          {review.review}
                        </p>

                      )}

                    </div>

                  ))}

                </div>

              )}

            </div>

          </section>


          {/* ==========================================
              OWNER PUBLIC PROFILE
          ========================================== */}

          {owner && (

            <section className="mt-12">

              <div className="mb-5">

                <p className="text-sm font-semibold text-primary">
                  ITEM OWNER
                </p>

                <h2 className="mt-1 text-2xl font-bold text-text">
                  About the owner
                </h2>

              </div>


              <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                  {}

                  <div className="flex items-center gap-4">

                    <div className="h-16 w-16 overflow-hidden rounded-2xl bg-primary/10">

                      {owner.profileImage ? (

                        <img
                          src={owner.profileImage}
                          alt={owner.name}
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-full w-full items-center justify-center text-primary">

                          <User size={28} />

                        </div>

                      )}

                    </div>


                    <div>

                      <h3 className="text-lg font-bold text-text">
                        {owner.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5 text-sm text-muted">

                        <MapPin size={15} />

                        {owner.village}

                      </div>

                    </div>

                  </div>


                  {}

                  <div className="flex items-center gap-3 rounded-2xl bg-background px-5 py-4">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">

                      <Star
                        size={20}
                        className="fill-primary text-primary"
                      />

                    </div>

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="text-lg font-bold text-text">
                          {ownerRating}
                        </span>

                        <span className="text-xs text-muted">
                          / 5
                        </span>

                      </div>

                      <p className="text-xs text-muted">
                        {ownerReviewCount} review
                        {ownerReviewCount !== 1
                          ? "s"
                          : ""}
                      </p>

                    </div>

                  </div>

                </div>


                {/* ====================================
                    OWNER ITEMS
                ==================================== */}

                <div className="mt-7 border-t border-border pt-6">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="font-bold text-text">
                        Other items from {owner.name}
                      </h3>

                      <p className="mt-1 text-xs text-muted">
                        Available items shared by this member.
                      </p>

                    </div>

                    <Package
                      size={20}
                      className="text-muted"
                    />

                  </div>


                  {ownerItems.length === 0 ? (

                    <p className="mt-5 rounded-xl bg-background px-4 py-5 text-center text-sm text-muted">
                      No other available items.
                    </p>

                  ) : (

                    <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

                      {ownerItems
                        .filter(
                          (ownerItem) =>
                            ownerItem._id !== item._id
                        )
                        .map((ownerItem) => (

                          <button
                            type="button"
                            key={ownerItem._id}
                            onClick={() =>
                              navigate(
                                `/itemDetails/${ownerItem._id}`
                              )
                            }
                            className="overflow-hidden rounded-2xl border border-border bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md"
                          >

                            <div className="aspect-square bg-background">

                              {ownerItem.image ? (

                                <img
                                  src={ownerItem.image}
                                  alt={ownerItem.title}
                                  className="h-full w-full object-cover"
                                />

                              ) : (

                                <div className="flex h-full items-center justify-center text-muted">

                                  <Package size={28} />

                                </div>

                              )}

                            </div>

                            <div className="p-3">

                              <p className="line-clamp-1 text-sm font-semibold text-text">
                                {ownerItem.title}
                              </p>

                              <p className="mt-1 text-xs text-muted">
                                {ownerItem.category}
                              </p>

                            </div>

                          </button>

                        ))}

                    </div>

                  )}

                </div>

              </div>

            </section>

          )}

        </div>

      </section>
      <Footer/>

    </main>
  );
}

export default ItemDetails;