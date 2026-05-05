import { useState } from "react";
import Input from "../common/Input";

export default function PasswordInput({ label, error, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        label={label}
        error={error}
        type={show ? "text" : "password"}
        {...props}
      />

      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute right-3 top-9 text-xs text-gray-500 hover:text-gray-700"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}