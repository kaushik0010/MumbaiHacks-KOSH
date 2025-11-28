import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-[calc(100vh-80px)] items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg border-2">
        <CardContent className="pt-10 pb-10 space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black text-slate-200">404</h1>
            <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
            <p className="text-muted-foreground">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/">Go Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}