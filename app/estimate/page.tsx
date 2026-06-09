import EstimateCalculator from "@/components/estimate/EstimateCalculator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Roof Estimate — GTARoofingEstimates.ca",
  description: "Get your instant roof estimate for your GTA home. Answer 6 questions and see your price in under 60 seconds.",
};

export default function EstimatePage() {
  return <EstimateCalculator />;
}
