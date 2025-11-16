import Features from "@/components/Feature";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWork";
import TestimonialsSection from "@/components/TestimonialsSection";

export default function Page() {
  return (
    <div className="bg-background">
      <HeroSection />
      <Features />
      <HowItWorks />
      <TestimonialsSection />
    </div>
  );
}
