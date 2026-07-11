"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const STEP_LABELS: Record<string, string> = {
  postal: "Postal Code",
  houseSize: "Home Size",
  roofShape: "Roof Shape",
  lead: "Your Details",
  result: "Your Estimate",
};

const STEP_ORDER = ["postal", "houseSize", "roofShape", "lead"];

interface Props {
  currentStep: string;
  onBack?: () => void;
}

export default function ProgressBar({ currentStep, onBack }: Props) {
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const totalSteps = 4; // The 4-step flow (postal, house size, roof shape, contact)
  const questionStep = Math.min(stepIndex + 1, totalSteps);
  const isFinal = currentStep === "result";
  const isLead = currentStep === "lead";
  const progress = isFinal ? 100 : isLead ? 88 : (stepIndex / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {stepIndex > 0 && !isFinal ? (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onBack}
                className="w-8 h-8 rounded-full hover:bg-brand-bg transition-colors flex items-center justify-center text-brand-text-secondary hover:text-brand-text"
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.button>
            ) : (
              <div className="w-8 h-8" />
            )}
            <div>
              <span className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wide">
                {isFinal || isLead
                  ? STEP_LABELS[currentStep]
                  : `Step ${questionStep} of ${totalSteps}`}
              </span>
              <div className="text-sm font-semibold text-brand-text leading-tight">
                {STEP_LABELS[currentStep] ?? ""}
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="w-8 h-8 rounded-full hover:bg-brand-bg transition-colors flex items-center justify-center text-brand-text-secondary hover:text-brand-text"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        <Progress value={progress} className="h-1" />
      </div>
    </div>
  );
}
