import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Package,
  ClipboardList,
  Star,
  ShieldCheck,
  ShieldAlert,
  User,
  Trash2,
  RefreshCw,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
} from "lucide-react";

const API_URL = "https://neighbourshare-i2wq.onrender.com/api";
const SOCKET_URL = "https://neighbourshare-i2wq.onrender.com";
const NOTIFICATIONS_PER_PAGE = 12;

function getUserIdFromToken(token) {
  try {
    if (!token) return null;

    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload.UserID || payload.userId || payload.id || null;
  } catch {
    return null;
  }
}

function getNotificationIcon(type) {
  switch (type) {
    case "REQUEST":
    case "NEW_REQUEST":
      return ClipboardList;

    case "REQUEST_ACCEPTED":
      return CheckCheck;

    case "REQUEST_REJECTED":
      return ShieldAlert;

    case "ITEM_RETURNED":
      return Package;

    case "REVIEW":
      return Star;

    case "NEW_USER_REGISTRATION":
      return User;

    case "USER_VERIFIED":
    case "USER_UNBLOCKED":
      return ShieldCheck;

    case "USER_REJECTED":
    case "USER_BLOCKED":
      return ShieldAlert;

    case "ACCOUNT_DELETION_REQUEST":
    case "ACCOUNT_DELETION_APPROVED":
    case "ACCOUNT_DELETION_REJECTED":
      return Trash2;

    case "ITEM_DELETED_BY_ADMIN":
      return Package;

    case "REVIEW_DELETED_BY_ADMIN":
      return Star;

    default:
      return Bell;
  }
}

function getNotificationColor(type) {
  switch (type) {
    case "REQUEST_ACCEPTED":
    case "USER_VERIFIED":
    case "USER_UNBLOCKED":
      return "bg-green-100 text-green-700";

    case "REQUEST_REJECTED":
    case "USER_REJECTED":
    case "USER_BLOCKED":
    case "ACCOUNT_DELETION_REJECTED":
      return "bg-red-100 text-red-700";

    case "REVIEW":
      return "bg-amber-100 text-amber-700";

    case "ACCOUNT_DELETION_REQUEST":
    case "ACCOUNT_DELETION_APPROVED":
    case "ITEM_DELETED_BY_ADMIN":
    case "REVIEW_DELETED_BY_ADMIN":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-teal-100 text-teal-700";
  }
}

