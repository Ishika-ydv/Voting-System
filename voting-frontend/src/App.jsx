import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

// 🔹 Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";

// 🔹 User Pages
import Polls from "./pages/user/Polls";
import Vote from "./pages/user/Vote";
import Results from "./pages/user/Results";
import Profile from "./pages/user/Profile";

// 🔹 Admin Pages
import CreatePoll from "./pages/admin/CreatePoll";
import ManagePolls from "./pages/admin/ManagePolls";
import AdminResults from "./pages/admin/AdminResults";

// 🔥 NEW LANDING PAGE
import Landing from "./pages/LandingPage";

export default function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify-otp" element={<PublicRoute><VerifyOTP /></PublicRoute>} />

      {/* ================= AUTH + LAYOUT ================= */}
      <Route element={<MainLayout />}>

        {/* USER */}
        <Route path="/polls" element={<PrivateRoute><Polls /></PrivateRoute>} />
        <Route path="/polls/:id" element={<PrivateRoute><Vote /></PrivateRoute>} />
        <Route path="/polls/:id/results" element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* ADMIN */}
        <Route path="/admin/polls" element={<AdminRoute><ManagePolls /></AdminRoute>} />
        <Route path="/admin/polls/new" element={<AdminRoute><CreatePoll /></AdminRoute>} />
        <Route path="/admin/polls/:id/results" element={<AdminRoute><AdminResults /></AdminRoute>} />

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}