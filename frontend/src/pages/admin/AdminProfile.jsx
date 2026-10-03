import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  ShieldCheck,
  Calendar,
  RefreshCw,
  AlertCircle,
  Pencil,
  X,
  Save,
  Lock,
  LogOut,
} from "lucide-react";

function AdminProfile() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    village: "",
    address: "",
    profileImage: null,
    password: "",
  });

  const [existingImage, setExistingImage] = useState("");

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:3003/api/admin/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.log("Admin profile loading error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          "Failed to load admin profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    navigate("/login");
  };

  const handleOpenEdit = () => {
    setSuccessMessage("");
    setError("");

    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      phone: admin.phone || "",
      village: admin.village || "",
      address: admin.address || "",
      profileImage: null,
      password: "",
    });

    setExistingImage(admin.profileImage || "");

    setEditOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setError("");
    setSuccessMessage("");
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      const token = localStorage.getItem("token");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("village", formData.village);
      data.append("address", formData.address);

      if (formData.profileImage) {
        data.append(
          "profileImage",
          formData.profileImage
        );
      }

      if (formData.password.trim() !== "") {
        data.append("password", formData.password);
      }

      const response = await axios.patch(
        "http://localhost:3003/api/updateProfile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.user) {
        setAdmin(response.data.user);

        setExistingImage(
          response.data.user.profileImage || ""
        );
      }

      setEditOpen(false);

      setSuccessMessage(
        response.data.msg ||
          "Admin profile updated successfully."
      );

      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      console.log("Admin profile update error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
        return;
      }

      setError(
        error.response?.data?.msg ||
          error.response?.data?.message ||
          "Failed to update admin profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw
            size={32}
            className="animate-spin text-primary"
          />

          <p className="text-sm text-muted">
            Loading admin profile...
          </p>
        </div>
      </div>
    );
  }

  if (error && !admin) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle
              size={22}
              className="text-red-600"
            />

            <div>
              <h2 className="font-semibold text-red-700">
                Unable to load profile
              </h2>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>
          </div>

          <button
            onClick={fetchAdminProfile}
            className="mt-5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted">
          Admin profile not found.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">

      <div className="mb-8">
        <p className="text-sm font-semibold tracking-wide text-primary">
          ADMINISTRATION
        </p>

        <h1 className="mt-1 text-3xl font-bold text-text">
          Admin Profile
        </h1>

        <p className="mt-2 text-muted">
          Manage and view your administrator account information.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700">
          {successMessage}
        </div>
      )}

      {error && admin && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-border bg-card">

        {/* PROFILE HEADER */}

        <div className="bg-primary px-6 py-8 sm:px-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">

            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border-4 border-white/20 bg-white/10 text-white">

              {admin.profileImage ? (
                <img
                  src={admin.profileImage}
                  alt={admin.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={42} />
              )}

            </div>

            <div className="text-center sm:text-left">

              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">

                <h2 className="text-2xl font-bold text-white">
                  {admin.name}
                </h2>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
                  <ShieldCheck size={15} />
                  Administrator
                </span>

              </div>

              <p className="mt-2 text-sm text-white/80">
                {admin.email}
              </p>

              <p className="mt-1 text-sm text-white/70">
                NeighbourShare Community Administrator
              </p>

            </div>
          </div>
        </div>

        {/* PROFILE DETAILS */}

        <div className="p-6 sm:p-8">

          <div className="mb-6">
            <h3 className="text-lg font-bold text-text">
              Personal Information
            </h3>

            <p className="mt-1 text-sm text-muted">
              Your account and contact details.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted">
                    Full Name
                  </p>

                  <p className="mt-1 truncate font-semibold text-text">
                    {admin.name}
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mail size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-muted">
                    Email Address
                  </p>

                  <p className="mt-1 truncate font-semibold text-text">
                    {admin.email}
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Phone size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted">
                    Phone Number
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {admin.phone || "Not available"}
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted">
                    Village
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {admin.village || "Not available"}
                  </p>
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 sm:col-span-2">
              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Home size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted">
                    Address
                  </p>

                  <p className="mt-1 font-semibold text-text">
                    {admin.address || "Not available"}
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* ACCOUNT INFORMATION */}

          <div className="mt-8 border-t border-border pt-8">

            <div className="mb-5">
              <h3 className="text-lg font-bold text-text">
                Account Information
              </h3>

              <p className="mt-1 text-sm text-muted">
                Administrator account status and details.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-muted">
                      Account Role
                    </p>

                    <p className="mt-1 font-semibold capitalize text-text">
                      {admin.role}
                    </p>
                  </div>

                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-muted">
                      Account Status
                    </p>

                    <p className="mt-1 font-semibold text-green-600">
                      Verified
                    </p>
                  </div>

                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Calendar size={19} />
                  </div>

                  <div>
                    <p className="text-xs text-muted">
                      Member Since
                    </p>

                    <p className="mt-1 font-semibold text-text">
                      {formatDate(admin.createdAt)}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* ACTION BUTTONS */}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              onClick={fetchAdminProfile}
              className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              <RefreshCw size={17} />
              Refresh Profile
            </button>

            <button
              onClick={handleOpenEdit}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
            >
              <Pencil size={17} />
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>

        </div>
      </div>

      {/* EDIT MODAL */}

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-card shadow-xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-5">

              <div>
                <h2 className="text-xl font-bold text-text">
                  Edit Admin Profile
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Update your administrator account information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted transition hover:bg-background hover:text-text disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleUpdateProfile}
              className="p-6"
            >

              {/* IMAGE PREVIEW */}

              <div className="mb-6 flex flex-col items-center">

                <div className="h-28 w-28 overflow-hidden rounded-3xl border-4 border-border bg-background shadow-sm">

                  {formData.profileImage ? (
                    <img
                      src={URL.createObjectURL(
                        formData.profileImage
                      )}
                      alt={formData.name}
                      className="h-full w-full object-cover"
                    />
                  ) : existingImage ? (
                    <img
                      src={existingImage}
                      alt={formData.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User
                        size={42}
                        className="text-muted"
                      />
                    </div>
                  )}

                </div>

              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Village
                  </label>

                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-text">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* PROFILE IMAGE */}

                <div className="sm:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-text">
                    Profile Image
                  </label>

                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />

                  <p className="mt-2 text-xs text-muted">
                    Select a new image to change your administrator profile picture.
                  </p>

                </div>

                {/* PASSWORD */}

                <div className="sm:col-span-2">

                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-text">
                    <Lock
                      size={16}
                      className="text-primary"
                    />
                    New Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave empty to keep your current password"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />

                  <p className="mt-2 text-xs text-muted">
                    Leave this field empty if you do not want to change your password.
                  </p>

                </div>

              </div>

              {/* FORM BUTTONS */}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text transition hover:bg-background disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <RefreshCw
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProfile;