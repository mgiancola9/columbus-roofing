/**
 * GTA area data keyed off the postal-code FSA (first 3 chars).
 * Mirrors the Columbus `ZIP_DB` approach: each region carries a *typical* roof size
 * and a regional price factor (labour/permits/demand vary by municipality).
 *
 * NOTE: these are area-typical figures, not a measurement of the specific property.
 * The matched roofer confirms the exact size + price on-site. To get the real roof
 * area per address, layer in the Google Solar API (Tier B) later.
 */

export interface AreaInfo {
  /** Display name, e.g. "Toronto" */
  area: string;
  /** Typical roof size for the area, in sq ft */
  sqft: number;
  /** Regional price multiplier (1.0 = GTA average) */
  factor: number;
  /** True when we resolved a real GTA area from the postal code */
  matched: boolean;
}

const REGIONS: Record<string, { area: string; sqft: number; factor: number }> = {
  toronto: { area: "Toronto", sqft: 1700, factor: 1.1 },
  mississauga: { area: "Mississauga", sqft: 2000, factor: 1.06 },
  brampton: { area: "Brampton", sqft: 2100, factor: 1.0 },
  vaughan: { area: "Vaughan", sqft: 2400, factor: 1.08 },
  markham: { area: "Markham", sqft: 2200, factor: 1.05 },
  richmondhill: { area: "Richmond Hill", sqft: 2300, factor: 1.07 },
  oakville: { area: "Oakville", sqft: 2500, factor: 1.12 },
  burlington: { area: "Burlington", sqft: 2300, factor: 1.08 },
  oshawa: { area: "Oshawa", sqft: 1800, factor: 0.95 },
  whitby: { area: "Whitby", sqft: 1900, factor: 0.96 },
  ajax: { area: "Ajax", sqft: 1850, factor: 0.96 },
  pickering: { area: "Pickering", sqft: 1900, factor: 0.98 },
};

const GTA_DEFAULT = { area: "the GTA", sqft: 2000, factor: 1.0 };

/** Ordered FSA → region rules (most specific first). */
const FSA_RULES: [RegExp, keyof typeof REGIONS][] = [
  [/^M/, "toronto"],
  [/^L5/, "mississauga"],
  [/^L4[TVWXYZ]/, "mississauga"],
  [/^L7A/, "brampton"],
  [/^L6[PRSTVWXYZ]/, "brampton"],
  [/^L6A/, "vaughan"],
  [/^L4[HJKL]/, "vaughan"],
  [/^L3[PRST]/, "markham"],
  [/^L6[BCEG]/, "markham"],
  [/^L4[BCES]/, "richmondhill"],
  [/^L6[HJKLM]/, "oakville"],
  [/^L7[LMNPRST]/, "burlington"],
  [/^L1[GHJKL]/, "oshawa"],
  [/^L1[MNPR]/, "whitby"],
  [/^L1[STZ]/, "ajax"],
  [/^L1[VWXY]/, "pickering"],
];

/** Resolve area data from a Canadian postal code (or FSA). Falls back to GTA average. */
export function lookupArea(postalCode?: string): AreaInfo {
  const fsa = (postalCode ?? "").toUpperCase().replace(/\s/g, "").slice(0, 3);
  if (fsa.length === 3) {
    for (const [rule, key] of FSA_RULES) {
      if (rule.test(fsa)) return { ...REGIONS[key], matched: true };
    }
    // Any other GTA "L" postal we don't have a specific region for
    if (/^L/.test(fsa)) return { ...GTA_DEFAULT, matched: true };
  }
  return { ...GTA_DEFAULT, matched: false };
}
