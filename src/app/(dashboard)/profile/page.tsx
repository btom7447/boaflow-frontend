"use client";

import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Camera, Save, Key, EyeClosed, Eye } from "lucide-react";
import { clsx } from "clsx";
import { profileApi } from "@/lib/api";
import { toast } from "sonner";
import { authStorage } from "@/lib/auth";

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile form
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

  // Password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (updatedUser) => {
      if (user) {
        const currentToken = authStorage.getToken(); // <-- Get token from localStorage directly

        setAuth(
          {
            ...user,
            full_name: updatedUser.full_name || user.full_name,
            avatar: updatedUser.avatar,
          },
          currentToken || "", // <-- Use the current token
        );
      }
      toast.success("Profile updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });
  const changePasswordMutation = useMutation({
    mutationFn: ({
      current_password,
      new_password,
    }: {
      current_password: string;
      new_password: string;
    }) => profileApi.changePassword(current_password, new_password),
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setPasswordError("");
      toast.success("Password changed successfully");
    },
    onError: (error: Error) => {
      setPasswordError(error.message);
      toast.error(error.message || "Failed to change password");
    },
  });

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setAvatarBase64((reader.result as string).split(",")[1]); // Remove data:image/...;base64, prefix
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    const payload: { full_name?: string; avatar_base64?: string } = {};
    if (fullName !== user?.full_name) payload.full_name = fullName;
    if (avatarBase64) payload.avatar_base64 = avatarBase64;

    if (Object.keys(payload).length > 0) {
      updateProfileMutation.mutate(payload);
    }
  };

  const handleChangePassword = () => {
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    changePasswordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
    });
  };

  const initials = (user?.full_name || user?.email || "")
    .trim()
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold text-white mb-6">
        Profile Settings
      </h1>

      <div className="space-y-6">
        {/* Avatar & Name */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-medium text-gray-300 mb-4">
            Profile Information
          </h2>

          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div
                className={clsx(
                  "w-20 h-20 rounded-full flex items-center justify-center border-2",
                  avatarPreview || user?.avatar
                    ? "border-blue-600/30"
                    : "border-blue-600/20 bg-blue-600/10",
                )}
              >
                {avatarPreview || user?.avatar ? (
                  <img
                    src={
                      avatarPreview || `data:image/png;base64,${user?.avatar}`
                    }
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold text-blue-400">
                    {initials}
                  </span>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <Camera size={14} className="text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Name */}
            <div className="flex-1">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
              <p className="text-xs text-gray-600 mt-2">{user?.email}</p>
              <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              loading={updateProfileMutation.isPending}
              onClick={handleSaveProfile}
              disabled={fullName === user?.full_name && !avatarBase64}
            >
              <Save size={13} className="mr-1.5" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-300">Password</h2>
            {!showPasswordForm && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowPasswordForm(true)}
              >
                <Key size={13} className="mr-1.5" />
                Change Password
              </Button>
            )}
          </div>

          {showPasswordForm && (
            <div className="space-y-4">
              <div className="relative ">
                <Input
                  label="Current Password"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 bottom-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeClosed size={18} strokeWidth={1} />
                  ) : (
                    <Eye size={18} strokeWidth={1} />
                  )}
                </button>
              </div>
              <div className="relative ">
                <Input
                  label="New Password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((s) => !s)}
                  className="absolute right-3 bottom-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeClosed size={18} strokeWidth={1} />
                  ) : (
                    <Eye size={18} strokeWidth={1} />
                  )}
                </button>
              </div>

              <div className="relative ">
                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  className="absolute right-3 bottom-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeClosed size={18} strokeWidth={1} />
                  ) : (
                    <Eye size={18} strokeWidth={1} />
                  )}
                </button>
              </div>

              {passwordError && (
                <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                  {passwordError}
                </p>
              )}

              {changePasswordMutation.isSuccess && (
                <p className="text-sm text-blue-400 bg-blue-950/30 border border-blue-900/50 rounded-lg px-3 py-2">
                  Password changed successfully
                </p>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  loading={changePasswordMutation.isPending}
                  onClick={handleChangePassword}
                  disabled={
                    !currentPassword || !newPassword || !confirmPassword
                  }
                >
                  Update Password
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
