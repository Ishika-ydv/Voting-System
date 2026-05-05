import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import { register as registerUser, sendOtp } from "../../api/authApi";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/common/Button";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      // ✅ send ALL required backend fields
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
      const message =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Register to start voting securely
        </p>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded-md">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

          {/* Name */}
          <Input
            label="Full name"
            error={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email", { required: "Email is required" })}
          />

          {/* Password */}
          <PasswordInput
            label="Password"
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          {/* 🔥 ROLE FIELD */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              className="w-full mt-1 border rounded-lg p-2"
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* 🔥 ORGANIZATION FIELD */}
          <Input
            label="Organization"
            error={errors.organization?.message}
            {...register("organization", {
              required: "Organization is required",
            })}
          />

          {/* Submit */}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>

        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}