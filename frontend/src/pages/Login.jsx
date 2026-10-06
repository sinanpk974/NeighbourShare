import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Home,
  ShieldCheck,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://neighbourshare-i2wq.onrender.com/api/login",
        formData
      );

      console.log("Login response:", response.data);

      const token = response.data.token;

      localStorage.setItem("token", token);
if (response.data.role) {
  localStorage.setItem("role", response.data.role);
}
console.log("Login response:", response.data);
if (response.data.role === "admin") {
  navigate("/admin/dashboard");
  return;
}
      const itemsResponse = await axios.get(
        "https://neighbourshare-i2wq.onrender.com/api/myItems",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("My items:", itemsResponse.data);

      const myItems = itemsResponse.data;

      if (myItems.length < 3) {
        navigate("/myItems");
      } else {
        navigate("/");
      }

    } catch (error) {
      console.log("Login error:", error);
      if (
        error.config?.url?.includes("/myItems")
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        setError(
          "Login successful, but we couldn't load your items. Please try again."
        );
      } else {
        setError(
          error.response?.data?.msg ||
            "Login failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">

      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg lg:grid-cols-2">

          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div className="hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

              {}

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                  <Home size={22} />
                </div>

                <div>

                  <h1 className="text-xl font-bold">
                    NeighbourShare
                  </h1>

                  <p className="text-xs text-white/70">
                    Share locally. Borrow confidently.
                  </p>

                </div>

              </div>


              {}

              <div className="mt-16">

                <p className="text-sm font-semibold text-accent">
                  WELCOME BACK
                </p>

                <h2 className="mt-3 text-4xl font-bold leading-tight">
                  Your community
                  <br />
                  is waiting for you.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                  Login to continue sharing items with your
                  neighbours and discover things you can borrow
                  from your local community.
                </p>

              </div>

            </div>


            {}

            <div className="rounded-2xl bg-white/10 p-5">

              <div className="flex gap-3">

                <ShieldCheck
                  size={22}
                  className="shrink-0 text-accent"
                />

                <div>

                  <p className="text-sm font-medium">
                    Trusted community sharing
                  </p>

                  <p className="mt-1 text-xs leading-5 text-white/70">
                    Only verified community members can access
                    protected features.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =====================================
              RIGHT SIDE
          ===================================== */}

          <div className="p-6 sm:p-10">

            {}

            <div className="mb-8">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LogIn size={24} />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-text sm:text-3xl">
                Welcome back
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                Login to your NeighbourShare account.
              </p>

            </div>


            {}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                {error}
              </div>
            )}


            {/* =====================================
                FORM
            ===================================== */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Email
                </label>

                <div className="relative">

                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                </div>

              </div>


              {}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-12 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>


              {}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Login
                  </>
                )}

              </button>

            </form>


            {}

            <p className="mt-7 text-center text-sm text-muted">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-primary hover:underline"
              >
                Create an account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;