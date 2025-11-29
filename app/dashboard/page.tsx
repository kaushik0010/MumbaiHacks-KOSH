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
import JoinedGroups from "@/components/dashboard/JoinedGroups";

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
    <div className="min-h-screen bg-linear-to-br from-blue-50/30 to-slate-50/50 py-8">
      <div className="container max-w-7xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome back, {user.name}! Here's your financial overview.
            </p>
          </div>
          <div className="w-full md:w-auto">
            <JustGotPaidButton />
          </div>
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <UserInfo user={user} healthScore={healthScore} />
            <StartSavingButton />
            <DeleteAccountButton />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <CurrentActivePlan initialCampaign={activePlan} />
              <SavingsHistory initialData={history} />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <WalletHistory initialTopups={topups} initialTotalPages={Math.ceil(totalTopUps / 5)} />
              <JoinedGroups />
            </div>
          </div>
        </div>

        {/* AI Hub */}
        <AIHub 
          healthScore={healthScore} 
          walletBalance={user.walletBalance} 
          taxBalance={user.taxBalance || 0} 
          savingsHistory={history} 
        />
      </div>
    </div>
  );
}