"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi, organizationApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { authStorage } from "@/lib/auth";
import { Organization } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Login and get token
      const loginResponse = await authApi.login(email, password);

      // Step 2: Store token first
      authStorage.setToken(loginResponse.access_token);

      // Step 3: Fetch organization (ignore 401)
      let organization: Organization | null = null;
      try {
        organization = await organizationApi.getOrganization();
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.warn("Organization fetch unauthorized, ignoring:", err);
        } else {
          console.error("Could not fetch organization:", err);
        }
      }

      // Step 4: Store everything in auth store
      setAuth(
        {
          id: loginResponse.id,
          email,
          full_name: loginResponse.full_name,
          role: loginResponse.role,
          avatar: loginResponse.avatar ?? null,
          organization_id: loginResponse.organization_id,
        },
        loginResponse.access_token,
        organization,
      );

      toast.success(`Welcome back, ${loginResponse.full_name || email}!`);
      router.push("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
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
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-white">Sign in</h1>
            <p className="text-sm text-gray-500 mt-1">
              Access your lead discovery dashboard
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
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 bottom-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeClosed size={18} strokeWidth={1} />
                ) : (
                  <Eye size={18} strokeWidth={1} />
                )}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign in
            </Button>
          </form>
        </div>

        {/* Signup link */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-gray-600 mt-6">
          Boaflow Lead Discovery Platform
        </p>
      </div>
    </div>
  );
}
