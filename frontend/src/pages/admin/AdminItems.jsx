import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import {
  Package,
  Trash2,
  Search,
  Eye,
  X,
  User,
  Calendar,
  Tag,
  CircleCheck,
  CircleX,
  Mail,
  ClipboardList,
  Star,
} from "lucide-react";

function AdminItems() {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingOwner, setLoadingOwner] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ==============================
  // PAGINATION
  // ==============================
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const token = localStorage.getItem("token");

  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://https://neighbourshare-i2wq.onrender.com/api/getItems"
      );

      setItems(response.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleViewOwner = async (ownerId, itemId) => {
    if (!ownerId) {
      alert("Owner information not available");
      return;
    }

    try {
      setLoadingOwner(itemId);

      const response = await axios.get(
        `http://https://neighbourshare-i2wq.onrender.com/api/admin/users/${ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const reviewsResponse = await axios.get(
        `http://https://neighbourshare-i2wq.onrender.com/api/userReview/${ownerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedOwner({
        ...response.data,
        reviews: reviewsResponse.data.reviews || [],
        averageRating:
          reviewsResponse.data.averageRating || 0,
        totalReviews:
          reviewsResponse.data.totalReviews || 0,
      });
    } catch (error) {
      console.error("Error fetching owner:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to load owner details."
      );
    } finally {
      setLoadingOwner(null);
    }
  };

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      await axios.delete(
        `http://https://neighbourshare-i2wq.onrender.com/api/admin/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems((prevItems) =>
        prevItems.filter(
          (item) => item._id !== itemId
        )
      );

      if (selectedItem?._id === itemId) {
        setSelectedItem(null);
      }

      alert("Item deleted successfully.");
    } catch (error) {
      console.error("Error deleting item:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to delete item."
      );
    } finally {
      setDeleting(false);
    }
  };

  // ==============================
  // FILTER ITEMS
  // ==============================

  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase().trim();

    const ownerId =
      item.owner?._id?.toString() ||
      item.owner?.toString();

    const matchesUser = userId
      ? ownerId === userId
      : true;

    const itemTitle =
      item.title?.toLowerCase() || "";

    const category =
      item.category?.toLowerCase() || "";

    const description =
      item.description?.toLowerCase() || "";

    const condition =
      item.condition?.toLowerCase() || "";

    const ownerName =
      typeof item.owner === "object"
        ? item.owner?.name?.toLowerCase() || ""
        : "";

    const ownerEmail =
      typeof item.owner === "object"
        ? item.owner?.email?.toLowerCase() || ""
        : "";

    const matchesSearch =
      itemTitle.includes(searchText) ||
      category.includes(searchText) ||
      description.includes(searchText) ||
      condition.includes(searchText) ||
      ownerName.includes(searchText) ||
      ownerEmail.includes(searchText);

    return matchesUser && matchesSearch;
  });

  // ==============================
  // PAGINATION
  // ==============================

  const totalPages = Math.ceil(
    filteredItems.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedItems = filteredItems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-muted">
            Loading items...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-8">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">

                <Package
                  size={23}
                  className="text-primary"
                />

              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold text-text">
                  {userId
                    ? "User Items"
                    : "All Items"}
                </h1>

                <p className="text-muted text-sm mt-1">
                  {userId
                    ? "Items listed by this community member"
                    : "Manage all items listed by community members"}
                </p>

              </div>

            </div>

          </div>

          <div className="relative w-full lg:w-80">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              placeholder="Search items or owner..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-text placeholder:text-muted outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />

          </div>

        </div>

      </div>

      {/* ==========================================
          ITEM COUNT
      ========================================== */}

      <div className="mb-5">

        <p className="text-sm text-muted">
          Showing{" "}

          <span className="font-semibold text-text">
            {filteredItems.length}
          </span>{" "}

          {filteredItems.length === 1
            ? "item"
            : "items"}

        </p>

      </div>

      {/* ==========================================
          NO ITEMS
      ========================================== */}

      {filteredItems.length === 0 ? (

        <div className="bg-card border border-border rounded-3xl p-12 text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-background flex items-center justify-center mb-4">

            <Package
              size={30}
              className="text-muted"
            />

          </div>

          <h2 className="text-lg font-semibold text-text mb-2">
            No items found
          </h2>

          <p className="text-sm text-muted">
            {search
              ? "Try changing your search."
              : userId
              ? "This user has not listed any items."
              : "There are no items listed yet."}
          </p>

        </div>

      ) : (

        <>
          {/* ==========================================
              ITEMS GRID
          ========================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

            {paginatedItems.map((item) => {

              const ownerId =
                item.owner?._id || item.owner;

              return (

                <div
                  key={item._id}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition"
                >

                  {/* IMAGE */}

                  <div className="relative">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-44 object-cover"
                      />

                    ) : (

                      <div className="w-full h-44 bg-background flex items-center justify-center">

                        <Package
                          size={42}
                          className="text-muted"
                        />

                      </div>

                    )}

                    {/* AVAILABILITY */}

                    <div className="absolute top-3 right-3">

                      {item.availability === "Available" ? (

                        <span className="flex items-center gap-1 bg-success text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">

                          <CircleCheck size={12} />

                          Available

                        </span>

                      ) : (

                        <span className="flex items-center gap-1 bg-danger text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">

                          <CircleX size={12} />

                          Borrowed

                        </span>

                      )}

                    </div>

                  </div>

                  {/* ITEM CONTENT */}

                  <div className="p-4">

                    <h2 className="font-bold text-text text-base truncate">
                      {item.title}
                    </h2>

                    <div className="flex items-center gap-1.5 mt-2">

                      <Tag
                        size={14}
                        className="text-primary"
                      />

                      <span className="text-xs text-muted truncate">
                        {item.category || "No category"}
                      </span>

                    </div>

                    <p className="text-xs text-muted mt-2 line-clamp-2 min-h-[32px]">
                      {item.description ||
                        "No description available."}
                    </p>

                    {/* CONDITION */}

                    <div className="mt-3">

                      <span className="text-[11px] text-muted">
                        Condition
                      </span>

                      <p className="text-sm font-medium text-text truncate">
                        {item.condition ||
                          "Not specified"}
                      </p>

                    </div>

                    {/* VIEW OWNER */}

                    <button
                      onClick={() =>
                        handleViewOwner(
                          ownerId,
                          item._id
                        )
                      }
                      disabled={
                        !ownerId ||
                        loadingOwner === item._id
                      }
                      className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary-dark transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                      <User size={15} />

                      {loadingOwner === item._id
                        ? "Loading..."
                        : "View Owner"}

                    </button>

                    {/* VIEW + DELETE */}

                    <div className="flex items-center gap-2 mt-2">

                      <button
                        onClick={() =>
                          setSelectedItem(item)
                        }
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border text-text hover:bg-background transition text-sm font-medium"
                      >

                        <Eye size={16} />

                        View

                      </button>

                      <button
                        onClick={() =>
                          handleDelete(item._id)
                        }
                        disabled={deleting}
                        title="Delete item"
                        className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-danger text-white hover:opacity-90 transition disabled:opacity-50"
                      >

                        <Trash2 size={15} />

                      </button>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

          {/* ==========================================
              PAGINATION
          ========================================== */}

          {totalPages > 1 && (

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
                    Math.min(
                      prev + 1,
                      totalPages
                    )
                  )
                }
                disabled={currentPage === totalPages}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium transition hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                More
              </button>

            </div>

          )}

        </>

      )}

      {/* ==================================================
          ITEM DETAILS MODAL
      ================================================== */}

      {selectedItem && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-card rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">

                  <Package
                    size={20}
                    className="text-primary"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-text">
                    Item Details
                  </h2>

                  <p className="text-xs text-muted">
                    Complete item information
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedItem(null)
                }
                className="w-9 h-9 rounded-xl hover:bg-background flex items-center justify-center"
              >

                <X size={19} />

              </button>

            </div>

            <div className="p-6">

              {selectedItem.image && (

                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-64 object-cover rounded-2xl mb-6"
                />

              )}

              <h3 className="text-2xl font-bold text-text">
                {selectedItem.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                <div className="bg-background rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted mb-1">

                    <Tag size={15} />

                    <span className="text-xs">
                      Category
                    </span>

                  </div>

                  <p className="font-semibold text-text">
                    {selectedItem.category ||
                      "Not specified"}
                  </p>

                </div>

                <div className="bg-background rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted mb-1">

                    <Package size={15} />

                    <span className="text-xs">
                      Condition
                    </span>

                  </div>

                  <p className="font-semibold text-text">
                    {selectedItem.condition ||
                      "Not specified"}
                  </p>

                </div>

                <div className="bg-background rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted mb-1">

                    {selectedItem.availability ===
                    "Available" ? (
                      <CircleCheck size={15} />
                    ) : (
                      <CircleX size={15} />
                    )}

                    <span className="text-xs">
                      Availability
                    </span>

                  </div>

                  <p className="font-semibold text-text">
                    {selectedItem.availability ||
                      "Not specified"}
                  </p>

                </div>

                <div className="bg-background rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted mb-1">

                    <ClipboardList size={15} />

                    <span className="text-xs">
                      Item ID
                    </span>

                  </div>

                  <p className="font-medium text-text text-xs break-all">
                    {selectedItem._id}
                  </p>

                </div>

              </div>

              <div className="mt-5">

                <h4 className="font-semibold text-text mb-2">
                  Description
                </h4>

                <div className="bg-background rounded-2xl p-4 text-sm text-muted leading-6">
                  {selectedItem.description ||
                    "No description available."}
                </div>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ==================================================
          OWNER DETAILS MODAL
      ================================================== */}

      {selectedOwner && (

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-card rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">

                  <User
                    size={20}
                    className="text-primary"
                  />

                </div>

                <div>

                  <h2 className="text-lg font-bold text-text">
                    Owner Details
                  </h2>

                  <p className="text-xs text-muted">
                    Complete owner information
                  </p>

                </div>

              </div>

              <button
                onClick={() =>
                  setSelectedOwner(null)
                }
                className="w-9 h-9 rounded-xl hover:bg-background flex items-center justify-center"
              >

                <X size={19} />

              </button>

            </div>

            <div className="p-6">

              {/* OWNER INFO */}

              <div className="bg-background rounded-2xl p-5">

                <div className="flex items-center gap-4">

                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">

                    {selectedOwner.user?.name
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}

                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-text">
                      {selectedOwner.user?.name ||
                        "Unknown User"}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted mt-1">

                      <Mail size={14} />

                      {selectedOwner.user?.email ||
                        "No email"}

                    </div>

                  </div>

                </div>

              </div>

              {/* OWNER STATS */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">

                <div className="border border-border rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted">

                    <Package size={16} />

                    <span className="text-xs">
                      My Items
                    </span>

                  </div>

                  <p className="text-2xl font-bold text-text mt-2">
                    {selectedOwner.items?.length || 0}
                  </p>

                </div>

                <div className="border border-border rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted">

                    <ClipboardList size={16} />

                    <span className="text-xs">
                      Received Requests
                    </span>

                  </div>

                  <p className="text-2xl font-bold text-text mt-2">
                    {selectedOwner.receivedRequests
                      ?.length || 0}
                  </p>

                </div>

                <div className="border border-border rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted">

                    <Star size={16} />

                    <span className="text-xs">
                      Reviews
                    </span>

                  </div>

                  <p className="text-2xl font-bold text-text mt-2">
                    {selectedOwner.reviews?.length || 0}
                  </p>

                </div>

              </div>

              {/* OWNER ITEMS */}

              <div className="mt-7">

                <div className="flex items-center gap-2 mb-4">

                  <Package
                    size={18}
                    className="text-primary"
                  />

                  <h3 className="font-bold text-text">
                    Owner's Items
                  </h3>

                </div>

                {selectedOwner.items?.length > 0 ? (

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {selectedOwner.items.map(
                      (ownerItem) => (

                        <div
                          key={ownerItem._id}
                          className="border border-border rounded-2xl p-4"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <h4 className="font-semibold text-text">
                                {ownerItem.title}
                              </h4>

                              <p className="text-xs text-muted mt-1">
                                {ownerItem.category ||
                                  "No category"}
                              </p>

                            </div>

                            <span
                              className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                                ownerItem.availability ===
                                "Available"
                                  ? "bg-success/10 text-success"
                                  : "bg-danger/10 text-danger"
                              }`}
                            >
                              {ownerItem.availability ||
                                "Unknown"}
                            </span>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-muted bg-background rounded-2xl p-4">
                    No items found.
                  </p>

                )}

              </div>

              {/* REVIEWS */}

              <div className="mt-7">

                <div className="flex items-center gap-2 mb-4">

                  <Star
                    size={18}
                    className="text-accent"
                  />

                  <h3 className="font-bold text-text">
                    Reviews
                  </h3>

                </div>

                {selectedOwner.reviews?.length > 0 ? (

                  <div className="space-y-3">

                    {selectedOwner.reviews.map(
                      (review) => (

                        <div
                          key={review._id}
                          className="border border-border rounded-2xl p-4"
                        >

                          <div className="flex items-center justify-between gap-3">

                            <div>

                              <p className="font-semibold text-text text-sm">
                                {review.reviewer?.name ||
                                  "Anonymous"}
                              </p>

                              <div className="flex items-center gap-1 mt-1">

                                {[1, 2, 3, 4, 5].map(
                                  (star) => (

                                    <Star
                                      key={star}
                                      size={13}
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
                                          : "text-muted"
                                      }
                                    />

                                  )
                                )}

                              </div>

                            </div>

                            <span className="text-xs text-muted">
                              {review.type}
                            </span>

                          </div>

                          {review.review && (

                            <p className="text-sm text-muted mt-3 leading-6">
                              {review.review}
                            </p>

                          )}

                        </div>

                      )
                    )}

                  </div>

                ) : (

                  <p className="text-sm text-muted bg-background rounded-2xl p-4">
                    No reviews available.
                  </p>

                )}

              </div>

              {/* REQUEST STATS */}

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="border border-border rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted mb-2">

                    <Calendar size={16} />

                    <span className="text-xs">
                      Requests Received
                    </span>

                  </div>

                  <p className="text-xl font-bold text-text">
                    {selectedOwner.receivedRequests
                      ?.length || 0}
                  </p>

                </div>

                <div className="border border-border rounded-2xl p-4">

                  <div className="flex items-center gap-2 text-muted mb-2">

                    <Calendar size={16} />

                    <span className="text-xs">
                      Requests Sent
                    </span>

                  </div>

                  <p className="text-xl font-bold text-text">
                    {selectedOwner.sentRequests
                      ?.length || 0}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminItems;