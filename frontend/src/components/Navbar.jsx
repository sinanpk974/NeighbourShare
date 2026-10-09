import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import {
  Bell,
  Menu,
  X,
  User,
  Package,
  ClipboardList,
  Home,
  LogIn,
  UserPlus,
  Search,
} from "lucide-react";

const API_URL = "https://neighbourshare-i2wq.onrender.com";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ==========================================
  // GET USER ID FROM JWT TOKEN
  // ==========================================

  const getUserIdFromToken = useCallback(() => {
    try {
      if (!token) return null;

      const payloadPart = token.split(".")[1];
      if (!payloadPart) return null;

      const base64 = payloadPart
        .replace(/-/g, "+")
        .replace(/_/g, "/");

      const payload = JSON.parse(
        atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))
      );

      return payload.UserID || payload.userId || payload.id || null;
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  }, [token]);

  // ==========================================
  // GET UNREAD NOTIFICATION COUNT
  // ==========================================

  const getUnreadNotificationCount = useCallback(async () => {
    try {
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(Number(response.data.unreadCount) || 0);
    } catch (error) {
      console.error(
        "Unread notification count error:",
        error.response?.data || error.message
      );
    }
  }, [token]);

  // ==========================================
  // FETCH COUNT WHEN LOGIN OR PAGE CHANGES
  // ==========================================

  useEffect(() => {
    if (!token) {
      setUnreadCount(0);
      return;
    }

    getUnreadNotificationCount();
  }, [token, location.pathname, getUnreadNotificationCount]);

  // ==========================================
  // SOCKET.IO REAL-TIME NOTIFICATION COUNT
  // ==========================================

  useEffect(() => {
    if (!token) {
      setUnreadCount(0);
      return;
    }

    const userId = getUserIdFromToken();

    if (!userId) {
      console.warn(
        "User ID not found in token. Real-time notifications are unavailable."
      );
      return;
    }

    const socket = io(API_URL);

    socket.on("connect", () => {
      socket.emit("joinNotificationRoom", userId);
    });

    socket.on("newNotification", (notification) => {
      if (!notification.isRead) {
        setUnreadCount((previousCount) => previousCount + 1);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Navbar socket connection error:", error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, getUserIdFromToken]);

  // ==========================================
  // ACTIVE LINK
  // ==========================================

  const isActive = (path) => location.pathname === path;

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMenu = () => setMenuOpen(false);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUnreadCount(0);
    setMenuOpen(false);
    navigate("/");
  };

  // ==========================================
  // NOTIFICATIONS BUTTON
  // ==========================================

  const handleNotifications = () => {
    navigate("/notifications");
    closeMenu();
  };

  // ==========================================
  // REUSABLE NOTIFICATION BUTTON
  // ==========================================

  const NotificationButton = ({ mobile = false }) => (
    <button
      type="button"
      onClick={handleNotifications}
      className={
        mobile
          ? `flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
              isActive("/notifications")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10"
            }`
          : `relative ml-2 rounded-xl p-2.5 transition hover:bg-white/10 hover:text-white ${
              isActive("/notifications")
                ? "bg-white/15 text-white"
                : "text-white/85"
            }`
      }
      aria-label={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : "Notifications"
      }
      title="Notifications"
    >
      <Bell size={mobile ? 18 : 20} />

      {mobile && <span>Notifications</span>}

      {unreadCount > 0 && (
        <span
          className={
            mobile
              ? "ml-auto flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white"
              : "absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-primary"
          }
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-primary text-white shadow-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={closeMenu}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
            <Home size={21} strokeWidth={2.3} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight sm:text-xl">
              NeighbourShare
            </h1>

            <p className="hidden text-[10px] text-white/70 sm:block">
              Share locally. Borrow confidently.
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-1 md:flex">
          {/* HOME */}
          <Link
            to="/"
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              isActive("/")
                ? "bg-white/15 text-white"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            Home
          </Link>

          {/* SEARCH */}
          <button
            type="button"
            onClick={() => navigate("/items")}
            className="ml-1 rounded-xl p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            title="Search Items"
            aria-label="Search Items"
          >
            <Search size={20} />
          </button>

          {token ? (
            <>
              {/* MY ITEMS */}
              <Link
                to="/myItems"
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive("/myItems")
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Package size={17} />
                My Items
              </Link>

              {/* REQUESTS */}
              <Link
                to="/myRequests"
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive("/myRequests")
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ClipboardList size={17} />
                Requests
              </Link>

              {/* NOTIFICATIONS - LOGGED IN */}
              <NotificationButton />

              {/* PROFILE */}
              <button
                type="button"
                onClick={() => navigate("/myProfile")}
                className="ml-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white transition hover:opacity-90"
                title="Profile"
                aria-label="Profile"
              >
                <User size={19} />
              </button>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 rounded-xl px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* ITEMS */}
              <Link
                to="/items"
                className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive("/items")
                    ? "bg-white/15 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                Items
              </Link>

              {/* NOTIFICATIONS - LOGGED OUT */}
              <NotificationButton />

              {/* LOGIN */}
              <Link
                to="/login"
                className="ml-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
              >
                <LogIn size={17} />
                Login
              </Link>

              {/* REGISTER */}
              <Link
                to="/register"
                className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                <UserPlus size={17} />
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="rounded-xl p-2 transition hover:bg-white/10 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-primary-dark px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {/* HOME */}
            <Link
              to="/"
              onClick={closeMenu}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                isActive("/")
                  ? "bg-white/15"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              <Home size={18} />
              Home
            </Link>

            {/* SEARCH */}
            <button
              type="button"
              onClick={() => {
                navigate("/items");
                closeMenu();
              }}
              className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-medium text-white/80 hover:bg-white/10"
            >
              <Search size={18} />
              Search Items
            </button>

            {/* NOTIFICATIONS - AVAILABLE TO EVERYONE */}
            <NotificationButton mobile />

            {token ? (
              <>
                {/* MY ITEMS */}
                <Link
                  to="/myItems"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive("/myItems")
                      ? "bg-white/15"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Package size={18} />
                  My Items
                </Link>

                {/* REQUESTS */}
                <Link
                  to="/myRequests"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive("/myRequests")
                      ? "bg-white/15"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <ClipboardList size={18} />
                  Requests
                </Link>

                {/* PROFILE */}
                <Link
                  to="/myProfile"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  <User size={18} />
                  My Profile
                </Link>

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  <LogIn size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* ITEMS */}
                <Link
                  to="/items"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive("/items")
                      ? "bg-white/15"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Package size={18} />
                  Items
                </Link>

                {/* LOGIN */}
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  <LogIn size={18} />
                  Login
                </Link>

                {/* REGISTER */}
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white"
                >
                  <UserPlus size={17} />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;