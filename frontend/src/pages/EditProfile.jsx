import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  ArrowLeft,
  Save,
  ShieldCheck,
} from "lucide-react";

function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    address: "",
    profileImage: null,
  });

  const [existingImage, setExistingImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://https://neighbourshare-i2wq.onrender.com/api/myProfile",
        {
          headers,
        }
      );

      const data = response.data;

      setUser(data);

      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        village: data.village || "",
        address: data.address || "",
        profileImage: null,
      });

      setExistingImage(data.profileImage || "");
    } catch (err) {
      console.log("Profile loading error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.msg ||
          "Unable to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("phone", formData.phone);
      data.append("village", formData.village);
      data.append("address", formData.address);

      if (formData.profileImage) {
        data.append(
          "profileImage",
          formData.profileImage
        );
      }

      const response = await axios.patch(
        "http://https://neighbourshare-i2wq.onrender.com/api/updateProfile",
        data,
        {
          headers,
        }
      );

      setSuccess(
        response.data.msg ||
          "Profile updated successfully"
      );

      if (response.data.user) {
        setUser(response.data.user);

        setFormData({
          name: response.data.user.name || "",
          phone: response.data.user.phone || "",
          village: response.data.user.village || "",
          address: response.data.user.address || "",
          profileImage: null,
        });

        setExistingImage(
          response.data.user.profileImage || ""
        );
      }

      setTimeout(() => {
        navigate("/myProfile");
      }, 1000);
    } catch (err) {
      console.log("Profile update error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.msg ||
          "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-muted">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted">
            Unable to load profile.
          </p>

          <button
            onClick={() => navigate("/myProfile")}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-white"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/myProfile")}
            className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-text hover:bg-background transition"
          >
            <ArrowLeft size={19} />
          </button>

          <div>
            <p className="text-sm font-semibold text-primary tracking-wide">
              NEIGHBOURSHARE
            </p>

            <h1 className="text-3xl font-bold text-text mt-1">
              Edit Profile
            </h1>

            <p className="text-muted mt-1">
              Update your community profile information
            </p>
          </div>
        </div>

        {/* PROFILE CARD */}

        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">

          {/* COVER */}

          <div className="h-28 bg-primary relative overflow-hidden">
            <div className="absolute -right-10 -top-20 w-64 h-64 rounded-full bg-primary-dark opacity-50"></div>

            <div className="absolute right-40 -bottom-20 w-48 h-48 rounded-full bg-primary-dark opacity-30"></div>
          </div>

          {/* PROFILE IMAGE */}

          <div className="px-6 sm:px-8">
            <div className="-mt-14 relative">

              <div className="w-28 h-28 rounded-full border-4 border-card bg-background overflow-hidden shadow-md">

                {formData.profileImage ? (
                  <img
                    src={URL.createObjectURL(
                      formData.profileImage
                    )}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : existingImage ? (
                  <img
                    src={existingImage}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User
                      size={48}
                      className="text-muted"
                    />
                  </div>
                )}

              </div>

            </div>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >

            {/* PERSONAL INFORMATION */}

            <div className="mb-8">
              <h2 className="text-lg font-bold text-text">
                Personal Information
              </h2>

              <p className="text-sm text-muted mt-1">
                Keep your profile information up to date.
              </p>
            </div>

            {/* NAME */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">
                Name
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
                  required
                  placeholder="Enter your name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>
            </div>

            {/* EMAIL */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-muted cursor-not-allowed"
                />
              </div>

              <p className="text-xs text-muted mt-2">
                Email cannot be changed from this page.
              </p>
            </div>

            {/* PHONE */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">
                Phone
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
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>
            </div>

            {/* VILLAGE */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">
                Village
              </label>

              <div className="relative">
                <Home
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Enter your village"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>

              <p className="text-xs text-muted mt-2">
                Your village helps NeighbourShare connect you with nearby neighbours.
              </p>
            </div>

            {/* ADDRESS */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-2">
                Address
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-4 top-4 text-muted"
                />

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter your address"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-text outline-none resize-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>
            </div>

            {/* PROFILE IMAGE */}

            <div className="mb-8">
              <label className="block text-sm font-medium text-text mb-2">
                Profile Image
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                />
              </div>

              <p className="text-xs text-muted mt-2">
                Select a new image to change your profile picture.
              </p>
            </div>

            {/* VERIFICATION */}

            <div className="bg-background border border-border rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">

                <ShieldCheck
                  size={21}
                  className={
                    user.isverified
                      ? "text-success mt-0.5"
                      : "text-muted mt-0.5"
                  }
                />

                <div>
                  <p className="font-semibold text-text">
                    Account Verification
                  </p>

                  <p className="text-sm text-muted mt-1">
                    {user.isverified
                      ? "Your account has been verified by the NeighbourShare admin."
                      : "Your account is currently waiting for admin verification."}
                  </p>
                </div>

              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-danger">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-success">
                {success}
              </div>
            )}

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">

              <button
                type="button"
                onClick={() => navigate("/myProfile")}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border text-text hover:bg-background transition"
              >
                <ArrowLeft size={18} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={18} />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;