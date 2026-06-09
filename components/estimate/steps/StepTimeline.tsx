"use client";

import type { ReactNode } from "react";
import OptionCard from "@/components/estimate/OptionCard";
import type { Timeline } from "@/types/estimate";
import { Zap, Calendar, Clock, Eye } from "lucide-react";

const options: {
  value: Timeline;
  title: string;
  description: string;
  icon: ReactNode;
  badge?: string;
}[] = [
  {
    value: "asap",
    title: "As Soon As Possible",
    description: "Active leak, storm damage, or urgent replacement needed",
    icon: <Zap className="w-5 h-5" />,
    badge: "Priority",
  },
  {
    value: "1-3months",
    title: "Within 1–3 Months",
    description: "Planning for this season before winter",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    value: "3-6months",
    title: "3–6 Months Out",
    description: "Early planning, no urgency",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    value: "exploring",
    title: "Just Exploring",
    description: "Researching costs for future reference",
    icon: <Eye className="w-5 h-5" />,
  },
];

interface Props {
  value: Timeline | null;
  onChange: (value: Timeline) => void;
}

export default function StepTimeline({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        What&apos;s your timeline?
      </h2>
      <p className="text-brand-text-secondary mb-8">
        This helps us match you with available contractors.
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
