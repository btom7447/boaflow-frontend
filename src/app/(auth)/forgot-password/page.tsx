"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, CheckCircle, ChevronLeft } from "lucide-react";
import Image from "next/image";

type State = "idle" | "loading" | "sent";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    await new Promise((r) => setTimeout(r, 900));
    setState("sent");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-xl relative">
        {/* Logo */}
        <div className="flex items-center justify-center gap-0 mb-2">
          <div className="">
            <Image
              src={"/favicon.png"}
              alt="Boaflow Logo"
              width={100}
              height={100}
              objectFit="cover"
            />
          </div>
          <span className="text-4xl font-semibold text-white tracking-tight">
            Boaflow
          </span>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {state === "sent" ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-600/15 flex items-center justify-center">
                  <CheckCircle size={24} className="text-blue-400" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">
                Check your email
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                If <span className="text-gray-300">{email}</span> has an
                account, a password reset link is on its way.
              </p>
              <Link
                href="/login"
                className="text-sm text-blue-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <ChevronLeft size={14} />
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors mb-5"
                >
                  <ChevronLeft size={13} />
                  Back to sign in
                </Link>
                <h1 className="text-lg font-semibold text-white">
                  Reset password
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your email and we'll send a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={state === "loading"}
                  className="w-full"
                >
                  Send reset link
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          Boaflow Lead Discovery Platform
        </p>
      </div>
    </div>
  );
}
