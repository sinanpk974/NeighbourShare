import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Users,
  Package,
  ClipboardList,
  Star,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "https://neighbourshare-i2wq.onrender.com/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDashboard(response.data.dashboard);
      } catch (error) {
        console.log("Dashboard loading error:", error);

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    } else {
      navigate("/login");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-border border-t-primary" />

          <p className="mt-4 text-sm text-muted">
            Loading dashboard...
          </p>

        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">

        <div className="text-center">

          <AlertCircle
            size={40}
            className="mx-auto text-danger"
          />

          <p className="mt-3 font-semibold text-text">
            Unable to load dashboard
          </p>

          <p className="mt-1 text-sm text-muted">
            Please try again later.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">

      {}
      {}
      {}

      <div className="mb-8">

        <p className="text-sm font-semibold tracking-wide text-primary">
          OVERVIEW
        </p>

        <h1 className="mt-1 text-3xl font-bold text-text">
          Dashboard
        </h1>

        <p className="mt-2 text-muted">
          Overview of your NeighbourShare community.
        </p>

      </div>


      {}
      {}
      {}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {}

        <button
          onClick={() => navigate("/admin/users")}
          className="group rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-md"
        >

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-muted">
                Total Users
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {dashboard.users.totalUsers}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users size={23} />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary">

            Manage users

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />

          </div>

        </button>


        {}

        <button
          onClick={() => navigate("/admin/items")}
          className="group rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-md"
        >

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-muted">
                Total Items
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {dashboard.items.totalItems}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Package size={23} />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary">

            Manage items

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />

          </div>

        </button>


        {}

        <button
          onClick={() => navigate("/admin/requests")}
          className="group rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-md"
        >

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-muted">
                Total Requests
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {dashboard.requests.totalRequests}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ClipboardList size={23} />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary">

            View requests

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />

          </div>

        </button>


        {}

        <button
          onClick={() => navigate("/admin/reviews")}
          className="group rounded-2xl border border-border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-md"
        >

          <div className="flex items-start justify-between">

            <div>

              <p className="text-sm text-muted">
                Total Reviews
              </p>

              <p className="mt-2 text-3xl font-bold text-text">
                {dashboard.reviews.totalReviews}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF7E6] text-accent">
              <Star
                size={23}
                fill="currentColor"
              />
            </div>

          </div>

          <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-primary">

            View reviews

            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />

          </div>

        </button>

      </div>


      {}
      {}
      {}

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 sm:p-7">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-text">
              User Overview
            </h2>

            <p className="mt-1 text-sm text-muted">
              Community member status
            </p>

          </div>

          <button
            onClick={() => navigate("/admin/users")}
            className="hidden items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark sm:flex"
          >
            View users
            <ArrowRight size={16} />
          </button>

        </div>


        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {}

          <button
            onClick={() => navigate("/admin/pending-users")}
            className="rounded-2xl border border-border bg-background p-5 text-left transition hover:border-accent/40"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF7E6] text-accent">
                <Clock size={21} />
              </div>

              <span className="text-2xl font-bold text-text">
                {dashboard.users.pendingUsers}
              </span>

            </div>

            <p className="mt-4 font-semibold text-text">
              Pending Verification
            </p>

            <p className="mt-1 text-sm text-muted">
              Waiting for approval
            </p>

          </button>


          {}

          <div
            onClick={() => navigate("/admin/users")}
            className="cursor-pointer rounded-2xl border border-border bg-background p-5 transition hover:border-success/30 hover:shadow-md"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                <UserCheck size={21} />
              </div>

              <span className="text-2xl font-bold text-text">
                {dashboard.users.verifiedUsers}
              </span>

            </div>

            <p className="mt-4 font-semibold text-text">
              Verified Users
            </p>

            <p className="mt-1 text-sm text-muted">
              Active community members
            </p>

          </div>


          {}

          <div
            onClick={() => navigate("/admin/users")}
            className="cursor-pointer rounded-2xl border border-border bg-background p-5 transition hover:border-danger/30 hover:shadow-md"
          >

            <div className="flex items-center justify-between">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
                <UserX size={21} />
              </div>

              <span className="text-2xl font-bold text-text">
                {dashboard.users.blockedUsers}
              </span>

            </div>

            <p className="mt-4 font-semibold text-text">
              Blocked Users
            </p>

            <p className="mt-1 text-sm text-muted">
              Restricted accounts
            </p>

          </div>

        </div>

      </div>


      {}
      {}
      {}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">


        {}
        {}
        {}

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-text">
                Item Overview
              </h2>

              <p className="mt-1 text-sm text-muted">
                Current sharing activity
              </p>

            </div>

            <Package
              size={25}
              className="text-primary"
            />

          </div>


          <div className="mt-6 space-y-4">

            {}

            <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <CheckCircle2 size={20} />
                </div>

                <div>

                  <p className="font-semibold text-text">
                    Available
                  </p>

                  <p className="text-xs text-muted">
                    Ready to borrow
                  </p>

                </div>

              </div>

              <span className="text-xl font-bold text-text">
                {dashboard.items.availableItems}
              </span>

            </div>


            {}

            <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Package size={20} />
                </div>

                <div>

                  <p className="font-semibold text-text">
                    Borrowed
                  </p>

                  <p className="text-xs text-muted">
                    Currently with borrowers
                  </p>

                </div>

              </div>

              <span className="text-xl font-bold text-text">
                {dashboard.items.borrowedItems}
              </span>

            </div>

          </div>

        </div>


        {}
        {}
        {}

        <div
          onClick={() => navigate("/admin/requests")}
          className="cursor-pointer rounded-3xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md sm:p-7"
        >

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-text">
                Request Overview
              </h2>

              <p className="mt-1 text-sm text-muted">
                Borrowing request status
              </p>

            </div>

            <ClipboardList
              size={25}
              className="text-primary"
            />

          </div>


          <div className="mt-6 grid grid-cols-2 gap-4">

            {}

            <div className="rounded-2xl border border-border bg-background p-4">

              <Clock
                size={20}
                className="text-accent"
              />

              <p className="mt-3 text-2xl font-bold text-text">
                {dashboard.requests.pendingRequests}
              </p>

              <p className="mt-1 text-sm text-muted">
                Pending
              </p>

            </div>


            {}

            <div className="rounded-2xl border border-border bg-background p-4">

              <CheckCircle2
                size={20}
                className="text-success"
              />

              <p className="mt-3 text-2xl font-bold text-text">
                {dashboard.requests.acceptedRequests}
              </p>

              <p className="mt-1 text-sm text-muted">
                Accepted
              </p>

            </div>


            {}

            <div className="rounded-2xl border border-border bg-background p-4">

              <XCircle
                size={20}
                className="text-danger"
              />

              <p className="mt-3 text-2xl font-bold text-text">
                {dashboard.requests.rejectedRequests}
              </p>

              <p className="mt-1 text-sm text-muted">
                Rejected
              </p>

            </div>


            {}

            <div className="rounded-2xl border border-border bg-background p-4">

              <RotateCcw
                size={20}
                className="text-primary"
              />

              <p className="mt-3 text-2xl font-bold text-text">
                {dashboard.requests.returnedRequests}
              </p>

              <p className="mt-1 text-sm text-muted">
                Returned
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;