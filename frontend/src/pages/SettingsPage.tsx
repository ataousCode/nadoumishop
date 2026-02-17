import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NadoumiCard } from "../components/shared/NadoumiCard";
import { NadoumiButton } from "../components/shared/NadoumiButton";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { updateProfile, updatePassword } from "../features/auth/authSlice";
import { useAppDispatch } from "../store/hooks";
import type { RootState } from "../store";
import { ShieldCheck } from "lucide-react";
import { ProfilePictureUpload } from "../components/profile/ProfilePictureUpload";

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error, message } = useSelector(
    (state: RootState) => state.auth,
  );

  const [profileData, setProfileData] = useState({
    name: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile(profileData));
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    dispatch(
      updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }),
    );
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link
            to="/dashboard"
            className="hover:text-orange-700 hover:underline"
          >
            Dashboard
          </Link>
          <span className="text-gray-300">&gt;</span>
          <span className="text-orange-700">Login & Security</span>
        </div>
        <h1 className="text-3xl font-normal mb-8">Login & Security</h1>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Settings Sidebar/Tabs (Conceptual) */}
          <div className="md:col-span-1 space-y-2">
            <div className="p-3 bg-white border border-[#febd69] shadow-[0_0_0_1px_#febd69] rounded-md font-bold text-gray-900">
              Login & Security
            </div>
            {/* Removed Your Addresses link as requested */}
          </div>

          <div className="md:col-span-2 space-y-6">
            <NadoumiCard
              title="Profile Information"
              className="border border-gray-200 shadow-sm rounded-md"
            >
              <div className="mb-6 flex justify-center">
                <ProfilePictureUpload user={user} />
              </div>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500">
                    Email cannot be changed currently.
                  </p>
                </div>
                <NadoumiButton
                  type="submit"
                  isLoading={isLoading}
                  className="w-auto px-10"
                >
                  Save Changes
                </NadoumiButton>
              </form>
            </NadoumiCard>

            <NadoumiCard
              title="Change Password"
              className="border border-gray-200 shadow-sm rounded-md"
            >
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <NadoumiButton
                  type="submit"
                  variant="yellow"
                  isLoading={isLoading}
                  className="w-auto px-10"
                >
                  Update Password
                </NadoumiButton>
              </form>
            </NadoumiCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
