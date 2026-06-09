"use client";

import type { ReactNode } from "react";
import OptionCard from "@/components/estimate/OptionCard";
import type { RoofCondition } from "@/types/estimate";
import { ThumbsUp, Minus, AlertTriangle } from "lucide-react";

const options: {
  value: RoofCondition;
  title: string;
  description: string;
  icon: ReactNode;
  badge?: string;
}[] = [
  {
    value: "excellent",
    title: "Excellent",
    description: "Under 10 years old, no visible damage, just being proactive",
    icon: <ThumbsUp className="w-5 h-5" />,
  },
  {
    value: "good",
    title: "Good",
    description: "10–15 years old, minor wear or a few missing shingles",
    icon: <Minus className="w-5 h-5" />,
  },
  {
    value: "fair",
    title: "Fair",
    description: "Noticeable aging, granule loss, or recent leak",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  {
    value: "poor",
    title: "Poor / Urgent",
    description: "Active leaks, sagging, storm damage, or 20+ years old",
    icon: <AlertTriangle className="w-5 h-5" />,
    badge: "Priority",
  },
];

interface Props {
  value: RoofCondition | null;
  onChange: (value: RoofCondition) => void;
}

export default function StepCondition({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        How&apos;s your current roof holding up?
      </h2>
      <p className="text-brand-text-secondary mb-8">
        Be honest — this affects the scope of work and your estimate.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            icon={opt.icon}
            title={opt.title}
            description={opt.description}
            badge={opt.badge}
          />
        ))}
      </div>
    </div>
  );
}
