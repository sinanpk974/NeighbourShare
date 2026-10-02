import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import {
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Save,
  MessageSquare,
  Package,
} from "lucide-react";

function MyItems() {
  const token = localStorage.getItem("token");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewItem, setReviewItem] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    condition: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  // ==============================
  // PAGINATION
  // ==============================

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedItems = items.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ==============================
  // FETCH MY ITEMS
  // ==============================

  const fetchMyItems = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:3003/api/myItems",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(response.data);
    } catch (err) {
      console.log("Get my items error:", err);

      setError(
        err.response?.data?.msg ||
          "Unable to load your items."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
  }, []);

  // Reset pagination when items count changes
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Prevent page from going beyond available pages
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // ==============================
  // FORM
  // ==============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      image: "",
      condition: "",
    });

    setEditingItem(null);
    setShowAddForm(false);
  };

  // ==============================
  // ADD ITEM
  // ==============================

  const handleAddItem = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.condition
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      await axios.post(
        "http://localhost:3003/api/addItem",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Item added successfully.");

      resetForm();

      await fetchMyItems();
    } catch (err) {
      console.log("Add item error:", err);

      setError(
        err.response?.data?.msg ||
          "Unable to add item."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // EDIT ITEM
  // ==============================

  const handleEdit = (item) => {
    setEditingItem(item);

    setFormData({
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      image: item.image || "",
      condition: item.condition || "",
    });

    setShowAddForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==============================
  // UPDATE ITEM
  // ==============================

  const handleUpdateItem = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.condition
    ) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      await axios.patch(
        `http://localhost:3003/api/updateItem/${editingItem._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Item updated successfully.");

      resetForm();

      await fetchMyItems();
    } catch (err) {
      console.log("Update item error:", err);

      setError(
        err.response?.data?.msg ||
          "Unable to update item."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // DELETE ITEM
  // ==============================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await axios.delete(
        `http://localhost:3003/api/deleteItem/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Item deleted successfully.");

      await fetchMyItems();
    } catch (err) {
      console.log("Delete item error:", err);

      setError(
        err.response?.data?.msg ||
          "Unable to delete item."
      );
    }
  };

  // ==============================
  // VIEW REVIEWS
  // ==============================

  const handleViewReviews = async (item) => {
    try {
      setReviewLoading(true);
      setReviewItem(item);
      setReviews([]);

      const response = await axios.get(
        `http://localhost:3003/api/itemReview/${item._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(response.data.reviews || []);
    } catch (err) {
      console.log("Get reviews error:", err);

      setError(
        err.response?.data?.msg ||
          "Unable to load reviews."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted">
          Loading your items...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">

      {/* ======================================
          HEADER
      ====================================== */}

      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

            <div>

              <p className="text-sm font-semibold text-primary">
                MY ITEMS
              </p>

              <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">
                Items you share
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Manage the items you share with your
                neighbourhood.
              </p>

            </div>

            <button
              type="button"
              onClick={() => {
                setEditingItem(null);

                setFormData({
                  title: "",
                  category: "",
                  description: "",
                  image: "",
                  condition: "",
                });

                setShowAddForm(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <Plus size={18} />
              Add Item
            </button>

          </div>

        </div>
      </section>

      {/* ======================================
          MESSAGES
      ====================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

      </div>

      {/* ======================================
          THREE ITEM REQUIREMENT
      ====================================== */}

      {items.length < 3 && (
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">

          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">

            <div className="flex gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Package size={21} />
              </div>

              <div>

                <h2 className="font-semibold text-text">
                  Build your sharing profile
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted">
                  Add at least 3 items before you can
                  borrow items from your community.
                </p>

                <p className="mt-2 text-xs font-medium text-primary">
                  {items.length} of 3 items added
                </p>

              </div>

            </div>

          </div>

        </section>
      )}

      {/* ======================================
          ADD / EDIT FORM
      ====================================== */}

      {showAddForm && (
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-text">
                  {editingItem
                    ? "Edit Item"
                    : "Add New Item"}
                </h2>

                <p className="mt-1 text-sm text-muted">
                  {editingItem
                    ? "Update your item information."
                    : "Add something you are willing to share."}
                </p>

              </div>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl p-2 text-muted transition hover:bg-background hover:text-text"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={
                editingItem
                  ? handleUpdateItem
                  : handleAddItem
              }
              className="grid gap-5 md:grid-cols-2"
            >

              {/* ITEM TITLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Item Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Example: Electric Drill"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Tools">
                    Tools
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Kitchen">
                    Kitchen
                  </option>

                  <option value="Outdoor">
                    Outdoor
                  </option>

                  <option value="Others">
                    Others
                  </option>

                </select>

              </div>

              {/* CONDITION */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Condition
                </label>

                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                >

                  <option value="">
                    Select condition
                  </option>

                  <option value="New">
                    New
                  </option>

                  <option value="Old">
                    Old
                  </option>

                  <option value="Good">
                    Good
                  </option>

                  <option value="Fair">
                    Fair
                  </option>

                </select>

              </div>

              {/* IMAGE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />

              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-text">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your item..."
                  rows="4"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                />

              </div>

              {/* FORM BUTTONS */}

              <div className="flex gap-3 md:col-span-2">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
                >

                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingItem
                    ? "Update Item"
                    : "Add Item"}

                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text transition hover:bg-background"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </section>
      )}

      {/* ======================================
          ITEMS
      ====================================== */}

      <section className="pb-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-6 flex items-end justify-between">

            <div>

              <h2 className="text-xl font-bold text-text">
                Your Items
              </h2>

              <p className="mt-1 text-sm text-muted">
                {items.length} item
                {items.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>

          {items.length === 0 ? (

            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Package size={25} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-text">
                You haven't added any items yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                Add at least 3 items to your sharing
                profile so you can participate in
                borrowing from your community.
              </p>

              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
              >
                <Plus size={18} />
                Add Your First Item
              </button>

            </div>

          ) : (

            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {paginatedItems.map((item) => (

                  <div
                    key={item._id}
                    className="overflow-hidden rounded-2xl bg-white shadow-sm"
                  >

                    {/* IMAGE */}

                    <div className="h-48 overflow-hidden bg-background">

                      {item.image ? (

                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-muted">
                          <Package size={35} />
                        </div>

                      )}

                    </div>

                    {/* ITEM CONTENT */}

                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <h3 className="font-bold text-text">
                          {item.title}
                        </h3>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.availability?.toLowerCase() ===
                            "available"
                              ? "bg-green-50 text-green-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {item.availability || "Available"}
                        </span>

                      </div>

                      <p className="mt-2 text-sm text-muted">
                        {item.category}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                        {item.description}
                      </p>

                      {/* VIEW REVIEWS */}

                      <button
                        type="button"
                        onClick={() =>
                          handleViewReviews(item)
                        }
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10"
                      >
                        <MessageSquare size={16} />
                        View Reviews
                      </button>

                      {/* EDIT / DELETE */}

                      <div className="mt-3 flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(item)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-text transition hover:bg-background"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          className="flex items-center justify-center rounded-xl border border-red-100 px-4 py-2.5 text-red-500 transition hover:bg-red-50"
                          title="Delete item"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>

                  </div>

                ))}

              </div>

              {/* ==============================
                  PAGINATION
              ============================== */}

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => prev - 1)
                    }
                    disabled={currentPage === 1}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white">
                    {currentPage}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => prev + 1)
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    More
                  </button>

                </div>
              )}

            </>

          )}

        </div>

      </section>

      {/* ======================================
          REVIEWS MODAL
      ====================================== */}

      {reviewItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">

          <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-border px-5 py-4">

              <div>

                <h2 className="font-bold text-text">
                  Reviews for {reviewItem.title}
                </h2>

                <p className="mt-1 text-xs text-muted">
                  Feedback from people who borrowed this item.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setReviewItem(null);
                  setReviews([]);
                }}
                className="rounded-xl p-2 text-muted transition hover:bg-background"
              >
                <X size={19} />
              </button>

            </div>

            {/* REVIEWS */}

            <div className="max-h-[65vh] overflow-y-auto p-5">

              {reviewLoading ? (

                <div className="py-10 text-center text-sm text-muted">
                  Loading reviews...
                </div>

              ) : reviews.length === 0 ? (

                <div className="py-10 text-center">

                  <MessageSquare
                    size={30}
                    className="mx-auto text-muted"
                  />

                  <p className="mt-3 text-sm font-medium text-text">
                    No reviews yet
                  </p>

                  <p className="mt-1 text-xs text-muted">
                    This item hasn't received any reviews.
                  </p>

                </div>

              ) : (

                <div className="space-y-4">

                  {reviews.map((review) => (

                    <div
                      key={review._id}
                      className="rounded-xl border border-border p-4"
                    >

                      <div className="flex items-center justify-between gap-4">

                        <p className="text-sm font-semibold text-text">
                          {review.reviewer?.name ||
                            "Community member"}
                        </p>

                        <div className="flex items-center gap-1">

                          <Star
                            size={15}
                            className="fill-primary text-primary"
                          />

                          <span className="text-sm font-semibold text-text">
                            {review.rating}
                          </span>

                        </div>

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

          </div>

        </div>
      )}

      <Footer />

    </main>
  );
}

export default MyItems;