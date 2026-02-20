"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PlanKey } from "@/lib/plans";
import Step1User from "./components/Step1User";
import Step2Organization from "./components/Step2Organization";
import Step3Plan from "./components/Step3Plan";

export interface WizardState {
  user: {
    full_name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  organization: {
    name: string;
    slug: string;
    slugManuallyEdited?: boolean;
  };
  plan: PlanKey;
}

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState<WizardState>({
    user: {
      full_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    organization: {
      name: "",
      slug: "",
    },
    plan: "pro",
  });

  // Auto-generate slug (only if user hasn’t manually edited)
  useEffect(() => {
    if (state.organization.name && !state.organization.slugManuallyEdited) {
      setState((prev) => ({
        ...prev,
        organization: {
          ...prev.organization,
          slug: generateSlug(prev.organization.name),
        },
      }));
    }
  }, [state.organization.name]);

  const nextStep = () =>
    setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));

  const prevStep = () =>
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 1500)); // simulate API
      console.log("Signup payload:", state);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-5 relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl relative">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <Image src="/favicon.png" alt="Boaflow Logo" width={90} height={90} />
          <span className="text-4xl font-semibold text-white tracking-tight">
            Boaflow
          </span>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-white">Sign up</h1>
            <p className="text-sm text-gray-500 mt-1">
              Create your admin account and organization
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
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
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
              >
                <Step2Organization
                  state={state}
                  setState={setState}
                  prevStep={prevStep}
                  nextStep={nextStep}
                  loading={loading}
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35 }}
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

        {/* Login Link */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Sign in
          </a>
        </p>

        <p className="text-center text-xs text-gray-600 mt-6">
          Boaflow Lead Discovery Platform
        </p>
      </div>
    </div>
  );
}
