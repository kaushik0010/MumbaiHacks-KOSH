"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, ShieldCheck, Lock, Loader2, Activity, Wallet, User } from "lucide-react";
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
      <Card className="border-2 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6 text-red-600 text-center">
          Failed to load user data.
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-700 bg-green-50 border-green-200";
    if (score >= 50) return "text-yellow-700 bg-yellow-50 border-yellow-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs Attention";
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
        toast.error(error.response?.data?.message || "Withdrawal Failed");
    } finally {
        setIsWithdrawing(false);
    }
  };

  return (
    <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          Account Overview
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => router.push("/profile")}
          className="gap-2 border-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        
        {/* User Basic Info */}
        <div className="space-y-3">
          <div className="flex">
            <p className="text-sm font-medium text-muted-foreground">Full Name:</p>
            <p className="text-sm font-semibold text-gray-900 ml-2">{user.name}</p>
          </div>
          <div className="flex">
            <p className="text-sm font-medium text-muted-foreground">Email: </p>
            <p className="text-sm font-semibold text-gray-900 ml-2">{user.email}</p>
          </div>
        </div>

        {/* Health Score */}
        <div className={`p-3 rounded-xl border-2 ${getScoreColor(healthScore)}`}>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3" />
                <span className="text-xs font-semibold uppercase">Financial Health</span>
              </div>
              <p className="text-xs text-muted-foreground">{getScoreLevel(healthScore)}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black">{healthScore}</span>
              <span className="text-xs font-medium block">/100</span>
            </div>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-linear-to-br from-green-50 to-emerald-50 p-3 rounded-xl border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Wallet className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Available Balance</span>
              </div>
              <p className="text-xs text-green-600">Ready to use</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-green-700">
                ${user.walletBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Tax Vault */}
        <div className="bg-linear-to-br from-blue-50 to-slate-50 p-3 rounded-xl border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Tax Vault</span>
              </div>
              <p className="text-xs text-blue-600">Secured for taxes</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">
                ${(user.taxBalance || 0).toFixed(2)}
              </p>
            </div>
            
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 border-2 border-blue-200 hover:border-red-300 transition-colors cursor-pointer"
                            onClick={handleTaxWithdraw}
                            disabled={isWithdrawing || !user.taxBalance}
                        >
                            {isWithdrawing ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                                <Lock className="h-3 w-3 text-blue-500 hover:text-red-500 transition-colors" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-xs">Request tax withdrawal</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}