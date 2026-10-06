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
  RefreshCw,
  ShieldCheck,
  XCircle,
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

  const [registeredEmail, setRegisteredEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  const [verificationStatus, setVerificationStatus] =
    useState("pending");

  const [statusMessage, setStatusMessage] = useState(
    "Your account is still waiting for admin verification."
  );

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
        "https://neighbourshare-i2wq.onrender.com/api/register",
        formData
      );

      console.log("Registration response:", response.data);

      // Keep the registered email for status checking
      setRegisteredEmail(formData.email);

      setRegistered(true);

      setVerificationStatus("pending");

      setStatusMessage(
        "Your account is still waiting for admin verification."
      );

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

  const checkVerificationStatus = async () => {
    try {
      setCheckingStatus(true);
      setError("");

      const response = await axios.post(
        "https://neighbourshare-i2wq.onrender.com/api/check-verification",
        {
          email: registeredEmail,
        }
      );

      if (response.data?.success) {
        setVerificationStatus(response.data.status);
        setStatusMessage(response.data.msg);
      }
    } catch (error) {
      console.log("Verification status error:", error);

      setError(
        error.response?.data?.msg ||
          "Unable to check verification status."
      );
    } finally {
      setCheckingStatus(false);
    }
  };

  if (registered) {
    const isVerified = verificationStatus === "verified";
    const isRejected = verificationStatus === "rejected";
    const isBlocked = verificationStatus === "blocked";

    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg rounded-3xl bg-white p-7 text-center shadow-lg sm:p-10">

            {/* STATUS ICON */}
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                isVerified
                  ? "bg-green-50 text-green-600"
                  : isRejected || isBlocked
                  ? "bg-red-50 text-red-600"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {isVerified ? (
                <ShieldCheck size={34} strokeWidth={2} />
              ) : isRejected || isBlocked ? (
                <XCircle size={34} strokeWidth={2} />
              ) : (
                <Clock3 size={34} strokeWidth={2} />
              )}
            </div>

            {/* TITLE */}
            <h1 className="mt-6 text-2xl font-bold text-text sm:text-3xl">
              {isVerified
                ? "Account verified!"
                : isRejected
                ? "Verification rejected"
                : isBlocked
                ? "Account blocked"
                : "Registration successful!"}
            </h1>

            {/* DESCRIPTION */}
            <p className="mt-3 text-sm leading-6 text-muted">
              {isVerified
                ? "Your NeighbourShare account has been verified successfully."
                : isRejected
                ? "Your account verification request was rejected by the administrator."
                : isBlocked
                ? "Your account has been blocked by the administrator."
                : "Your NeighbourShare account has been created successfully."}
            </p>

            {/* EMAIL */}
            <div className="mt-5 rounded-xl border border-border bg-background px-4 py-3">
              <p className="text-xs font-medium text-muted">
                Registered email
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-text">
                {registeredEmail}
              </p>
            </div>

            {/* STATUS BOX */}
            <div
              className={`mt-6 rounded-2xl border p-5 text-left ${
                isVerified
                  ? "border-green-200 bg-green-50"
                  : isRejected || isBlocked
                  ? "border-red-200 bg-red-50"
                  : "border-primary/10 bg-primary/5"
              }`}
            >
              <div className="flex gap-4">

                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isVerified
                      ? "bg-green-100 text-green-600"
                      : isRejected || isBlocked
                      ? "bg-red-100 text-red-600"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {isVerified ? (
                    <CheckCircle2 size={21} />
                  ) : isRejected || isBlocked ? (
                    <XCircle size={21} />
                  ) : (
                    <Clock3 size={21} />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-text">
                    {isVerified
                      ? "You can now login"
                      : isRejected
                      ? "Verification rejected"
                      : isBlocked
                      ? "Account blocked"
                      : "Waiting for verification"}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {statusMessage}
                  </p>
                </div>

              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* CHECK STATUS */}
            {!isVerified && !isRejected && !isBlocked && (
              <button
                type="button"
                onClick={checkVerificationStatus}
                disabled={checkingStatus}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary bg-white px-5 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkingStatus ? (
                  <>
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                    Checking status...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    Check verification status
                  </>
                )}
              </button>
            )}

            {/* LOGIN */}
            {isVerified && (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                <ShieldCheck size={18} />
                Login to NeighbourShare
              </button>
            )}

            {/* HOME */}
            {!isVerified && (
              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                <Home size={18} />
                Go to Home
              </button>
            )}

            {/* LOGIN LINK */}
            {!isRejected && !isBlocked && (
              <p className="mt-5 text-xs leading-5 text-muted">
                Already verified by an administrator?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  You can login here.
                </Link>
              </p>
            )}

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">

        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-lg lg:grid-cols-2">

          {/* LEFT SIDE */}
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

          {/* RIGHT SIDE */}
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

            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* NAME */}
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

              {/* EMAIL */}
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

              {/* PASSWORD */}
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

              {/* PHONE */}
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

              {/* VILLAGE */}
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

              {/* ADDRESS */}
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

              {/* SUBMIT */}
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

            {/* LOGIN */}
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