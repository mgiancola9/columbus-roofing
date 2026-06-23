"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { EstimateResult as IEstimateResult, EstimateData } from "@/types/estimate";
import { CheckCircle2, ArrowRight, Clock, Info } from "lucide-react";

interface Props {
  result: IEstimateResult;
  data: EstimateData;
  onGetQuotes: () => void;
}

const CITY_LABELS: Record<string, string> = {
  asap: "ASAP",
  "1-3months": "1–3 months",
  "3-6months": "3–6 months",
  exploring: "Just exploring",
};

export default function EstimateResult({ result, data, onGetQuotes }: Props) {
  const midpoint = Math.round((result.low + result.high) / 2 / 100) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {/* Estimate card */}
      <div className="rounded-3xl border-2 border-brand-primary/20 bg-gradient-to-b from-brand-primary/5 to-white overflow-hidden mb-6">
        {/* Header */}
        <div className="bg-brand-primary px-8 py-6 text-center">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">
            Your Instant Estimate
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
              Typical range · {result.materialLabel} · {data.city}
            </p>
          </motion.div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <div className="flex items-center gap-2 text-brand-text-secondary text-sm mb-5">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{result.timeframe}</span>
          </div>

          <h3 className="text-sm font-bold text-brand-text uppercase tracking-wider mb-4">
            What&apos;s Included
          </h3>
          <ul className="space-y-2.5 mb-6">
            {result.includesItems.map((item) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 text-brand-text text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-success flex-shrink-0" />
                {item}
              </motion.li>
            ))}
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-xs leading-relaxed">
              This is a <strong>preliminary estimate</strong> based on GTA market averages. Your
              actual quote may vary based on roof access, deck condition, and current material
              costs. Get matched with a trusted local roofer to lock in your real price.
            </p>
          </div>
        </div>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          data.stories && `${data.stories} storey`,
          data.roofType,
          data.condition && `${data.condition} condition`,
          data.material,
          data.timeline && CITY_LABELS[data.timeline],
        ]
          .filter(Boolean)
          .map((chip) => (
            <span
              key={chip}
              className="bg-brand-bg border border-brand-border text-brand-text-secondary text-xs font-medium px-3 py-1.5 rounded-full capitalize"
            >
              {chip}
            </span>
          ))}
      </div>

      {/* CTA */}
      <div className="space-y-3">
        <Button
          size="xl"
          className="w-full group font-bold text-base"
          onClick={onGetQuotes}
        >
          Get Matched With a Local Roofer
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-center text-xs text-brand-text-secondary">
          Free · No obligation · Trusted local roofers only
        </p>
      </div>
    </motion.div>
  );
}
