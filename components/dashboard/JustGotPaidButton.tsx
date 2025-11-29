"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Banknote, Loader2, Sparkles, DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import confetti from "canvas-confetti";

export default function JustGotPaidButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.patch("/api/user/update", { walletTopUp: val });
      if (response.data.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#16a34a', '#fbbf24']
        });
        toast.success("Income Registered!", {
          description: `$${val.toFixed(2)} added to your wallet successfully`,
        });
        setAmount("");
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      toast.error("Update Failed", {
        description: "Failed to update wallet balance",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-auto bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-3 h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer">
          <Banknote className="h-5 w-5" />
          Just Got Paid?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-green-600" />
            Register New Income
          </DialogTitle>
          <DialogDescription className="text-base">
            Great job! Enter the amount you received to instantly top up your wallet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Amount Received
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="pl-10 h-11 text-lg font-medium focus:border-green-500 focus:ring-1 focus:ring-green-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          
          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[100, 250, 500].map((quickAmount) => (
              <Button
                key={quickAmount}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="border-2 hover:border-green-500 hover:text-green-600 cursor-pointer"
              >
                ${quickAmount}
              </Button>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleConfirm} 
            disabled={isLoading} 
            className="w-full bg-green-600 hover:bg-green-700 h-11 text-base gap-2 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Banknote className="h-4 w-4" />
            )}
            Confirm & Add to Wallet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}