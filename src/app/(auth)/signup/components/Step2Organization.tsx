"use client";

import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { WizardState } from "./SignupWizard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  state: WizardState;
  setState: Dispatch<SetStateAction<WizardState>>;
  nextStep: () => void;
  prevStep: () => void;
  loading: boolean;
}

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

export default function Step2Organization({
  state,
  setState,
  prevStep,
  nextStep,
  loading,
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-white">
        Step 2: Organization Details
      </h2>

      <Input
        placeholder="Organization Name"
        value={state.organization.name}
        onChange={(e) =>
          setState((prev: WizardState) => ({
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
          setState((prev: WizardState) => ({
            ...prev,
            organization: {
              ...prev.organization,
              slug: e.target.value,
              slugManuallyEdited: true,
            },
          }))
        }
        className="mb-1"
      />
      <p className="text-xs text-gray-400 mb-3">
        This will be your organization URL and can only be set once.
      </p>

      <div className="flex justify-between mt-4">
        <Button variant="secondary" onClick={prevStep}>
          <ChevronLeft size={13} />
          Back
        </Button>
        <Button onClick={nextStep} disabled={loading}>
          Next
          <ChevronRight size={13} />
        </Button>
      </div>
    </>
  );
}
