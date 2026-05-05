import { useState } from "react";

/* ================= HOOK ================= */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = "success") => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, message, type }]);

    // auto remove
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return { toasts, show };
}

/* ================= COMPONENT ================= */
export default function Toast({ toasts }) {
  if (!toasts.length) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-5 py-3 rounded-lg text-white shadow-lg text-sm
          animate-slide-in ${colors[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}