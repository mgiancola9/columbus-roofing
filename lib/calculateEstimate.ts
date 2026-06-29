import type {
  EstimateData,
  EstimateResult,
  Stories,
  RoofType,
  RoofMaterial,
} from "@/types/estimate";
import { lookupArea } from "./gtaAreas";

// Fallback roof size by stories, used only when we can't resolve the area from a postal code.
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

function roundToHundred(n: number): number {
  return Math.round(n / 100) * 100;
}

/**
 * Estimate = roof size × roof complexity × material $/sqft × regional price factor.
 * Roof size and price factor come from the selected address's postal code (area-typical);
 * if no postal code resolves, we fall back to a size assumed from the "stories" answer.
 */
export function calculateEstimate(data: EstimateData, postalCode?: string): EstimateResult | null {
  if (!data.stories || !data.roofType || !data.material) return null;

  const region = lookupArea(postalCode);
  const roofSqft = region.matched ? region.sqft : BASE_AREA[data.stories];
  const complexity = COMPLEXITY_FACTOR[data.roofType];
  const { low: matLow, high: matHigh, label } = MATERIAL_RANGE[data.material];

  const low = roundToHundred(roofSqft * complexity * matLow * region.factor);
  const high = roundToHundred(roofSqft * complexity * matHigh * region.factor);

  return {
    low,
    high,
    materialLabel: label,
    areaLabel: region.area,
    roofSqft,
  };
}
