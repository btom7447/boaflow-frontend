"use client";

import { Dispatch, SetStateAction } from "react";
import { WizardState } from "./SignupWizard";
import { PLAN_INFO } from "@/lib/plans";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

interface Props {
  state: WizardState;
  setState: Dispatch<SetStateAction<WizardState>>;
  prevStep: () => void;
  handleSubmit: () => void;
  loading: boolean;
}

export default function Step3Plan({
  state,
  setState,
  prevStep,
  handleSubmit,
  loading,
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-white">
        Step 3: Select Plan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(PLAN_INFO).map(([key, info]) => (
          <div
            key={key}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${state.plan === key ? "border-green-500 bg-green-900/20" : `${info.bg} ${info.color}`}`}
            onClick={() =>
              setState((prev: WizardState) => ({ ...prev, plan: key as any }))
            }
          >
            <h3 className="text-lg font-semibold">{info.name}</h3>
            <p className="text-gray-400">{info.price}</p>
            <p className="text-gray-500">
              {info.limit ? `${info.limit} searches/month` : "Custom"}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="secondary" onClick={prevStep}>
          <ChevronLeft size={13} /> Back
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          Create Organization
        </Button>
      </div>
    </>
  );
}
