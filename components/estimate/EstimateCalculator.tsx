"use client";

import { useState, useCallback } from "react";
import ProgressBar from "./ProgressBar";
import StepWrapper from "./StepWrapper";
import StepStories from "./steps/StepStories";
import StepRoofType from "./steps/StepRoofType";
import StepCondition from "./steps/StepCondition";
import StepMaterial from "./steps/StepMaterial";
import StepTimeline from "./steps/StepTimeline";
import StepLocation from "./steps/StepLocation";
import EstimateResult from "./EstimateResult";
import LeadForm from "./LeadForm";
import ThankYou from "./ThankYou";
import { calculateEstimate } from "@/lib/calculateEstimate";
import type {
  EstimateData,
  EstimateStep,
  Stories,
  RoofType,
  RoofCondition,
  RoofMaterial,
  Timeline,
  GTACity,
  LeadData,
} from "@/types/estimate";

const STEP_ORDER: EstimateStep[] = [
  "stories",
  "roofType",
  "condition",
  "material",
  "timeline",
  "city",
  "result",
  "lead",
  "thankyou",
];

const INITIAL_DATA: EstimateData = {
  stories: null,
  roofType: null,
  condition: null,
  material: null,
  timeline: null,
  city: null,
};

export default function EstimateCalculator() {
  const [currentStep, setCurrentStep] = useState<EstimateStep>("stories");
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<EstimateData>(INITIAL_DATA);

  const goNext = useCallback(() => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx < STEP_ORDER.length - 1) {
      setDirection(1);
      setCurrentStep(STEP_ORDER[idx + 1]);
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx > 0) {
      setDirection(-1);
      setCurrentStep(STEP_ORDER[idx - 1]);
    }
  }, [currentStep]);

  function selectAndAdvance<K extends keyof EstimateData>(key: K, value: EstimateData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setTimeout(goNext, 180);
  }

  const result = calculateEstimate(data);

  function renderStep() {
    switch (currentStep) {
      case "stories":
        return (
          <StepStories
            value={data.stories}
            onChange={(v: Stories) => selectAndAdvance("stories", v)}
          />
        );
      case "roofType":
        return (
          <StepRoofType
            value={data.roofType}
            onChange={(v: RoofType) => selectAndAdvance("roofType", v)}
          />
        );
      case "condition":
        return (
          <StepCondition
            value={data.condition}
            onChange={(v: RoofCondition) => selectAndAdvance("condition", v)}
          />
        );
      case "material":
        return (
          <StepMaterial
            value={data.material}
            onChange={(v: RoofMaterial) => selectAndAdvance("material", v)}
          />
        );
      case "timeline":
        return (
          <StepTimeline
            value={data.timeline}
            onChange={(v: Timeline) => selectAndAdvance("timeline", v)}
          />
        );
      case "city":
        return (
          <StepLocation
            value={data.city}
            onChange={(v: GTACity) => selectAndAdvance("city", v)}
          />
        );
      case "result":
        return result ? (
          <EstimateResult
            result={result}
            data={data}
            onGetQuotes={goNext}
          />
        ) : null;
      case "lead":
        return result ? (
          <LeadForm
            estimateResult={result}
            estimateData={data}
            onSubmit={(_lead: LeadData) => goNext()}
          />
        ) : null;
      case "thankyou":
        return <ThankYou />;
      default:
        return null;
    }
  }

  return (
    <>
      <ProgressBar currentStep={currentStep} onBack={goBack} />
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <div className="flex-1 flex items-start justify-center pt-28 pb-16 px-6">
          <div className="w-full max-w-2xl">
            <StepWrapper stepKey={currentStep} direction={direction}>
              {renderStep()}
            </StepWrapper>
          </div>
        </div>
      </div>
    </>
  );
}
