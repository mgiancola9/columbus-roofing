# Build Prompt — Estimate Confirmation Page Copy Fix (GTA Roofing Estimates Calculator)

## Context

The post-submit "Your Estimate" confirmation screen currently implies that a licensed roofer will personally reach out to the homeowner. In reality, our team (GTA Roofing Estimates) calls first to confirm details and get the homeowner booked with one of our vetted contractors — the roofer only enters the picture once the appointment is scheduled. The current copy overpromises and creates a trust gap the moment the homeowner realizes it's not a roofer calling.

**Scope: copy only.** No changes to layout, the price calculation logic, the design system, or the visual structure of the page — this is a find-and-replace of specific text strings.

---

## Changes Required

### 1. Headline

- **Find:** `You're matched — here's your estimate.`
- **Replace with:** `Here's your estimate.`
- **Why:** No one has been matched to a specific contractor yet at this point in the flow — that happens after our team qualifies and books the lead. Don't claim it early.

### 2. Subheading

- **Find:** `We're connecting you with a trusted, licensed roofer in your area.`
- **Replace with:** `A GTA Roofing Estimates specialist will call you next to get you booked.`
- **Why:** Sets the accurate expectation that a person from our team calls first, not a roofer directly.

### 3. Disclaimer box (below the price range)

- **Find:** `This is a preliminary range based on market averages for your area. Your matched roofer will confirm a firm quote after a quick on-site look.`
- **Replace with:** `This is a preliminary range based on market averages for your area. A local roofer will confirm a firm quote once you're booked.`
- **Why:** Removes "matched roofer" (premature) and "on-site look" ambiguity — makes clear the firm quote comes after booking, not before.

### 4. Info card 1 — title

- **Find:** `Expect a call — fast`
- **Replace with:** `Expect a call from our team`
- **Why:** Names who's actually calling.

### 5. Info card 1 — body

- **Find:** `A trusted local roofer will reach out shortly to schedule a free on-site assessment.`
- **Replace with:** `We'll call shortly to confirm the details and get you booked with a vetted local roofer.`
- **Why:** Corrects the actor (our team, not the roofer) while keeping the reassurance that a vetted roofer is still the end result.

### 6. Info card 2 — title

- **Find:** `Free, no-pressure inspection`
- **Keep as-is.**

### 7. Info card 2 — body

- **Find:** `They'll confirm the details in person and give you a firm quote — zero obligation.`
- **Replace with:** `Once you're booked, your roofer confirms everything in person and gives you a firm quote — zero obligation.`
- **Why:** Clarifies "they" refers to the roofer at the booked appointment, not an earlier undefined step.

---

## Timing Language — Decide Before Shipping

"Expect a call from our team" and "will call shortly" imply fast turnaround. Confirm this matches actual outreach speed before deploying:

- If outreach is genuinely same-day → copy is accurate as written, no change needed.
- If outreach can take a day or two depending on queue volume → soften to something like `We'll call within 1 business day to confirm the details and get you booked.` Do not ship "shortly" if it isn't consistently true — this is the exact class of mismatch this fix is meant to eliminate.

---

## Out of Scope (do not touch)

- Price range calculation and display (`$10,100–$13,400`, squares, GTA label)
- CASL consent copy on the contact step (Step 4) — separate compliance review required for any changes there
- Visual design (colors, spacing, icons, layout)
