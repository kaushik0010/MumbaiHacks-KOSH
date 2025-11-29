import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

export default function StartSavingButton() {
  return (
    <Card className="h-full bg-blue-50 border-blue-100">
      <CardHeader>
        <CardTitle className="text-blue-700">Start New Savings Plan</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Link href="/individual/start">
          <Button className="gap-2 cursor-pointer">
            <PlusCircle className="h-4 w-4" />
            Create Plan
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}