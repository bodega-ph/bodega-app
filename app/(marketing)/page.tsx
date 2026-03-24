import HeroSection from "@/features/marketing/components/HeroSection";
import FeaturesGrid from "@/features/marketing/components/FeaturesGrid";
import StepsSection from "@/features/marketing/components/StepsSection";
import CTASection from "@/features/marketing/components/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full overflow-hidden">
      <HeroSection />
      <FeaturesGrid />
      <StepsSection />
      <CTASection />
    </div>
  );
}
