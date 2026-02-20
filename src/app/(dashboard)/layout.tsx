"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

const SIDEBAR_KEY = "boaflow_sidebar_collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAuthStore();

  const [hydrated, setHydrated] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // hydrate auth
  useEffect(() => {
    hydrate();
    setHydrated(true);
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      const token = localStorage.getItem("boaflow_token");
      if (!token) router.push("/login");
    }
  }, [hydrated, isAuthenticated, router]);

  // load persisted state
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(SIDEBAR_KEY, String(collapsed));
  }, [collapsed]);

  // sync across tabs
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === SIDEBAR_KEY) {
        setCollapsed(e.newValue === "true");
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  // Ctrl/Cmd + B toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!hydrated || !isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? "lg:ml-16" : "lg:ml-56"
        }`}
      >
        <TopBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
