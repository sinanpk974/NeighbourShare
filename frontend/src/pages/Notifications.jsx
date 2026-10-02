import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  CheckCheck,
  RefreshCw,
  Inbox,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  RotateCcw,
  Star,
  ShieldCheck,
  ShieldX,
  Lock,
  Unlock,
  Trash2,
  UserPlus,
  AlertCircle,
} from "lucide-react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Pagination
  const NOTIFICATIONS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    const iconProps = {
      size: 21,
      strokeWidth: 2,
    };

    switch (type) {
      case "NEW_USER_REGISTRATION":
        return <UserPlus {...iconProps} />;

      case "REQUEST":
        return <Send {...iconProps} />;

      case "REQUEST_ACCEPTED":
        return <CheckCircle {...iconProps} />;

      case "REQUEST_REJECTED":
        return <XCircle {...iconProps} />;

      case "ITEM_RETURNED":
        return <RotateCcw {...iconProps} />;

      case "REVIEW":
        return <Star {...iconProps} />;

      case "USER_VERIFIED":
        return <ShieldCheck {...iconProps} />;

      case "USER_REJECTED":
        return <ShieldX {...iconProps} />;

      case "USER_BLOCKED":
        return <Lock {...iconProps} />;

      case "USER_UNBLOCKED":
        return <Unlock {...iconProps} />;

      case "ACCOUNT_DELETION_REQUEST":
        return <AlertCircle {...iconProps} />;

      case "ACCOUNT_DELETION_REJECTED":
        return <XCircle {...iconProps} />;

      case "ACCOUNT_DELETION_APPROVED":
        return <CheckCircle {...iconProps} />;

      case "ITEM_DELETED_BY_ADMIN":
        return <Trash2 {...iconProps} />;

      case "REVIEW_DELETED_BY_ADMIN":
        return <Trash2 {...iconProps} />;

      default:
        return <Bell {...iconProps} />;
    }
  };

  const getNotificationIconStyle = (type) => {
    switch (type) {
      case "REQUEST_ACCEPTED":
      case "ITEM_RETURNED":
      case "USER_VERIFIED":
      case "USER_UNBLOCKED":
        return "bg-success/10 text-success";

      case "REQUEST_REJECTED":
      case "USER_REJECTED":
      case "USER_BLOCKED":
      case "ACCOUNT_DELETION_REJECTED":
      case "ITEM_DELETED_BY_ADMIN":
      case "REVIEW_DELETED_BY_ADMIN":
        return "bg-red-50 text-red-600";

      case "REVIEW":
        return "bg-accent/10 text-accent";

      case "NEW_USER_REGISTRATION":
      case "ACCOUNT_DELETION_REQUEST":
        return "bg-blue-50 text-blue-600";

      default:
        return "bg-primary/10 text-primary";
    }
  };

  const formatNotificationTime = (date) => {
    if (!date) return "";

    const notificationDate = new Date(date);
    const now = new Date();

    const difference =
      now.getTime() - notificationDate.getTime();

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hr ago`;
    }

    if (days === 1) {
      return "Yesterday";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    return notificationDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year:
        notificationDate.getFullYear() !== now.getFullYear()
          ? "numeric"
          : undefined,
    });
  };

  const getNotifications = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:3003/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.log("Get notifications error:", error);

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        setActionLoading(notification._id);

        await axios.patch(
          `http://localhost:3003/api/notifications/${notification._id}/read`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications((previousNotifications) =>
          previousNotifications.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  isRead: true,
                }
              : item
          )
        );
      }

      switch (notification.type) {
        case "REQUEST":
          if (notification.request) {
            navigate(
              `/myRequests?tab=received&request=${notification.request}`
            );
          } else {
            navigate("/myRequests?tab=received");
          }
          break;

        case "REQUEST_ACCEPTED":
          if (notification.request) {
            navigate(
              `/myRequests?tab=sent&request=${notification.request}`
            );
          } else {
            navigate("/myRequests?tab=sent");
          }
          break;

        case "REQUEST_REJECTED":
          if (notification.request) {
            navigate(
              `/myRequests?tab=sent&request=${notification.request}`
            );
          } else {
            navigate("/myRequests?tab=sent");
          }
          break;

        case "ITEM_RETURNED":
          if (notification.request) {
            navigate(
              `/myRequests?tab=sent&request=${notification.request}`
            );
          } else {
            navigate("/myRequests?tab=sent");
          }
          break;

        case "REVIEW":
          if (notification.review) {
            navigate(`/ViewReview?review=${notification.review}`);
          } else {
            navigate("/ViewReview");
          }
          break;

        case "USER_VERIFIED":
        case "USER_REJECTED":
          navigate("/myProfile");
          break;

        case "USER_BLOCKED":
        case "USER_UNBLOCKED":
          navigate("/myProfile");
          break;

        case "ACCOUNT_DELETION_APPROVED":
        case "ACCOUNT_DELETION_REJECTED":
          navigate("/myProfile");
          break;

        case "ITEM_DELETED_BY_ADMIN":
          navigate("/myItems");
          break;

        case "REVIEW_DELETED_BY_ADMIN":
          navigate("/viewReview");
          break;

        default:
          break;
      }
    } catch (error) {
      console.log("Notification action error:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      setMarkingAll(true);

      await axios.patch(
        "http://localhost:3003/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((previousNotifications) =>
        previousNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (error) {
      console.log(
        "Mark all notifications as read error:",
        error
      );
    } finally {
      setMarkingAll(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(
    notifications.length / NOTIFICATIONS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * NOTIFICATIONS_PER_PAGE;

  const paginatedNotifications = notifications.slice(
    startIndex,
    startIndex + NOTIFICATIONS_PER_PAGE
  );

  // Keep current page valid after notifications
  // are marked/deleted/refreshed.
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                <Bell size={22} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-text sm:text-3xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-muted">
                  Stay updated with your latest activity.
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <p className="ml-14 text-sm font-medium text-primary">
                {unreadCount} unread{" "}
                {unreadCount === 1
                  ? "notification"
                  : "notifications"}
              </p>
            )}
          </div>

          {/* ======================================
              ACTIONS
          ====================================== */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={getNotifications}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={loading ? "animate-spin" : ""}
              />

              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                disabled={markingAll}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {markingAll ? (
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCheck size={17} />
                )}

                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* ======================================
            LOADING
        ====================================== */}

        {loading ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card py-20">
            <RefreshCw
              size={30}
              className="animate-spin text-primary"
            />

            <p className="mt-4 text-sm text-muted">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (

          /* ======================================
              EMPTY STATE
          ====================================== */

          <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card px-6 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Inbox size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-text">
              No notifications yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              When there is new activity related to
              your account, you will see it here.
            </p>
          </div>

        ) : (

          /* ======================================
              NOTIFICATION LIST
          ====================================== */

          <>
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              {paginatedNotifications.map(
                (notification, index) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() =>
                      handleNotificationClick(notification)
                    }
                    disabled={
                      actionLoading === notification._id
                    }
                    className={`relative flex w-full items-start gap-4 px-5 py-5 text-left transition sm:px-6 ${
                      index !==
                      paginatedNotifications.length - 1
                        ? "border-b border-border"
                        : ""
                    } ${
                      notification.isRead
                        ? "bg-card hover:bg-background/60"
                        : "bg-primary/5 hover:bg-primary/10"
                    }`}
                  >
                    {/* ==================================
                        UNREAD INDICATOR
                    ================================== */}

                    {!notification.isRead && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-primary" />
                    )}

                    {/* ==================================
                        ICON
                    ================================== */}

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${getNotificationIconStyle(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(
                        notification.type
                      )}
                    </div>

                    {/* ==================================
                        CONTENT
                    ================================== */}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <h3
                          className={`text-sm font-semibold ${
                            notification.isRead
                              ? "text-text"
                              : "text-primary-dark"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
                          <Clock size={13} />

                          {formatNotificationTime(
                            notification.createdAt
                          )}
                        </div>
                      </div>

                      <p className="mt-1.5 text-sm leading-6 text-muted">
                        {notification.message}
                      </p>

                      {/* ==================================
                          SENDER
                      ================================== */}

                      {notification.sender?.name && (
                        <p className="mt-2 text-xs text-muted">
                          From:{" "}
                          <span className="font-medium text-text">
                            {notification.sender.name}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* ==================================
                        ACTION LOADING
                    ================================== */}

                    {actionLoading === notification._id && (
                      <RefreshCw
                        size={17}
                        className="mt-1 shrink-0 animate-spin text-primary"
                      />
                    )}
                  </button>
                )
              )}
            </div>

            {/* ======================================
                PAGINATION
            ====================================== */}

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((previousPage) =>
                      Math.max(previousPage - 1, 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                  {currentPage}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((previousPage) =>
                      Math.min(
                        previousPage + 1,
                        totalPages
                      )
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
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

export default Notifications;