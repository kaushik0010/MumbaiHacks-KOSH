import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import WalletTopUpModel from "@/models/walletTopUp.model";
import { ApiResponse } from "@/types/apiResponse";

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const { name, walletTopUp } = await request.json();
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update Name
    if (name) {
      user.name = name;
    }

    // Process Wallet Top Up
    if (walletTopUp && typeof walletTopUp === "number" && walletTopUp > 0) {
      user.walletBalance += walletTopUp;

      // Create Record
      await WalletTopUpModel.create({
        userId: user._id,
        amount: walletTopUp,
        status: "success",
      });
    }

    await user.save();

    return NextResponse.json<ApiResponse>(
      { 
        success: true, 
        message: "Profile updated successfully", 
        data: { name: user.name, walletBalance: user.walletBalance } 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error updating profile" },
      { status: 500 }
    );
  }
}