export type Stories = "1" | "1.5" | "2" | "2+";
export type RoofType = "gable" | "hip" | "flat" | "complex";
export type RoofMaterial = "asphalt" | "architectural" | "metal" | "flat-membrane";

export interface EstimateData {
  stories: Stories | null;
  roofType: RoofType | null;
  material: RoofMaterial | null;
}

export interface EstimateResult {
  low: number;
  high: number;
  materialLabel: string;
  areaLabel: string;
  roofSqft: number;
}

export interface LeadData {
  name: string;
  phone: string;
  email: string;
  address?: string;
}

export type EstimateStep =
  | "stories"
  | "roofType"
  | "material"
  | "lead"
  | "result";
