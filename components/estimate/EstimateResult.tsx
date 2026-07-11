"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { EstimateResult as IEstimateResult } from "@/types/estimate";
import { CheckCircle2, Phone, Calendar, Info } from "lucide-react";

interface Props {
  result: IEstimateResult;
}

const nextSteps = [
  {
    icon: Phone,
    title: "Expect a call from our team",
    desc: "We'll call shortly to confirm the details and get you booked with a vetted local roofer.",
  },
  {
    icon: Calendar,
    title: "Free, no-pressure inspection",
    desc: "Once you're booked, your roofer confirms everything in person and gives you a firm quote — zero obligation.",
  },
];

export default function EstimateResult({ result }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Matched confirmation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 20, delay: 0.1 }}
        className="w-16 h-16 rounded-full bg-brand-success/10 flex items-center justify-center mx-auto mb-5"
      >
        <CheckCircle2 className="w-8 h-8 text-brand-success" />
      </motion.div>

      <h2 className="text-3xl md:text-4xl font-black text-brand-text tracking-tight mb-2 text-center">
        Here&apos;s your estimate.
      </h2>
      <p className="text-brand-text-secondary mb-8 text-center">
        A GTA Roofing Estimates specialist will call you next to get you booked.
      </p>

      {/* Estimate card */}
      <div className="rounded-3xl border-2 border-brand-primary/20 bg-gradient-to-b from-brand-primary/5 to-white overflow-hidden mb-6">
        <div className="bg-brand-primary px-8 py-7 text-center">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">
            Your Estimated Range
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-5xl md:text-6xl font-black text-white tracking-tight">
              {formatCurrency(result.low)}
              <span className="text-2xl text-blue-200 font-medium mx-3">–</span>
              {formatCurrency(result.high)}
            </div>
            <p className="text-blue-200 text-sm mt-2 font-medium">
              ~{result.roofSquares.toLocaleString()} squares · {result.areaLabel}
            </p>
          </motion.div>
        </div>

        <div className="px-8 py-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-xs leading-relaxed">
              This is a <strong>preliminary range</strong> based on market averages for your
              area. A local roofer will confirm a firm quote once you&apos;re booked.
            </p>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="text-left space-y-4 mb-10">
        {nextSteps.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.1 }}
            className="flex items-start gap-4 bg-brand-card rounded-xl p-5 border border-brand-border"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <div className="font-bold text-brand-text text-sm mb-0.5">{title}</div>
              <div className="text-brand-text-secondary text-sm leading-relaxed">{desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </motion.div>
  );
}
