import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowRight, Search, BarChart3 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-linear-to-br from-blue-50/50 to-slate-50/50">
      <div className="container max-w-md mx-auto">
        <Card className="relative overflow-hidden border-2 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-6">
              {/* Error Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200">
                <Search className="h-3 w-3 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">Error 404</span>
              </div>
              
              {/* Main Content */}
              <div className="space-y-4">
                <h1 className="text-7xl font-black text-slate-200 tracking-tighter">
                  404
                </h1>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                  Page Not Found
                </h2>
                <p className="text-muted-foreground">
                  Sorry, the page you're looking for doesn't exist or has been moved. 
                  Let's get you back on track.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm">
                  <Link href="/">
                    <Home className="h-4 w-4" />
                    Go Home
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="gap-2 border-2">
                  <Link href="/dashboard">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200">
                <div className="flex justify-center gap-6 text-sm text-muted-foreground">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">99.9%</div>
                    <div>Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">256-bit</div>
                    <div>Encryption</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">24/7</div>
                    <div>Support</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-br from-blue-500/5 to-cyan-500/5 rounded-full -translate-x-12 translate-y-12" />
        </Card>
      </div>
    </div>
  );
}