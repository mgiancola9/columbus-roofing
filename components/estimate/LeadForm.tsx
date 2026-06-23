"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, ArrowRight, Loader2 } from "lucide-react";
import type { LeadData, EstimateData } from "@/types/estimate";
import type { EstimateResult } from "@/types/estimate";
import { formatCurrency } from "@/lib/utils";

interface Props {
  estimateResult: EstimateResult;
  estimateData: EstimateData;
  onSubmit: (lead: LeadData) => void;
}

export default function LeadForm({ estimateResult, estimateData, onSubmit }: Props) {
  const [form, setForm] = useState<LeadData>({ name: "", phone: "", email: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadData>>({});

  function validate(): boolean {
    const newErrors: Partial<LeadData> = {};
    if (!form.name.trim()) newErrors.name = "Your name is required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10)
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email address";
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
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead: form, estimate: estimateResult, data: estimateData }),
      });
    } catch {
      // fail silently — still advance to thank you
    } finally {
      setLoading(false);
      onSubmit(form);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Estimate recap */}
      <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-2xl px-6 py-4 mb-8">
        <p className="text-brand-text-secondary text-xs font-semibold uppercase tracking-wide mb-1">
          Your Estimate
        </p>
        <p className="text-2xl font-black text-brand-primary">
          {formatCurrency(estimateResult.low)} – {formatCurrency(estimateResult.high)}
        </p>
        <p className="text-brand-text-secondary text-sm mt-0.5">
          {estimateResult.materialLabel} · {estimateData.city}
        </p>
      </div>

      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        Get matched with a local roofer.
      </h2>
      <p className="text-brand-text-secondary mb-8">
        Enter your details and a trusted, licensed roofer who works your area will reach out — fast.
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
          <Input
            placeholder="Home address (optional)"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            autoComplete="street-address"
          />
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
              Sending...
            </>
          ) : (
            <>
              Connect Me With Contractors
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
