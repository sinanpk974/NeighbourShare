import { useEffect, useState } from "react";
import axios from "axios";

import {
  UserCheck,
  User,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingDeletions, setPendingDeletions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Pagination
  const [usersPage, setUsersPage] = useState(1);
  const [deletionsPage, setDeletionsPage] = useState(1);

  const USERS_PER_PAGE = 10;
  const DELETIONS_PER_PAGE = 10;

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchPendingData = async () => {
    try {
      setLoading(true);

      const [usersResponse, deletionsResponse] =
        await Promise.all([
          axios.get(
            "http://localhost:3003/api/admin/pending-users",
            { headers }
          ),

          axios.get(
            "http://localhost:3003/api/admin/pending-deletions",
            { headers }
          ),
        ]);

      setPendingUsers(
        usersResponse.data.users ||
          usersResponse.data ||
          []
      );

      setPendingDeletions(
        deletionsResponse.data.users ||
          deletionsResponse.data ||
          []
      );

      setUsersPage(1);
      setDeletionsPage(1);
    } catch (error) {
      console.log("Pending data error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingData();
  }, []);

  // ==========================================
  // USERS PAGINATION
  // ==========================================

  const usersTotalPages = Math.ceil(
    pendingUsers.length / USERS_PER_PAGE
  );

  const usersStartIndex =
    (usersPage - 1) * USERS_PER_PAGE;

  const paginatedUsers = pendingUsers.slice(
    usersStartIndex,
    usersStartIndex + USERS_PER_PAGE
  );

  // ==========================================
  // DELETIONS PAGINATION
  // ==========================================

  const deletionsTotalPages = Math.ceil(
    pendingDeletions.length / DELETIONS_PER_PAGE
  );

  const deletionsStartIndex =
    (deletionsPage - 1) * DELETIONS_PER_PAGE;

  const paginatedDeletions = pendingDeletions.slice(
    deletionsStartIndex,
    deletionsStartIndex + DELETIONS_PER_PAGE
  );

  // ==========================================
  // KEEP PAGE VALID AFTER DATA CHANGES
  // ==========================================

  useEffect(() => {
    if (
      usersTotalPages > 0 &&
      usersPage > usersTotalPages
    ) {
      setUsersPage(usersTotalPages);
    }
  }, [usersPage, usersTotalPages]);

  useEffect(() => {
    if (
      deletionsTotalPages > 0 &&
      deletionsPage > deletionsTotalPages
    ) {
      setDeletionsPage(deletionsTotalPages);
    }
  }, [deletionsPage, deletionsTotalPages]);

  // ==========================================
  // VERIFY USER
  // ==========================================

  const handleVerifyUser = async (userId) => {
    try {
      setActionLoading(`verify-${userId}`);

      await axios.patch(
        `http://localhost:3003/api/admin/users/${userId}/verify`,
        {},
        { headers }
      );

      setPendingUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );
    } catch (error) {
      console.log("Verify user error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Unable to verify user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // REJECT USER
  // ==========================================

  const handleRejectUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this user?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`reject-user-${userId}`);

      await axios.patch(
        `http://localhost:3003/api/admin/users/${userId}/reject`,
        {},
        { headers }
      );

      setPendingUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );
    } catch (error) {
      console.log("Reject user error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Unable to reject user"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // APPROVE ACCOUNT DELETION
  // ==========================================

  const handleApproveDeletion = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this user's account?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`approve-${userId}`);

      await axios.patch(
        `http://localhost:3003/api/approveDeletion/${userId}`,
        {},
        { headers }
      );

      setPendingDeletions((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );
    } catch (error) {
      console.log("Approve deletion error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Unable to approve account deletion"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // REJECT ACCOUNT DELETION
  // ==========================================

  const handleRejectDeletion = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this account deletion request?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`reject-${userId}`);

      await axios.patch(
        `http://localhost:3003/api/rejectDeletion/${userId}`,
        {},
        { headers }
      );

      setPendingDeletions((previousUsers) =>
        previousUsers.filter(
          (user) => user._id !== userId
        )
      );
    } catch (error) {
      console.log("Reject deletion error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Unable to reject deletion request"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            Loading pending requests...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary">
            ADMIN MANAGEMENT
          </p>

          <h1 className="mt-1 text-3xl font-bold text-text">
            Pending Requests
          </h1>

          <p className="mt-2 text-muted">
            Review new members and account deletion requests.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchPendingData}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary/30 hover:bg-primary/5"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* ====================================== */}
      {/* PENDING USERS */}
      {/* ====================================== */}

      <div className="mb-10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserCheck size={22} />
            </div>

            <div>
              <h2 className="font-bold text-text sm:text-lg">
                Users Pending Verification
              </h2>

              <p className="text-sm text-muted">
                New members waiting for admin approval
              </p>
            </div>
          </div>

          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            {pendingUsers.length}
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background">
              <CheckCircle
                size={28}
                className="text-success"
              />
            </div>

            <h3 className="mt-4 font-semibold text-text">
              All caught up!
            </h3>

            <p className="mt-1 text-sm text-muted">
              There are no users waiting for verification.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-3xl border border-border bg-card p-6 transition hover:border-primary/30 hover:shadow-md"
                >
                  {/* USER HEADER */}

                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/10">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User
                          size={26}
                          className="text-primary"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-text">
                        {user.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-accent">
                        <Clock size={14} />
                        Pending verification
                      </div>
                    </div>
                  </div>

                  {/* USER DETAILS */}

                  <div className="mt-6 space-y-3 border-t border-border pt-5">
                    <div className="flex items-start gap-3">
                      <Mail
                        size={17}
                        className="mt-0.5 shrink-0 text-primary"
                      />

                      <p className="break-all text-sm text-muted">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone
                        size={17}
                        className="mt-0.5 shrink-0 text-primary"
                      />

                      <p className="text-sm text-muted">
                        {user.phone || "Phone not provided"}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-primary"
                      />

                      <div className="text-sm text-muted">
                        <p>
                          {user.village ||
                            "Village not provided"}
                        </p>

                        {user.address && (
                          <p className="mt-1 text-xs text-muted">
                            {user.address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleVerifyUser(user._id)
                      }
                      disabled={
                        actionLoading ===
                          `verify-${user._id}` ||
                        actionLoading ===
                          `reject-user-${user._id}`
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle size={18} />

                      {actionLoading ===
                      `verify-${user._id}`
                        ? "Verifying..."
                        : "Verify"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRejectUser(user._id)
                      }
                      disabled={
                        actionLoading ===
                          `reject-user-${user._id}` ||
                        actionLoading ===
                          `verify-${user._id}`
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-3 text-sm font-semibold text-danger transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle size={18} />

                      {actionLoading ===
                      `reject-user-${user._id}`
                        ? "Rejecting..."
                        : "Reject"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* USERS PAGINATION */}

            {usersTotalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setUsersPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                  disabled={usersPage === 1}
                  className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary">
                  {usersPage} / {usersTotalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setUsersPage((prev) =>
                      Math.min(
                        prev + 1,
                        usersTotalPages
                      )
                    )
                  }
                  disabled={
                    usersPage === usersTotalPages
                  }
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ====================================== */}
      {/* ACCOUNT DELETION REQUESTS */}
      {/* ====================================== */}

      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-danger">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="font-bold text-text sm:text-lg">
                Account Deletion Requests
              </h2>

              <p className="text-sm text-muted">
                Users requesting permanent account deletion
              </p>
            </div>
          </div>

          <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-danger">
            {pendingDeletions.length}
          </span>
        </div>

        {pendingDeletions.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background">
              <Trash2
                size={26}
                className="text-muted"
              />
            </div>

            <h3 className="mt-4 font-semibold text-text">
              No deletion requests
            </h3>

            <p className="mt-1 text-sm text-muted">
              There are currently no account deletion requests.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedDeletions.map((user) => (
                <div
                  key={user._id}
                  className="rounded-3xl border border-danger/20 bg-card p-6"
                >
                  {/* USER HEADER */}

                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-red-50">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User
                          size={26}
                          className="text-danger"
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-text">
                        {user.name}
                      </h3>

                      <p className="mt-1 text-xs font-medium text-danger">
                        Account deletion requested
                      </p>
                    </div>
                  </div>

                  {/* USER DETAILS */}

                  <div className="mt-6 space-y-3 border-t border-border pt-5">
                    <div className="flex items-start gap-3">
                      <Mail
                        size={17}
                        className="mt-0.5 shrink-0 text-muted"
                      />

                      <p className="break-all text-sm text-muted">
                        {user.email}
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin
                        size={17}
                        className="mt-0.5 shrink-0 text-muted"
                      />

                      <p className="text-sm text-muted">
                        {user.village ||
                          "Village not provided"}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleRejectDeletion(user._id)
                      }
                      disabled={
                        actionLoading ===
                        `reject-${user._id}`
                      }
                      className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-3 text-sm font-semibold text-text transition hover:bg-background/70 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle size={17} />

                      {actionLoading ===
                      `reject-${user._id}`
                        ? "Rejecting..."
                        : "Reject"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleApproveDeletion(user._id)
                      }
                      disabled={
                        actionLoading ===
                        `approve-${user._id}`
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-danger px-3 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Trash2 size={17} />

                      {actionLoading ===
                      `approve-${user._id}`
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DELETIONS PAGINATION */}

            {deletionsTotalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setDeletionsPage((prev) =>
                      Math.max(prev - 1, 1)
                    )
                  }
                  disabled={deletionsPage === 1}
                  className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary">
                  {deletionsPage} / {deletionsTotalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setDeletionsPage((prev) =>
                      Math.min(
                        prev + 1,
                        deletionsTotalPages
                      )
                    )
                  }
                  disabled={
                    deletionsPage ===
                    deletionsTotalPages
                  }
                  className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
                >
                  More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default PendingUsers;