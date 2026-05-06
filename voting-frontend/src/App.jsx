import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

// 🔹 Auth Pages (NO Navbar/Footer)
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";

// 🔹 User Pages
import Polls from "./pages/user/Polls";
import Vote from "./pages/user/Vote";
import Results from "./pages/user/Results";
import Profile from "./pages/user/Profile";
import VotedPoll from "./pages/user/VotedPoll";
import ResultsDashboard from "./pages/user/ResultsDashboard";

// 🔹 Admin Pages
import CreatePoll from "./pages/admin/CreatePoll";
import ManagePolls from "./pages/admin/ManagePolls";
import AdminResults from "./pages/admin/AdminResults";
import AdminDashboard from "./pages/admin/AdminDashboard";

// 🔥 Landing Page
import Landing from "./pages/LandingPage";

export default function App() {
  return (
    <Routes>

      {/* ================= MAIN LAYOUT (Navbar + Footer) ================= */}
      <Route element={<MainLayout />}>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />

        {/* USER */}
        <Route
          path="/polls"
          element={
            <PrivateRoute>
              <Polls />
            </PrivateRoute>
          }
        />

        <Route
          path="/polls/:id"
          element={
            <PrivateRoute>
              <Vote />
            </PrivateRoute>
          }
        />

        <Route
          path="/polls/:id/results"
          element={
            <PrivateRoute>
              <Results />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="/polls/:id/voted" element={<VotedPoll />} />

        {/* ✅ USER RESULTS (FIXED) */}
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <ResultsDashboard />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin/polls"
          element={
            <AdminRoute>
              <ManagePolls />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/polls/new"
          element={
            <AdminRoute>
              <CreatePoll />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/polls/:id/results"
          element={
            <AdminRoute>
              <AdminResults />
            </AdminRoute>
          }
        />

        {/* ✅ ADMIN RESULTS (FIXED) */}
        <Route
          path="/admin/results"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

      </Route>

      {/* ================= AUTH (NO NAVBAR/FOOTER) ================= */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/verify-otp"
        element={
          <PublicRoute>
            <VerifyOTP />
          </PublicRoute>
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}