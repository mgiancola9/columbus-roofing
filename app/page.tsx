import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import TrustSection from "@/components/TrustSection";
import Reviews from "@/components/Reviews";
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
        <Reviews />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
