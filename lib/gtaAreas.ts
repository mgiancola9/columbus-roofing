/**
 * GTA area data keyed off the postal-code FSA (first 3 chars).
 * Each region carries a labour multiplier (labour/permits/demand vary by
 * municipality) applied on top of the material's base price-per-square.
 *
 * NOTE: these are area-typical figures, not a quote for the specific property.
 * The matched roofer confirms exact scope + price on-site.
 */

export interface AreaInfo {
  /** Display name, e.g. "Toronto" */
  area: string;
  /** Labour/permit/demand multiplier applied on top of material cost (1.0 = GTA average) */
  factor: number;
  /** True when we resolved a real GTA area from the postal code (also = serviceable) */
  matched: boolean;
}

const REGIONS: Record<string, { area: string; factor: number }> = {
  toronto: { area: "Toronto", factor: 1.1 },
  mississauga: { area: "Mississauga", factor: 1.06 },
  brampton: { area: "Brampton", factor: 1.0 },
  vaughan: { area: "Vaughan", factor: 1.08 },
  markham: { area: "Markham", factor: 1.05 },
  richmondhill: { area: "Richmond Hill", factor: 1.07 },
  oakville: { area: "Oakville", factor: 1.12 },
  burlington: { area: "Burlington", factor: 1.08 },
  oshawa: { area: "Oshawa", factor: 0.95 },
  whitby: { area: "Whitby", factor: 0.96 },
  ajax: { area: "Ajax", factor: 0.96 },
  pickering: { area: "Pickering", factor: 0.98 },
};

const GTA_DEFAULT = { area: "the GTA", factor: 1.0 };

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
      if (rule.test(fsa)) {
        const region = REGIONS[key];
        return { area: region.area, factor: region.factor, matched: true };
      }
    }
    // Any other GTA "L" postal we don't have a specific region for
    if (/^L/.test(fsa)) return { area: GTA_DEFAULT.area, factor: GTA_DEFAULT.factor, matched: true };
  }
  return { area: GTA_DEFAULT.area, factor: GTA_DEFAULT.factor, matched: false };
}

/** A postal code is serviceable when it resolves to a real GTA area. */
export function isServiceable(postalCode: string): boolean {
  return lookupArea(postalCode).matched;
}

/** Canonical Canadian postal code format check, e.g. "M4C 1A1". */
export function isValidPostalCode(postalCode: string): boolean {
  return /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/.test(postalCode.trim());
}

/** Auto-format as the user types: uppercase, single space after the 3rd character. */
export function formatPostalCode(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  if (clean.length <= 3) return clean;
  return `${clean.slice(0, 3)} ${clean.slice(3)}`;
}
