import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Top Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

    </div>
  );
}