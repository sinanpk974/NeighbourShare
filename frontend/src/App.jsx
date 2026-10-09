import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";

import Home from "./pages/Home";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyItems from "./pages/MyItems";
import BorrowRequest from "./pages/BorrowRequest";
import MyRequests from "./pages/MyRequests";
import MyProfile from "./pages/MyProfile";
import EditProfile from "./pages/EditProfile";
import ReviewModal from "./pages/Review";
import ViewReview from "./pages/ViewReview";
import Notifications from "./pages/Notifications";

import AdminLayout from "./pages/admin/AdLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import PendingUsers from "./pages/admin/PendingUsers";
import AdminItems from "./pages/admin/AdminItems";
import AdminRequest from "./pages/admin/AdminRequests";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminNotification from "./pages/admin/AdminNotification";

function App() {

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

      const payload = JSON.parse(
        atob(token.split(".")[1])
      );

      const currentTime = Date.now() / 1000;

      if (payload.exp && payload.exp <= currentTime) {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        return;
      }

      if (payload.role) {
        localStorage.setItem("role", payload.role);
      }

      if (
        payload.role === "admin" &&
        !location.pathname.startsWith("/admin")
      ) {
        navigate("/admin/dashboard", { replace: true });
      }

    } catch (error) {

      localStorage.removeItem("token");
      localStorage.removeItem("role");

    }

  }, [location.pathname, navigate]);
  const isAdminRoute =
    location.pathname.startsWith("/admin");


  return (
    <>

      {!isAdminRoute && <Navbar />}

      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/items"
          element={<Items />}
        />

        <Route
          path="/itemDetails/:id"
          element={<ItemDetails />}
        />
        <Route
          path="/notifications"
          element={<Notifications />}/>

        {/* ================= PROTECTED USER ROUTES ================= */}

        <Route element={<ProtectedRoutes />}>

          <Route
            path="/myitems"
            element={<MyItems />}
          />

          <Route
            path="/borrowRequest/:itemId"
            element={<BorrowRequest />}
          />

          <Route
            path="/myRequests"
            element={<MyRequests />}
          />

          <Route
            path="/myProfile"
            element={<MyProfile />}
          />

          <Route
            path="/editProfile"
            element={<EditProfile />}
          />

          <Route
            path="/review"
            element={<ReviewModal />}
          />

          <Route
            path="/viewreview"
            element={<ViewReview />}
          />
          

        </Route>


        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="pending-users"
            element={<PendingUsers />}
          />

          <Route
            path="items"
            element={<AdminItems />}
          />
         
         <Route
            path="requests"
            element={<AdminRequest />}
          />

          <Route
            path="reviews"
            element={<AdminReviews />}
          />
          <Route
            path="profile"
            element={<AdminProfile />}
          />
          <Route 
          path="notifications"
          element={<AdminNotification />}
          />
        </Route>

      </Routes>

    </>
  );
}

export default App;