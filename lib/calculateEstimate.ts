import type {
  EstimateData,
  EstimateResult,
  Stories,
  RoofType,
  RoofCondition,
  RoofMaterial,
} from "@/types/estimate";

const BASE_AREA: Record<Stories, number> = {
  "1": 1400,
  "1.5": 1650,
  "2": 2000,
  "2+": 2600,
};

const MATERIAL_RANGE: Record<RoofMaterial, { low: number; high: number; label: string }> = {
  asphalt: { low: 4.0, high: 6.0, label: "3-Tab Asphalt Shingles" },
  architectural: { low: 6.5, high: 9.5, label: "Architectural Shingles" },
  metal: { low: 11.0, high: 17.0, label: "Standing Seam Metal" },
  "flat-membrane": { low: 7.5, high: 12.0, label: "Flat TPO/EPDM Membrane" },
};

const COMPLEXITY_FACTOR: Record<RoofType, number> = {
  gable: 1.0,
  hip: 1.15,
  flat: 0.85,
  complex: 1.3,
};

const CONDITION_FACTOR: Record<RoofCondition, number> = {
  excellent: 0.85,
  good: 1.0,
  fair: 1.1,
  poor: 1.25,
};

const INCLUDES_BY_MATERIAL: Record<RoofMaterial, string[]> = {
  asphalt: [
    "Full tear-off & disposal",
    "Ice & water shield",
    "Synthetic underlayment",
    "New asphalt shingles",
    "Ridge cap & flashing",
    "10-year labour warranty",
  ],
  architectural: [
    "Full tear-off & disposal",
    "Ice & water shield",
    "Synthetic underlayment",
    "Architectural shingles (30-yr)",
    "Ridge cap & all flashing",
    "15-year labour warranty",
  ],
  metal: [
    "Full tear-off & disposal",
    "Rigid insulation board",
    "Standing seam metal panels",
    "Hidden fastener system",
    "Copper flashing details",
    "25-year labour warranty",
  ],
  "flat-membrane": [
    "Full tear-off & disposal",
    "Tapered insulation board",
    "60-mil TPO/EPDM membrane",
    "Heat-welded seams",
    "Drain upgrade if required",
    "15-year labour warranty",
  ],
};

const TIMEFRAME_BY_MATERIAL: Record<RoofMaterial, string> = {
  asphalt: "1–2 day installation",
  architectural: "1–2 day installation",
  metal: "3–5 day installation",
  "flat-membrane": "2–3 day installation",
};

function roundToHundred(n: number): number {
  return Math.round(n / 100) * 100;
}

export function calculateEstimate(data: EstimateData): EstimateResult | null {
  if (!data.stories || !data.roofType || !data.condition || !data.material) return null;

  const area = BASE_AREA[data.stories];
  const complexity = COMPLEXITY_FACTOR[data.roofType];
  const condition = CONDITION_FACTOR[data.condition];
  const { low: matLow, high: matHigh, label } = MATERIAL_RANGE[data.material];

  const lowEstimate = roundToHundred(area * complexity * condition * matLow);
  const highEstimate = roundToHundred(area * complexity * condition * matHigh);

  return {
    low: lowEstimate,
    high: highEstimate,
    materialLabel: label,
    includesItems: INCLUDES_BY_MATERIAL[data.material],
    timeframe: TIMEFRAME_BY_MATERIAL[data.material],
  };
}
