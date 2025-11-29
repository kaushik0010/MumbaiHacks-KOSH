import { Metadata } from "next";
import UpdateProfileForm from "@/components/dashboard/UpdateProfileForm";

export const metadata: Metadata = {
  title: "KOSH | Profile Settings",
  description: "Manage your KOSH account settings, update your profile, and manage your wallet balance.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-[80vh] bg-linear-to-br from-blue-50/30 to-slate-50/50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Account Settings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Manage your account settings, update your profile, and manage your wallet balance.
          </p>
        </div>
        <UpdateProfileForm />
      </div>
    </div>
  );
}