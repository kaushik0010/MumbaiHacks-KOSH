import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import SavingModel from "@/models/saving.model";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/apiResponse";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { savingId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

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

    const user = await UserModel.findById(session.user._id);
    if (!user) {
        return NextResponse.json<ApiResponse>(
            { success: false, message: "User not found" },
            { status: 404 }
        );
    }

    // Payout Check: Plan must be inactive (completed) or past end date
    // Or user is forcing a withdrawal (logic per prompt: isActive check)
    if (saving.isActive && saving.endDate > new Date()) {
         return NextResponse.json<ApiResponse>(
            { success: false, message: "Campaign not completed yet." },
            { status: 400 }
          );
    }

    // Perform Transfer
    user.walletBalance += saving.amountSaved;
    saving.isActive = false; // Ensure it's marked inactive

    // If we were storing "payoutStatus" we would update it here, 
    // but for this lite version, we rely on balance transfer.
    // Resetting amountSaved to 0 is optional, but keeping it for record history is better.
    
    await user.save();
    await saving.save();

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Funds transferred to wallet successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Payout error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error processing payout" },
      { status: 500 }
    );
  }
}