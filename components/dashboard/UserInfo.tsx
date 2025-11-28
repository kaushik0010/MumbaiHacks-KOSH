"use client";

import { useRouter } from "next/navigation";
import { Edit, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserInfoProps {
  user: {
    name: string;
    email: string;
    walletBalance: number;
    taxBalance?: number;
  } | null;
}

export default function UserInfo({ user }: UserInfoProps) {
  const router = useRouter();

  if (!user) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 text-red-600">
          Failed to load user data.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">User Information</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => router.push("/profile")}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
            <p className="text-lg font-semibold">{user.name}</p>
          </div>
          
          {/* Wallet Balance */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">Available Wallet</p>
            <p className="text-2xl font-bold text-green-600">
              ${user.walletBalance.toFixed(2)}
            </p>
          </div>

          {/* NEW: Tax Trap Visual */}
          <div className="bg-slate-100 p-3 rounded-md flex items-center gap-3 border border-slate-200">
            <div className="bg-blue-100 p-2 rounded-full">
                <ShieldCheck className="h-5 w-5 text-blue-700" />
            </div>
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Tax Vault (Locked)</p>
                <p className="text-lg font-bold text-slate-800">
                    ${(user.taxBalance || 0).toFixed(2)}
                </p>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}