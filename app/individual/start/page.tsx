"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Target, Calendar, DollarSign, TrendingUp, Sparkles } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { savingSchema, SavingInput } from "@/schemas/savingSchema";
import confetti from "canvas-confetti";

export default function StartSavingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SavingInput>({
    resolver: zodResolver(savingSchema) as any,
    defaultValues: {
      campaignName: "",
      frequency: "daily",
      amountPerContribution: 10,
      duration: 30,
    },
  });

  const frequency = form.watch("frequency");
  const amount = form.watch("amountPerContribution");
  const duration = form.watch("duration");

  const calculateTotal = () => {
    return (amount || 0) * (duration || 0);
  };

  const getDurationLabel = () => {
    switch (frequency) {
      case "daily": return "Days";
      case "weekly": return "Weeks";
      case "bi-weekly": return "Bi-Weeks"; 
      default: return "Periods";
    }
  };

  const getDurationDescription = () => {
    switch (frequency) {
      case "daily": return "(Total number of days you'll contribute)";
      case "weekly": return "(Total number of weeks you'll contribute)";
      case "bi-weekly": return "(Total number of bi-weekly periods you'll contribute)";
      default: return "(Total number of contributions)";
    }
  };

  const onSubmit = async (data: SavingInput) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/savings/create", data);
      if (response.data.success) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
        toast.success("Savings Plan Created!", {
          description: response.data.message,
        });
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      toast.error("Creation Failed", {
        description: error.response?.data?.message || "Failed to create savings plan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-linear-to-br from-blue-50/30 to-slate-50/50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">New Savings Plan</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Create Your Savings Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Set up a flexible savings plan that fits your budget and goals
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Card */}
          <Card className="lg:col-span-2 border-2 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Plan Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Campaign Name */}
                  <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel className="text-sm font-medium">Goal Name</FormLabel>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Give your savings goal a meaningful name)
                          </span>
                        </div>
                        <FormControl>
                          <Input 
                            placeholder="e.g., New Laptop Fund, Vacation Savings" 
                            {...field} 
                            className="h-11 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Frequency */}
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Contribution Frequency</FormLabel>
                          <FormDescription className="text-xs">
                            (How often you'll contribute)
                          </FormDescription>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 mt-1">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Duration */}
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Duration ({getDurationLabel()})
                          </FormLabel>
                          <FormDescription className="text-xs">
                            {getDurationDescription()}
                          </FormDescription>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={1} 
                              {...field} 
                              className="h-11 mt-1 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Amount Per Contribution */}
                  <FormField
                    control={form.control}
                    name="amountPerContribution"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center">
                          <FormLabel className="text-sm font-medium">Amount Per Contribution</FormLabel>
                          <span className="text-xs text-muted-foreground ml-2">
                            (Enter the amount you'll save each contribution)
                          </span>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input 
                              type="number"
                              min={1}
                              placeholder="0"
                              {...field} 
                              className="h-11 pl-10 transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dynamic Summary */}
                  <div className="bg-linear-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center gap-2 text-blue-700">
                        <TrendingUp className="h-5 w-5" />
                        <span className="font-semibold">Plan Summary</span>
                      </div>
                      <p className="text-slate-700">
                        You will save <span className="font-bold text-blue-600">${amount}</span> {frequency} for{" "}
                        <span className="font-bold text-blue-600">{duration} {getDurationLabel().toLowerCase()}</span>.
                      </p>
                      <div className="pt-2 border-t border-blue-200">
                        <p className="text-xl font-bold text-green-600">
                          Total Goal: ${calculateTotal().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all duration-200" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Your Plan...
                      </>
                    ) : (
                      "Start Saving Plan"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Info Sidebar */}
          <Card className="border-2 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Set Your Goal",
                  description: "Choose what you're saving for and set a target amount"
                },
                {
                  step: "2",
                  title: "Choose Frequency",
                  description: "Pick how often you want to contribute to your goal"
                },
                {
                  step: "3",
                  title: "Track Progress",
                  description: "Monitor your savings growth and stay motivated"
                },
                {
                  step: "4",
                  title: "Achieve Goal",
                  description: "Reach your target and celebrate your success"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="shrink-0 w-6 h-6 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{item.step}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}

              {/* Quick Tips */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-semibold text-sm text-gray-900 mb-2">Quick Tips</h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Start with small, consistent amounts</li>
                  <li>• Choose a frequency that matches your income</li>
                  <li>• Set realistic timelines for your goals</li>
                  <li>• Review and adjust your plan as needed</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}