"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, ShieldCheck, Lock, Loader2, Activity } from "lucide-react"; // Import Lock
import axios from "axios";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserInfoProps {
  user: {
    name: string;
    email: string;
    walletBalance: number;
    taxBalance?: number;
  } | null;
  healthScore: number;
}

export default function UserInfo({ user, healthScore }: UserInfoProps) {
  const router = useRouter();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  if (!user) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6 text-red-600">
          Failed to load user data.
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100 border-green-200";
    if (score >= 50) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  const handleTaxWithdraw = async () => {
    setIsWithdrawing(true);
    try {
        const response = await axios.patch("/api/user/withdraw-tax");
        if (response.data.success) {
            toast.success(response.data.message);
            router.refresh();
        }
    } catch (error: any) {
        // Show the Agent's Rejection Message
        toast.error(error.response?.data?.message || "Withdrawal Failed");
    } finally {
        setIsWithdrawing(false);
    }
  };

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
          
          {/* Header Row: Name + Health Score */}
          <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-lg font-semibold">{user.name}</p>
            </div>
            
            {/* Health Score Badge */}
            <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${getScoreColor(healthScore)}`}>
                 <div className="flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">Health Score</span>
                 </div>
                 <span className="text-2xl font-black">{healthScore}</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Available Wallet</p>
            <p className="text-2xl font-bold text-green-600">
              ${user.walletBalance.toFixed(2)}
            </p>
          </div>

          {/* Tax Vault Visual */}
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
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

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8"
                            onClick={handleTaxWithdraw}
                            disabled={isWithdrawing || !user.taxBalance}
                        >
                            {isWithdrawing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Lock className="h-4 w-4 text-slate-400 hover:text-red-500 transition-colors" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Attempt to withdraw taxes</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}