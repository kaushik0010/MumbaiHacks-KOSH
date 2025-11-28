"use server";

import { getServerSession } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import SavingModel from "@/models/saving.model";
import WalletTopUpModel from "@/models/walletTopUp.model";

// Helper function for deterministic scoring
function calculateHealthScore(savings: any[]) {
  if (!savings || savings.length === 0) return 50; // Neutral start

  let totalContributions = 0;
  let onTimeContributions = 0;

  savings.forEach((plan) => {
    totalContributions += plan.totalContributionsDue || 0;
    onTimeContributions += plan.onTimeContributions || 0;
  });

  if (totalContributions === 0) return 50;

  const score = Math.round((onTimeContributions / totalContributions) * 100);
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, score));
}

export async function getDashboardData() {
  noStore();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return null;
  }

  await dbConnect();
  const userId = session.user._id;

  const [user, activePlan, history, topups, totalTopUps] = await Promise.all([
    UserModel.findById(userId).select("name email walletBalance").lean(),
    SavingModel.findOne({ userId, isActive: true }).lean(),
    SavingModel.find({ userId, isActive: false }).sort({ endDate: -1 }).lean(),
    WalletTopUpModel.find({ userId }).sort({ createdAt: -1 }).limit(5).lean(),
    WalletTopUpModel.countDocuments({ userId }),
  ]);

  // Combine all plans to calculate score
  const allPlans = [...(activePlan ? [activePlan] : []), ...history];
  const healthScore = calculateHealthScore(allPlans);

  return {
    user,
    activePlan,
    history,
    topups,
    totalTopUps,
    healthScore,
  };
}