import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Flexible Savings Plans",
    description: "Create daily, weekly, or bi-weekly savings plans to match your unique income schedule.",
    icon: "💰",
  },
  {
    title: "AI-Powered Coach",
    description: "Your personal AI agent provides proactive tips and helps you stay on track.",
    icon: "🤖",
  },
  {
    title: "Simple Wallet System",
    description: "A secure in-app wallet to manage your funds and contributions.",
    icon: "👛",
  },
  {
    title: "Proactive AI To-Do List",
    description: "An AI-powered action list that tells you exactly what to do next to reach your goals.",
    icon: "📅",
  },
  {
    title: "Multimodal Analysis",
    description: "Upload bills and receipts to get AI-powered insights on your spending.",
    icon: "📸",
  },
  {
    title: "Unified Dashboard",
    description: "A single, clean dashboard to see your plans, wallet, and AI score.",
    icon: "📊",
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Powerful Features</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to take control of your financial journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-100/50 border-0 shadow-none hover:bg-white hover:shadow-md transition-all">
              <CardHeader>
                <div className="mb-2 text-4xl">{feature.icon}</div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}