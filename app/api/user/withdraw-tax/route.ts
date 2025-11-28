import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
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
    const user = await UserModel.findById(session.user._id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (!user.taxBalance || user.taxBalance <= 0) {
      return NextResponse.json({ success: false, message: "Tax Vault is empty." }, { status: 400 });
    }

    // --- AGENTIC LOGIC ---
    // In real life, we check: new Date().getMonth() === 3 (April)
    
    // FOR HACKATHON DEMO: 
    // Set this to FALSE to show the Agent protecting the money (The "Wow" factor)
    // Set this to TRUE to show the money moving to the wallet.
    const IS_TAX_SEASON = false; 

    if (!IS_TAX_SEASON) {
       return NextResponse.json<ApiResponse>(
        { 
          success: false, 
          message: "🔒 ACCESS DENIED. The Tax Agent has locked these funds until Tax Season (April) to prevent liability." 
        },
        { status: 403 }
      );
    }
    // ---------------------

    // Perform Transfer (Vault -> Wallet)
    const amountToRelease = user.taxBalance;
    user.walletBalance += amountToRelease;
    user.taxBalance = 0;

    await user.save();

    return NextResponse.json<ApiResponse>(
      { 
        success: true, 
        message: `Success! $${amountToRelease.toFixed(2)} released from Tax Vault to Wallet.` 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing withdrawal" },
      { status: 500 }
    );
  }
}