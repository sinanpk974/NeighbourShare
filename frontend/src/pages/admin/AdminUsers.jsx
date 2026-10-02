import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Search,
  User,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Trash2,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  Home,
  AlertTriangle,
  Loader2,
  MoreVertical,
  Package,
  ClipboardList,
  Star,
} from "lucide-react";

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [openActionMenu, setOpenActionMenu] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 10;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:3003/api/admin/users",
        { headers }
      );

      setUsers(response.data.users || response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.village?.toLowerCase().includes(searchText);

    if (!matchesSearch) return false;

    if (filter === "Verified") {
      return user.verificationStatus === "Verified";
    }

    if (filter === "Pending") {
      return user.verificationStatus === "Pending";
    }

    if (filter === "Rejected") {
      return user.verificationStatus === "Rejected";
    }

    if (filter === "Blocked") {
      return user.isBlocked;
    }

    return true;
  });

  const totalPages = Math.ceil(
    filteredUsers.length / USERS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * USERS_PER_PAGE;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  const handleVerify = async (id) => {
    try {
      setActionLoading(true);

      await axios.patch(
        `http://localhost:3003/api/admin/users/${id}/verify`,
        {},
        { headers }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isVerified: true,
                verificationStatus: "Verified",
              }
            : user
        )
      );

      setOpenActionMenu(null);
    } catch (error) {
      console.error("Error verifying user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(true);

      await axios.patch(
        `http://localhost:3003/api/admin/users/${id}/reject`,
        {},
        { headers }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isVerified: false,
                verificationStatus: "Rejected",
              }
            : user
        )
      );

      setOpenActionMenu(null);
    } catch (error) {
      console.error("Error rejecting user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBlock = async (id) => {
    try {
      setActionLoading(true);

      await axios.patch(
        `http://localhost:3003/api/admin/users/${id}/block`,
        {},
        { headers }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isBlocked: true,
              }
            : user
        )
      );

      setOpenActionMenu(null);
    } catch (error) {
      console.error("Error blocking user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblock = async (id) => {
    try {
      setActionLoading(true);

      await axios.patch(
        `http://localhost:3003/api/admin/users/${id}/unblock`,
        {},
        { headers }
      );

      setUsers((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isBlocked: false,
              }
            : user
        )
      );

      setOpenActionMenu(null);
    } catch (error) {
      console.error("Error unblocking user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      setActionLoading(true);

      await axios.delete(
        `http://localhost:3003/api/admin/delusers/${userToDelete._id}`,
        { headers }
      );

      setUsers((prev) =>
        prev.filter(
          (user) => user._id !== userToDelete._id
        )
      );

      setShowDeleteModal(false);
      setUserToDelete(null);
      setOpenActionMenu(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
    setOpenActionMenu(null);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenActionMenu(null);
  };

  const handleViewItems = (user) => {
    setSelectedUser(null);

    navigate(
      `/admin/items?userId=${user._id}&userName=${encodeURIComponent(
        user.name || ""
      )}`
    );
  };

  const handleViewRequests = (user) => {
    setSelectedUser(null);

    navigate(
      `/admin/requests?userId=${user._id}&userName=${encodeURIComponent(
        user.name || ""
      )}`
    );
  };

  const handleViewReviews = (user) => {
    setSelectedUser(null);

    navigate(
      `/admin/reviews?userId=${user._id}&userName=${encodeURIComponent(
        user.name || ""
      )}`
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <Loader2
            size={24}
            className="animate-spin text-primary"
          />
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
              <Users
                size={23}
                className="text-primary"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-text">
                Users
              </h1>

              <p className="text-sm text-muted">
                Manage all registered users
              </p>
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted">
          <span className="font-semibold text-text">
            {filteredUsers.length}
          </span>{" "}
          users
        </div>

      </div>

      <div className="rounded-2xl border border-border bg-card p-4">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />

            <input
              type="text"
              placeholder="Search by name, email or village..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-text outline-none transition focus:border-primary"
            />

          </div>

          <div className="flex flex-wrap gap-2">

            {[
              "All",
              "Verified",
              "Pending",
              "Rejected",
              "Blocked",
            ].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setFilter(item);
                  setCurrentPage(1);
                }}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  filter === item
                    ? "bg-primary text-white"
                    : "border border-border bg-background text-muted hover:bg-primary/5 hover:text-primary"
                }`}
              >
                {item}
              </button>
            ))}

          </div>

        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">

        <div className="hidden grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-border bg-background px-6 py-4 text-xs font-semibold uppercase tracking-wide text-muted lg:grid">
          <div>User</div>
          <div>Contact</div>
          <div>Village</div>
          <div>Address</div>
          <div>Verification</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        <div className="divide-y divide-border">

          {filteredUsers.length === 0 ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background">
                <Users
                  size={26}
                  className="text-muted"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-text">
                No users found
              </h3>

              <p className="mt-1 text-sm text-muted">
                Try changing your search or filter.
              </p>

            </div>

          ) : (

            paginatedUsers.map((user) => (

              <div
                key={user._id}
                className="relative p-5 lg:grid lg:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-4 lg:px-6"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <User
                      size={20}
                      className="text-primary"
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate font-semibold text-text">
                      {user.name || "Unnamed User"}
                    </p>

                    <p className="truncate text-xs text-muted">
                      ID: {user._id}
                    </p>

                  </div>

                </div>

                <div className="mt-4 space-y-1 lg:mt-0">

                  <div className="flex items-center gap-2 text-sm text-text">

                    <Mail
                      size={14}
                      className="shrink-0 text-muted"
                    />

                    <span className="truncate">
                      {user.email || "Not provided"}
                    </span>

                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted">

                    <Phone
                      size={14}
                      className="shrink-0"
                    />

                    <span>
                      {user.phone || "Not provided"}
                    </span>

                  </div>

                </div>

                <div className="mt-4 lg:mt-0">

                  <div className="flex items-center gap-2 text-sm text-text">

                    <Home
                      size={15}
                      className="shrink-0 text-muted"
                    />

                    <span>
                      {user.village || "Not provided"}
                    </span>

                  </div>

                </div>

                <div className="mt-4 lg:mt-0">

                  <div className="flex items-start gap-2 text-sm text-text">

                    <MapPin
                      size={15}
                      className="mt-0.5 shrink-0 text-muted"
                    />

                    <span className="line-clamp-2">
                      {user.address || "Not provided"}
                    </span>

                  </div>

                </div>

                <div className="mt-4 lg:mt-0">

                  {user.verificationStatus === "Verified" ? (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                      <ShieldCheck size={14} />
                      Verified
                    </span>

                  ) : user.verificationStatus === "Rejected" ? (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger">
                      <ShieldAlert size={14} />
                      Rejected
                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                      <ShieldAlert size={14} />
                      Pending
                    </span>

                  )}

                </div>

                <div className="mt-4 lg:mt-0">

                  {user.isBlocked ? (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger">
                      <Ban size={14} />
                      Blocked
                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                      <CheckCircle2 size={14} />
                      Active
                    </span>

                  )}

                </div>

                <div className="relative mt-4 flex lg:mt-0 lg:justify-end">

                  <button
                    onClick={() =>
                      setOpenActionMenu(
                        openActionMenu === user._id
                          ? null
                          : user._id
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-text transition hover:border-primary hover:text-primary"
                  >
                    <MoreVertical size={17} />
                    <span>Actions</span>
                  </button>

                  {openActionMenu === user._id && (

                    <div
                      className={`absolute right-0 z-30 w-44 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg ${
                        paginatedUsers.indexOf(user) >=
                        paginatedUsers.length - 2
                          ? "bottom-full mb-2"
                          : "top-full mt-2"
                      }`}
                    >

                      <div className="flex items-center justify-between border-b border-border px-2 py-1.5">

                        <span className="text-xs font-semibold text-muted">
                          Actions
                        </span>

                        <button
                          onClick={() =>
                            setOpenActionMenu(null)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-background hover:text-text"
                        >
                          <X size={16} />
                        </button>

                      </div>

                      <button
                        onClick={() =>
                          handleViewUser(user)
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition hover:bg-background"
                      >
                        <Eye
                          size={16}
                          className="text-primary"
                        />
                        View
                      </button>

                      {user.verificationStatus === "Pending" && (

                        <button
                          onClick={() =>
                            handleVerify(user._id)
                          }
                          disabled={actionLoading}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition hover:bg-background disabled:opacity-50"
                        >
                          <ShieldCheck
                            size={16}
                            className="text-success"
                          />
                          Verify
                        </button>

                      )}

                      {user.verificationStatus === "Pending" && (

                        <button
                          onClick={() =>
                            handleReject(user._id)
                          }
                          disabled={actionLoading}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition hover:bg-background disabled:opacity-50"
                        >
                          <ShieldAlert
                            size={16}
                            className="text-danger"
                          />
                          Reject
                        </button>

                      )}

                      {user.isBlocked ? (

                        <button
                          onClick={() =>
                            handleUnblock(user._id)
                          }
                          disabled={actionLoading}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition hover:bg-background disabled:opacity-50"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-success"
                          />
                          Unblock
                        </button>

                      ) : (

                        <button
                          onClick={() =>
                            handleBlock(user._id)
                          }
                          disabled={actionLoading}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text transition hover:bg-background disabled:opacity-50"
                        >
                          <Ban
                            size={16}
                            className="text-accent"
                          />
                          Block
                        </button>

                      )}

                      <button
                        onClick={() =>
                          openDeleteModal(user)
                        }
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-danger transition hover:bg-danger/5"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>

                    </div>

                  )}

                </div>

              </div>

            ))

          )}

        </div>
      </div>

      {filteredUsers.length > 0 && totalPages > 1 && (

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
                Math.min(prev + 1, totalPages)
              )
            }
            disabled={currentPage === totalPages}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium transition hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed"
          >
            More
          </button>

        </div>

      )}

      {selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl">

            <div className="flex items-center justify-between border-b border-border px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-text">
                  User Details
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Complete information about this user
                </p>

              </div>

              <button
                onClick={() => setSelectedUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition hover:bg-background hover:text-text"
              >
                <X size={18} />
              </button>

            </div>

            <div className="space-y-6 p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User
                    size={30}
                    className="text-primary"
                  />
                </div>

                <div>

                  <h3 className="text-xl font-bold text-text">
                    {selectedUser.name || "Unnamed User"}
                  </h3>

                  <p className="text-sm text-muted">
                    {selectedUser.email || "No email"}
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                    <Mail
                      size={18}
                      className="text-primary"
                    />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-text">
                      {selectedUser.email ||
                        "Not provided"}
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                    <Phone
                      size={18}
                      className="text-primary"
                    />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-text">
                      {selectedUser.phone ||
                        "Not provided"}
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                    <Home
                      size={18}
                      className="text-primary"
                    />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Village
                    </p>

                    <p className="mt-1 text-sm text-text">
                      {selectedUser.village ||
                        "Not provided"}
                    </p>

                  </div>

                </div>

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                    <MapPin
                      size={18}
                      className="text-primary"
                    />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Address
                    </p>

                    <p className="mt-1 text-sm text-text">
                      {selectedUser.address ||
                        "Not provided"}
                    </p>

                  </div>

                </div>

              </div>

              <div className="rounded-2xl border border-border bg-background p-4">

                <h3 className="mb-3 text-sm font-semibold text-text">
                  Account Status
                </h3>

                <div className="flex flex-wrap gap-2">

                  {selectedUser.verificationStatus ===
                  "Verified" ? (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                      <ShieldCheck size={14} />
                      Verified
                    </span>

                  ) : selectedUser.verificationStatus ===
                    "Rejected" ? (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger">
                      <ShieldAlert size={14} />
                      Rejected
                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
                      <ShieldAlert size={14} />
                      Pending
                    </span>

                  )}

                  {selectedUser.isBlocked ? (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger">
                      <Ban size={14} />
                      Blocked
                    </span>

                  ) : (

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                      <CheckCircle2 size={14} />
                      Active
                    </span>

                  )}

                </div>

              </div>

              <div>

                <h3 className="mb-3 text-sm font-semibold text-text">
                  User Activity
                </h3>

                <div className="grid gap-3 sm:grid-cols-3">

                  <button
                    onClick={() =>
                      handleViewItems(selectedUser)
                    }
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background p-5 text-center transition hover:border-primary/30 hover:bg-primary/5"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Package size={21} />
                    </div>

                    <div>

                      <p className="font-semibold text-text">
                        Items
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        View user's items
                      </p>

                    </div>

                  </button>

                  <button
                    onClick={() =>
                      handleViewRequests(selectedUser)
                    }
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background p-5 text-center transition hover:border-primary/30 hover:bg-primary/5"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ClipboardList size={21} />
                    </div>

                    <div>

                      <p className="font-semibold text-text">
                        Requests
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        View user's requests
                      </p>

                    </div>

                  </button>

                  <button
                    onClick={() =>
                      handleViewReviews(selectedUser)
                    }
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-background p-5 text-center transition hover:border-primary/30 hover:bg-primary/5"
                  >

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Star size={21} />
                    </div>

                    <div>

                      <p className="font-semibold text-text">
                        Reviews
                      </p>

                      <p className="mt-1 text-xs text-muted">
                        View user's reviews
                      </p>

                    </div>

                  </button>

                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {showDeleteModal && userToDelete && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-danger/10">
                <AlertTriangle
                  size={23}
                  className="text-danger"
                />
              </div>

              <div>

                <h2 className="text-lg font-bold text-text">
                  Delete User
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-text">
                    {userToDelete.name}
                  </span>
                  ? This action cannot be undone.
                </p>

              </div>

            </div>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                disabled={actionLoading}
                className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text transition hover:bg-card disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >

                {actionLoading && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                Delete User

              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}