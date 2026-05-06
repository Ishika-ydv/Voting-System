import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setUser, setRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await login(data);
      const user = res?.data?.data?.user;
      

      setUser(user);
      setRole(user?.role?.toLowerCase());
      console.log(user.role)

      

      toast.success("Login successful");

      navigate(user?.role === "admin" ? "/admin/polls" : "/polls");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* 🔵 LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-[#080838] text-white p-16 flex-col justify-between">
        <div>
          <p className="text-xs tracking-widest text-gray-300 mb-6">
            A CIVIC INSTRUMENT
          </p>

          <h1 className="text-4xl font-serif leading-tight">
            Every voice tallied,
            <br />
            <span className="text-yellow-400 italic">
              every ballot honoured.
            </span>
          </h1>

          <p className="mt-6 text-sm text-gray-300 max-w-md">
            Secure, transparent, and verifiable digital voting.
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div>
            <p className="text-yellow-400 text-xl font-semibold">256-bit</p>
            <p className="text-gray-300 text-xs">ENCRYPTED</p>
          </div>
          <div>
            <p className="text-yellow-400 text-xl font-semibold">1×</p>
            <p className="text-gray-300 text-xs">PER VOTER</p>
          </div>
          <div>
            <p className="text-yellow-400 text-xl font-semibold">Live</p>
            <p className="text-gray-300 text-xs">TALLY</p>
          </div>
        </div>
      </div>

      {/* ⚪ RIGHT PANEL */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm relative">

          {/* ❌ Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>

          <p className="text-xs text-gray-400 tracking-widest mb-2">
            WELCOME BACK
          </p>

          <h2 className="text-2xl font-semibold mb-2">
            Sign in to your ballot
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to continue
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@civic.gov"
              {...register("email", {
                required: "Email is required",
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              error={errors.password?.message}
            />

            {/* REMEMBER + FORGOT */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-blue-600" />
                <span className="text-gray-600">Remember me</span>
              </label>

              <button
                type="button"
                className="text-gray-500 hover:text-gray-700"
              >
                Forgot password?
              </button>
            </div>

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* REGISTER */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-700 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}