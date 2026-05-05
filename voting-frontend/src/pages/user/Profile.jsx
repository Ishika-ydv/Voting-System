import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

import {
  updateProfile,
  changePassword,
} from "../../api/authApi";

import Navbar from "../../components/common/Navbar";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth();

  // 🔥 loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile form
  const {
    register: regProfile,
    handleSubmit: hsProfile,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  // Password form
  const {
    register: regPwd,
    handleSubmit: hsPwd,
    reset: resetPwd,
  } = useForm();

  // 🧑 Update profile
  const saveProfile = async (data) => {
    try {
      setProfileLoading(true);

      await updateProfile(data);

      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // 🔐 Change password
  const savePwd = async (data) => {
    try {
      setPasswordLoading(true);

      await changePassword(data);

      toast.success("Password changed successfully");
      resetPwd();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}

      <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-8">

        {/* Profile Update */}
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="font-semibold text-gray-800 mb-4">
            Update Profile
          </h2>

          <form
            onSubmit={hsProfile(saveProfile)}
            className="flex flex-col gap-3"
          >
            <Input
              label="Name"
              {...regProfile("name")}
            />

            <Input
              label="Email"
              type="email"
              {...regProfile("email")}
            />

            <Button
              type="submit"
              disabled={profileLoading}
            >
              {profileLoading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl p-6 border">
          <h2 className="font-semibold text-gray-800 mb-4">
            Change Password
          </h2>

          <form
            onSubmit={hsPwd(savePwd)}
            className="flex flex-col gap-3"
          >
            <Input
              label="Current password"
              type="password"
              {...regPwd("currentPassword")}
            />

            <Input
              label="New password"
              type="password"
              {...regPwd("newPassword")}
            />

            <Button
              type="submit"
              disabled={passwordLoading}
            >
              {passwordLoading
                ? "Updating..."
                : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}