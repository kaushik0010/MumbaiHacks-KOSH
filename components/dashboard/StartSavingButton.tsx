// components/dashboard/StartSavingButton.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle, Target } from "lucide-react";

export default function StartSavingButton() {
  return (
    <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50 backdrop-blur-sm hover:bg-blue-50 hover:border-blue-300 transition-all group cursor-pointer h-full">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
        <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
          <PlusCircle className="h-8 w-8 text-white" />
        </div>
        <h3 className="font-bold text-blue-900 text-lg mb-2">Start New Savings Plan</h3>
        <p className="text-blue-700 text-sm mb-4">
          Create a personalized savings goal and start your financial journey
        </p>
        <Link href="/individual/start" className="w-full">
          <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer">
            <Target className="h-4 w-4" />
            Create Plan
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}