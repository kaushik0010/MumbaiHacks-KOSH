import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import SavingModel from "@/models/saving.model";
import UserModel from "@/models/user.model";
import { savingSchema } from "@/schemas/savingSchema";
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const body = await request.json();
    const result = savingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid input data" },
        { status: 400 }
      );
    }

    const { campaignName, frequency, amountPerContribution, duration } = result.data;

    // 1. Check for existing active campaign
    const activeCampaign = await SavingModel.findOne({
      userId: session.user._id,
      isActive: true,
    });

    if (activeCampaign) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "You already have an active savings plan." },
        { status: 400 }
      );
    }

    // 2. Check Wallet Balance
    const user = await UserModel.findById(session.user._id);
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.walletBalance < amountPerContribution) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Insufficient wallet balance for first contribution." },
        { status: 400 }
      );
    }

    // 3. Deduct First Payment
    user.walletBalance -= amountPerContribution;
    await user.save();

    // 4. Calculate Dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    const nextDueDate = new Date(startDate);

    switch (frequency) {
      case "daily":
        endDate.setDate(endDate.getDate() + duration);
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        break;
      case "weekly":
        endDate.setDate(endDate.getDate() + duration * 7);
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case "bi-weekly":
        endDate.setDate(endDate.getDate() + duration * 14);
        nextDueDate.setDate(nextDueDate.getDate() + 14);
        break;
    }

    const totalAmount = amountPerContribution * duration;

    // 5. Create Plan
    await SavingModel.create({
      userId: user._id,
      campaignName,
      frequency,
      amountPerContribution,
      totalAmount,
      amountSaved: amountPerContribution, // First payment added
      startDate,
      endDate,
      isActive: true,
      nextDueDate,
      onTimeContributions: 1,
      totalContributionsDue: 1,
    });

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Savings plan created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create savings error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error creating savings plan" },
      { status: 500 }
    );
  }
}