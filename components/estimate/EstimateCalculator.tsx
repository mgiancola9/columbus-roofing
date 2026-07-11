"use client";

import { useState, useCallback } from "react";
import ProgressBar from "./ProgressBar";
import StepWrapper from "./StepWrapper";
import StepPostalCode from "./steps/StepPostalCode";
import StepHouseSize from "./steps/StepHouseSize";
import StepRoofShape from "./steps/StepRoofShape";
import LeadForm from "./LeadForm";
import EstimateResult from "./EstimateResult";
import { calculateEstimate } from "@/lib/calculateEstimate";
import type {
  EstimateData,
  EstimateStep,
  EstimateResult as IEstimateResult,
  HouseProfile,
  SizeRange,
  RoofMaterial,
  RoofShape,
  LeadData,
} from "@/types/estimate";

const STEP_ORDER: EstimateStep[] = ["postal", "houseSize", "roofShape", "lead", "result"];

const INITIAL_DATA: EstimateData = {
  postalCode: "",
  houseProfile: null,
  sizeRange: null,
  material: null,
  roofShape: null,
};

export default function EstimateCalculator() {
  const [currentStep, setCurrentStep] = useState<EstimateStep>("postal");
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

  function handlePostalCodeChange(postalCode: string) {
    setData((prev) => ({ ...prev, postalCode }));
  }

  function handlePostalCodeSubmit(postalCode: string) {
    setData((prev) => ({ ...prev, postalCode }));
    setDirection(1);
    goNext();
  }

  function handleHouseSize(houseProfile: HouseProfile, sizeRange: SizeRange, material: RoofMaterial) {
    setData((prev) => ({ ...prev, houseProfile, sizeRange, material }));
    goNext();
  }

  // Roof shape is the last input needed — compute the estimate now (per the spec,
  // calculation runs after Step 3, but stays hidden until the lead form is submitted).
  function handleRoofShape(roofShape: RoofShape) {
    const nextData = { ...data, roofShape };
    setData(nextData);
    setResult(calculateEstimate(nextData));
    setTimeout(goNext, 180);
  }

  function handleLeadSubmit(_lead: LeadData) {
    setDirection(1);
    setCurrentStep("result");
  }

  function renderStep() {
    switch (currentStep) {
      case "postal":
        return (
          <StepPostalCode
            value={data.postalCode}
            onChange={handlePostalCodeChange}
            onSubmit={handlePostalCodeSubmit}
          />
        );
      case "houseSize":
        return (
          <StepHouseSize
            profile={data.houseProfile}
            sizeRange={data.sizeRange}
            material={data.material}
            onComplete={handleHouseSize}
          />
        );
      case "roofShape":
        return (
          <StepRoofShape
            value={data.roofShape}
            onChange={handleRoofShape}
          />
        );
      case "lead":
        return result ? (
          <LeadForm estimateData={data} estimate={result} onSubmit={handleLeadSubmit} />
        ) : null;
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
