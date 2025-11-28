"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, DollarSign, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProfileSchema, UpdateProfileInput } from "@/schemas/updateProfileSchema";
import { ApiResponse } from "@/types/apiResponse";

export default function UpdateProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string; walletBalance: number } | null>(null);
  const [showDashboardLink, setShowDashboardLink] = useState(false); // New State
  const router = useRouter();

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema) as any,
    defaultValues: {
      name: "",
      walletTopUp: 0,
    },
  });

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<ApiResponse>("/api/user/details");
        if (response.data.success && response.data.data) {
          setUserData(response.data.data);
          form.setValue("name", response.data.data.name);
        }
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    };

    fetchUserData();
  }, [form]);

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true);
    setShowDashboardLink(false); // Reset in case they submit again
    try {
      const response = await axios.patch<ApiResponse>("/api/user/update", data);
      if (response.data.success) {
        toast.success(response.data.message);
        
        if (response.data.data) {
             setUserData(prev => prev ? { ...prev, ...response.data.data } : null);
        }
        
        form.reset({ name: data.name, walletTopUp: 0 });
        router.refresh();
        setShowDashboardLink(true); // Show button on success
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
      return <div className="p-4 text-center">Loading profile...</div>;
  }

  return (
    <Card className="w-full max-w-lg mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Profile & Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-100 rounded-md">
                <span className="text-xs text-muted-foreground block">Email</span>
                <span className="font-medium text-sm">{userData.email}</span>
            </div>
            <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                <span className="text-xs text-green-700 block">Wallet Balance</span>
                <span className="font-bold text-lg text-green-700">${userData.walletBalance.toFixed(2)}</span>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="walletTopUp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Add Money to Wallet</FormLabel>
                  <FormDescription>Enter amount to deposit (optional)</FormDescription>
                  <FormControl>
                    <div className="relative">
                        <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          className="pl-8" 
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>

            {/* Conditionally Rendered Dashboard Button */}
            {showDashboardLink && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-green-200 text-green-700 hover:text-green-800 hover:bg-green-50" 
                asChild
              >
                <Link href="/dashboard">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Link>
              </Button>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}