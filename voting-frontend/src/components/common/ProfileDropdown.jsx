import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();

  return (
    <div className="relative group">

      {/* 🔹 Trigger (Avatar + Name) */}
      <div className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold">
          {user?.name?.charAt(0)}
        </div>
        <span className="text-sm font-medium">{user?.name}</span>
      </div>

      {/* 🔻 Dropdown */}
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

        {/* User Info */}
        <div className="p-4 border-b">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* Links */}
        <div className="py-2">

          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
          >
            👤 Profile
          </Link>

          {user?.role === "admin" && (
            <Link
              to="/admin/polls"
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-sm"
            >
              🛡 Admin Console
            </Link>
          )}

        </div>

        {/* Logout */}
        <div className="border-t">
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 text-sm"
          >
            🚪 Sign out
          </button>
        </div>

      </div>
    </div>
  );
}