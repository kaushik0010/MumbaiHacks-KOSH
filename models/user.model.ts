import mongoose, { Schema, Document, Model } from "mongoose";

// Email Regex for validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface User extends Document {
  name: string;
  email: string;
  password?: string;
  walletBalance: number;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [emailRegex, "Please enter a valid email address"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    isEmailVerified: {
      type: Boolean,
      default: true, 
    },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;