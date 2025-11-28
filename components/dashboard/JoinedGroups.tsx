import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JoinedGroups() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Joined Savings Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center py-8 text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Coming Soon</h3>
          <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
            Group savings and collaborative features will be available in the next update.
          </p>
        </div>
        <Button disabled variant="secondary" className="w-full mt-4">
          Browse Groups
        </Button>
      </CardContent>
    </Card>
  );
}