// components/dashboard/DeleteAccountButton.tsx
"use client";
import axios from "axios";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
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
        toast.success("Account Deleted", {
          description: "Your account has been permanently deleted",
        });
        signOut();
      }
    } catch (error: any) {
      toast.error("Deletion Failed", {
        description: error.response?.data?.message || "Failed to delete account",
      });
    }
  };

  return (
    <div className="pt-4 border-t border-slate-200">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full gap-2 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="border-2 max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <AlertDialogTitle className="text-red-700">
                Delete Your Account?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-sm leading-relaxed">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers. 
              <br /><br />
              <span className="font-semibold text-red-600">
                Note: You cannot delete your account if you have active savings plans.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel className="flex-1 border-2 mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Yes, Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}