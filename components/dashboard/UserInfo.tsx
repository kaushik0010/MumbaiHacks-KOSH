"use client";

import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserInfoProps {
  user: {
    name: string;
    email: string;
    walletBalance: number;
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
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-sm">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
            <p className="text-2xl font-bold text-green-600">
              ${user.walletBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}