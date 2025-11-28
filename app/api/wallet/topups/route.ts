import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import WalletTopUpModel from "@/models/walletTopUp.model";
import { ApiResponse } from "@/types/apiResponse";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "5");
  const skip = (page - 1) * limit;

  try {
    const topups = await WalletTopUpModel.find({ userId: session.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await WalletTopUpModel.countDocuments({ userId: session.user._id });

    return NextResponse.json<ApiResponse>(
      { 
        success: true, 
        message: "Topups fetched", 
        data: { topups, totalPages: Math.ceil(total / limit) } 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error fetching topups" },
      { status: 500 }
    );
  }
}