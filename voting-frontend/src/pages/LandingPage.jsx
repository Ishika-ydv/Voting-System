import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex flex-col">

      {/* <Navbar /> */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">
          🗳️ VoteSecure
        </h1>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="text-center max-w-2xl">

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Secure Online Voting System
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Create polls, vote securely, and view real-time results with a modern,
            transparent voting platform.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
            >
              Get Started
            </Link>

            <Link
              to="/polls"
              className="px-6 py-3 bg-white border rounded-xl font-medium hover:bg-gray-100"
            >
              View Polls
            </Link>
          </div>

          {/* Features */}
          <div className="mt-12 grid md:grid-cols-3 gap-4 text-left">

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold">🔐 Secure</h3>
              <p className="text-sm text-gray-600 mt-1">
                Protected with authentication & secure cookies
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold">⚡ Fast Voting</h3>
              <p className="text-sm text-gray-600 mt-1">
                Real-time vote updates and instant results
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold">📊 Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">
                View detailed poll results and insights
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
 
    </div>
  );
}