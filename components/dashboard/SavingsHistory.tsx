"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { format } from "date-fns";

interface HistoryItem {
  _id: string;
  campaignName: string;
  amountSaved: number;
  totalAmount: number;
  endDate: string;
}

interface SavingsHistoryProps {
  initialData: HistoryItem[];
}

export default function SavingsHistory({ initialData }: SavingsHistoryProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Past Savings Plans</CardTitle>
        <Button variant="ghost" size="icon" onClick={() => router.refresh()} className="cursor-pointer">
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {initialData.length === 0 ? (
          <p className="text-muted-foreground text-sm">No completed plans yet.</p>
        ) : (
          <div className="space-y-4">
            {initialData.map((plan) => (
              <div
                key={plan._id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{plan.campaignName}</p>
                  <p className="text-xs text-muted-foreground">
                    Ended: {format(new Date(plan.endDate), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${plan.amountSaved}</p>
                  <p className="text-xs text-muted-foreground">
                    Goal: ${plan.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}