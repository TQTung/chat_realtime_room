import { Camera, Mail, User } from "lucide-react";
import { useAccount } from "../hooks/useAccount";
import { useAppService } from "../context/app-service";
import toast from "react-hot-toast";
import { useState } from "react";

const ProfilePage = () => {
  const { account, getProfile } = useAccount();
  const { clientApi } = useAppService();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setLoading(true);
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file!);
      reader.onload = () => {
        const base64Image = reader.result as string;
        setSelectedImage(base64Image);
      };

      await clientApi.user.updateProfile(
        { avatar: file },
        {
          "Content-Type": "multipart/form-data",
        }
      );
      getProfile();
      toast.success("Profile picture updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || account?.profilePicture || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 border-base-200"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadImage}
                  disabled={false}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {loading
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {account?.fullName}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {account?.email}
              </p>
            </div>
            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{account.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
