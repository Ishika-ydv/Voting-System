import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

import Input from "../../components/common/Input";
import PasswordInput from "../../components/auth/PasswordInput";
import Button from "../../components/common/Button";

export default function Login() {
  const { register, handleSubmit } = useForm();
  const { setUser, setRole } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const res = await login(data);

      const user = res?.data?.data?.user;

      // ❌ NO localStorage token (cookies handle auth)

      setUser(user);
      setRole(user?.role);

      toast.success("Login successful");

      navigate(user?.role === "admin" ? "/admin/polls" : "/polls");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">

        <h1 className="text-2xl font-bold">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">

          <Input
            label="Email"
            type="email"
            {...register("email", { required: true })}
          />

          <PasswordInput
            label="Password"
            {...register("password", { required: true })}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

        </form>

        <p className="text-center mt-4 text-sm">
          No account? <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}