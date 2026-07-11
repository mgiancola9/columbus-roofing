"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { formatPostalCode, isValidPostalCode, isServiceable } from "@/lib/gtaAreas";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
}

export default function StepPostalCode({ value, onChange, onSubmit }: Props) {
  const [error, setError] = useState("");
  const [declined, setDeclined] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPostalCode(value)) {
      setError("Enter a valid postal code, e.g. M4C 1A1");
      return;
    }
    setError("");
    if (!isServiceable(value)) {
      setDeclined(true);
      return;
    }
    onSubmit(value);
  }

  async function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(waitlistEmail.trim())) return;
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waitlist: true, email: waitlistEmail, postalCode: value }),
      });
    } catch {
      // fail silently — still confirm to the user
    } finally {
      setLoading(false);
      setWaitlistSubmitted(true);
    }
  }

  if (declined) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
          We&apos;re not in your area yet.
        </h2>
        <p className="text-brand-text-secondary mb-8">
          We currently only serve the Greater Toronto Area. Leave your email and we&apos;ll let
          you know as soon as we expand to your area.
        </p>

        {waitlistSubmitted ? (
          <div className="rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-6 text-center">
            <p className="font-bold text-brand-text mb-1">You&apos;re on the list!</p>
            <p className="text-brand-text-secondary text-sm">
              We&apos;ll email you the moment we&apos;re in your area.
            </p>
          </div>
        ) : (
          <form onSubmit={handleWaitlistSubmit} className="space-y-4">
            <Input
              placeholder="Email address"
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              autoComplete="email"
            />
            <Button type="submit" size="xl" className="w-full font-bold text-base" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Notify Me"}
            </Button>
          </form>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2">
        What&apos;s your postal code?
      </h2>
      <p className="text-brand-text-secondary mb-8">
        So we can show accurate pricing for your area.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary pointer-events-none" />
          <Input
            placeholder="M4C 1A1"
            value={value}
            onChange={(e) => onChange(formatPostalCode(e.target.value))}
            className="pl-9 uppercase"
            autoComplete="postal-code"
            maxLength={7}
          />
        </div>
        {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

        <Button type="submit" size="xl" className="w-full group font-bold text-base">
          Continue
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    </motion.div>
  );
}
