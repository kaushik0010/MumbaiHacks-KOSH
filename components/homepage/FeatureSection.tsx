import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Flexible Savings Plans",
    description: "Create daily, weekly, or bi-weekly savings plans to match your unique income schedule.",
    icon: "💰",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "AI-Powered Coach",
    description: "Your personal AI agent provides proactive tips and helps you stay on track.",
    icon: "🤖",
    color: "from-purple-500 to-pink-500",
  },
  {
    title: "Secure Wallet System",
    description: "A secure in-app wallet to manage your funds and contributions with bank-level encryption.",
    icon: "👛",
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Smart To-Do List",
    description: "AI-powered action list that tells you exactly what to do next to reach your goals.",
    icon: "📅",
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Multimodal Analysis",
    description: "Upload bills and receipts to get AI-powered insights on your spending patterns.",
    icon: "📸",
    color: "from-indigo-500 to-purple-500",
  },
  {
    title: "Unified Dashboard",
    description: "A single, clean dashboard to see your plans, wallet, and financial health score.",
    icon: "📊",
    color: "from-teal-500 to-blue-500",
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-16 md:py-24 lg:py-32 bg-linear-to-b from-white to-slate-50/50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to take control of your financial journey with intelligent tools.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-2 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:border-blue-100 transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className={`mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-r ${feature.color} text-white text-xl shadow-sm`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
              
              {/* Hover effect */}
              <div className="absolute inset-0 border-2 border-transparent bg-linear-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}