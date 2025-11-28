import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
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
    const history = await SavingModel.find({
      userId: session.user._id,
      isActive: false,
    })
    .select("campaignName amountSaved totalAmount endDate")
    .sort({ endDate: -1 })
    .lean();

    return NextResponse.json<ApiResponse>(
      { success: true, message: "History fetched", data: history },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error fetching history" },
      { status: 500 }
    );
  }
}