function formatNotificationTime(date) {
  if (!date) return "";

  const notificationDate = new Date(date);

  if (Number.isNaN(notificationDate.getTime())) {
    return "";
  }

  const now = new Date();
  const difference = now.getTime() - notificationDate.getTime();

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1 && difference >= 0) {
    return "Just now";
  }

  if (minutes < 60 && difference >= 0) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24 && difference >= 0) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (days < 7 && difference >= 0) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return notificationDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Notifications() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const registrationStatusToken = sessionStorage.getItem(
    "registrationStatusToken"
  );

  const isRegistrationVisitor =
    !token && Boolean(registrationStatusToken);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(notifications.length / NOTIFICATIONS_PER_PAGE)
  );

  const startIndex =
    (currentPage - 1) * NOTIFICATIONS_PER_PAGE;

  const currentNotifications = notifications.slice(
    startIndex,
    startIndex + NOTIFICATIONS_PER_PAGE
  );

  const getNotifications = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage("");

      let response;

      if (token) {
        response = await axios.get(`${API_URL}/notifications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (registrationStatusToken) {
        response = await axios.get(
          `${API_URL}/notifications/registration-status`,
          {
            headers: {
              Authorization: `Bearer ${registrationStatusToken}`,
            },
          }
        );
      } else {
        setNotifications([]);
        setErrorMessage(
          "Please log in to view notifications. If you recently registered, return to the registration page and open your verification notifications."
        );
        return;
      }

      setNotifications(response.data?.notifications || []);
      setCurrentPage(1);
    } catch (error) {
      console.error(
        "Get notifications error:",
        error.response?.data || error.message
      );

      setNotifications([]);

      setErrorMessage(
        error.response?.data?.message ||
          "Unable to load notifications. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, registrationStatusToken]);

  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  // Real-time notifications for logged-in users only.
  useEffect(() => {
    if (!token) return;

    const userId = getUserIdFromToken(token);

    if (!userId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      socket.emit("joinNotificationRoom", userId);
    });

    socket.on("newNotification", (newNotification) => {
      if (!newNotification) return;

      setNotifications((previousNotifications) => {
        const alreadyExists = previousNotifications.some(
          (notification) =>
            notification._id === newNotification._id
        );

        if (alreadyExists) {
          return previousNotifications;
        }

        return [newNotification, ...previousNotifications];
      });

      setCurrentPage(1);
    });

    return () => {
      socket.off("connect");
      socket.off("newNotification");
      socket.disconnect();
    };
  }, [token]);

  async function handleNotificationClick(notification) {
    if (!token || !notification?._id) return;

    setActionLoading(notification._id);

    try {
      if (!notification.isRead) {
        await axios.patch(
          `${API_URL}/notifications/${notification._id}/read`,
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
              ? { ...item, isRead: true }
              : item
          )
        );
      }

      const routes = {
        REQUEST: "/myRequests",
        NEW_REQUEST: "/myRequests",
        REQUEST_ACCEPTED: "/myRequests",
        REQUEST_REJECTED: "/myRequests",
        ITEM_RETURNED: "/myRequests",
        REVIEW: "/viewreview",
        NEW_USER_REGISTRATION: "/myProfile",
        USER_VERIFIED: "/myProfile",
        USER_REJECTED: "/myProfile",
        USER_BLOCKED: "/myProfile",
        USER_UNBLOCKED: "/myProfile",
        ACCOUNT_DELETION_REQUEST: "/myProfile",
        ACCOUNT_DELETION_APPROVED: "/myProfile",
        ACCOUNT_DELETION_REJECTED: "/myProfile",
        ITEM_DELETED_BY_ADMIN: "/myItems",
        REVIEW_DELETED_BY_ADMIN: "/viewreview",
      };

      const destination = routes[notification.type];

      if (destination) {
        navigate(destination);
      }
    } catch (error) {
      console.error(
        "Mark notification as read error:",
        error.response?.data || error.message
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function markAllNotificationsAsRead() {
    if (!token || unreadCount === 0) return;

    try {
      setMarkingAll(true);

      await axios.patch(
        `${API_URL}/notifications/read-all`,
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
      console.error(
        "Mark all notifications as read error:",
        error.response?.data || error.message
      );

      setErrorMessage(
        "Unable to mark all notifications as read. Please try again."
      );
    } finally {
      setMarkingAll(false);
    }
  }

  function goBack() {
    if (isRegistrationVisitor) {
      navigate("/register");
      return;
    }

    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={goBack}
              className="mt-1 rounded-xl border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#1F2937] sm:text-3xl">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="rounded-full bg-[#0F766E] px-2.5 py-1 text-xs font-semibold text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-[#64748B]">
                {isRegistrationVisitor
                  ? "Updates about your account registration and verification."
                  : "Stay updated on your sharing activity and account."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => getNotifications(true)}
              disabled={refreshing || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            {token && unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                disabled={markingAll}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCheck size={16} />
                {markingAll ? "Updating..." : "Mark all read"}
              </button>
            )}
          </div>
        </div>

        {/* Registration visitor message */}
        {isRegistrationVisitor && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-teal-200 bg-teal-50 p-4">
            <ShieldCheck
              size={22}
              className="mt-0.5 shrink-0 text-[#0F766E]"
            />

            <div>
              <h2 className="font-semibold text-[#115E59]">
                Registration status updates
              </h2>

              <p className="mt-1 text-sm leading-6 text-gray-700">
                You can view account verification updates here without
                logging in. Use Refresh to check for the latest updates.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && !loading && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-[#0F766E]"
            />

            <p className="mt-4 font-medium text-gray-700">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (

          /* Empty state */
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
              <Inbox
                size={30}
                className="text-[#0F766E]"
              />
            </div>

            <h2 className="mt-5 text-lg font-bold text-[#1F2937]">
              No notifications yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748B]">
              {isRegistrationVisitor
                ? "There are no account verification updates yet. Please check again later."
                : "When there are updates about your requests, items, reviews, or account, they will appear here."}
            </p>

            {isRegistrationVisitor && (
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="mt-6 rounded-xl bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#115E59]"
              >
                Back to registration
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Notification list */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                <h2 className="font-semibold text-[#1F2937]">
                  {isRegistrationVisitor
                    ? "Account updates"
                    : "All notifications"}
                </h2>

                <span className="text-sm text-[#64748B]">
                  {notifications.length} total
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {currentNotifications.map((notification) => {
                  const Icon = getNotificationIcon(
                    notification.type
                  );

                  const iconColor = getNotificationColor(
                    notification.type
                  );

                  const notificationIsBusy =
                    actionLoading === notification._id;

                  return (
                    <div
                      key={notification._id}
                      className={`flex gap-3 px-4 py-5 transition sm:gap-4 sm:px-6 ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-teal-50/50"
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconColor}`}
                      >
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="break-words font-semibold text-[#1F2937]">
                              {isRegistrationVisitor
                                ? "Account verification update"
                                : notification.title || "Notification"}
                            </h3>

                            <p className="mt-1 whitespace-pre-line break-words text-sm leading-6 text-[#64748B]">
                              {notification.message ||
                                "You have a new notification."}
                            </p>
                          </div>

                          {!notification.isRead && (
                            <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-[#115E59]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#0F766E]" />
                              New
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                            <Clock size={13} />
                            {formatNotificationTime(
                              notification.createdAt
                            )}
                          </span>

                          {token && (
                            <button
                              type="button"
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              disabled={notificationIsBusy}
                              className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-[#0F766E] transition hover:bg-teal-50 disabled:opacity-50"
                            >
                              {notificationIsBusy ? (
                                <RefreshCw
                                  size={14}
                                  className="animate-spin"
                                />
                              ) : notification.isRead ? (
                                <Check size={14} />
                              ) : (
                                <Bell size={14} />
                              )}

                              {notificationIsBusy
                                ? "Please wait..."
                                : notification.isRead
                                  ? "View update"
                                  : "Mark as read"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row">
                <p className="text-sm text-[#64748B]">
                  Showing{" "}
                  <span className="font-semibold text-[#1F2937]">
                    {startIndex + 1}
                  </span>
                  {" "}to{" "}
                  <span className="font-semibold text-[#1F2937]">
                    {Math.min(
                      startIndex + NOTIFICATIONS_PER_PAGE,
                      notifications.length
                    )}
                  </span>
                  {" "}of{" "}
                  <span className="font-semibold text-[#1F2937]">
                    {notifications.length}
                  </span>
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.max(1, page - 1)
                      )
                    }
                    disabled={currentPage === 1}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="px-3 text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(totalPages, page + 1)
                      )
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default Notifications;