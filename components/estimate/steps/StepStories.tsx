"use client";

import OptionCard from "@/components/estimate/OptionCard";
import type { Stories } from "@/types/estimate";

const options: { value: Stories; title: string; description: string; icon: string }[] = [
  {
    value: "1",
    title: "1 Storey",
    description: "Bungalow or ranch-style home",
    icon: "🏠",
  },
  {
    value: "1.5",
    title: "1.5 Storeys",
    description: "Cape cod or partial second floor",
    icon: "🏡",
  },
  {
    value: "2",
    title: "2 Storeys",
    description: "Standard two-storey detached",
    icon: "🏘️",
  },
  {
    value: "2+",
    title: "2+ Storeys",
    description: "Large home or multi-level",
    icon: "🏗️",
  },
];

interface Props {
  value: Stories | null;
  onChange: (value: Stories) => void;
}

export default function StepStories({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        How many storeys is your home?
      </h2>
      <p className="text-brand-text-secondary mb-8">
        This helps us estimate your roof area.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            icon={<span className="text-2xl">{opt.icon}</span>}
            title={opt.title}
            description={opt.description}
          />
        ))}
      </div>
    </div>
  );
}
