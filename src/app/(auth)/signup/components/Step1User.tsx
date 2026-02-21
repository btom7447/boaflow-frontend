"use client";

import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ChevronRight, Eye, EyeClosed } from "lucide-react";
import { WizardState } from "./SignupWizard";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  state: WizardState;
  setState: Dispatch<SetStateAction<WizardState>>;
  nextStep: () => void;
  loading: boolean;
}

export default function Step1User({
  state,
  setState,
  nextStep,
  loading,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    number: false,
    special: false,
    match: false,
  });

  useEffect(() => {
    const length = state.user.password.length >= 8;
    const number = /\d/.test(state.user.password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(state.user.password);

    const match = showPassword
      ? state.user.password.length > 0
      : state.user.password === state.user.confirmPassword &&
        state.user.password.length > 0;

    setPasswordValid({ length, number, special, match });
  }, [state.user.password, state.user.confirmPassword, showPassword]);

  const canProceed = Object.values(passwordValid).every(Boolean);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canProceed && !loading) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4 text-white">
        Step 1: Create Admin User
      </h2>

      <Input
        placeholder="Full Name"
        value={state.user.full_name}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            user: { ...prev.user, full_name: e.target.value },
          }))
        }
        className="mb-3"
      />

      <Input
        placeholder="Email"
        type="email"
        value={state.user.email}
        onChange={(e) =>
          setState((prev) => ({
            ...prev,
            user: { ...prev.user, email: e.target.value },
          }))
        }
        className="mb-3"
      />

      <div className="relative mb-3">
        <Input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={state.user.password}
          onChange={(e) =>
            setState((prev) => ({
              ...prev,
              user: { ...prev.user, password: e.target.value },
            }))
          }
        />

        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          className="absolute right-3 bottom-2 text-gray-500 hover:text-gray-300"
        >
          {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* Smooth confirm password hide */}
      <AnimatePresence>
        {!showPassword && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-3"
          >
            <Input
              placeholder="Confirm Password"
              type="password"
              value={state.user.confirmPassword}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  user: {
                    ...prev.user,
                    confirmPassword: e.target.value,
                  },
                }))
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="text-xs text-gray-400 mb-4 space-y-1">
        <li className={passwordValid.length ? "text-green-400" : ""}>
          • At least 8 characters
        </li>
        <li className={passwordValid.number ? "text-green-400" : ""}>
          • Includes a number
        </li>
        <li className={passwordValid.special ? "text-green-400" : ""}>
          • Includes a special character
        </li>
        <li className={passwordValid.match ? "text-green-400" : ""}>
          • Passwords match
        </li>
      </ul>

      <div className="flex justify-end">
        <Button type="submit" disabled={!canProceed || loading}>
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </form>
  );
}
