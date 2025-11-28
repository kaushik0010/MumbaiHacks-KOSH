import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { differenceInDays } from "date-fns";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import SavingModel from "@/models/saving.model";
import { ApiResponse } from "@/types/apiResponse";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const user = await UserModel.findById(session.user._id).select("walletBalance");
    const activePlan = await SavingModel.findOne({ userId: session.user._id, isActive: true });

    const actions = [];

    // Check 1: Wallet Health
    if (user && user.walletBalance < 20) {
      actions.push({
        id: "1",
        type: "critical",
        text: "Wallet balance is low. Top up now!",
        action: "top-up",
      });
    }

    // Check 2: Savings Status
    if (activePlan) {
      const daysUntilDue = differenceInDays(new Date(activePlan.nextDueDate), new Date());
      
      if (daysUntilDue <= 1) {
        actions.push({
          id: "2",
          type: "urgent",
          text: `Pay ${activePlan.frequency} contribution tomorrow.`,
          action: "pay",
        });
      } else {
        actions.push({
          id: "3",
          type: "info",
          text: `Next payment due in ${daysUntilDue} days.`,
          action: "wait",
        });
      }
    } else {
      // Check 3: No Active Plan
      actions.push({
        id: "4",
        type: "suggestion",
        text: "Start a savings plan to boost your score.",
        action: "create",
      });
    }

    return NextResponse.json({ success: true, actions }, { status: 200 });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error generating actions" },
      { status: 500 }
    );
  }
}