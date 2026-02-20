"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PLAN_INFO, PlanKey } from "@/lib/plans";
import Step1User from "./Step1User";
import Step2Organization from "./Step2Organization";
import Step3Plan from "./Step3Plan";
import { toast } from "sonner";

export interface WizardState {
  user: {
    full_name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  organization: { name: string; slug: string; slugManuallyEdited?: boolean };
  plan: PlanKey;
}

const defaultState: WizardState = {
  user: { full_name: "", email: "", password: "", confirmPassword: "" },
  organization: { name: "", slug: "" },
  plan: "pro",
};

export default function SignupWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [state, setState] = useState<WizardState>(defaultState);
  const [loading, setLoading] = useState(false);

  const nextStep = () =>
    setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  const prevStep = () =>
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500));
      console.log("Payload ready for backend:", state);
      toast.success("Signup completed! Redirect to dashboard...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-5">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Step1User
                state={state}
                setState={setState}
                nextStep={nextStep}
                loading={loading}
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Step2Organization
                state={state}
                setState={setState}
                nextStep={nextStep}
                prevStep={prevStep}
                loading={loading}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              <Step3Plan
                state={state}
                setState={setState}
                prevStep={prevStep}
                handleSubmit={handleSubmit}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
