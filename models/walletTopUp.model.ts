import mongoose, { Schema, Document, Model } from "mongoose";

export interface WalletTopUp extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: "success" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const WalletTopUpSchema: Schema<WalletTopUp> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

const WalletTopUpModel =
  (mongoose.models.WalletTopUp as Model<WalletTopUp>) ||
  mongoose.model<WalletTopUp>("WalletTopUp", WalletTopUpSchema);

export default WalletTopUpModel;