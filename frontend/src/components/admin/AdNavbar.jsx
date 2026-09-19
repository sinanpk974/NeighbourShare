import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

function AdminNavbar({ setMobileOpen }) {
  const navigate = useNavigate();

  // ==========================================
  // GO TO ADMIN PROFILE
  // ==========================================

  const handleProfileClick = () => {
    navigate("/admin/profile");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">

      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">

        {}

        <div className="flex items-center gap-4">

          {}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-text transition hover:border-primary/30 hover:bg-primary/5 lg:hidden"
          >
            <Menu size={21} />
          </button>


          {}

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


        {}

        <div className="flex items-center gap-3">

          {}

          <div className="hidden items-center gap-2 rounded-xl border border-primary/10 bg-primary/5 px-3 py-2 md:flex">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">

              <ShieldCheck size={15} />

            </div>

            <div>

              <p className="text-xs font-semibold text-primary">
                Admin Access
              </p>

              <p className="text-[10px] text-muted">
                Secure Panel
              </p>

            </div>

          </div>


          {}

          <button
            type="button"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-muted transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            aria-label="Notifications"
          >

            <Bell size={20} />

            {}

            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" />

          </button>


          {}

          <button
            type="button"
            onClick={handleProfileClick}
            className="flex items-center gap-3 rounded-xl border border-border bg-background px-2.5 py-2 transition hover:border-primary/30 hover:bg-primary/5"
          >

            {}

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">

              <User size={18} />

            </div>


            {}

            <div className="hidden text-left leading-tight sm:block">

              <p className="text-sm font-semibold text-text">
                Administrator
              </p>

              <p className="text-xs text-muted">
                NeighbourShare
              </p>

            </div>


            {}

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