# Build Prompt — Add Roofing Material Selection to Step 2 (GTA Roofing Estimates Calculator)

## Context

Step 2 of the lead flow (house size) has excess unused vertical space — a leftover from compressing the original "stories" field into the home-type tap earlier in this build. Rather than just padding the layout, add a roofing material selection section below the existing house-size chips, filling the space with a question that actually improves the estimate.

**This is not the same question we deliberately excluded earlier.** "Current roofing material" (what's on the roof now) was correctly left out — it only affects tear-off/disposal cost, which the contractor discovers on-site anyway. This is "desired material for the new roof" — a forward-looking choice the homeowner is actually making, and it is the single largest lever on price in the entire calculator (2–3x swing between tiers, versus 5–25% for roof shape).

**Scope:** Add one new section to the existing Step 2 screen. Do not add a new step — the 4-step structure stays intact. Do not touch Step 1, Step 3, or Step 4.

---

## UI Placement & Style

- Position: directly below the house-size chip row, within Step 2, same screen, no additional scrolling required
- Visual style: reuse the same tappable card pattern established for the Step 3 roof-shape selector — consistent card sizing, spacing, and selected-state styling
- Label: *"What material are you thinking for your new roof?"*
- Helper text: *"This helps us give you a more accurate range — you can always change your mind later."*

---

## Material Options

| Card label | Sublabel (optional) | Internal price-per-square range (CAD) |
|---|---|---|
| Asphalt shingles | "Most popular in the GTA" | $550–$800 |
| Premium shingles | "Thicker, longer warranty, more style options" | $800–$1,200 |
| Metal roofing | "Steel or standing seam — built to last" | $1,200–$2,000 |
| Flat / membrane | "Best for low-slope roofs and additions" | $700–$1,500 |
| Not sure yet | — | Defaults to Asphalt shingles range |

Pricing is sourced from 2026 GTA/Ontario contractor pricing guides (installed cost, full tear-off, single layer, standard flashing included) and should be treated as a starting baseline — revisit once you have real close data from your own contractors or the Columbus operation's material cost history.

---

## Calculation Logic — Update Required

**Current formula:**
```
estimated_range = squares × city_price_per_square_range
```

**New formula:**
```
estimated_range = squares × material_price_per_square_range × city_labor_multiplier
```

- `material_price_per_square_range` comes from the new Step 2 selection (table above)
- `city_labor_multiplier` is the existing FSA-based adjustment — keep this table as-is, it now applies on top of material cost rather than being the sole price driver
- Store both the material selection and its dollar range on the lead record — this is valuable qualifying data for contractors, not just a pricing input

---

## Known Edge Case — Flag, Don't Block

Step 2 (material) happens before Step 3 (roof shape). A homeowner could select "Flat / membrane" in Step 2, then select "Steep & Complex" in Step 3 — a physically inconsistent combination, since flat membrane systems aren't used on steep pitched roofs.

Do not hard-block this combination; it adds friction for an edge case that's rare in practice (most GTA homes are one or the other, homeowners generally know which they have) and the on-site visit corrects it regardless. The "Best for low-slope roofs and additions" sublabel on the Flat/membrane card is enough of a soft signal. If mismatched selections turn out to be common in your lead data, revisit with a simple validation nudge rather than a hard block.

---

## Out of Scope (do not touch)

- Step 1 (postal code), Step 3 (roof shape/steepness), Step 4 (contact info)
- The existing city labour multiplier table
- Design system, layout structure outside of Step 2, calculation display format on the results page
