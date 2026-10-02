import { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardList,
  User,
  Package,
  Calendar,
  RefreshCw,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  AlertCircle,
  Eye,
  X,
  Search,
} from "lucide-react";

function AdminRequest() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [ownerSearch, setOwnerSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ==============================
  // PAGINATION
  // ==============================
  const [currentPage, setCurrentPage] = useState(1);

  const REQUESTS_PER_PAGE = 10;

  const searchParams = new URLSearchParams(
    window.location.search
  );

  const userId = searchParams.get("userId");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3003/api/admin/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        let allRequests = response.data.requests || [];

        if (userId) {
          allRequests = allRequests.filter((request) => {
            const borrowerId =
              request.borrower?._id ||
              request.borrower;

            return (
              borrowerId?.toString() === userId
            );
          });
        }

        setRequests(allRequests);
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load requests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  // ==============================
  // FILTER
  // ==============================

  const filteredRequests = requests.filter(
    (request) => {
      const searchText =
        search.toLowerCase().trim();

      const ownerSearchText =
        ownerSearch.toLowerCase().trim();

      const itemName =
        request.item?.title?.toLowerCase() || "";

      const category =
        request.item?.category?.toLowerCase() ||
        "";

      const borrowerName =
        request.borrower?.name?.toLowerCase() ||
        "";

      const status =
        request.status?.toLowerCase() || "";

      const ownerName =
        request.owner?.name?.toLowerCase() || "";

      const ownerEmail =
        request.owner?.email?.toLowerCase() || "";

      const generalSearchMatch =
        !searchText ||
        itemName.includes(searchText) ||
        category.includes(searchText) ||
        borrowerName.includes(searchText) ||
        status.includes(searchText);

      const ownerSearchMatch =
        !ownerSearchText ||
        ownerName.includes(ownerSearchText) ||
        ownerEmail.includes(ownerSearchText);

      return (
        generalSearchMatch &&
        ownerSearchMatch
      );
    }
  );

  // ==============================
  // PAGINATION
  // ==============================

  const totalPages = Math.ceil(
    filteredRequests.length /
      REQUESTS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) *
    REQUESTS_PER_PAGE;

  const paginatedRequests =
    filteredRequests.slice(
      startIndex,
      startIndex + REQUESTS_PER_PAGE
    );

  // ==============================
  // STATUS STYLE
  // ==============================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return {
          className:
            "bg-green-100 text-green-700 border border-green-200",
          icon: <CheckCircle size={14} />,
        };

      case "Rejected":
        return {
          className:
            "bg-red-100 text-red-700 border border-red-200",
          icon: <XCircle size={14} />,
        };

      case "Returned":
        return {
          className:
            "bg-blue-100 text-blue-700 border border-blue-200",
          icon: <RotateCcw size={14} />,
        };

      case "Pending":
      default:
        return {
          className:
            "bg-yellow-100 text-yellow-700 border border-yellow-200",
          icon: <Clock size={14} />,
        };
    }
  };

  // ==============================
  // DATE FORMAT
  // ==============================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">

          <div className="flex flex-col items-center gap-3">

            <RefreshCw
              size={30}
              className="animate-spin text-primary"
            />

            <p className="text-muted">
              Loading requests...
            </p>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">

              <ClipboardList
                size={23}
                className="text-primary"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-text">

                {userId
                  ? "User Borrow Requests"
                  : "Borrow Requests"}

              </h1>

              <p className="text-sm text-muted">

                {userId
                  ? "Borrowing requests sent by this user"
                  : "Monitor all borrowing requests"}

              </p>

            </div>

          </div>

          <button
            onClick={fetchRequests}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition font-medium"
          >

            <RefreshCw size={17} />

            Refresh

          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">

            <AlertCircle size={19} />

            <span>{error}</span>

          </div>
        )}

        {/* SEARCH */}

        <div className="mb-5 flex flex-col gap-4">

          <p className="text-sm text-muted">

            Total Requests:{" "}

            <span className="font-bold text-text">
              {requests.length}
            </span>

            {(search || ownerSearch) && (
              <>
                {" "}

                <span className="text-muted">

                  • Showing{" "}

                  <span className="font-bold text-text">
                    {filteredRequests.length}
                  </span>

                </span>
              </>
            )}

          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">

            {/* GENERAL SEARCH */}

            <div className="relative w-full sm:w-80">

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
                placeholder="Search item, category, borrower, status..."
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

            </div>

            {/* OWNER SEARCH */}

            <div className="relative w-full sm:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                type="text"
                value={ownerSearch}
                onChange={(e) => {
                  setOwnerSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by owner..."
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

            </div>

          </div>

        </div>

        {/* REQUESTS */}

        {requests.length === 0 ? (

          <div className="bg-card border border-border rounded-3xl p-12 text-center">

            <ClipboardList
              size={35}
              className="mx-auto text-primary mb-4"
            />

            <h2 className="text-xl font-bold text-text mb-2">
              No Requests Found
            </h2>

            <p className="text-muted">

              {userId
                ? "This user has not sent any borrowing requests."
                : "There are no borrowing requests yet."}

            </p>

          </div>

        ) : filteredRequests.length === 0 ? (

          <div className="bg-card border border-border rounded-3xl p-12 text-center">

            <Search
              size={35}
              className="mx-auto text-primary mb-4"
            />

            <h2 className="text-xl font-bold text-text mb-2">
              No Matching Requests
            </h2>

            <p className="text-muted">
              No matching requests found.
            </p>

          </div>

        ) : (

          <>

            <div className="bg-card border border-border rounded-3xl overflow-hidden">

              {/* TABLE HEADER */}

              <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1.5fr_1.5fr_1fr_100px] gap-4 px-6 py-4 bg-background border-b border-border text-xs font-semibold text-muted uppercase tracking-wide">

                <div>Item</div>

                <div>Category</div>

                <div>Borrower</div>

                <div>Owner</div>

                <div>Status</div>

                <div>Action</div>

              </div>

              {/* REQUEST LIST */}

              <div className="divide-y divide-border">

                {paginatedRequests.map(
                  (request) => {

                    const status =
                      getStatusStyle(
                        request.status
                      );

                    return (

                      <div
                        key={request._id}
                        className="px-5 sm:px-6 py-5 hover:bg-background/60 transition"
                      >

                        {/* DESKTOP */}

                        <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1.5fr_1.5fr_1fr_100px] gap-4 items-center">

                          {/* ITEM */}

                          <div className="flex items-center gap-3 min-w-0">

                            <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">

                              <Package
                                size={18}
                                className="text-primary"
                              />

                            </div>

                            <div className="min-w-0">

                              <p className="font-semibold text-text truncate">

                                {request.item?.title ||
                                  "Item unavailable"}

                              </p>

                            </div>

                          </div>

                          {/* CATEGORY */}

                          <div>

                            <span className="text-sm text-muted">

                              {request.item?.category ||
                                "—"}

                            </span>

                          </div>

                          {/* BORROWER */}

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <User
                                size={16}
                                className="text-accent shrink-0"
                              />

                              <div className="min-w-0">

                                <p className="text-sm font-semibold text-text truncate">

                                  {request.borrower?.name ||
                                    "Unknown"}

                                </p>

                                <p className="text-xs text-muted truncate">

                                  {request.borrower?.email ||
                                    "No email"}

                                </p>

                              </div>

                            </div>

                          </div>

                          {/* OWNER */}

                          <div className="min-w-0">

                            <div className="flex items-center gap-2">

                              <User
                                size={16}
                                className="text-primary shrink-0"
                              />

                              <div className="min-w-0">

                                <p className="text-sm font-semibold text-text truncate">

                                  {request.owner?.name ||
                                    "Unknown"}

                                </p>

                                <p className="text-xs text-muted truncate">

                                  {request.owner?.email ||
                                    "No email"}

                                </p>

                              </div>

                            </div>

                          </div>

                          {/* STATUS */}

                          <div>

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.className}`}
                            >

                              {status.icon}

                              {request.status}

                            </span>

                          </div>

                          {/* ACTION */}

                          <div>

                            <button
                              onClick={() =>
                                setSelectedRequest(
                                  request
                                )
                              }
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition text-sm font-medium"
                            >

                              <Eye size={15} />

                              View

                            </button>

                          </div>

                        </div>

                        {/* MOBILE */}

                        <div className="lg:hidden">

                          <div className="flex items-start justify-between gap-4">

                            <div className="flex items-start gap-3 min-w-0">

                              <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">

                                <Package
                                  size={18}
                                  className="text-primary"
                                />

                              </div>

                              <div className="min-w-0">

                                <h2 className="font-semibold text-text truncate">

                                  {request.item?.title ||
                                    "Item unavailable"}

                                </h2>

                                <p className="text-sm text-muted mt-1">

                                  {request.item?.category ||
                                    "No category"}

                                </p>

                              </div>

                            </div>

                            <span
                              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.className}`}
                            >

                              {status.icon}

                              {request.status}

                            </span>

                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

                            {/* BORROWER */}

                            <div className="rounded-xl bg-background p-3">

                              <p className="text-xs text-muted mb-1">
                                Borrower
                              </p>

                              <div className="flex items-center gap-2">

                                <User
                                  size={15}
                                  className="text-accent"
                                />

                                <div className="min-w-0">

                                  <p className="text-sm font-semibold text-text truncate">

                                    {request.borrower?.name ||
                                      "Unknown"}

                                  </p>

                                  <p className="text-xs text-muted truncate">

                                    {request.borrower?.email ||
                                      "No email"}

                                  </p>

                                </div>

                              </div>

                            </div>

                            {/* OWNER */}

                            <div className="rounded-xl bg-background p-3">

                              <p className="text-xs text-muted mb-1">
                                Owner
                              </p>

                              <div className="flex items-center gap-2">

                                <User
                                  size={15}
                                  className="text-primary"
                                />

                                <div className="min-w-0">

                                  <p className="text-sm font-semibold text-text truncate">

                                    {request.owner?.name ||
                                      "Unknown"}

                                  </p>

                                  <p className="text-xs text-muted truncate">

                                    {request.owner?.email ||
                                      "No email"}

                                  </p>

                                </div>

                              </div>

                            </div>

                          </div>

                          <button
                            onClick={() =>
                              setSelectedRequest(
                                request
                              )
                            }
                            className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition text-sm font-medium"
                          >

                            <Eye size={16} />

                            View Details

                          </button>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            </div>

            {/* PAGINATION */}

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
                  disabled={
                    currentPage === totalPages
                  }
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium transition hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  More
                </button>

              </div>

            )}

          </>

        )}

      </div>

      {/* REQUEST DETAILS MODAL */}

      {selectedRequest && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() =>
            setSelectedRequest(null)
          }
        >

          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border">

              <div>

                <h2 className="text-xl font-bold text-text">
                  Request Details
                </h2>

                <p className="text-sm text-muted mt-1">

                  {selectedRequest.item?.title ||
                    "Item unavailable"}

                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-background transition"
              >

                <X
                  size={20}
                  className="text-muted"
                />

              </button>

            </div>

            {/* MODAL CONTENT */}

            <div className="p-5 sm:p-6">

              {/* STATUS */}

              <div className="mb-6">

                <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-2">
                  Current Status
                </p>

                {(() => {

                  const status =
                    getStatusStyle(
                      selectedRequest.status
                    );

                  return (

                    <span
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${status.className}`}
                    >

                      {status.icon}

                      {selectedRequest.status}

                    </span>

                  );

                })()}

              </div>

              {/* REQUEST DATES */}

              <div className="mb-6">

                <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">
                  Request Dates
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                  <div className="p-4 rounded-2xl border border-border">

                    <div className="flex items-center gap-2 mb-2">

                      <Calendar
                        size={17}
                        className="text-primary"
                      />

                      <span className="text-xs text-muted">
                        Borrow Date
                      </span>

                    </div>

                    <p className="font-semibold text-text">

                      {formatDate(
                        selectedRequest.borrowDate
                      )}

                    </p>

                  </div>

                  <div className="p-4 rounded-2xl border border-border">

                    <div className="flex items-center gap-2 mb-2">

                      <Calendar
                        size={17}
                        className="text-accent"
                      />

                      <span className="text-xs text-muted">
                        Expected Return
                      </span>

                    </div>

                    <p className="font-semibold text-text">

                      {formatDate(
                        selectedRequest.expectedReturnDate
                      )}

                    </p>

                  </div>

                  <div className="p-4 rounded-2xl border border-border">

                    <div className="flex items-center gap-2 mb-2">

                      <RotateCcw
                        size={17}
                        className="text-primary"
                      />

                      <span className="text-xs text-muted">
                        Actual Return
                      </span>

                    </div>

                    <p className="font-semibold text-text">

                      {formatDate(
                        selectedRequest.actualReturnDate
                      )}

                    </p>

                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              <div>

                <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-3">
                  Borrower Message
                </p>

                <div className="p-4 rounded-2xl bg-background border border-border">

                  <div className="flex items-start gap-3">

                    <Mail
                      size={18}
                      className="text-primary mt-0.5 shrink-0"
                    />

                    <p className="text-sm text-text leading-relaxed">

                      {selectedRequest.message ||
                        "No message provided."}

                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* MODAL FOOTER */}

            <div className="px-5 sm:px-6 pb-5 sm:pb-6">

              <button
                onClick={() =>
                  setSelectedRequest(null)
                }
                className="w-full px-4 py-2.5 rounded-xl border border-border text-text hover:bg-background transition font-medium"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminRequest;