import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { name, email, password } = await request.json();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      walletBalance: 0,
      isEmailVerified: true,
    });

    await newUser.save();

    return NextResponse.json<ApiResponse>(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}