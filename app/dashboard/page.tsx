import { getDashboardData } from "./actions";
import { redirect } from "next/navigation";
import UserInfo from "@/components/dashboard/UserInfo";
import WalletHistory from "@/components/dashboard/wallet/WalletHistory";
import CurrentActivePlan from "@/components/dashboard/CurrentActivePlan";
import StartSavingButton from "@/components/dashboard/StartSavingButton";
import SavingsHistory from "@/components/dashboard/SavingsHistory";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import JustGotPaidButton from "@/components/dashboard/JustGotPaidButton";
import AIHub from "@/components/dashboard/AIHub";
import JoinedGroups from "@/components/dashboard/JoinedGroups";

export default async function DashboardPage() {
  // 1. Fetch Data from Server Action
  const data = await getDashboardData();

  // 2. Auth Guard
  if (!data) {
    redirect("/login");
  }

  // 3. Serialization for Client Components
  const user = JSON.parse(JSON.stringify(data.user));
  const activePlan = JSON.parse(JSON.stringify(data.activePlan));
  const history = JSON.parse(JSON.stringify(data.history));
  const topups = JSON.parse(JSON.stringify(data.topups));
  const totalTopUps = data.totalTopUps;
  const healthScore = data.healthScore;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 min-h-screen">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            Overview of your financial health
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto cursor-pointer">
          <JustGotPaidButton />
          <DeleteAccountButton />
        </div>
      </div>
      
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column - Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* First Row - User Info & Wallet History */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="h-full">
              <UserInfo user={user} healthScore={healthScore} />
            </div>
            <div className="h-full">
              <WalletHistory 
                initialTopups={topups} 
                initialTotalPages={Math.ceil(totalTopUps / 5)} 
              />
            </div>
          </div>

          {/* Second Row - Current Active Plan */}
          <div>
            <CurrentActivePlan initialCampaign={activePlan} />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Start Saving Button */}
          <div>
            <StartSavingButton />
          </div>

          {/* Joined Groups */}
          <div>
            <JoinedGroups />
          </div>

          {/* Savings History */}
          <div>
            <SavingsHistory initialData={history} />
          </div>
        </div>
      </div>

      {/* Floating AI Coach */}
      <AIHub 
        healthScore={healthScore} 
        walletBalance={user.walletBalance} 
        taxBalance={user.taxBalance || 0}
        savingsHistory={history}
      />
    </div>
  );
}