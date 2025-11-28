import HeroSection from "@/components/homepage/HeroSection";
import FeatureSection from "@/components/homepage/FeatureSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeatureSection />
    </div>
  );
}