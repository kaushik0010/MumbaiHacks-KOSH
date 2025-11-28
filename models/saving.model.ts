import mongoose, { Schema, Document, Model } from "mongoose";

export interface Saving extends Document {
  userId: mongoose.Types.ObjectId;
  campaignName: string;
  frequency: "daily" | "weekly" | "bi-weekly";
  amountPerContribution: number;
  totalAmount: number;
  amountSaved: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  nextDueDate: Date;
  onTimeContributions: number;
  totalContributionsDue: number;
  createdAt: Date;
  updatedAt: Date;
}

const SavingSchema: Schema<Saving> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    campaignName: {
      type: String,
      required: true,
    },
    frequency: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "bi-weekly"],
    },
    amountPerContribution: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    amountSaved: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
    },
    onTimeContributions: {
      type: Number,
      default: 0,
    },
    totalContributionsDue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

SavingSchema.index({ userId: 1, isActive: 1 });

const SavingModel =
  (mongoose.models.Saving as Model<Saving>) ||
  mongoose.model<Saving>("Saving", SavingSchema);

export default SavingModel;