import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <HowItWorks />
        <TrustSection />
        <WhyChooseUs />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
