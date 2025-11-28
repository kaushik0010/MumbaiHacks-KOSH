import { getDashboardData } from "./actions";
import { redirect } from "next/navigation";
import UserInfo from "@/components/dashboard/UserInfo";
import WalletHistory from "@/components/dashboard/wallet/WalletHistory";
import CurrentActivePlan from "@/components/dashboard/CurrentActivePlan";
import StartSavingButton from "@/components/dashboard/StartSavingButton";
import SavingsHistory from "@/components/dashboard/SavingsHistory";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import AIHub from "@/components/dashboard/AIHub";
import JustGotPaidButton from "@/components/dashboard/JustGotPaidButton";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) {
    redirect("/login");
  }

  // Serialization for Client Components
  const user = JSON.parse(JSON.stringify(data.user));
  const activePlan = JSON.parse(JSON.stringify(data.activePlan));
  const history = JSON.parse(JSON.stringify(data.history));
  const topups = JSON.parse(JSON.stringify(data.topups));
  const totalTopUps = data.totalTopUps;
  const healthScore = data.healthScore;

  return (
    <div className="container mx-auto p-6 space-y-6 relative min-h-screen pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="w-full md:w-auto">
             {/* 1. Render Income Button */}
             <JustGotPaidButton />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: User Info & Wallet */}
        <div className="md:col-span-1 space-y-6">
          <UserInfo user={user} />
          <StartSavingButton />
          <SavingsHistory initialData={history} />
          <DeleteAccountButton />
        </div>

        {/* Column 2 & 3: Main Content */}
        <div className="md:col-span-2 space-y-6">
          <CurrentActivePlan initialCampaign={activePlan} />
          <WalletHistory initialTopups={topups} initialTotalPages={Math.ceil(totalTopUps / 5)} />
        </div>
      </div>

      {/* 2. Render AI Hub (Fixed Position handled in component) */}
      <AIHub 
        healthScore={healthScore} 
        walletBalance={user.walletBalance} 
        taxBalance={user.taxBalance || 0} 
        savingsHistory={history} 
      />
    </div>
  );
}