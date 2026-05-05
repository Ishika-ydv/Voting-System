import { useState } from "react";

export default function Input({
  label,
  error,
  type = "text",
  className = "",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1 w-full">
      {/* 🏷️ Label */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* 🧠 Input wrapper (for password toggle) */}
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          className={`w-full border rounded-lg px-3 py-2 text-sm outline-none
            focus:ring-2 focus:ring-blue-500 transition-all
            ${error ? "border-red-400" : "border-gray-300"}
            ${props.disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            ${className}
          `}
          {...props}
        />

        {/* 👁️ Password toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-xs text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {/* ❌ Error message */}
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}