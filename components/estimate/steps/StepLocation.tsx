"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MapPin, CheckCircle2 } from "lucide-react";
import type { GTACity } from "@/types/estimate";

const cities: GTACity[] = [
  "Toronto",
  "Mississauga",
  "Brampton",
  "Vaughan",
  "Oakville",
  "Markham",
  "Scarborough",
  "Oshawa",
  "Ajax",
  "Whitby",
];

interface Props {
  value: GTACity | null;
  onChange: (value: GTACity) => void;
}

export default function StepLocation({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        Which city are you in?
      </h2>
      <p className="text-brand-text-secondary mb-8">
        We serve all of the Greater Toronto Area.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cities.map((city, i) => (
          <motion.button
            key={city}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(city)}
            className={cn(
              "relative flex items-center gap-2.5 rounded-xl border-2 p-4 text-left transition-all duration-200 font-semibold text-sm",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
              value === city
                ? "border-brand-primary bg-brand-primary/5 text-brand-primary shadow-md shadow-brand-primary/10"
                : "border-brand-border bg-brand-card text-brand-text hover:border-brand-primary/40 hover:bg-brand-bg"
            )}
          >
            {value === city ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-brand-primary" />
            ) : (
              <MapPin className="w-4 h-4 flex-shrink-0 text-brand-text-secondary" />
            )}
            {city}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
