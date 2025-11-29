import { Users, Clock, ArrowRight, Trophy, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function GroupsPage() {
  return (
    <div className="min-h-[80vh] bg-linear-to-br from-blue-50/30 to-slate-50/50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Community Savings
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Save together, achieve more. Collaborative financial goals with friends and family.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Main Coming Soon Card */}
          <Card className="relative overflow-hidden border-2 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 bg-linear-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl w-fit shadow-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Group Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border border-orange-200">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Coming Soon</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Collaborative savings groups, peer challenges, and community leaderboards are currently under development. 
                  Be the first to know when we launch!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm">
                  <Link href="/dashboard">
                    Return to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2 border-2">
                  <Link href="/">
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>

            {/* Decorative linear */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-12 translate-x-12" />
          </Card>

          {/* Features Preview Card */}
          <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                What's Coming
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  icon: Users,
                  title: "Shared Savings Goals",
                  description: "Create group targets and track progress together"
                },
                {
                  icon: Trophy,
                  title: "Friendly Competitions",
                  description: "Challenge friends with savings milestones and rewards"
                },
                {
                  icon: Target,
                  title: "Community Leaderboards",
                  description: "See how you rank and get motivated by peers"
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="shrink-0 w-10 h-10 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}

              {/* Notify Me Button */}
              <div className="pt-4 border-t border-slate-200">
                <Button variant="outline" className="w-full gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Sparkles className="h-4 w-4" />
                  Notify Me When Launched
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}