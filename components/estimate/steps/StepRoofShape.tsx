"use client";

import type { ReactNode } from "react";
import OptionCard from "@/components/estimate/OptionCard";
import type { RoofShape } from "@/types/estimate";

const options: { value: RoofShape; title: string; description: string; badge?: string }[] = [
  {
    value: "simple",
    title: "Simple & Low",
    description: "Flat-ish, one or two slopes",
  },
  {
    value: "standard",
    title: "Standard",
    description: "Typical peaked roof",
    badge: "Most Common",
  },
  {
    value: "complex",
    title: "Steep & Complex",
    description: "Steep slopes, multiple angles, dormers",
  },
];

function SimpleIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-10 h-8" aria-hidden="true">
      <rect x="2" y="14" width="36" height="16" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M2 14L20 8L38 14" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
function StandardIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-10 h-8" aria-hidden="true">
      <rect x="2" y="18" width="36" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M2 18L20 6L38 18" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
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

const ICONS: Record<RoofShape, ReactNode> = {
  simple: <SimpleIcon />,
  standard: <StandardIcon />,
  complex: <ComplexIcon />,
};

interface Props {
  value: RoofShape | null;
  onChange: (value: RoofShape) => void;
}

export default function StepRoofShape({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        Which best matches your roof?
      </h2>
      <p className="text-brand-text-secondary mb-8">
        Not sure? Standard is the most common shape in the GTA.
      </p>
      <div className="grid grid-cols-1 gap-3">
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
