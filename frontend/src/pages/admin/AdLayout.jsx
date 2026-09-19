import { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdSidebar";
import AdminNavbar from "../../components/admin/AdNavbar";

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">

      {}

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {}

      <div className="min-h-screen lg:ml-72">

        {}

        <AdminNavbar
          setMobileOpen={setMobileOpen}
        />

        {}

        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">

          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;