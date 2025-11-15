import Features from "@/components/Feature";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWork";
import TestimonialsSection from "@/components/TestimonialsSection";

const page = async () => {
  return (
    <div className="bg-background  ">
      <HeroSection></HeroSection>
      <Features></Features>
      <HowItWorks></HowItWorks>
      <TestimonialsSection></TestimonialsSection>
    </div>
  );
};

export default page;
