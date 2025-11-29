import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "KOSH | Register - Start Your Savings Journey",
  description: "Create your KOSH account and start saving smarter with AI-powered financial tools.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-linear-to-br from-blue-50/30 to-slate-50/50 py-8">
      <div className="container mx-auto px-4">

        <div className="flex justify-center">
          <Card className="w-full max-w-md border-2 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2 pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">
                Create Account
              </CardTitle>
              <CardDescription className="text-base">
                Join thousands saving smarter with KOSH
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}