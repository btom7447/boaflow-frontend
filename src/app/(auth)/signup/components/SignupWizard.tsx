"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PLAN_INFO, PlanKey } from "@/lib/plans";
import Step1User from "./Step1User";
import Step2Organization from "./Step2Organization";
import Step3Plan from "./Step3Plan";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authStorage } from "@/lib/auth";
import { organizationApi } from "@/lib/api";

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

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Build payload
      const payload = {
        user: {
          full_name: state.user.full_name,
          email: state.user.email,
          password: state.user.password,
        },
        organization: {
          name: state.organization.name,
          slug: state.organization.slug,
        },
        plan: state.plan,
      };

      // Step 1: Signup
      const signupResponse = await authApi.signup(payload as any);

      // Step 2: Store token immediately
      authStorage.setToken(signupResponse.access_token);

      // Step 3: Hydrate store early (without organization yet)
      const { setAuth } = useAuthStore.getState();
      const user = {
        id: signupResponse.id,
        email: payload.user.email,
        full_name: signupResponse.full_name,
        role: signupResponse.role,
        avatar: signupResponse.avatar ?? null,
        organization_id: signupResponse.organization_id,
      };
      setAuth(user, signupResponse.access_token, null);

      // Step 4: Fetch organization safely
      let organization = null;
      try {
        organization = await organizationApi.getOrganization();
      } catch (err: any) {
        if (err.response?.status === 401) {
          // Retry once after short delay (backend may not have fully created org yet)
          await new Promise((r) => setTimeout(r, 150));
          try {
            organization = await organizationApi.getOrganization();
          } catch {
            console.warn("Org fetch still failed after retry");
          }
        } else {
          console.warn("Org fetch failed:", err);
        }
      }

      // Step 5: Update store with organization if fetched
      if (organization) {
        setAuth(user, signupResponse.access_token, organization);
      }

      toast.success("Signup successful! Redirecting to dashboard.");

      // Step 6: Redirect to dashboard
      router.push("/");
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-5">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6">
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
