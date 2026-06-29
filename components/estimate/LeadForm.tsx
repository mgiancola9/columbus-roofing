"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, ArrowRight, Loader2 } from "lucide-react";
import type { LeadData, EstimateData, EstimateResult } from "@/types/estimate";
import { calculateEstimate } from "@/lib/calculateEstimate";
import AddressAutocomplete, { type SelectedAddress } from "./AddressAutocomplete";

interface Props {
  estimateData: EstimateData;
  onSubmit: (lead: LeadData, estimate: EstimateResult) => void;
}

export default function LeadForm({ estimateData, onSubmit }: Props) {
  const [form, setForm] = useState<LeadData>({ name: "", phone: "", email: "", address: "" });
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadData>>({});

  function validate(): boolean {
    const newErrors: Partial<LeadData> = {};
    if (!form.name.trim()) newErrors.name = "Your name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
    if (!form.address?.trim())
      newErrors.address = "Enter your address or postal code so we can price it for your area";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    // Compute the estimate now — the selected address's postal code drives the
    // area-specific roof size + price range.
    const estimate = calculateEstimate(estimateData, postalCode);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: form, estimate, data: estimateData }),
      });
    } catch {
      // fail silently — still reveal the estimate + match screen
    } finally {
      setLoading(false);
      if (estimate) onSubmit(form, estimate);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        Last step — see your estimate.
      </h2>
      <p className="text-brand-text-secondary mb-8">
        Enter your details to reveal your price and get matched with a trusted, licensed
        roofer who works your area.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
          />
          {errors.name && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.name}</p>}
        </div>

        <div>
          <Input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
            type="tel"
            autoComplete="tel"
          />
          {errors.phone && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.phone}</p>}
        </div>

        <div>
          <Input
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            type="email"
            autoComplete="email"
          />
          {errors.email && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.email}</p>}
        </div>

        <div>
          <AddressAutocomplete
            value={form.address ?? ""}
            onChange={(v) => {
              setForm({ ...form, address: v });
              setPostalCode(""); // typing invalidates a prior selection
            }}
            onSelect={(addr: SelectedAddress) => {
              setForm((prev) => ({ ...prev, address: addr.formatted }));
              setPostalCode(addr.postalCode);
            }}
          />
          {errors.address && <p className="mt-1.5 text-red-500 text-xs font-medium">{errors.address}</p>}
        </div>

        <Button
          type="submit"
          size="xl"
          className="w-full font-bold text-base mt-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 w-5 h-5 animate-spin" />
              Getting your estimate...
            </>
          ) : (
            <>
              See My Estimate & Get Matched
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Trust row */}
      <div className="mt-6 pt-5 border-t border-brand-border flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-1.5 text-brand-text-secondary text-xs">
          <Lock className="w-3.5 h-3.5" />
          SSL encrypted
        </div>
        <div className="flex items-center gap-1.5 text-brand-text-secondary text-xs">
          <Shield className="w-3.5 h-3.5" />
          Never sold to third parties
        </div>
        <div className="text-brand-text-secondary text-xs">
          Unsubscribe anytime
        </div>
      </div>
    </motion.div>
  );
}
