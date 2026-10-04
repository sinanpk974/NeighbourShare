import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import {
  Menu,
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  ClipboardList,
  Star,
  X,
} from "lucide-react";

function AdminNavbar({ setMobileOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  // ==========================================
  // ADMIN PAGE LINKS
  // ==========================================

  const adminPages = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Pending Users",
      path: "/admin/pending-users",
      icon: UserCheck,
    },
    {
      name: "Items",
      path: "/admin/items",
      icon: Package,
    },
    {
      name: "Requests",
      path: "/admin/requests",
      icon: ClipboardList,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: Star,
    },
    {
      name: "Notifications",
      path: "/admin/notifications",
      icon: Bell,
    },
    {
      name: "Admin Profile",
      path: "/admin/profile",
      icon: User,
    },
  ];

  // ==========================================
  // GET UNREAD NOTIFICATION COUNT
  // ==========================================

  const getUnreadNotificationCount = async () => {
    try {
      if (!token) return;

      const response = await axios.get(
        "http://https://neighbourshare-i2wq.onrender.com/api/notifications/unread-count",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error(
        "Failed to fetch admin notification count:",
        error
      );
    }
  };

  // ==========================================
  // REFRESH WHEN ADMIN CHANGES PAGE
  // ==========================================

  useEffect(() => {
    if (token) {
      getUnreadNotificationCount();
    }

    setAdminMenuOpen(false);
  }, [location.pathname]);

  // ==========================================
  // REFRESH EVERY 15 SECONDS
  // ==========================================

  useEffect(() => {
    if (!token) return;

    getUnreadNotificationCount();

    const interval = setInterval(() => {
      getUnreadNotificationCount();
    }, 15000);

    return () => clearInterval(interval);
  }, [token]);

  // ==========================================
  // GO TO ADMIN PROFILE
  // ==========================================

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  // ==========================================
  // GO TO NOTIFICATIONS
  // ==========================================

  const handleNotificationClick = () => {
    navigate("/admin/notifications");
  };

  // ==========================================
  // ADMIN PAGE NAVIGATION
  // ==========================================

  const handleAdminPageClick = (path) => {
    navigate(path);
    setAdminMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">

      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <div className="flex items-center gap-4">

          {/* MOBILE MENU */}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-text transition hover:border-primary/30 hover:bg-primary/5 lg:hidden"
          >
            <Menu size={21} />
          </button>

          {/* TITLE */}

          <div>
            <div className="flex items-center gap-2">

              <div className="hidden h-8 w-1 rounded-full bg-primary sm:block" />

              <div>
                <h1 className="text-xl font-bold tracking-tight text-text">
                  Admin Dashboard
                </h1>

                <p className="hidden text-xs text-muted sm:block">
                  Manage your NeighbourShare community
                </p>
              </div>

            </div>
          </div>

        </div>


        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="flex items-center gap-3">

          {/* ==========================================
              ADMIN NAVIGATION DROPDOWN
          ========================================== */}

          <div className="relative hidden md:block">

            <button
              type="button"
              onClick={() =>
                setAdminMenuOpen((previous) => !previous)
              }
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${
                adminMenuOpen
                  ? "border-primary/30 bg-primary/10"
                  : "border-primary/10 bg-primary/5 hover:border-primary/30 hover:bg-primary/10"
              }`}
            >

              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
                <ShieldCheck size={15} />
              </div>

              <div className="text-left">

                <p className="text-xs font-semibold text-primary">
                  Admin Access
                </p>

                <p className="text-[10px] text-muted">
                  Navigate Panel
                </p>

              </div>

              <ChevronDown
                size={16}
                className={`text-primary transition-transform ${
                  adminMenuOpen ? "rotate-180" : ""
                }`}
              />

            </button>


            {/* ==========================================
                DROPDOWN MENU
            ========================================== */}

            {adminMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-xl">

                <div className="flex items-center justify-between px-3 py-2">

                  <div>
                    <p className="text-sm font-bold text-text">
                      Admin Pages
                    </p>

                    <p className="text-xs text-muted">
                      Quick navigation
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAdminMenuOpen(false)}
                    className="rounded-lg p-1.5 text-muted transition hover:bg-background hover:text-text"
                  >
                    <X size={16} />
                  </button>

                </div>

                <div className="my-1 border-t border-border" />

                <div className="space-y-1">

                  {adminPages.map((page) => {
                    const Icon = page.icon;

                    const isActive =
                      location.pathname === page.path;

                    return (
                      <button
                        key={page.path}
                        type="button"
                        onClick={() =>
                          handleAdminPageClick(page.path)
                        }
                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-text hover:bg-background hover:text-primary"
                        }`}
                      >

                        <Icon
                          size={18}
                          className={
                            isActive
                              ? "text-primary"
                              : "text-muted"
                          }
                        />

                        <span className="flex-1">
                          {page.name}
                        </span>

                        {page.path ===
                          "/admin/notifications" &&
                          unreadCount > 0 && (
                            <span className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                              {unreadCount > 99
                                ? "99+"
                                : unreadCount}
                            </span>
                          )}

                      </button>
                    );
                  })}

                </div>

              </div>
            )}

          </div>


          {/* ==========================================
              NOTIFICATIONS
          ========================================== */}

          <button
            type="button"
            onClick={handleNotificationClick}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-muted transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            aria-label="Notifications"
          >

            <Bell size={20} />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}

          </button>


          {/* ==========================================
              ADMIN PROFILE
          ========================================== */}

          <button
            type="button"
            onClick={handleProfileClick}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-2.5 py-2 transition hover:border-primary/30 hover:bg-primary/5"
          >

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
              <User size={18} />
            </div>

            <div className="hidden text-left leading-tight sm:block">

              <p className="text-sm font-semibold text-text">
                Administrator
              </p>

              <p className="text-xs text-muted">
                NeighbourShare
              </p>

            </div>

            <ChevronDown
              size={16}
              className="hidden text-muted sm:block"
            />

          </button>

        </div>

      </div>

    </header>
  );
}

export default AdminNavbar;