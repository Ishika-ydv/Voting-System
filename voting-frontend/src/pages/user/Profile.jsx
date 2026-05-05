import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile, changePassword } from "../../api/authApi";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";

export default function Profile() {
  const { user, logout, setUser } = useAuth();

  // 🔹 Profile state
  const [name, setName] = useState(user?.name || "");
  const [loadingProfile, setLoadingProfile] = useState(false);

  // 🔹 Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  if (!user) return <p className="p-6">Loading...</p>;

  // ✅ Update Profile
  const handleProfileUpdate = async () => {
    try {
      setLoadingProfile(true);

      const res = await updateProfile({ name });

      const updatedUser = res?.data?.data;

      setUser(updatedUser);

      toast.success("Profile updated successfully 🎉");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Update failed"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  // ✅ Change Password
  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword) {
      return toast.error("Both fields are required");
    }

    try {
      setLoadingPassword(true);

      await changePassword({
        oldPassword: currentPassword, // ✅ FIXED
        newPassword,
      });

      toast.success("Password updated successfully 🔐");

      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update password"
      );
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <p className="text-sm tracking-widest text-gray-500 uppercase mb-2">
          Account
        </p>

        <h1 className="text-4xl font-serif font-semibold mb-8">
          Your civic profile.
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {/* LEFT CARD */}
          <div className="bg-white rounded-xl p-6 border">

            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold text-lg">
                {user.name?.charAt(0)}
              </div>

              <div>
                <h2 className="text-lg font-semibold">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>

                <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-red-100 text-red-600">
                  {user.role.toUpperCase()}
                </span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="text-green-600 font-medium">
                  ✔ Verified
                </span>
              </p>

              <p className="flex justify-between">
                <span className="text-gray-500">Member since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toDateString()}
                </span>
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="mt-6 w-full border border-red-400 text-red-500 py-2 rounded-lg hover:bg-red-50"
            >
              Sign out
            </button>
          </div>

          {/* RIGHT CARD */}
          <div className="bg-white rounded-xl p-6 border">

            {/* 🔹 Update Profile */}
            <h2 className="text-lg font-semibold mb-4">
              👤 Update profile
            </h2>

            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="text-sm text-gray-600">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 border rounded-lg px-3 py-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-600">
                  Email address
                </label>
                <input
                  value={user.email}
                  disabled
                  className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-100"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleProfileUpdate}
                  disabled={loadingProfile}
                >
                  {loadingProfile ? "Saving..." : "Save changes"}
                </Button>

                <button
                  onClick={() => setName(user.name)}
                  className="text-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* 🔑 Change Password */}
            <div className="mt-10 border-t pt-6">

              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🔑 Change password
              </h3>

              <div className="space-y-4">

                {/* Current Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Current password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) =>
                      setCurrentPassword(e.target.value)
                    }
                    placeholder="Enter current password"
                    className="w-full mt-1 border rounded-lg px-3 py-2"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    className="w-full mt-1 border rounded-lg px-3 py-2"
                  />
                </div>

                {/* Button */}
                <button
                  onClick={handlePasswordUpdate}
                  disabled={loadingPassword}
                  className="bg-blue-900 text-white px-5 py-2 rounded-lg hover:bg-blue-800"
                >
                  {loadingPassword
                    ? "Updating..."
                    : "Update password"}
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}