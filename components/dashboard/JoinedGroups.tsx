import { Users, Sparkles, Users2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JoinedGroups() {
  return (
    <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Users2 className="h-5 w-5 text-blue-500" />
          Savings Groups
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8 text-center space-y-4 h-full">
        <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-gray-900">Coming Soon</h3>
          <p className="text-sm text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
            Collaborate with friends and family in group savings challenges with shared goals and progress tracking.
          </p>
        </div>

        <div className="space-y-3 w-full pt-4">
          <Button disabled variant="outline" className="w-full gap-2 border-2 cursor-pointer">
            <Users className="h-4 w-4" />
            Browse Groups
          </Button>
          
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="font-bold text-gray-900">50+</div>
              <div>Groups</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">1K+</div>
              <div>Members</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">$25K+</div>
              <div>Saved</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}