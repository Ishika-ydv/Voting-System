import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { X } from "lucide-react";

import { register as registerUser, sendOtp } from "../../api/authApi";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "voter",
    },
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        organization: data.organization,
      });

      await sendOtp(data.email);

      navigate("/verify-otp", { state: { email: data.email } });
    } catch (err) {
      setServerError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* 🔵 LEFT PANEL (FIXED) */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-1/2 bg-[#080838] text-white p-16 flex-col justify-between">
        <div>
          <p className="text-xs tracking-widest text-gray-300 mb-6">
            A CIVIC INSTRUMENT
          </p>

          <h1 className="text-4xl font-serif leading-tight">
            Build trust through,
            <br />
            <span className="text-yellow-400 italic">
              secure digital voting.
            </span>
          </h1>

          <p className="mt-6 text-sm text-gray-300 max-w-md">
            Create your account to participate in transparent and verifiable elections.
          </p>
        </div>

        <div className="flex gap-12 text-sm">
          <div>
            <p className="text-yellow-400 text-xl font-semibold">256-bit</p>
            <p className="text-gray-300 text-xs">ENCRYPTED</p>
          </div>
          <div>
            <p className="text-yellow-400 text-xl font-semibold">Secure</p>
            <p className="text-gray-300 text-xs">IDENTITY</p>
          </div>
          <div>
            <p className="text-yellow-400 text-xl font-semibold">Trusted</p>
            <p className="text-gray-300 text-xs">RESULTS</p>
          </div>
        </div>
      </div>

      {/* ⚪ RIGHT PANEL (SCROLLABLE) */}
      <div className="flex w-full lg:w-1/2 lg:ml-[50%] items-start justify-center bg-gray-50 px-6 pt-16 overflow-y-auto min-h-screen">
        
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm relative mb-10">

          {/* ❌ Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>

          <p className="text-xs text-gray-400 tracking-widest mb-2">
            GET STARTED
          </p>

          <h2 className="text-2xl font-semibold mb-1">
            Create account
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Register to start voting securely
          </p>

          {/* SERVER ERROR */}
          {serverError && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
              {serverError}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <Input
              label="Full name"
              {...register("name", {
                required: "Name is required",
              })}
              error={errors.name?.message}
            />

            <Input
              label="Email"
              type="email"
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

            {/* ROLE */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Role
              </label>

              <select
                className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                {...register("role", {
                  required: "Role is required",
                })}
              >
                <option value="voter">Voter</option>
                <option value="admin">Admin</option>
              </select>

              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <Input
              label="Organization"
              {...register("organization", {
                required: "Organization is required",
              })}
              error={errors.organization?.message}
            />

            {/* BUTTON */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-700 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}