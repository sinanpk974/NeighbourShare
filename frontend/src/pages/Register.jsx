import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Home,
  Eye,
  EyeOff,
  Clock3,
  CheckCircle2,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    village: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

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

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.village ||
      !formData.address
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3003/api/register",
        formData
      );

      console.log("Registration response:", response.data);
      setRegistered(true);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        village: "",
        address: "",
      });
    } catch (error) {
      console.log("Registration error:", error);

      setError(
        error.response?.data?.msg ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <main className="min-h-screen bg-background">

        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

          <div className="w-full max-w-lg rounded-3xl bg-white p-7 text-center shadow-lg sm:p-10">

            {}

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">

              <CheckCircle2
                size={34}
                strokeWidth={2}
              />

            </div>


            {}

            <h1 className="mt-6 text-2xl font-bold text-text sm:text-3xl">
              Registration successful!
            </h1>


            <p className="mt-3 text-sm leading-6 text-muted">
              Your NeighbourShare account has been created
              successfully.
            </p>


            {}

            <div className="mt-7 rounded-2xl border border-primary/10 bg-primary/5 p-5 text-left">

              <div className="flex gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">

                  <Clock3 size={21} />

                </div>

                <div>

                  <h2 className="font-bold text-text">
                    Waiting for verification
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    Your account needs to be verified by our
                    administrator before you can log in.
                  </p>

                </div>

              </div>

            </div>


            {}

            <p className="mt-6 text-sm leading-6 text-muted">
              You don't need to keep trying to log in. Once your
              account is verified, you will be able to access
              your NeighbourShare account.
            </p>


            {}

            <button
              type="button"
              onClick={() => navigate("/")}
              className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <Home size={18} />
              Go to Home
            </button>


            {}

            <p className="mt-5 text-xs leading-5 text-muted">
              Already verified by an administrator?
              {" "}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                You can login here.
              </Link>
            </p>

          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">

      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg lg:grid-cols-2">

          {}

          <div className="hidden bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between">

            <div>

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


              <div className="mt-16">

                <p className="text-sm font-semibold text-accent">
                  JOIN YOUR COMMUNITY
                </p>

                <h2 className="mt-3 text-4xl font-bold leading-tight">
                  Share what you have.
                  <br />
                  Borrow what you need.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                  Create your NeighbourShare account and become
                  part of a trusted local sharing community.
                </p>

              </div>

            </div>


            <div className="rounded-2xl bg-white/10 p-5">

              <p className="text-sm font-medium">
                Why join NeighbourShare?
              </p>

              <p className="mt-2 text-xs leading-5 text-white/70">
                Connect with people in your village, share useful
                items and borrow from neighbours you can trust.
              </p>

            </div>

          </div>


          {}

          <div className="p-6 sm:p-10">

            <div className="mb-8">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserPlus size={24} />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-text sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted">
                Join your local community and start sharing.
              </p>

            </div>


            {}

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}


            {}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Full name
                </label>

                <div className="relative">

                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                </div>

              </div>


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
                    placeholder="Create a password"
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-12 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
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

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Phone number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                </div>

              </div>


              {}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Village
                </label>

                <div className="relative">

                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    placeholder="Enter your village"
                    className="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

                </div>

              </div>


              {}

              <div>

                <label className="mb-2 block text-sm font-semibold text-text">
                  Address
                </label>

                <div className="relative">

                  <Home
                    size={18}
                    className="absolute left-4 top-4 text-muted"
                  />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    rows="3"
                    className="w-full resize-none rounded-xl border border-border bg-background py-3 pl-11 pr-4 text-sm text-text outline-none transition placeholder:text-muted/70 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />

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
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create account
                  </>
                )}

              </button>

            </form>


            {}

            <p className="mt-7 text-center text-sm text-muted">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Register;