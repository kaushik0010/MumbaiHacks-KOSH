"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CreditCard, Wallet, Target, Calendar, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CurrentActivePlanProps {
  initialCampaign: any | null;
}

export default function CurrentActivePlan({ initialCampaign }: CurrentActivePlanProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!initialCampaign) {
    return (
      <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg h-full flex items-center justify-center min-h-[200px]">
        <CardContent className="text-center space-y-3">
          <Target className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <div>
            <p className="font-semibold text-muted-foreground">No Active Plans</p>
            <p className="text-sm text-muted-foreground mt-1">Start your first savings journey</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = Math.min(
    (initialCampaign.amountSaved / initialCampaign.totalAmount) * 100,
    100
  );

  const handlePay = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/savings/${initialCampaign._id}/contribute`, {
        amountPaid: initialCampaign.amountPerContribution
      });
      if (response.data.success) {
        toast.success("Contribution Successful!", {
          description: `$${initialCampaign.amountPerContribution} added to your savings`,
        });
        router.refresh();
      }
    } catch (error: any) {
      toast.error("Payment Failed", {
        description: error.response?.data?.message || "Unable to process contribution",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/savings/${initialCampaign._id}/payout`);
      if (response.data.success) {
        toast.success("Savings Collected!", {
          description: "Funds transferred to your wallet",
        });
        router.refresh();
      }
    } catch (error: any) {
      toast.error("Payout Failed", {
        description: error.response?.data?.message || "Unable to process payout",
      });
    } finally {
      setLoading(false);
    }
  };

  const isCompleted = initialCampaign.amountSaved >= initialCampaign.totalAmount;

  return (
    <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Active Savings Plan
            </CardTitle>
            <CardDescription className="mt-1">
              {initialCampaign.campaignName}
            </CardDescription>
          </div>
          <Badge variant={isCompleted ? "default" : "secondary"} className="capitalize">
            {isCompleted ? "Completed" : initialCampaign.frequency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Progress Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-bold text-blue-600">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">${initialCampaign.amountSaved} saved</span>
            <span className="font-semibold text-gray-900">Goal: ${initialCampaign.totalAmount}</span>
          </div>
        </div>

        {/* Plan Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-muted-foreground">Next Due</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(initialCampaign.nextDueDate).toLocaleDateString()}
            </p>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-muted-foreground">Per Payment</span>
            </div>
            <p className="text-sm font-semibold text-green-600">
              ${initialCampaign.amountPerContribution}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          {!isCompleted ? (
            <Button 
              onClick={handlePay} 
              disabled={loading} 
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 h-11 text-base cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Pay ${initialCampaign.amountPerContribution} Now
            </Button>
          ) : (
            <Button 
              onClick={handlePayout} 
              disabled={loading} 
              className="w-full gap-2 bg-green-600 hover:bg-green-700 h-11 text-base cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              Collect ${initialCampaign.amountSaved} Savings
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}