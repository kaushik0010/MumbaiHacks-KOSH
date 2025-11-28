import { Metadata } from "next";
import UpdateProfileForm from "@/components/dashboard/UpdateProfileForm";

export const metadata: Metadata = {
  title: "KOSH | Update Profile",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col gap-6">
        <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and wallet preferences.</p>
        </div>
        <UpdateProfileForm />
      </div>
    </div>
  );
}