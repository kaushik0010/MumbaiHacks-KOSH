import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "KOSH | Login - Access Your Savings Dashboard",
  description: "Sign in to your KOSH account to manage your savings, track goals, and get AI-powered financial insights.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-linear-to-br from-blue-50/30 to-slate-50/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <Card className="w-full max-w-md border-2 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Sign In
              </CardTitle>
              <CardDescription className="text-base">
                Access your KOSH dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}