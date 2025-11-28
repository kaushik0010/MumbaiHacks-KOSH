"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { savingSchema, SavingInput } from "@/schemas/savingSchema";

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

  const onSubmit = async (data: SavingInput) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/savings/create", data);
      if (response.data.success) {
        toast.success(response.data.message);
        router.replace("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center p-6 min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create Flexible Savings Plan</CardTitle>
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
                    <FormLabel>Campaign Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., New Laptop Fund" {...field} />
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
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How often you want to contribute.
                      </FormDescription>
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
                      <FormLabel>Duration ({getDurationLabel()})</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormDescription>
                        Total number of contributions.
                      </FormDescription>
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
                    <FormLabel>Amount Per Contribution ($)</FormLabel>
                    <FormControl>
                        <div className="space-y-4">
                             <div className="flex items-center space-x-4">
                                <span className="font-bold text-xl w-16">${field.value}</span>
                                <Slider
                                    min={1}
                                    max={500}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                    className="flex-1"
                                />
                             </div>
                             <Input type="number" {...field} className="w-full" />
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic Summary */}
              <div className="bg-slate-100 p-4 rounded-lg text-center border border-slate-200">
                <p className="text-slate-700">
                    You will save <span className="font-bold text-blue-600">${amount}</span> {frequency} for <span className="font-bold">{duration} {getDurationLabel().toLowerCase()}</span>.
                </p>
                <p className="mt-2 text-lg font-semibold">
                    Total Goal: <span className="text-green-600">${calculateTotal()}</span>
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Plan...
                  </>
                ) : (
                  "Start Saving Plan"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}