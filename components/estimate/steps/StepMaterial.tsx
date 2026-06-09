"use client";

import OptionCard from "@/components/estimate/OptionCard";
import type { RoofMaterial } from "@/types/estimate";

const options: {
  value: RoofMaterial;
  title: string;
  description: string;
  priceRange: string;
  badge?: string;
}[] = [
  {
    value: "asphalt",
    title: "Asphalt Shingles",
    description: "Most affordable option. 25-year lifespan. Widely available.",
    priceRange: "$4–$6 /sqft",
    badge: "Budget",
  },
  {
    value: "architectural",
    title: "Architectural Shingles",
    description: "Dimensional look with better durability. 30-year lifespan.",
    priceRange: "$6.50–$9.50 /sqft",
    badge: "Most Popular",
  },
  {
    value: "metal",
    title: "Standing Seam Metal",
    description: "Premium performance. 50+ year lifespan. Excellent for snow loads.",
    priceRange: "$11–$17 /sqft",
    badge: "Premium",
  },
  {
    value: "flat-membrane",
    title: "Flat TPO/EPDM",
    description: "For flat or low-slope roofs. Watertight and energy-efficient.",
    priceRange: "$7.50–$12 /sqft",
  },
];

interface Props {
  value: RoofMaterial | null;
  onChange: (value: RoofMaterial) => void;
}

export default function StepMaterial({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        What material are you interested in?
      </h2>
      <p className="text-brand-text-secondary mb-8">
        Prices shown are installed cost estimates for the GTA.
      </p>
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            icon={
              <span className="text-xs font-bold text-current leading-tight text-center">
                {opt.priceRange}
              </span>
            }
            title={opt.title}
            description={opt.description}
            badge={opt.badge}
          />
        ))}
      </div>
    </div>
  );
}
