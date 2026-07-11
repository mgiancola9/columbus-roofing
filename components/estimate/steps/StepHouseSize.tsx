"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import OptionCard from "@/components/estimate/OptionCard";
import { cn } from "@/lib/utils";
import type { HouseProfile, SizeRange, RoofMaterial } from "@/types/estimate";

const PROFILE_OPTIONS: { value: HouseProfile; title: string; description: string }[] = [
  { value: "bungalow", title: "Bungalow", description: "Single storey, no upper floor" },
  { value: "two-storey", title: "2-Storey", description: "Standard two-storey detached" },
  { value: "backsplit", title: "Backsplit / Sidesplit", description: "Staggered, split-level floors" },
  { value: "townhouse", title: "Townhouse", description: "Attached, 2–3 storeys" },
];

function BungalowIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-9 h-7" aria-hidden="true">
      <path d="M2 30V16L20 4L38 16V30" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 30H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function TwoStoreyIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-9 h-7" aria-hidden="true">
      <path d="M4 30V8L20 2L36 8V30" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M4 30H36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 19H36" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}
function BacksplitIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-9 h-7" aria-hidden="true">
      <path d="M2 30V20L12 12V30" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 30V14L22 6L32 14V30" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 30H38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function TownhouseIcon() {
  return (
    <svg viewBox="0 0 40 32" fill="none" className="w-9 h-7" aria-hidden="true">
      <path d="M2 30V12L9 6L16 12V30" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M16 30V12L23 6L30 12V30" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M2 30H30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const ICONS: Record<HouseProfile, ReactNode> = {
  bungalow: <BungalowIcon />,
  "two-storey": <TwoStoreyIcon />,
  backsplit: <BacksplitIcon />,
  townhouse: <TownhouseIcon />,
};

const SIZE_OPTIONS: { value: SizeRange; label: string }[] = [
  { value: "under-1500", label: "Under 1,500 sq ft" },
  { value: "1500-2500", label: "1,500–2,500 sq ft" },
  { value: "2500-3500", label: "2,500–3,500 sq ft" },
  { value: "3500-plus", label: "3,500+ sq ft" },
];

const MATERIAL_OPTIONS: { value: RoofMaterial; title: string; description?: string; priceRange: string }[] = [
  { value: "asphalt", title: "Asphalt shingles", description: "Most popular in the GTA", priceRange: "$550–$800" },
  { value: "premium", title: "Premium shingles", description: "Thicker, longer warranty, more style options", priceRange: "$800–$1,200" },
  { value: "metal", title: "Metal roofing", description: "Steel or standing seam — built to last", priceRange: "$1,200–$2,000" },
  { value: "flat-membrane", title: "Flat / membrane", description: "Best for low-slope roofs and additions", priceRange: "$700–$1,500" },
  { value: "not-sure", title: "Not sure yet", priceRange: "" },
];

interface Props {
  profile: HouseProfile | null;
  sizeRange: SizeRange | null;
  material: RoofMaterial | null;
  onComplete: (profile: HouseProfile, sizeRange: SizeRange, material: RoofMaterial) => void;
}

export default function StepHouseSize({ profile, sizeRange, material, onComplete }: Props) {
  const [subStep, setSubStep] = useState<"profile" | "size">(profile ? "size" : "profile");
  const [selectedProfile, setSelectedProfile] = useState<HouseProfile | null>(profile);
  const [selectedSize, setSelectedSize] = useState<SizeRange | null>(sizeRange);
  const [selectedMaterial, setSelectedMaterial] = useState<RoofMaterial | null>(material);

  function pickSize(value: SizeRange) {
    setSelectedSize(value);
    if (selectedProfile && selectedMaterial) {
      setTimeout(() => onComplete(selectedProfile, value, selectedMaterial), 180);
    }
  }

  function pickMaterial(value: RoofMaterial) {
    setSelectedMaterial(value);
    if (selectedProfile && selectedSize) {
      setTimeout(() => onComplete(selectedProfile, selectedSize, value), 180);
    }
  }

  if (subStep === "size" && selectedProfile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          onClick={() => setSubStep("profile")}
          className="inline-flex items-center gap-1.5 text-brand-text-secondary hover:text-brand-text text-sm font-medium mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home type
        </button>
        <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
          How big is your home?
        </h2>
        <p className="text-brand-text-secondary mb-8">Total living area, all floors combined.</p>

        <div className="flex flex-wrap gap-3 mb-10">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => pickSize(opt.value)}
              className={cn(
                "rounded-full border-2 px-5 py-3 text-sm font-semibold transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2",
                selectedSize === opt.value
                  ? "border-brand-primary bg-brand-primary text-white"
                  : "border-brand-border bg-brand-card text-brand-text hover:border-brand-primary/40 hover:bg-brand-bg"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <h3 className="text-xl md:text-2xl font-black text-brand-text tracking-tight mb-2">
          What material are you thinking for your new roof?
        </h3>
        <p className="text-brand-text-secondary mb-6 text-sm">
          This helps us give you a more accurate range — you can always change your mind later.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {MATERIAL_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              selected={selectedMaterial === opt.value}
              onClick={() => pickMaterial(opt.value)}
              icon={
                opt.priceRange ? (
                  <span className="text-xs font-bold text-current leading-tight text-center">
                    {opt.priceRange}
                  </span>
                ) : undefined
              }
              title={opt.title}
              description={opt.description}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        What best describes your home?
      </h2>
      <p className="text-brand-text-secondary mb-8">This helps us estimate your roof area.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROFILE_OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            selected={selectedProfile === opt.value}
            onClick={() => {
              setSelectedProfile(opt.value);
              setSubStep("size");
            }}
            icon={ICONS[opt.value]}
            title={opt.title}
            description={opt.description}
          />
        ))}
      </div>
    </div>
  );
}
