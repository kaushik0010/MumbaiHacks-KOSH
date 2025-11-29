"use client";
import axios from "axios";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteAccountButton() {
  const handleDelete = async () => {
    try {
      const response = await axios.delete("/api/user/delete");
      if (response.data.success) {
        toast.success("Account deleted successfully");
        signOut();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    }
  };

  return (
    <div className="pt-4 border-t">
        <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full cursor-pointer px-6 py-6 mb-3 hover:bg-red-700">Delete Account</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers. You cannot delete your account if you have active savings plans.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 cursor-pointer">
                Yes, Delete My Account
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}