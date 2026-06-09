"use client";

import type { ReactNode } from "react";
import OptionCard from "@/components/estimate/OptionCard";
import type { RoofType } from "@/types/estimate";

const options: { value: RoofType; title: string; description: string; badge?: string }[] = [
  {
    value: "gable",
    title: "Gable (Triangle)",
    description: "Two sloping sides meet at a ridge — the most common style in Ontario",
    badge: "Most Common",
  },
  {
    value: "hip",
    title: "Hip Roof",
    description: "All four sides slope downward to the walls — more complex than gable",
  },
  {
    value: "flat",
    title: "Flat / Low-Slope",
    description: "Nearly horizontal — common on additions, garages, and commercial properties",
  },
  {
    value: "complex",
    title: "Complex / Mixed",
    description: "Multiple pitches, dormers, or valleys — custom design or additions",
  },
];

// SVG Roof Icons
function GableIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-10 h-8" aria-hidden="true">
      <rect x="2" y="18" width="36" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M2 18L20 6L38 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function HipIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-10 h-8" aria-hidden="true">
      <rect x="2" y="18" width="36" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M8 18L20 6L32 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
      <path d="M2 18L8 18" stroke="currentColor" strokeWidth="2" />
      <path d="M32 18L38 18" stroke="currentColor" strokeWidth="2" />
      <path d="M2 18L8 18M38 18L32 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 24L8 18L32 18L38 24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" fill="none"/>
    </svg>
  );
}
function FlatIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-10 h-8" aria-hidden="true">
      <rect x="2" y="12" width="36" height="18" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="2" y1="12" x2="38" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function ComplexIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-10 h-8" aria-hidden="true">
      <rect x="2" y="18" width="36" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M2 18L12 8L22 14L30 6L38 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

const ICONS: Record<RoofType, ReactNode> = {
  gable: <GableIcon />,
  hip: <HipIcon />,
  flat: <FlatIcon />,
  complex: <ComplexIcon />,
};

interface Props {
  value: RoofType | null;
  onChange: (value: RoofType) => void;
}

export default function StepRoofType({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        What type of roof do you have?
      </h2>
      <p className="text-brand-text-secondary mb-8">
        Not sure? Gable is the most common in Ontario.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            icon={ICONS[opt.value]}
            title={opt.title}
            description={opt.description}
            badge={opt.badge}
          />
        ))}
      </div>
    </div>
  );
}
