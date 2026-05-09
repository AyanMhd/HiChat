import { useState } from "react";
import { Camera, Mail, ShieldCheck, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <main className="page-shell">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="muted-label">Account</p>
          <h1 className="mt-2 text-3xl font-semibold">Profile</h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="section-panel overflow-hidden">
            <div className="bg-neutral px-6 py-8 text-neutral-content">
              <div className="relative mx-auto size-32">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full border-4 border-white/20 object-cover"
                />
                <label
                  htmlFor="avatar-upload"
                  className={`absolute bottom-1 right-1 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white text-neutral transition-transform hover:scale-105 ${
                    isUpdatingProfile ? "pointer-events-none animate-pulse" : ""
                  }`}
                >
                  <Camera className="size-5" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-semibold">{authUser?.fullName}</h2>
                <p className="mt-1 text-sm text-white/55">{authUser?.email}</p>
              </div>
            </div>
            <div className="p-5 text-center text-sm text-base-content/55">
              {isUpdatingProfile ? "Uploading your new photo..." : "Use a clear profile photo so conversations feel personal."}
            </div>
          </section>

          <section className="section-panel p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-base-300 bg-base-200 p-4">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-base-100">
                  <User className="size-5" />
                </div>
                <p className="field-label">Full name</p>
                <p className="mt-1 truncate text-lg font-semibold">{authUser?.fullName}</p>
              </div>

              <div className="rounded-lg border border-base-300 bg-base-200 p-4">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-base-100">
                  <Mail className="size-5" />
                </div>
                <p className="field-label">Email</p>
                <p className="mt-1 truncate text-lg font-semibold">{authUser?.email}</p>
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-base-300">
              <div className="flex items-center gap-3 border-b border-base-300 p-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-neutral text-neutral-content">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Account status</h3>
                  <p className="text-sm text-base-content/55">Your account is active and ready to chat.</p>
                </div>
              </div>
              <div className="divide-y divide-base-300 text-sm">
                <div className="flex items-center justify-between p-4">
                  <span className="text-base-content/55">Member since</span>
                  <span className="font-medium">{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-base-content/55">Status</span>
                  <span className="rounded-full bg-neutral px-3 py-1 text-xs font-medium text-neutral-content">Active</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
