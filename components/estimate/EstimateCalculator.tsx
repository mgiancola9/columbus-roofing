"use client";

import { useState, useCallback } from "react";
import ProgressBar from "./ProgressBar";
import StepWrapper from "./StepWrapper";
import StepStories from "./steps/StepStories";
import StepRoofType from "./steps/StepRoofType";
import StepMaterial from "./steps/StepMaterial";
import LeadForm from "./LeadForm";
import EstimateResult from "./EstimateResult";
import type {
  EstimateData,
  EstimateStep,
  EstimateResult as IEstimateResult,
  Stories,
  RoofType,
  RoofMaterial,
  LeadData,
} from "@/types/estimate";

const STEP_ORDER: EstimateStep[] = ["stories", "roofType", "material", "lead", "result"];

const INITIAL_DATA: EstimateData = {
  stories: null,
  roofType: null,
  material: null,
};

export default function EstimateCalculator() {
  const [currentStep, setCurrentStep] = useState<EstimateStep>("stories");
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<EstimateData>(INITIAL_DATA);
  const [result, setResult] = useState<IEstimateResult | null>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentStep((s) => {
      const idx = STEP_ORDER.indexOf(s);
      return idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : s;
    });
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((s) => {
      const idx = STEP_ORDER.indexOf(s);
      return idx > 0 ? STEP_ORDER[idx - 1] : s;
    });
  }, []);

  function selectAndAdvance<K extends keyof EstimateData>(key: K, value: EstimateData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
    setTimeout(goNext, 180);
  }

  // Lead submitted: the area-driven estimate was computed in LeadForm (it has the
  // address) and handed back. Store it and reveal the combined estimate + match screen.
  function handleLeadSubmit(_lead: LeadData, estimate: IEstimateResult) {
    setResult(estimate);
    setDirection(1);
    setCurrentStep("result");
  }

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
      case "material":
        return (
          <StepMaterial
            value={data.material}
            onChange={(v: RoofMaterial) => selectAndAdvance("material", v)}
          />
        );
      case "lead":
        return <LeadForm estimateData={data} onSubmit={handleLeadSubmit} />;
      case "result":
        return result ? <EstimateResult result={result} /> : null;
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
