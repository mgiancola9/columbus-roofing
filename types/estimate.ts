export type HouseProfile = "bungalow" | "two-storey" | "backsplit" | "townhouse";
export type SizeRange = "under-1500" | "1500-2500" | "2500-3500" | "3500-plus";
export type RoofMaterial = "asphalt" | "premium" | "metal" | "flat-membrane" | "not-sure";
export type RoofShape = "simple" | "standard" | "complex";

export interface EstimateData {
  postalCode: string;
  houseProfile: HouseProfile | null;
  sizeRange: SizeRange | null;
  material: RoofMaterial | null;
  roofShape: RoofShape | null;
}

export interface EstimateResult {
  low: number;
  high: number;
  areaLabel: string;
  roofSquares: number;
  materialLabel: string;
}

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

export type EstimateStep =
  | "postal"
  | "houseSize"
  | "roofShape"
  | "lead"
  | "result";
