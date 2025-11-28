import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import WalletTopUpModel from "@/models/walletTopUp.model";
import { ApiResponse } from "@/types/apiResponse";
import SavingModel from "@/models/saving.model";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  const sessionTransaction = await mongoose.startSession();
  sessionTransaction.startTransaction();

  try {
    const userId = session.user._id;

    // 1. Check for Active Plans
    const activePlan = await SavingModel.findOne({ userId, isActive: true }).session(sessionTransaction);

    if (activePlan) {
      await sessionTransaction.abortTransaction();
      sessionTransaction.endSession();
      return NextResponse.json<ApiResponse>(
        { success: false, message: "You must complete your active savings plans before deleting your account." },
        { status: 400 }
      );
    }

    // 2. Delete Associated Data
    await WalletTopUpModel.deleteMany({ userId }).session(sessionTransaction);
    await SavingModel.deleteMany({ userId }).session(sessionTransaction);

    // 3. Delete User
    await UserModel.findByIdAndDelete(userId).session(sessionTransaction);

    await sessionTransaction.commitTransaction();
    sessionTransaction.endSession();

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Account deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    await sessionTransaction.abortTransaction();
    sessionTransaction.endSession();
    console.error("Delete account error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error deleting account" },
      { status: 500 }
    );
  }
}