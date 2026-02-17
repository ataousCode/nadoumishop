import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../services/api";
import { useAppDispatch } from "../../store/hooks";
import { updateProfile } from "../../features/auth/authSlice";
import { getImageUrl } from "../../lib/utils";

interface ProfilePictureUploadProps {
  user: any;
}

export const ProfilePictureUpload = ({ user }: ProfilePictureUploadProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("profilePicture", file);

      // Endpoint differs slightly based on context or just use /users/me for both?
      // user.controller.ts uses /users/me for updateMe which handles profilePicture.
      // So it should be same for both User and Admin if they share the same endpoint.
      // Admin might have specific endpoint? No, admin uses updateMe too in AdminProfilePage.
      const response = await api.patch("/users/me", fd);

      if (response.data.status === "success") {
        toast.success("Profile picture updated");
        dispatch(updateProfile(response.data.data.user));
      }
    } catch (error) {
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  // Determine image source
  const profilePic = user?.profilePicture;
  const imageSrc =
    profilePic &&
    (profilePic.startsWith("http") || profilePic.startsWith("/images"))
      ? getImageUrl(profilePic)
      : profilePic
        ? profilePic
        : `https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`;

  return (
    <div className="relative inline-block">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
        disabled={isUploading}
      />
      <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shadow-md mx-auto relative group">
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        ) : (
          <img
            src={imageSrc}
            alt={user?.name || "User"}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${
                  user?.name || "User"
                }&background=random`;
            }}
          />
        )}

        {/* Overlay on hover */}
        <div
          onClick={handleImageClick}
          className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center cursor-pointer"
        >
          <Camera className="text-white opacity-0 group-hover:opacity-100 h-8 w-8" />
        </div>
      </div>
      <button
        onClick={handleImageClick}
        disabled={isUploading}
        className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-orange-500 transition-colors z-10"
      >
        <Camera className="h-4 w-4" />
      </button>
    </div>
  );
};
