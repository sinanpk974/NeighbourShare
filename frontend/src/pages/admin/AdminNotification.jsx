import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Check,
  CheckCheck,
  UserPlus,
  UserCheck,
  UserX,
  UserRoundX,
  Trash2,
  Star,
  Package,
  ShieldCheck,
  ShieldOff,
  Clock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

function AdminNotification() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ==========================================
  // GET NOTIFICATIONS
  // ==========================================

  const getNotifications = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://https://neighbourshare-i2wq.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // MARK SINGLE NOTIFICATION AS READ
  // ==========================================

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `http://https://neighbourshare-i2wq.onrender.com/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // ==========================================
  // MARK ALL AS READ
  // ==========================================

  const markAllAsRead = async () => {
    try {
      setActionLoading(true);

      await axios.patch(
        "http://https://neighbourshare-i2wq.onrender.com/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // NOTIFICATION ICON
  // ==========================================

  const getNotificationIcon = (type) => {
    switch (type) {
      case "NEW_USER_REGISTRATION":
        return <UserPlus size={21} />;

      case "ACCOUNT_DELETION_REQUEST":
        return <UserRoundX size={21} />;

      case "USER_VERIFIED":
        return <UserCheck size={21} />;

      case "USER_REJECTED":
        return <UserX size={21} />;

      case "USER_BLOCKED":
        return <ShieldOff size={21} />;

      case "USER_UNBLOCKED":
        return <ShieldCheck size={21} />;

      case "ACCOUNT_DELETION_APPROVED":
        return <Trash2 size={21} />;

      case "ACCOUNT_DELETION_REJECTED":
        return <UserRoundX size={21} />;

      case "ITEM_DELETED_BY_ADMIN":
        return <Package size={21} />;

      case "REVIEW_DELETED_BY_ADMIN":
        return <Trash2 size={21} />;

      case "REVIEW":
        return <Star size={21} />;

      default:
        return <Bell size={21} />;
    }
  };

  // ==========================================
  // ICON STYLE
  // ==========================================

  const getIconStyle = (type) => {
    switch (type) {
      case "NEW_USER_REGISTRATION":
        return "bg-primary/10 text-primary";

      case "ACCOUNT_DELETION_REQUEST":
        return "bg-accent/10 text-accent";

      case "USER_VERIFIED":
      case "USER_UNBLOCKED":
        return "bg-success/10 text-success";

      case "USER_REJECTED":
      case "USER_BLOCKED":
      case "ACCOUNT_DELETION_REJECTED":
        return "bg-red-50 text-red-600";

      case "ACCOUNT_DELETION_APPROVED":
        return "bg-red-50 text-red-600";

      case "ITEM_DELETED_BY_ADMIN":
      case "REVIEW_DELETED_BY_ADMIN":
        return "bg-slate-100 text-slate-600";

      case "REVIEW":
        return "bg-accent/10 text-accent";

      default:
        return "bg-primary/10 text-primary";
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // HANDLE NOTIFICATION CLICK
  // ==========================================

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }

    switch (notification.type) {
      case "NEW_USER_REGISTRATION":
        navigate("/admin/pending-users");
        break;

      case "ACCOUNT_DELETION_REQUEST":
        navigate("/admin/pending-users");
        break;

      case "USER_VERIFIED":
      case "USER_REJECTED":
      case "USER_BLOCKED":
      case "USER_UNBLOCKED":
        navigate("/admin/users");
        break;

      case "ITEM_DELETED_BY_ADMIN":
        navigate("/admin/items");
        break;

      case "REVIEW":
      case "REVIEW_DELETED_BY_ADMIN":
        navigate("/admin/reviews");
        break;

      default:
        break;
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    getNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw
            size={28}
            className="animate-spin text-primary"
          />

          <p className="text-sm text-muted">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                <Bell size={21} />
              </div>

              <div>

                <h2 className="text-2xl font-bold tracking-tight text-text">
                  Notifications
                </h2>

                <p className="text-sm text-muted">
                  Stay updated with NeighbourShare activity
                </p>

              </div>

            </div>

            {unreadCount > 0 && (
              <p className="mt-3 text-sm text-muted">
                You have{" "}
                <span className="font-semibold text-primary">
                  {unreadCount}
                </span>{" "}
                unread{" "}
                {unreadCount === 1
                  ? "notification"
                  : "notifications"}
                .
              </p>
            )}

          </div>

          {/* MARK ALL */}

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={actionLoading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary/30 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CheckCheck size={17} />

              {actionLoading
                ? "Marking..."
                : "Mark all as read"}
            </button>
          )}

        </div>


        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {notifications.length === 0 ? (

          <div className="rounded-3xl border border-border bg-card px-6 py-16 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bell size={28} />
            </div>

            <h3 className="text-lg font-bold text-text">
              No notifications
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              New user registrations and account deletion
              requests will appear here.
            </p>

          </div>

        ) : (

          /* ==========================================
             NOTIFICATION LIST
          ========================================== */

          <div className="space-y-3">

            {notifications.map((notification) => (

              <button
                key={notification._id}
                type="button"
                onClick={() =>
                  handleNotificationClick(notification)
                }
                className={`group relative w-full rounded-2xl border p-4 text-left transition sm:p-5 ${
                  notification.isRead
                    ? "border-border bg-card hover:border-primary/20 hover:bg-primary/[0.02]"
                    : "border-primary/20 bg-primary/[0.035] shadow-sm hover:border-primary/30"
                }`}
              >

                {/* UNREAD LINE */}

                {!notification.isRead && (
                  <div className="absolute left-0 top-5 h-10 w-1 rounded-r-full bg-primary" />
                )}

                <div className="flex items-start gap-4">

                  {/* ICON */}

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${getIconStyle(
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>


                  {/* CONTENT */}

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">

                      <div className="flex items-center gap-2">

                        <h3
                          className={`text-sm sm:text-base ${
                            notification.isRead
                              ? "font-semibold text-text"
                              : "font-bold text-text"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {!notification.isRead && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                        )}

                      </div>

                      <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted">

                        <Clock size={13} />

                        {formatDate(notification.createdAt)}

                      </div>

                    </div>


                    {/* MESSAGE */}

                    <p className="mt-2 text-sm leading-6 text-muted">
                      {notification.message}
                    </p>


                    {/* VIEW DETAILS */}

                    <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">

                      <span>
                        View details
                      </span>

                      <ArrowRight size={14} />

                    </div>

                  </div>


                  {/* READ */}

                  {notification.isRead && (
                    <div className="hidden shrink-0 items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[10px] font-medium text-muted sm:flex">
                      <Check size={12} />
                      Read
                    </div>
                  )}

                </div>

              </button>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default AdminNotification;