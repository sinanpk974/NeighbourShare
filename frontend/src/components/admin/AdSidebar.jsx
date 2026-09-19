import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  ClipboardList,
  Star,
  Trash2,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";

function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const menuItems = [
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
    
  ];

  return (
    <>
      {}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-white/10
          bg-primary text-white
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {}

        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent shadow-sm">
              <ShieldCheck size={23} />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                NeighbourShare
              </h1>

              <p className="text-xs text-white/65">
                Admin Panel
              </p>
            </div>

          </div>

          {}

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X size={21} />
          </button>

        </div>


        {}

        <div className="px-5 pt-6">

          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">

                <ShieldCheck size={18} />

              </div>

              <div>

                <p className="text-sm font-semibold">
                  Administrator
                </p>

                <p className="text-xs text-white/60">
                  Community management
                </p>

              </div>

            </div>

          </div>

        </div>


        {}

        <nav className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-xs font-semibold tracking-wider text-white/45">
            MANAGEMENT
          </p>

          <div className="space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 rounded-xl
                    px-4 py-3 text-sm font-medium
                    transition
                    ${
                      isActive
                        ? "bg-white text-primary shadow-sm"
                        : "text-white/75 hover:bg-white/10 hover:text-white"
                    }
                    `
                  }
                >

                  <Icon size={19} />

                  {item.name}

                </NavLink>
              );
            })}

          </div>

        </nav>


        {}

        <div className="border-t border-white/10 p-4">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-red-500/20 hover:text-white"
          >

            <LogOut size={19} />

            Logout

          </button>

        </div>

      </aside>
    </>
  );
}

export default AdminSidebar;