export type Stories = "1" | "1.5" | "2" | "2+";
export type RoofType = "gable" | "hip" | "flat" | "complex";
export type RoofCondition = "excellent" | "good" | "fair" | "poor";
export type RoofMaterial = "asphalt" | "architectural" | "metal" | "flat-membrane";
export type Timeline = "asap" | "1-3months" | "3-6months" | "exploring";
export type GTACity =
  | "Toronto"
  | "Mississauga"
  | "Brampton"
  | "Vaughan"
  | "Oakville"
  | "Markham"
  | "Scarborough"
  | "Oshawa"
  | "Ajax"
  | "Whitby";

export interface EstimateData {
  stories: Stories | null;
  roofType: RoofType | null;
  condition: RoofCondition | null;
  material: RoofMaterial | null;
  timeline: Timeline | null;
  city: GTACity | null;
}

export interface EstimateResult {
  low: number;
  high: number;
  materialLabel: string;
  includesItems: string[];
  timeframe: string;
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
  | "condition"
  | "material"
  | "timeline"
  | "city"
  | "result"
  | "lead"
  | "thankyou";
