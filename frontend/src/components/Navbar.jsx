import { useEffect, useState } from "react";
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

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ==========================================
  // GET USER ID FROM JWT TOKEN
  // ==========================================

  const getUserIdFromToken = () => {
    try {
      if (!token) return null;

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      return (
        payload.UserID ||
        payload.userId ||
        payload.id
      );
    } catch (error) {
      console.log("Token decode error:", error);
      return null;
    }
  };

  // ==========================================
  // GET UNREAD NOTIFICATION COUNT
  // ==========================================

  const getUnreadNotificationCount = async () => {
    try {
      if (!token) {
        setUnreadCount(0);
        return;
      }

      const response = await axios.get(
        "http://localhost:3003/api/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUnreadCount(
        response.data.unreadCount || 0
      );
    } catch (error) {
      console.log(
        "Unread notification count error:",
        error
      );
    }
  };

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
      console.log("User ID not found in token");
      return;
    }

    // Get current count once
    getUnreadNotificationCount();

    // Connect to Socket.IO
    const socket = io("http://localhost:3003");

    socket.on("connect", () => {
      console.log(
        "Navbar socket connected:",
        socket.id
      );

      socket.emit(
        "joinNotificationRoom",
        userId
      );

      console.log(
        `Navbar joined notification room: user:${userId}`
      );
    });

    // ==========================================
    // NEW NOTIFICATION
    // ==========================================

    socket.on(
      "newNotification",
      (notification) => {
        console.log(
          "Navbar received new notification:",
          notification
        );

        // Only increase count if notification is unread
        if (!notification.isRead) {
          setUnreadCount(
            (previousCount) =>
              previousCount + 1
          );
        }
      }
    );

    socket.on("disconnect", () => {
      console.log("Navbar socket disconnected");
    });

    socket.on("connect_error", (error) => {
      console.log(
        "Navbar socket connection error:",
        error.message
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // ==========================================
  // REFRESH COUNT WHEN NOTIFICATION PAGE OPENS
  // ==========================================

  useEffect(() => {
    if (
      token &&
      location.pathname === "/notifications"
    ) {
      getUnreadNotificationCount();
    }
  }, [location.pathname, token]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setUnreadCount(0);

    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path) =>
    location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-primary text-white shadow-md">

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}

        <Link
          to="/"
          className="flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
            <Home
              size={21}
              strokeWidth={2.3}
            />
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
            onClick={() =>
              navigate("/items")
            }
            className="ml-1 rounded-xl p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white"
            title="Search Items"
          >
            <Search size={20} />
          </button>

          {/* LOGGED IN */}

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

              {/* NOTIFICATIONS */}

              <button
                type="button"
                onClick={() =>
                  navigate("/notifications")
                }
                className={`relative ml-2 rounded-xl p-2.5 transition hover:bg-white/10 hover:text-white ${
                  isActive("/notifications")
                    ? "bg-white/15 text-white"
                    : "text-white/85"
                }`}
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-primary">
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* PROFILE */}

              <button
                type="button"
                onClick={() =>
                  navigate("/myProfile")
                }
                className="ml-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white transition hover:opacity-90"
                title="Profile"
                aria-label="Profile"
              >
                <User size={19} />
              </button>

            </>
          ) : (

            /* LOGGED OUT */

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
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
          className="rounded-xl p-2 transition hover:bg-white/10 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>

      </div>

      {/* MOBILE MENU */}

      {menuOpen && (

        <div className="border-t border-white/10 bg-primary-dark px-4 pb-5 pt-3 md:hidden">

          <div className="flex flex-col gap-1">

            {/* HOME */}

            <Link
              to="/"
              onClick={() =>
                setMenuOpen(false)
              }
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
                setMenuOpen(false);
              }}
              className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-base font-medium text-white/80 hover:bg-white/10"
            >
              <Search size={18} />
              Search Items
            </button>

            {/* LOGGED IN */}

            {token ? (
              <>

                {/* MY ITEMS */}

                <Link
                  to="/myItems"
                  onClick={() =>
                    setMenuOpen(false)
                  }
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
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive("/myRequests")
                      ? "bg-white/15"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <ClipboardList size={18} />
                  Requests
                </Link>

                {/* NOTIFICATIONS */}

                <button
                  type="button"
                  onClick={() => {
                    navigate("/notifications");
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
                    isActive("/notifications")
                      ? "bg-white/15 text-white"
                      : "text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Bell size={18} />

                  Notifications

                  {unreadCount > 0 && (
                    <span className="ml-auto flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}
                    </span>
                  )}
                </button>

                {/* PROFILE */}

                <Link
                  to="/myProfile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  <User size={18} />
                  My Profile
                </Link>

              </>
            ) : (

              /* LOGGED OUT */

              <>

                {/* ITEMS */}

                <Link
                  to="/items"
                  onClick={() =>
                    setMenuOpen(false)
                  }
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
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  <LogIn size={18} />
                  Login
                </Link>

                {/* REGISTER */}

                <Link
                  to="/register"
                  onClick={() =>
                    setMenuOpen(false)
                  }
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