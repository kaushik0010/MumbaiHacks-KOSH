"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, DollarSign, ArrowRight, User, Wallet, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [showDashboardLink, setShowDashboardLink] = useState(false);
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
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, [form]);

  const onSubmit = async (data: UpdateProfileInput) => {
    setIsLoading(true);
    setShowDashboardLink(false);
    try {
      const response = await axios.patch<ApiResponse>("/api/user/update", data);
      if (response.data.success) {
        toast.success("Profile Updated", {
          description: response.data.message,
        });
        
        if (response.data.data) {
          setUserData(prev => prev ? { ...prev, ...response.data.data } : null);
        }
        
        form.reset({ name: data.name, walletTopUp: 0 });
        router.refresh();
        setShowDashboardLink(true);
      }
    } catch (error) {
      toast.error("Update Failed", {
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
      {/* User Info Card */}
      <Card className="lg:col-span-1 border-2 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 bg-linear-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl w-fit shadow-sm">
            <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Email</span>
              </div>
              <span className="font-medium text-sm text-gray-900">{userData.email}</span>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Wallet className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">Wallet Balance</span>
              </div>
              <span className="font-bold text-2xl text-green-700">
                ${userData.walletBalance.toFixed(2)}
              </span>
            </div>
          </div>

          {showDashboardLink && (
            <Button 
              variant="outline" 
              className="w-full border-green-200 text-green-700 hover:text-green-800 hover:bg-green-50 gap-2" 
              asChild
            >
              <Link href="/dashboard">
                <ArrowRight className="h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Update Form Card */}
      <Card className="lg:col-span-2 border-2 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-blue-500" />
            Edit Profile & Wallet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="h-11 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter your full name"
                      />
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
                    <FormLabel className="text-sm font-medium">Add Money to Wallet</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="number" 
                          className="h-11 pl-10 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          placeholder="0.00"
                          min="0"
                          step="1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Enter the amount you want to add to your wallet
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all duration-200" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}