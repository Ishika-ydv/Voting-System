import { Link } from "react-router-dom";
import { Shield, BarChart3, Users, CheckSquare } from "lucide-react";
import votingImg from "../assets/voting.jpeg";

export default function LandingPage() {
  return (
    <div className="bg-white">

      {/* ================= HERO ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row items-center gap-10">

        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 ml-5">
            Voting System
          </h1>

          <p className="text-gray-600 mb-6 max-w-md ml-5">
            A Secure Voting System is an online platform that allows users to vote safely and easily from anywhere. It ensures privacy and accuracy using secure authentication and encryption.
          </p>

          <p className="italic text-gray-800 font-medium ml-5">
            “Your Vote. Your Voice — Anytime, Anywhere”
          </p>

          <div className="mt-6 flex gap-4 ml-5">
            <Link
              to="/register"
              className="bg-[#080838] text-white px-6 py-2 rounded-md hover:opacity-90"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="border px-6 py-2 rounded-md hover:bg-gray-100"
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex-1 flex justify-center">
            <img
              src={votingImg}
              alt="Online voting system"
              className="w-full max-w-md object-contain"
            />
          </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-2">
            Why Choose Online Voting?
          </h2>
          <p className="text-gray-500 mb-10">
            Built with cutting-edge technology to ensure every vote counts
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card */}
            <div className="bg-blue-100 p-6 rounded-xl shadow-sm text-left">
              <Shield className="mb-3 text-[#080838]" />
              <h3 className="font-semibold mb-2">Secure & Encrypted</h3>
              <p className="text-sm text-gray-600">
                Military-grade encryption ensures your vote remains confidential.
              </p>
            </div>

            <div className="bg-yellow-100 p-6 rounded-xl shadow-sm text-left">
              <BarChart3 className="mb-3 text-[#080838]" />
              <h3 className="font-semibold mb-2">Real-time Results</h3>
              <p className="text-sm text-gray-600">
                Watch results update live as votes are cast.
              </p>
            </div>

            <div className="bg-pink-100 p-6 rounded-xl shadow-sm text-left">
              <Users className="mb-3 text-[#080838]" />
              <h3 className="font-semibold mb-2">Accessible to All</h3>
              <p className="text-sm text-gray-600">
                Vote from anywhere, anytime with ease.
              </p>
            </div>

            <div className="bg-green-100 p-6 rounded-xl shadow-sm text-left">
              <CheckSquare className="mb-3 text-[#080838]" />
              <h3 className="font-semibold mb-2">Transparent Analytics</h3>
              <p className="text-sm text-gray-600">
                Full transparency with detailed analytics and audit trails.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-2">
            How It Works?
          </h2>
          <p className="text-gray-500 mb-12">
            Four simple steps to participate in democracy
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

            {[
              {
                step: "1",
                title: "Create Account",
                desc: "Sign up with your email and verify your identity securely.",
              },
              {
                step: "2",
                title: "Browse Elections",
                desc: "View all active elections available.",
              },
              {
                step: "3",
                title: "Cast Your Vote",
                desc: "Submit your vote with a single click.",
              },
              {
                step: "4",
                title: "View Results",
                desc: "Track results in real-time.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-linear-to-br from-[#080838] to-blue-400 text-white font-bold">
                  {item.step}
                </div>

                <h3 className="font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-600">
                  {item.desc}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

    </div>
  );
}