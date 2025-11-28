import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import SavingModel from "@/models/saving.model";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/apiResponse";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { savingId: string } } // Fixed type for Next.js 15 params
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // In Next.js 15 params are async
  const { savingId } = await params;

  await dbConnect();

  try {
    const saving = await SavingModel.findById(savingId);

    if (!saving) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Plan not found" },
        { status: 404 }
      );
    }

    if (saving.userId.toString() !== session.user._id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized access to plan" },
        { status: 403 }
      );
    }

    if (!saving.isActive) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Plan has ended." },
        { status: 400 }
      );
    }

    // Check Due Date
    if (new Date() < saving.nextDueDate) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Your next contribution is not due yet." },
        { status: 400 }
      );
    }

    // Get Payment Amount
    const { amountPaid } = await request.json();

    if (amountPaid !== saving.amountPerContribution) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid contribution amount." },
        { status: 400 }
      );
    }

    // User Balance Check
    const user = await UserModel.findById(session.user._id);
    if (!user || user.walletBalance < amountPaid) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Insufficient wallet balance." },
        { status: 400 }
      );
    }

    // Execute Transaction
    user.walletBalance -= amountPaid;
    saving.amountSaved += amountPaid;

    // AI Health Score Logic
    saving.totalContributionsDue += 1;
    saving.onTimeContributions += 1; // Hackathon assumption: if paying, it is on time

    // Update Next Due Date
    const nextDue = new Date(saving.nextDueDate);
    switch (saving.frequency) {
      case "daily":
        nextDue.setDate(nextDue.getDate() + 1);
        break;
      case "weekly":
        nextDue.setDate(nextDue.getDate() + 7);
        break;
      case "bi-weekly":
        nextDue.setDate(nextDue.getDate() + 14);
        break;
    }
    saving.nextDueDate = nextDue;

    // Check Completion
    if (saving.amountSaved >= saving.totalAmount) {
      saving.isActive = false;
    }

    await user.save();
    await saving.save();

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Contribution successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contribution error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error processing contribution" },
      { status: 500 }
    );
  }
}