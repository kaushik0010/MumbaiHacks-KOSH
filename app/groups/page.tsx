import { Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function GroupsPage() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-140px)] items-center justify-center p-4">
      <Card className="w-full max-w-lg border-dashed border-2">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-blue-100 p-4 rounded-full w-fit">
                <Users className="h-10 w-10 text-blue-600" />
            </div>
          <CardTitle className="text-3xl font-bold">Community Savings</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-orange-600 font-semibold">
                <Clock className="h-5 w-5" />
                <span>Coming Soon</span>
            </div>
            <p className="text-muted-foreground text-lg">
              Collaborative savings groups, peer challenges, and community leaderboards are currently under development.
            </p>
          </div>
          
          <div className="pt-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}