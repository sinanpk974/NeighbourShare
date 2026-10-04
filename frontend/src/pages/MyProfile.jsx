import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Package,
  HandCoins,
  Send,
  Inbox,
  Star,
  Pencil,
  Trash2,
  LogOut,
  ShieldCheck,
  Clock,
  X,
  ChevronRight,
} from "lucide-react";

function MyProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [myItems, setMyItems] = useState([]);

  const [myRequests, setMyRequests] = useState([]);

  const [receivedRequests, setReceivedRequests] = useState([]);

  const [reviews, setReviews] = useState({
    borrowerReviews: [],
    itemReviews: [],
    borrowerRating: 0,
    borrowerReviewCount: 0,
    itemRating: 0,
    itemReviewCount: 0,
    totalReviews: 0,
  });

  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [deleting, setDeleting] = useState(false);

  const [showAllReviews, setShowAllReviews] =
    useState(false);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);

      const [
        profileResponse,
        itemsResponse,
        requestsResponse,
        receivedResponse,
        reviewsResponse,
      ] = await Promise.all([
        axios.get(
          "http://https://neighbourshare-i2wq.onrender.com/api/myProfile",
          {
            headers,
          }
        ),
        axios.get(
          "http://https://neighbourshare-i2wq.onrender.com/api/myItems",
          {
            headers,
          }
        ),
        axios.get(
          "http://https://neighbourshare-i2wq.onrender.com/api/myRequests",
          {
            headers,
          }
        ),
        axios.get(
          "http://https://neighbourshare-i2wq.onrender.com/api/receivedRequests",
          {
            headers,
          }
        ),
        axios.get(
          "http://https://neighbourshare-i2wq.onrender.com/api/myReviews",
          {
            headers,
          }
        ),
      ]);

      setUser(profileResponse.data);

      setMyItems(itemsResponse.data);

      setMyRequests(requestsResponse.data);

      setReceivedRequests(receivedResponse.data);

      setReviews(reviewsResponse.data);

    } catch (err) {
      console.log("Profile loading error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");

        navigate("/login");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfileData();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);

      const response = await axios.delete(
        "http://https://neighbourshare-i2wq.onrender.com/api/deleteAccount",
        {
          headers,
        }
      );

      alert(response.data.msg);

      setShowDeleteModal(false);
      await fetchProfileData();

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.msg ||
          "Unable to send deletion request"
      );

    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };
  const borrowedItemsCount = myRequests.filter(
    (request) =>
      request.status === "Accepted"
  ).length;

  const allReviews = [
    ...reviews.borrowerReviews.map(
      (review) => ({
        ...review,
        reviewType: "Borrower",
      })
    ),

    ...reviews.itemReviews.map(
      (review) => ({
        ...review,
        reviewType: "Item",
      })
    ),
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-muted">
            Loading profile...
          </p>

        </div>

      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">

        <p className="text-muted">
          Unable to load profile.
        </p>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      {}
      {}
      {}

      <div className="max-w-6xl mx-auto px-4 py-8 pb-12 sm:px-6 lg:px-8">

        {}
        {}
        {}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <p className="text-sm font-semibold text-primary tracking-wide">
              NEIGHBOURSHARE
            </p>

            <h1 className="text-3xl font-bold text-text mt-1">
              My Profile
            </h1>

            <p className="text-muted mt-1">
              Manage your community sharing account
            </p>

          </div>

          <div className="flex gap-3">

            {}

            <button
              onClick={() =>
                navigate("/editProfile")
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition shadow-sm"
            >

              <Pencil size={17} />

              Edit Profile

            </button>

            {}

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-text hover:bg-background transition"
            >

              <LogOut size={17} />

              Logout

            </button>

          </div>

        </div>

        {}
        {}
        {}

        <div className="bg-card rounded-3xl border border-border shadow-sm">

          {}

          <div className="h-32 bg-primary relative overflow-hidden rounded-t-3xl">

            <div className="absolute -right-10 -top-20 w-64 h-64 rounded-full bg-primary-dark opacity-50"></div>

            <div className="absolute right-40 -bottom-20 w-48 h-48 rounded-full bg-primary-dark opacity-30"></div>

          </div>

          {}

          <div className="px-6 sm:px-8 pb-8">

            <div className="-mt-16 relative z-10 flex flex-col sm:flex-row sm:items-end gap-5">

              <div className="w-32 h-32 rounded-full border-4 border-card bg-background overflow-hidden shadow-md">

                {user.profileImage ? (

                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center">

                    <User
                      size={55}
                      className="text-muted"
                    />

                  </div>

                )}

              </div>

              {}

              <div className="pb-1">

                <div className="flex items-center gap-2">

                  <h2 className="text-2xl font-bold text-text">
                    {user.name}
                  </h2>

                  {user.isverified && (

                    <ShieldCheck
                      size={21}
                      className="text-success"
                    />

                  )}

                </div>

                <p className="text-muted">
                  NeighbourShare Member
                </p>

              </div>

            </div>

            {}
            {}
            {}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

              {}

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">

                  <Mail
                    size={19}
                    className="text-primary"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-muted">
                    Email
                  </p>

                  <p className="text-text break-all mt-1">
                    {user.email}
                  </p>

                </div>

              </div>

              {}

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">

                  <Phone
                    size={19}
                    className="text-primary"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-muted">
                    Phone
                  </p>

                  <p className="text-text mt-1">
                    {user.phone ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {}

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">

                  <Home
                    size={19}
                    className="text-primary"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-muted">
                    Village
                  </p>

                  <p className="text-text mt-1">
                    {user.village ||
                      "Not provided"}
                  </p>

                </div>

              </div>

              {}

              <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-3">

                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0">

                  <MapPin
                    size={19}
                    className="text-primary"
                  />

                </div>

                <div>

                  <p className="text-xs uppercase tracking-wide text-muted">
                    Address
                  </p>

                  <p className="text-text mt-1">
                    {user.address ||
                      "Not provided"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {}
        {}
        {}

        {user.deletionStatus ===
          "Pending" && (

          <div className="mt-6 bg-[#FFF7E6] border border-[#FCD34D] rounded-2xl p-5 flex items-start gap-4">

            <Clock
              size={22}
              className="text-accent mt-0.5 shrink-0"
            />

            <div>

              <h3 className="font-semibold text-text">
                Deletion request pending
              </h3>

              <p className="text-sm text-muted mt-1">
                Your account deletion request has
                been sent to the admin. Your account
                will remain active until the admin
                makes a decision.
              </p>

            </div>

          </div>

        )}

        {user.deletionStatus ===
          "Rejected" && (

          <div className="mt-6 bg-card border border-danger/30 rounded-2xl p-5">

            <h3 className="font-semibold text-danger">
              Deletion request rejected
            </h3>

            <p className="text-sm text-muted mt-1">
              Your previous account deletion request
              was rejected by the admin.
            </p>

          </div>

        )}

        {}
        {}
        {}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">

          {}

          <button
            onClick={() =>
              navigate("/myitems")
            }
            className="group bg-card border border-border rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-md transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center">

                <Package
                  size={22}
                  className="text-primary"
                />

              </div>

              <div className="flex items-center gap-1">

                <span className="text-2xl font-bold text-text">
                  {myItems.length}
                </span>

                <ChevronRight
                  size={18}
                  className="text-muted group-hover:text-primary transition"
                />

              </div>

            </div>

            <p className="font-semibold text-text mt-4">
              My Items
            </p>

            <p className="text-sm text-muted mt-1">
              Items you provide
            </p>

          </button>

          {}

          <button
            onClick={() =>
              navigate("/myRequests")
            }
            className="group bg-card border border-border rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-md transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center">

                <HandCoins
                  size={22}
                  className="text-primary"
                />

              </div>

              <div className="flex items-center gap-1">

                <span className="text-2xl font-bold text-text">
                  {borrowedItemsCount}
                </span>

                <ChevronRight
                  size={18}
                  className="text-muted group-hover:text-primary transition"
                />

              </div>

            </div>

            <p className="font-semibold text-text mt-4">
              Borrowed Items
            </p>

            <p className="text-sm text-muted mt-1">
              Currently borrowed
            </p>

          </button>

          {}

          <button
            onClick={() =>
              navigate("/myRequests")
            }
            className="group bg-card border border-border rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-md transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center">

                <Send
                  size={22}
                  className="text-primary"
                />

              </div>

              <div className="flex items-center gap-1">

                <span className="text-2xl font-bold text-text">
                  {myRequests.length}
                </span>

                <ChevronRight
                  size={18}
                  className="text-muted group-hover:text-primary transition"
                />

              </div>

            </div>

            <p className="font-semibold text-text mt-4">
              Sent Requests
            </p>

            <p className="text-sm text-muted mt-1">
              Requests you sent
            </p>

          </button>

          {}

          <button
            onClick={() =>
              navigate("/myRequests")
            }
            className="group bg-card border border-border rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-md transition"
          >

            <div className="flex items-center justify-between">

              <div className="w-11 h-11 rounded-xl bg-background border border-border flex items-center justify-center">

                <Inbox
                  size={22}
                  className="text-primary"
                />

              </div>

              <div className="flex items-center gap-1">

                <span className="text-2xl font-bold text-text">
                  {receivedRequests.length}
                </span>

                <ChevronRight
                  size={18}
                  className="text-muted group-hover:text-primary transition"
                />

              </div>

            </div>

            <p className="font-semibold text-text mt-4">
              Received Requests
            </p>

            <p className="text-sm text-muted mt-1">
              Requests from neighbours
            </p>

          </button>

        </div>

        {}
        {}
        {}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">

          {}

          <div className="bg-card border border-border rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted">
                  Borrower Rating
                </p>

                <div className="flex items-center gap-3 mt-3">

                  <span className="text-3xl font-bold text-text">
                    {reviews.borrowerRating}
                  </span>

                  <div>

                    <div className="flex gap-1">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (

                          <Star
                            key={star}
                            size={18}
                            fill={
                              star <=
                              Math.round(
                                reviews.borrowerRating
                              )
                                ? "currentColor"
                                : "none"
                            }
                            className={
                              star <=
                              Math.round(
                                reviews.borrowerRating
                              )
                                ? "text-accent"
                                : "text-border"
                            }
                          />

                        )
                      )}

                    </div>

                    <p className="text-xs text-muted mt-1">
                      {
                        reviews.borrowerReviewCount
                      }{" "}
                      reviews
                    </p>

                  </div>

                </div>

              </div>

              <div className="w-12 h-12 rounded-xl bg-[#FFF7E6] flex items-center justify-center">

                <Star
                  size={23}
                  className="text-accent"
                  fill="currentColor"
                />

              </div>

            </div>

          </div>

          {}

          <div className="bg-card border border-border rounded-2xl p-6">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-muted">
                  My Items Rating
                </p>

                <div className="flex items-center gap-3 mt-3">

                  <span className="text-3xl font-bold text-text">
                    {reviews.itemRating}
                  </span>

                  <div>

                    <div className="flex gap-1">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (

                          <Star
                            key={star}
                            size={18}
                            fill={
                              star <=
                              Math.round(
                                reviews.itemRating
                              )
                                ? "currentColor"
                                : "none"
                            }
                            className={
                              star <=
                              Math.round(
                                reviews.itemRating
                              )
                                ? "text-accent"
                                : "text-border"
                            }
                          />

                        )
                      )}

                    </div>

                    <p className="text-xs text-muted mt-1">
                      {reviews.itemReviewCount}{" "}
                      reviews
                    </p>

                  </div>

                </div>

              </div>

              <div className="w-12 h-12 rounded-xl bg-[#FFF7E6] flex items-center justify-center">

                <Package
                  size={23}
                  className="text-accent"
                />

              </div>

            </div>

          </div>

        </div>

        {}
        {}
        {}

        <div className="bg-card border border-border rounded-3xl mt-8 p-6 sm:p-8">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-xl font-bold text-text flex items-center gap-2">

                <Star
                  size={21}
                  className="text-accent"
                  fill="currentColor"
                />

                Reviews About Me

              </h2>

              <p className="text-sm text-muted mt-1">
                What your neighbours say about you
              </p>

            </div>

            <span className="text-sm font-medium text-primary bg-background border border-border px-3 py-1.5 rounded-full">
              {reviews.totalReviews} total
            </span>

          </div>

          {}

          {allReviews.length === 0 ? (

            <div className="py-10 text-center">

              <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center mx-auto">

                <Star
                  size={28}
                  className="text-muted"
                />

              </div>

              <p className="text-muted mt-3">
                No reviews yet
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {(showAllReviews
                ? allReviews
                : allReviews.slice(0, 4)
              ).map(
                (review) => (

                  <div
                    key={review._id}
                    className="border-b border-border pb-5 last:border-0 last:pb-0"
                  >

                    {}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        {}

                        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center overflow-hidden">

                          {review.reviewer?.profileImage ? (

                            <img
                              src={review.reviewer.profileImage}
                              alt={
                                review.reviewer?.name ||
                                "Neighbour"
                              }
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <User
                              size={19}
                              className="text-primary"
                            />

                          )}

                        </div>

                        <div>

                          <p className="font-semibold text-text">
                            {review.reviewer?.name ||
                              "Neighbour"}
                          </p>

                          {}

                          <div className="flex gap-1 mt-1">

                            {[1, 2, 3, 4, 5].map(
                              (star) => (

                                <Star
                                  key={star}
                                  size={14}
                                  fill={
                                    star <=
                                    review.rating
                                      ? "currentColor"
                                      : "none"
                                  }
                                  className={
                                    star <=
                                    review.rating
                                      ? "text-accent"
                                      : "text-border"
                                  }
                                />

                              )
                            )}

                          </div>

                        </div>

                      </div>

                      {}

                      <span className="text-xs px-2.5 py-1 rounded-full bg-background border border-border text-primary capitalize">
                        {review.reviewType}
                      </span>

                    </div>

                    {}

                    {review.item?.title && (

                      <p className="text-xs text-muted mt-3">
                        Item:{" "}
                        {review.item.title}
                      </p>

                    )}

                    {}

                    {review.review && (

                      <div className="mt-3 bg-background border border-border rounded-xl px-4 py-3">

                        <p className="text-sm text-text leading-relaxed">
                          "{review.review}"
                        </p>

                      </div>

                    )}

                    {}

                    {review.createdAt && (

                      <p className="text-xs text-muted mt-3">
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                      </p>

                    )}

                  </div>

                )
              )}

              {}

              {allReviews.length > 4 && (

                <div className="text-center pt-2">

                  <button
                    onClick={() =>
                      setShowAllReviews(
                        !showAllReviews
                      )
                    }
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {showAllReviews
                      ? "Show Less"
                      : `View More (${allReviews.length - 4} more)`}
                  </button>

                </div>

              )}

            </div>

          )}

        </div>

        {}
        {}
        {}

        <div className="mt-8 bg-card border border-danger/30 rounded-3xl p-6 sm:p-8">

          <h2 className="text-lg font-bold text-danger">
            Danger Zone
          </h2>

          <p className="text-sm text-muted mt-1">
            Account deletion requires admin approval.
          </p>

          <button
            onClick={() =>
              setShowDeleteModal(true)
            }
            disabled={
              user.deletionStatus ===
              "Pending"
            }
            className="mt-5 flex items-center gap-2 px-5 py-3 rounded-xl border border-danger/40 text-danger hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >

            <Trash2 size={18} />

            {user.deletionStatus ===
            "Pending"
              ? "Deletion Request Pending"
              : "Request Account Deletion"}

          </button>

        </div>

      </div>

      {}
      {}
      {}

      {showDeleteModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">

          <div className="bg-card rounded-3xl w-full max-w-md p-6 shadow-xl">

            {}

            <div className="flex items-center justify-between">

              <h2 className="text-xl font-bold text-text">
                Request Account Deletion
              </h2>

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="w-9 h-9 rounded-full hover:bg-background flex items-center justify-center"
              >

                <X size={20} />

              </button>

            </div>

            {}

            <div className="mt-5">

              <p className="text-text leading-relaxed">
                Are you sure you want to request
                deletion of your account?
              </p>

              <p className="text-sm text-muted mt-3">
                Your account will not be deleted
                immediately. An admin will review
                your request. If you have active
                borrowed items, the request may be
                rejected.
              </p>

            </div>

            {}

            <div className="flex gap-3 mt-7">

              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="flex-1 px-4 py-3 rounded-xl border border-border text-text hover:bg-background transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-xl bg-danger text-white hover:opacity-90 transition disabled:opacity-50"
              >

                {deleting
                  ? "Sending..."
                  : "Request Deletion"}

              </button>

            </div>

          </div>

        </div>

      )}

      {}
      {}
      {}

      <Footer />

    </div>
  );
}

export default MyProfile;