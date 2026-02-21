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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!loading) handleSubmit();
      }}
    >
      <h2 className="text-xl font-semibold mb-4 text-white">
        Step 3: Select Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-3 mb-6">
        {Object.entries(PLAN_INFO).map(([key, info]) => (
          <div
            key={key}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              state.plan === key
                ? "border-green-500 bg-green-900/20"
                : `${info.bg} ${info.color}`
            }`}
            onClick={() =>
              setState((prev: WizardState) => ({
                ...prev,
                plan: key as keyof typeof PLAN_INFO,
              }))
            }
          >
            <h3 className="text-md font-semibold">{info.name}</h3>
            <p className="text-2xl text-gray-400">
              {info.price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">
              {info.limit
                ? `${info.limit.toLocaleString()} searches/month`
                : "unlimited"}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="secondary" onClick={prevStep}>
          <ChevronLeft size={13} /> Back
        </Button>

        <Button type="submit" loading={loading}>
          Create Organization
        </Button>
      </div>
    </form>
  );
}
