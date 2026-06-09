"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

const STEP_LABELS: Record<string, string> = {
  stories: "Home Size",
  roofType: "Roof Style",
  condition: "Condition",
  material: "Material",
  timeline: "Timeline",
  city: "Your City",
  result: "Your Estimate",
  lead: "Get Quotes",
  thankyou: "Done!",
};

const STEP_ORDER = ["stories", "roofType", "condition", "material", "timeline", "city", "result", "lead"];

interface Props {
  currentStep: string;
  onBack?: () => void;
}

export default function ProgressBar({ currentStep, onBack }: Props) {
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const totalSteps = 6; // The 6 question steps
  const questionStep = Math.min(stepIndex + 1, totalSteps);
  const progress = currentStep === "result" || currentStep === "lead" || currentStep === "thankyou"
    ? 100
    : (stepIndex / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-brand-border">
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {stepIndex > 0 && currentStep !== "thankyou" ? (
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
                {currentStep === "result" || currentStep === "lead" || currentStep === "thankyou"
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
