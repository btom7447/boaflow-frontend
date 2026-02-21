"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { WizardState } from "./SignupWizard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { authApi } from "@/lib/api";

interface Props {
  state: WizardState;
  setState: Dispatch<SetStateAction<WizardState>>;
  nextStep: () => void;
  prevStep: () => void;
  loading: boolean;
}

type SlugStatus = "idle" | "checking" | "available" | "taken";

export default function Step2Organization({
  state,
  setState,
  prevStep,
  nextStep,
  loading,
}: Props) {
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");

  // Auto-generate slug if name changes and slug not manually edited
  useEffect(() => {
    if (state.organization.name && !state.organization.slugManuallyEdited) {
      const slug = state.organization.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "");
      setState((prev) => ({
        ...prev,
        organization: { ...prev.organization, slug },
      }));
    }
  }, [state.organization.name, state.organization.slugManuallyEdited]);

  // ─── Debounced Slug Check ─────────────────────────────
  useEffect(() => {
    const slug = state.organization.slug;

    if (!slug || slug.length < 3) {
      setSlugStatus("idle");
      return;
    }

    setSlugStatus("checking");

    const timeout = setTimeout(async () => {
      try {
        const res = await authApi.checkSlug(slug);
        setSlugStatus(res.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [state.organization.slug]);

  const isNextDisabled =
    loading || !state.organization.slug || slugStatus !== "available";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!isNextDisabled) nextStep();
      }}
    >
      <h2 className="text-xl font-semibold mb-4 text-white">
        Step 2: Organization Details
      </h2>

      <Input
        placeholder="Organization Name"
        value={state.organization.name}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            organization: {
              ...prev.organization,
              name: e.target.value,
              slugManuallyEdited: prev.organization.slugManuallyEdited,
            },
          }))
        }
        className="mb-3"
      />

      <Input
        placeholder="Organization Slug"
        value={state.organization.slug}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            organization: {
              ...prev.organization,
              slug: e.target.value.toLowerCase(),
              slugManuallyEdited: true,
            },
          }))
        }
        className="mb-1"
      />

      {/* Slug Feedback */}
      <div className="text-xs mb-3 h-5 flex items-center gap-1">
        {slugStatus === "checking" && (
          <>
            <svg
              className="animate-spin h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-gray-400">Checking availability</span>
          </>
        )}
        {slugStatus === "available" && (
          <span className="text-green-500">Slug is available</span>
        )}
        {slugStatus === "taken" && (
          <span className="text-red-500">Slug already taken</span>
        )}
      </div>

      <p className="text-xs text-gray-400 mb-3">
        This will be your organization URL and can only be set once.
      </p>

      <div className="flex justify-between mt-4">
        <Button variant="secondary" onClick={prevStep}>
          <ChevronLeft size={13} /> Back
        </Button>

        <Button type="submit" disabled={isNextDisabled}>
          Next
          <ChevronRight size={13} />
        </Button>
      </div>
    </form>
  );
}
