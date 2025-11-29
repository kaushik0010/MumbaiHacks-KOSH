"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Trophy, Calendar, Target } from "lucide-react";
import { format } from "date-fns";

interface HistoryItem {
  _id: string;
  campaignName: string;
  amountSaved: number;
  totalAmount: number;
  endDate: string;
  frequency: string;
}

interface SavingsHistoryProps {
  initialData: HistoryItem[];
}

export default function SavingsHistory({ initialData }: SavingsHistoryProps) {
  const router = useRouter();

  const getCompletionRate = (saved: number, total: number) => {
    return Math.min((saved / total) * 100, 100);
  };

  return (
    <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-blue-500" />
          Past Savings Plans
        </CardTitle>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.refresh()}
          className="border-2 cursor-pointer"
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {initialData.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <Target className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
            <div>
              <p className="font-semibold text-muted-foreground">No Completed Plans</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your completed savings plans will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {initialData.map((plan) => {
              const completionRate = getCompletionRate(plan.amountSaved, plan.totalAmount);
              return (
                <div
                  key={plan._id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {plan.campaignName}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="capitalize">{plan.frequency}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(plan.endDate), "MMM dd, yyyy")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{completionRate.toFixed(0)}%</span>
                        <Trophy className="h-3 w-3 text-yellow-500" />
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-green-600">
                      ${plan.amountSaved.toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">
                      Goal: ${plan.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}