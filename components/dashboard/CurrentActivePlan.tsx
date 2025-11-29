"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, CreditCard, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DataTable } from "./wallet/DataTable"; // Reusing generic table
import { activePlanColumns, ActiveSaving } from "./ActivePlanColumns";

interface CurrentActivePlanProps {
  initialCampaign: ActiveSaving | null;
}

export default function CurrentActivePlan({ initialCampaign }: CurrentActivePlanProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!initialCampaign) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[200px]">
        <CardContent className="text-muted-foreground">
          No active saving plans.
        </CardContent>
      </Card>
    );
  }

  // Calculate progress percentage
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
        toast.success("Contribution paid successfully!");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Contribution failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async () => {
    setLoading(true);
    try {
      const response = await axios.patch(`/api/savings/${initialCampaign._id}/payout`);
      if (response.data.success) {
        toast.success("Funds transferred to wallet!");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Payout failed");
    } finally {
      setLoading(false);
    }
  };

  // Check if plan is completed (locally for UI logic)
  const isCompleted = initialCampaign.amountSaved >= initialCampaign.totalAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Plan: {initialCampaign.campaignName}</CardTitle>
        <CardDescription>Track your progress and manage contributions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${initialCampaign.amountSaved} Saved</span>
            <span>Goal: ${initialCampaign.totalAmount}</span>
          </div>
        </div>

        {/* Data Table */}
        <DataTable columns={activePlanColumns} data={[initialCampaign]} />

        {/* Actions */}
        <div className="flex gap-4 pt-4">
            {!isCompleted ? (
                <Button 
                    onClick={handlePay} 
                    disabled={loading} 
                    className="w-full md:w-auto gap-2 cursor-pointer"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                    Pay Contribution (${initialCampaign.amountPerContribution})
                </Button>
            ) : (
                <Button 
                    onClick={handlePayout} 
                    disabled={loading} 
                    className="w-full md:w-auto gap-2 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                >
                     {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                    Collect Savings
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}