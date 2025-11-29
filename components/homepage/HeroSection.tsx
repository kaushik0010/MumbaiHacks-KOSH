import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-white" />
      
      <div className="container relative mx-auto flex flex-col items-center justify-center px-4 py-16 text-center sm:py-24 md:py-32 max-w-7xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            AI-Powered Savings Platform
          </span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
          Save Smarter{" "}
          <span className="block bg-linear-to-r from-blue-600 via-blue-500 to-blue-400 bg-clip-text text-transparent">
            Together with KOSH
          </span>
        </h1>
        
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl lg:text-lg">
          Your intelligent financial hub — build goals, track progress, and grow your wealth with AI-driven insights.
        </p>
        
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <Link href="/register">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow-md transition-all group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="#features">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-2"
            >
              See Features
            </Button>
          </Link>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-col items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-6 opacity-70">
            <span>🔒 Bank-level Security</span>
            <span>•</span>
            <span>📈 Real-time Analytics</span>
            <span>•</span>
            <span>🤖 AI Assistant</span>
          </div>
        </div>
      </div>
    </section>
  );
}