import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
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
    const user = await UserModel.findOne({ email: session.user.email }).select(
      "name email walletBalance"
    );

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "User details fetched", data: user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error fetching user details" },
      { status: 500 }
    );
  }
}