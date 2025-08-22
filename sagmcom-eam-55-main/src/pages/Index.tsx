import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import OverviewCards from "@/components/OverviewCards";
import FeatureHighlights from "@/components/FeatureHighlights";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <OverviewCards />
        <FeatureHighlights />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
