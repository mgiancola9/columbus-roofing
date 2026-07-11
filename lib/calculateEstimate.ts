import type { EstimateData, EstimateResult, HouseProfile, SizeRange, RoofMaterial, RoofShape } from "@/types/estimate";
import { lookupArea } from "./gtaAreas";

// Living-area midpoint (sq ft) for each size chip range.
const SIZE_MIDPOINT: Record<SizeRange, number> = {
  "under-1500": 1200,
  "1500-2500": 2000,
  "2500-3500": 3000,
  "3500-plus": 4000,
};

// Divides living area down to footprint based on implied stories for the house profile.
const STORIES_DIVISOR: Record<HouseProfile, number> = {
  bungalow: 1.0,
  "two-storey": 1.85,
  backsplit: 1.4,
  townhouse: 1.9,
};

const ROOF_SHAPE_FACTOR: Record<RoofShape, { pitchMultiplier: number; complexityAdd: number }> = {
  simple: { pitchMultiplier: 1.05, complexityAdd: 0 },
  standard: { pitchMultiplier: 1.15, complexityAdd: 0.08 },
  complex: { pitchMultiplier: 1.25, complexityAdd: 0.18 },
};

// Installed cost per "square" (100 sq ft) by desired new-roof material, GTA/Ontario baseline.
const MATERIAL_PRICE_RANGE: Record<RoofMaterial, { low: number; high: number; label: string }> = {
  asphalt: { low: 550, high: 800, label: "Asphalt Shingles" },
  premium: { low: 800, high: 1200, label: "Premium Shingles" },
  metal: { low: 1200, high: 2000, label: "Metal Roofing" },
  "flat-membrane": { low: 700, high: 1500, label: "Flat / Membrane" },
  "not-sure": { low: 550, high: 800, label: "Asphalt Shingles (default)" },
};

function roundToHundred(n: number): number {
  return Math.round(n / 100) * 100;
}

/**
 * footprint = size_midpoint / stories_divisor
 * roof_area = footprint × pitch_multiplier × (1 + complexity_add)
 * squares = roof_area / 100
 * estimated_range = squares × material_price_per_square_range × city_labor_multiplier
 */
export function calculateEstimate(data: EstimateData): EstimateResult | null {
  if (!data.houseProfile || !data.sizeRange || !data.roofShape || !data.material) return null;

  const region = lookupArea(data.postalCode);
  const footprint = SIZE_MIDPOINT[data.sizeRange] / STORIES_DIVISOR[data.houseProfile];
  const { pitchMultiplier, complexityAdd } = ROOF_SHAPE_FACTOR[data.roofShape];
  const roofArea = footprint * pitchMultiplier * (1 + complexityAdd);
  const squares = roofArea / 100;
  const material = MATERIAL_PRICE_RANGE[data.material];

  const low = roundToHundred(squares * material.low * region.factor);
  const high = roundToHundred(squares * material.high * region.factor);

  return {
    low,
    high,
    areaLabel: region.area,
    roofSquares: Math.round(squares * 10) / 10,
    materialLabel: material.label,
  };
}
