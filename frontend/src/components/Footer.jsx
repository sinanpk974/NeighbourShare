import { Link } from "react-router-dom";
import {
  Home,
  Search,
  Package,
  ClipboardList,
  ShieldCheck,
  ArrowUp,
} from "lucide-react";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-primary text-white">

      {}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {}

          <div className="sm:col-span-2 lg:col-span-2">

            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
                <Home size={21} strokeWidth={2.3} />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  NeighbourShare
                </h2>

                <p className="text-xs text-white/60">
                  Share locally. Borrow confidently.
                </p>
              </div>

            </Link>


            <p className="mt-5 max-w-md text-sm leading-6 text-white/70">
              A trusted community platform that helps neighbours share useful
              items, borrow what they need, and build stronger local
              connections.
            </p>


            {}

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80">

              <ShieldCheck
                size={15}
                className="text-accent"
              />

              Built for trusted local sharing

            </div>

          </div>


          {}

          <div>

            <h3 className="text-sm font-semibold text-white">
              Quick Links
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              <Link
                to="/"
                className="flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
              >
                <Home size={15} />
                Home
              </Link>

              <Link
                to="/items"
                className="flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
              >
                <Search size={15} />
                Find Items
              </Link>

              <Link
                to="/myItems"
                className="flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
              >
                <Package size={15} />
                My Items
              </Link>

              <Link
                to="/myRequests"
                className="flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
              >
                <ClipboardList size={15} />
                Requests
              </Link>

            </div>

          </div>


          {}

          <div>

            <h3 className="text-sm font-semibold text-white">
              NeighbourShare
            </h3>

            <div className="mt-4 flex flex-col gap-3">

              <Link
                to="/items"
                className="text-sm text-white/70 transition hover:text-white"
              >
                Explore Items
              </Link>

              <Link
                to="/register"
                className="text-sm text-white/70 transition hover:text-white"
              >
                Join the Community
              </Link>

              <Link
                to="/login"
                className="text-sm text-white/70 transition hover:text-white"
              >
                Sign In
              </Link>

              <button
                type="button"
                onClick={scrollToTop}
                className="flex items-center gap-2 text-left text-sm text-white/70 transition hover:text-white"
              >
                <ArrowUp size={15} />
                Back to top
              </button>

            </div>

          </div>

        </div>

      </div>


      {}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 sm:text-left">

          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} NeighbourShare. All rights reserved.
          </p>

          <p className="text-xs text-white/50">
            Share locally. Borrow confidently.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;