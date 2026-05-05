import { useState, useRef, useEffect } from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      
      {/* 🔘 Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-gray-700 hover:text-black"
      >
        <Shield size={16} />
        Admin
      </button>

      {/* 📦 Dropdown */}
      {open && (
        <div className="absolute mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
          
          {/* Header */}
          <div className="px-4 py-2 text-sm font-semibold border-b">
            Administration
          </div>

          {/* Items */}
          <div className="py-2 text-sm">

            <Link
              to="/admin/polls"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Manage Polls
            </Link>

            <Link
              to="/admin/polls/new"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Create Poll
            </Link>

            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Results Dashboard
            </Link>

          </div>
        </div>
      )}
    </div>
  );
}