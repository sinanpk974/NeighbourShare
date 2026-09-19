import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  MapPin,
  User,
  CalendarDays,
  Inbox,
  Send,
  ChevronDown,
  ChevronUp,
  Phone,
  Star,
  Eye,
} from "lucide-react";

import ReviewModal from "./Review.jsx";

function MyRequests() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem("token");

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "received"
      ? "received"
      : "sent"
  );

  const [showAllSent, setShowAllSent] = useState(false);
  const [showAllReceived, setShowAllReceived] = useState(false);

  const [highlightedRequestId, setHighlightedRequestId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewType, setReviewType] = useState("");

  const [showViewReview, setShowViewReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loadingViewReview, setLoadingViewReview] = useState(false);

  const [showBorrowerReviews, setShowBorrowerReviews] =
    useState(false);

  const [selectedBorrower, setSelectedBorrower] =
    useState(null);

  const [borrowerReviews, setBorrowerReviews] =
    useState(null);

  const [loadingBorrowerReviews, setLoadingBorrowerReviews] =
    useState(false);

  const [contactDetails, setContactDetails] = useState({});

  const [loadingContactId, setLoadingContactId] =
    useState(null);

  const [showContactFor, setShowContactFor] =
    useState(null);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (tab === "received") {
      setActiveTab("received");

      setTimeout(() => {
        document
          .getElementById("received-requests")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 300);
    }

    if (tab === "sent") {
      setActiveTab("sent");

      setTimeout(() => {
        document
          .getElementById("sent-requests")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 300);
    }
  }, [searchParams]);

  useEffect(() => {
    const requestId = searchParams.get("request");
    const tab = searchParams.get("tab");

    if (!requestId) return;

    setHighlightedRequestId(requestId);

    if (tab === "received") {
      setShowAllReceived(true);
    } else {
      setShowAllSent(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const requestId = searchParams.get("request");

    if (!requestId || loading) return;

    const timer = setTimeout(() => {
      const requestElement = document.getElementById(
        `request-${requestId}`
      );

      if (requestElement) {
        requestElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 400);

    const highlightTimer = setTimeout(() => {
      setHighlightedRequestId(null);
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearTimeout(highlightTimer);
    };
  }, [
    searchParams,
    loading,
    showAllSent,
    showAllReceived,
    sentRequests,
    receivedRequests,
  ]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [sentResponse, receivedResponse] =
          await Promise.all([
            axios.get(
              "http://localhost:3003/api/myRequests",
              { headers }
            ),

            axios.get(
              "http://localhost:3003/api/receivedRequests",
              { headers }
            ),
          ]);

        setSentRequests(sentResponse.data || []);
        setReceivedRequests(receivedResponse.data || []);
      } catch (err) {
        console.log("Requests error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          navigate("/login");
          return;
        }

        setError(
          err.response?.data?.msg ||
            "Unable to load requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token, navigate]);

  const getStatusStyle = (status) => {
    if (status === "Accepted") {
      return {
        className: "bg-green-100 text-green-700",
        icon: <CheckCircle2 size={15} />,
      };
    }

    if (status === "Rejected") {
      return {
        className: "bg-red-100 text-red-700",
        icon: <XCircle size={15} />,
      };
    }

    if (status === "Returned") {
      return {
        className: "bg-blue-100 text-blue-700",
        icon: <RotateCcw size={15} />,
      };
    }

    return {
      className: "bg-yellow-100 text-yellow-700",
      icon: <Clock size={15} />,
    };
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const latestSentRequests = showAllSent
    ? [...sentRequests].sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [...sentRequests]
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 4);

  const latestReceivedRequests = showAllReceived
    ? [...receivedRequests].sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [...receivedRequests]
        .sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 4);

  const handleViewContact = async (request) => {
    const requestId = request._id;
    const ownerId = request.owner?._id;

    if (!ownerId) {
      alert("Owner information is not available.");
      return;
    }

    if (contactDetails[requestId]) {
      setShowContactFor(
        showContactFor === requestId ? null : requestId
      );
      return;
    }

    try {
      setLoadingContactId(requestId);

      const response = await axios.get(
        `http://localhost:3003/api/profileContact/${ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContactDetails((previous) => ({
        ...previous,
        [requestId]: response.data.contact,
      }));

      setShowContactFor(requestId);
    } catch (err) {
      console.log("Contact details error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      alert(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          "Unable to load contact details."
      );
    } finally {
      setLoadingContactId(null);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      await axios.patch(
        `http://localhost:3003/api/acceptRequest/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReceivedRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "Accepted",
                borrowDate: new Date(),
              }
            : request
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Unable to accept request."
      );
    }
  };

  const handleReject = async (requestId) => {
    try {
      await axios.patch(
        `http://localhost:3003/api/rejectRequest/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReceivedRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "Rejected",
              }
            : request
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Unable to reject request."
      );
    }
  };

  const handleReturn = async (requestId) => {
    try {
      await axios.patch(
        `http://localhost:3003/api/return/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReceivedRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "Returned",
                actualReturnDate: new Date(),
              }
            : request
        )
      );

      setSentRequests((previous) =>
        previous.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "Returned",
                actualReturnDate: new Date(),
              }
            : request
        )
      );

      setShowContactFor(null);
    } catch (err) {
      alert(
        err.response?.data?.msg ||
          "Unable to confirm return."
      );
    }
  };

  const openReviewModal = (request, type) => {
    setSelectedRequest(request);
    setReviewType(type);
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRequest(null);
    setReviewType("");
  };

  const handleReviewSuccess = (responseData) => {
    const newReview =
      responseData?.review ||
      responseData?.data?.review ||
      responseData?.data ||
      responseData;

    if (!selectedRequest || !newReview) {
      closeReviewModal();
      return;
    }

    const reviewData = {
      exists: true,
      _id: newReview?._id,
      rating: newReview?.rating,
      review: newReview?.review,
      createdAt: newReview?.createdAt,
    };

    if (reviewType === "item") {
      setSentRequests((previous) =>
        previous.map((request) =>
          request._id === selectedRequest._id
            ? {
                ...request,
                review: reviewData,
              }
            : request
        )
      );
    }

    if (reviewType === "borrower") {
      setReceivedRequests((previous) =>
        previous.map((request) =>
          request._id === selectedRequest._id
            ? {
                ...request,
                review: reviewData,
              }
            : request
        )
      );
    }

    setSelectedReview({
      ...selectedRequest,
      review: reviewData,
    });

    setShowReviewModal(false);
    setSelectedRequest(null);
    setReviewType("");

    setShowViewReview(true);
  };

  const openViewReview = async (request) => {
    try {
      setLoadingViewReview(true);
      setSelectedReview(null);
      setShowViewReview(true);

      const response = await axios.get(
        `http://localhost:3003/api/reviewsByRequest/${request._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedReview({
        ...request,
        givenReview: response.data?.givenReview || null,
        receivedReview:
          response.data?.receivedReview || null,
      });
    } catch (err) {
      console.log("View reviews error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      alert(
        err.response?.data?.msg ||
          "Unable to load reviews."
      );

      setShowViewReview(false);
    } finally {
      setLoadingViewReview(false);
    }
  };

  const closeViewReview = () => {
    setShowViewReview(false);
    setSelectedReview(null);
  };

  const openBorrowerReviews = async (borrower) => {
    if (!borrower?._id) return;

    try {
      setSelectedBorrower(borrower);
      setBorrowerReviews(null);
      setShowBorrowerReviews(true);
      setLoadingBorrowerReviews(true);

      const response = await axios.get(
        `http://localhost:3003/api/userReviews/${borrower._id}`
      );

      setBorrowerReviews(response.data);
    } catch (err) {
      console.log("Borrower reviews error:", err);

      alert(
        err.response?.data?.msg ||
          "Unable to load borrower reviews."
      );

      setShowBorrowerReviews(false);
    } finally {
      setLoadingBorrowerReviews(false);
    }
  };

  const closeBorrowerReviews = () => {
    setShowBorrowerReviews(false);
    setSelectedBorrower(null);
    setBorrowerReviews(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

            <p className="mt-4 text-sm text-muted">
              Loading requests...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">

      {}

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
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

      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {}

          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              COMMUNITY REQUESTS
            </p>

            <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
              Requests
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Manage the items you have requested and the requests
              received from your neighbours.
            </p>
          </div>

          {}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {}

          <section id="sent-requests">

            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Send size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-text">
                    Sent Requests
                  </h2>

                  <p className="mt-1 text-xs text-muted">
                    Items you have requested from neighbours
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {sentRequests.length}
              </span>
            </div>

            {sentRequests.length === 0 ? (
              <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-muted">
                  <Send size={25} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-text">
                  No sent requests
                </h3>

                <p className="mt-2 text-sm text-muted">
                  You haven't requested any items yet.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/items")}
                  className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Browse Items
                </button>
              </div>
            ) : (
              <div className="space-y-4">

                {latestSentRequests.map((request) => {
                  const statusStyle =
                    getStatusStyle(request.status);

                  const item = request.item;
                  const owner = request.owner;

                  const contact =
                    contactDetails[request._id];

                  return (
                    <div
                      key={request._id}
                      id={`request-${request._id}`}
                      className={`overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-500 ${
                        highlightedRequestId === request._id
                          ? "ring-2 ring-primary ring-offset-2 shadow-lg"
                          : ""
                      }`}
                    >
                      <div className="grid lg:grid-cols-[190px_1fr]">

                        <div className="aspect-[4/3] bg-background lg:aspect-auto">
                          {item?.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full min-h-[170px] items-center justify-center text-muted">
                              <Package size={42} />
                            </div>
                          )}
                        </div>

                        <div className="p-5">

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                {item?.category || "Item"}
                              </p>

                              <h3 className="mt-1 text-lg font-bold text-text">
                                {item?.title || "Item unavailable"}
                              </h3>
                            </div>

                            <span
                              className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle.className}`}
                            >
                              {statusStyle.icon}
                              {request.status}
                            </span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-4">

                            <div className="flex items-center gap-2">
                              <User
                                size={17}
                                className="text-primary"
                              />

                              <div>
                                <p className="text-[11px] text-muted">
                                  Owner
                                </p>

                                <p className="text-sm font-semibold text-text">
                                  {owner?.name ||
                                    "Community member"}
                                </p>
                              </div>
                            </div>

                            {owner?.village && (
                              <div className="flex items-center gap-2">
                                <MapPin
                                  size={17}
                                  className="text-muted"
                                />

                                <div>
                                  <p className="text-[11px] text-muted">
                                    Village
                                  </p>

                                  <p className="text-sm font-semibold text-text">
                                    {owner.village}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2">

                            <div className="rounded-xl bg-background px-4 py-3">
                              <div className="flex items-center gap-2 text-muted">
                                <CalendarDays size={14} />
                                <span className="text-xs">
                                  Expected return
                                </span>
                              </div>

                              <p className="mt-1 text-sm font-semibold text-text">
                                {formatDate(
                                  request.expectedReturnDate
                                )}
                              </p>
                            </div>

                            {request.borrowDate && (
                              <div className="rounded-xl bg-background px-4 py-3">
                                <div className="flex items-center gap-2 text-muted">
                                  <CalendarDays size={14} />

                                  <span className="text-xs">
                                    Borrowed on
                                  </span>
                                </div>

                                <p className="mt-1 text-sm font-semibold text-text">
                                  {formatDate(
                                    request.borrowDate
                                  )}
                                </p>
                              </div>
                            )}
                          </div>

                          {request.status === "Accepted" &&
                            owner?._id && (
                              <div className="mt-4">

                                {!contact ||
                                showContactFor !== request._id ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleViewContact(request)
                                    }
                                    disabled={
                                      loadingContactId ===
                                      request._id
                                    }
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    <Phone size={17} />

                                    {loadingContactId ===
                                    request._id
                                      ? "Loading Contact Details..."
                                      : "View Contact Details"}
                                  </button>
                                ) : (
                                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">

                                    <div className="mb-4 flex items-center justify-between">

                                      <div className="flex items-center gap-2">

                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                                          <Phone
                                            size={18}
                                            className="text-primary"
                                          />
                                        </div>

                                        <div>
                                          <p className="text-sm font-bold text-text">
                                            Owner Contact Details
                                          </p>

                                          <p className="text-xs text-muted">
                                            Contact the owner to arrange the borrowing.
                                          </p>
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setShowContactFor(null)
                                        }
                                        className="text-xs font-semibold text-muted transition hover:text-primary"
                                      >
                                        Hide
                                      </button>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">

                                      <div className="rounded-xl bg-white px-4 py-3">
                                        <p className="text-[11px] uppercase tracking-wide text-muted">
                                          Name
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-text">
                                          {contact.name ||
                                            "Not provided"}
                                        </p>
                                      </div>

                                      <div className="rounded-xl bg-white px-4 py-3">
                                        <p className="text-[11px] uppercase tracking-wide text-muted">
                                          Phone
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-text">
                                          {contact.phone ||
                                            "Not provided"}
                                        </p>
                                      </div>

                                      <div className="rounded-xl bg-white px-4 py-3">
                                        <p className="text-[11px] uppercase tracking-wide text-muted">
                                          Village
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-text">
                                          {contact.village ||
                                            "Not provided"}
                                        </p>
                                      </div>

                                      <div className="rounded-xl bg-white px-4 py-3 sm:col-span-2">
                                        <p className="text-[11px] uppercase tracking-wide text-muted">
                                          Address
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-text">
                                          {contact.address ||
                                            "Not provided"}
                                        </p>
                                      </div>

                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                          <div className="mt-4 flex flex-wrap gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/itemDetails/${item?._id}`
                                )
                              }
                              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary/30 hover:bg-primary/5"
                            >
                              View Item
                            </button>

                            {request.status === "Returned" && (
                              request.review?.exists ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openViewReview(request)
                                  }
                                  className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                                >
                                  <Eye size={17} />
                                  View Review
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openReviewModal(
                                      request,
                                      "item"
                                    )
                                  }
                                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
                                >
                                  <Star
                                    size={17}
                                    fill="currentColor"
                                  />

                                  Review Item
                                </button>
                              )
                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {sentRequests.length > 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllSent(!showAllSent)
                    }
                    className="mx-auto flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    {showAllSent
                      ? "Show Less"
                      : `View More (${sentRequests.length - 4} more)`}

                    {showAllSent ? (
                      <ChevronUp size={17} />
                    ) : (
                      <ChevronDown size={17} />
                    )}
                  </button>
                )}

              </div>
            )}
          </section>

          {}

          <section
            id="received-requests"
            className="mt-14"
          >

            <div className="mb-5 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Inbox size={20} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-text">
                    Received Requests
                  </h2>

                  <p className="mt-1 text-xs text-muted">
                    Requests from neighbours for your items
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {receivedRequests.length}
              </span>
            </div>

            {receivedRequests.length === 0 ? (
              <div className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-muted">
                  <Inbox size={25} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-text">
                  No received requests
                </h3>

                <p className="mt-2 text-sm text-muted">
                  No neighbours have requested your items yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">

                {latestReceivedRequests.map((request) => {

                  const statusStyle =
                    getStatusStyle(request.status);

                  const item = request.item;
                  const borrower = request.borrower;

                  return (
                    <div
                      key={request._id}
                      id={`request-${request._id}`}
                      className={`overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-500 ${
                        highlightedRequestId === request._id
                          ? "ring-2 ring-primary ring-offset-2 shadow-lg"
                          : ""
                      }`}
                    >

                      <div className="grid lg:grid-cols-[190px_1fr]">

                        <div className="aspect-[4/3] bg-background lg:aspect-auto">
                          {item?.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full min-h-[170px] items-center justify-center text-muted">
                              <Package size={42} />
                            </div>
                          )}
                        </div>

                        <div className="p-5">

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                BORROW REQUEST
                              </p>

                              <h3 className="mt-1 text-lg font-bold text-text">
                                {item?.title ||
                                  "Item unavailable"}
                              </h3>
                            </div>

                            <span
                              className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle.className}`}
                            >
                              {statusStyle.icon}
                              {request.status}
                            </span>
                          </div>

                          <div className="mt-4 rounded-2xl bg-background p-4">

                            <div className="flex flex-wrap gap-5">

                              <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <User size={18} />
                                </div>

                                <div>
                                  <p className="text-xs text-muted">
                                    Borrower
                                  </p>

                                  <p className="text-sm font-semibold text-text">
                                    {borrower?.name ||
                                      "Community member"}
                                  </p>
                                </div>
                              </div>

                              {borrower?.village && (
                                <div className="flex items-center gap-3">
                                  <MapPin
                                    size={17}
                                    className="text-muted"
                                  />

                                  <div>
                                    <p className="text-xs text-muted">
                                      Village
                                    </p>

                                    <p className="text-sm font-semibold text-text">
                                      {borrower.village}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {borrower?.phone && (
                                <div className="flex items-center gap-3">
                                  <Phone
                                    size={17}
                                    className="text-muted"
                                  />

                                  <div>
                                    <p className="text-xs text-muted">
                                      Phone
                                    </p>

                                    <p className="text-sm font-semibold text-text">
                                      {borrower.phone}
                                    </p>
                                  </div>
                                </div>
                              )}

                            </div>
                          </div>

                          {borrower?._id && (
                            <button
                              type="button"
                              onClick={() =>
                                openBorrowerReviews(borrower)
                              }
                              className="mt-3 text-sm font-semibold text-primary transition hover:underline"
                            >
                              View Borrower Reviews
                            </button>
                          )}

                          <div className="mt-4 rounded-xl bg-background px-4 py-3">

                            <div className="flex items-center gap-2 text-muted">
                              <CalendarDays size={14} />

                              <span className="text-xs">
                                Expected return
                              </span>
                            </div>

                            <p className="mt-1 text-sm font-semibold text-text">
                              {formatDate(
                                request.expectedReturnDate
                              )}
                            </p>
                          </div>

                          {request.message && (
                            <div className="mt-4 rounded-xl border border-border px-4 py-3">
                              <p className="text-xs font-semibold text-text">
                                Borrower's message
                              </p>

                              <p className="mt-1 text-sm leading-6 text-muted">
                                {request.message}
                              </p>
                            </div>
                          )}

                          {request.status === "Pending" && (
                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                              <button
                                type="button"
                                onClick={() =>
                                  handleAccept(
                                    request._id
                                  )
                                }
                                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:opacity-90"
                              >
                                <CheckCircle2 size={17} />
                                Accept Request
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleReject(
                                    request._id
                                  )
                                }
                                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                              >
                                <XCircle size={17} />
                                Reject
                              </button>

                            </div>
                          )}

                          {request.status === "Accepted" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleReturn(
                                  request._id
                                )
                              }
                              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                              <RotateCcw size={17} />
                              Confirm Item Returned
                            </button>
                          )}

                          {request.status === "Returned" && (
                            <div className="mt-5">

                              {request.review?.exists ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openViewReview(request)
                                  }
                                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                                >
                                  <Eye size={17} />
                                  View Review
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openReviewModal(
                                      request,
                                      "borrower"
                                    )
                                  }
                                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
                                >
                                  <Star
                                    size={17}
                                    fill="currentColor"
                                  />
                                  Review Borrower
                                </button>
                              )}

                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })}

                {receivedRequests.length > 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllReceived(
                        !showAllReceived
                      )
                    }
                    className="mx-auto flex items-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-text transition hover:border-primary/30 hover:bg-primary/5"
                  >
                    {showAllReceived
                      ? "Show Less"
                      : `View More (${receivedRequests.length - 4} more)`}

                    {showAllReceived ? (
                      <ChevronUp size={17} />
                    ) : (
                      <ChevronDown size={17} />
                    )}
                  </button>
                )}

              </div>
            )}
          </section>

        </div>
      </section>

      {}

      {showBorrowerReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-lg max-h-[85vh] overflow-hidden rounded-3xl bg-card shadow-xl">

            <div className="flex items-center justify-between border-b border-border px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-text">
                  Borrower Reviews
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {selectedBorrower?.name ||
                    "Community member"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeBorrowerReviews}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-background hover:text-text"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">

              {loadingBorrowerReviews ? (
                <div className="py-10 text-center">

                  <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

                  <p className="mt-4 text-sm text-muted">
                    Loading reviews...
                  </p>
                </div>
              ) : borrowerReviews?.totalReviews === 0 ? (
                <div className="py-10 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-muted">
                    <Star size={25} />
                  </div>

                  <p className="mt-4 text-sm text-muted">
                    No borrower reviews yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center gap-4 rounded-2xl bg-background p-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Star
                        size={24}
                        className="fill-accent text-accent"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-text">
                          {borrowerReviews?.averageRating || 0}
                        </span>

                        <span className="text-sm text-muted">
                          / 5
                        </span>
                      </div>

                      <p className="text-xs text-muted">
                        {borrowerReviews?.totalReviews || 0} review
                        {borrowerReviews?.totalReviews !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">

                    {borrowerReviews?.reviews?.map(
                      (review) => (
                        <div
                          key={review._id}
                          className="border-b border-border pb-5 last:border-0 last:pb-0"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div>
                              <p className="text-sm font-semibold text-text">
                                {review.reviewer?.name ||
                                  "Neighbour"}
                              </p>

                              <div className="mt-1 flex gap-1">

                                {[1, 2, 3, 4, 5].map(
                                  (star) => (
                                    <Star
                                      key={star}
                                      size={14}
                                      fill={
                                        star <= review.rating
                                          ? "currentColor"
                                          : "none"
                                      }
                                      className={
                                        star <= review.rating
                                          ? "text-accent"
                                          : "text-border"
                                      }
                                    />
                                  )
                                )}

                              </div>
                            </div>

                            {review.createdAt && (
                              <span className="shrink-0 text-xs text-muted">
                                {formatDate(
                                  review.createdAt
                                )}
                              </span>
                            )}

                          </div>

                          {review.review && (
                            <div className="mt-3 rounded-xl bg-background px-4 py-3">
                              <p className="text-sm leading-6 text-text">
                                "{review.review}"
                              </p>
                            </div>
                          )}

                          {review.item?.title && (
                            <p className="mt-2 text-xs text-muted">
                              Item: {review.item.title}
                            </p>
                          )}

                        </div>
                      )
                    )}

                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {}

      {showReviewModal && selectedRequest && (
        <ReviewModal
          request={selectedRequest}
          reviewType={reviewType}
          onClose={closeReviewModal}
          onSuccess={handleReviewSuccess}
        />
      )}

      {}

      {showViewReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md max-h-[85vh] overflow-hidden rounded-3xl bg-card shadow-xl">

            <div className="flex items-center justify-between border-b border-border px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-text">
                  Reviews
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {selectedReview?.item?.title ||
                    selectedReview?.borrower?.name ||
                    "Community Review"}
                </p>
              </div>

              <button
                type="button"
                onClick={closeViewReview}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-background hover:text-text"
              >
                <XCircle size={20} />
              </button>

            </div>

            <div className="max-h-[70vh] overflow-y-auto p-6">

              {loadingViewReview ? (
                <div className="py-10 text-center">

                  <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />

                  <p className="mt-4 text-sm text-muted">
                    Loading reviews...
                  </p>

                </div>
              ) : (
                <div className="space-y-5">

                  {/* ======================================
                      REVIEW GIVEN BY LOGGED-IN USER
                  ====================================== */}

                  {selectedReview?.givenReview && (
                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">

                      <div className="flex items-center justify-between gap-3">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            Your Review
                          </p>

                          <p className="mt-1 text-sm font-semibold text-text">
                            {selectedReview.givenReview.type ===
                            "item"
                              ? "Review about the item"
                              : "Review about the borrower"}
                          </p>
                        </div>

                        <div className="flex gap-1">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <Star
                                key={star}
                                size={17}
                                className={
                                  star <=
                                  selectedReview.givenReview
                                    .rating
                                    ? "text-accent"
                                    : "text-border"
                                }
                                fill={
                                  star <=
                                  selectedReview.givenReview
                                    .rating
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            )
                          )}

                        </div>

                      </div>

                      <div className="mt-4 rounded-xl bg-white p-4">

                        <p className="text-sm leading-6 text-text">
                          {selectedReview.givenReview.review ||
                            "No written review."}
                        </p>

                      </div>

                      {selectedReview.givenReview.createdAt && (
                        <p className="mt-3 text-xs text-muted">
                          Reviewed on{" "}
                          {formatDate(
                            selectedReview.givenReview
                              .createdAt
                          )}
                        </p>
                      )}

                    </div>
                  )}

                  {/* ======================================
                      REVIEW RECEIVED BY LOGGED-IN USER
                  ====================================== */}

                  {selectedReview?.receivedReview && (
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-5">

                      <div className="flex items-center justify-between gap-3">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                            Review You Received
                          </p>

                          <p className="mt-1 text-sm font-semibold text-text">
                            {selectedReview.receivedReview
                              .type === "item"
                              ? "Review about your item"
                              : "Review about you as a borrower"}
                          </p>
                        </div>

                        <div className="flex gap-1">

                          {[1, 2, 3, 4, 5].map(
                            (star) => (
                              <Star
                                key={star}
                                size={17}
                                className={
                                  star <=
                                  selectedReview.receivedReview
                                    .rating
                                    ? "text-accent"
                                    : "text-border"
                                }
                                fill={
                                  star <=
                                  selectedReview.receivedReview
                                    .rating
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            )
                          )}

                        </div>

                      </div>

                      <div className="mt-4 flex items-center gap-2">

                        <User
                          size={16}
                          className="text-green-700"
                        />

                        <p className="text-xs text-muted">
                          Reviewed by{" "}
                          <span className="font-semibold text-text">
                            {selectedReview.receivedReview
                              .reviewer?.name ||
                              "Neighbour"}
                          </span>
                        </p>

                      </div>

                      <div className="mt-4 rounded-xl bg-white p-4">

                        <p className="text-sm leading-6 text-text">
                          {selectedReview.receivedReview
                            .review ||
                            "No written review."}
                        </p>

                      </div>

                      {selectedReview.receivedReview
                        .createdAt && (
                        <p className="mt-3 text-xs text-muted">
                          Received on{" "}
                          {formatDate(
                            selectedReview.receivedReview
                              .createdAt
                          )}
                        </p>
                      )}

                    </div>
                  )}

                  {/* ======================================
                      NO REVIEWS
                  ====================================== */}

                  {!selectedReview?.givenReview &&
                    !selectedReview?.receivedReview && (
                      <div className="py-8 text-center">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-muted">
                          <Star size={25} />
                        </div>

                        <p className="mt-4 text-sm text-muted">
                          No reviews found for this request.
                        </p>

                      </div>
                    )}

                  <button
                    type="button"
                    onClick={closeViewReview}
                    className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Close
                  </button>

                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </main>
  );
}

export default MyRequests;