"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Settings, ChevronDown, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { clsx } from "clsx";

type TopBarProps = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
};

const PAGE_TITLES: Record<string, string> = {
  "/leads": "Leads",
  "/pipeline": "Pipeline",
  "/settings/roles": "Role Config",
  "/settings/users": "Users",
  "/settings/criteria": "Fit Criteria",
  "/profile": "Profile",
};

function Avatar({ name }: { name: string }) {
  const parts = name.trim().split(" ");
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center shrink-0">
      <span className="text-xs font-semibold text-emerald-400">{initials}</span>
    </div>
  );
}

export function TopBar({ mobileOpen, setMobileOpen }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const title =
    Object.entries(PAGE_TITLES).find(([path]) =>
      pathname.startsWith(path),
    )?.[1] ?? "Dashboard";

  const displayName = user?.full_name || user?.email || "User";

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <header className="h-14 border-b border-gray-800 bg-gray-950/80 backdrop-blur-xs flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-800 transition"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>

      {/* User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Avatar name={displayName} />
          <div className="text-left hidden sm:block">
            <p className="text-xs font-medium text-gray-200 leading-tight">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 capitalize mt-0.5">
              {user?.role}
            </p>
          </div>
          <ChevronDown
            size={14}
            className={clsx(
              "text-gray-500 transition-transform duration-150",
              open && "rotate-180",
            )}
          />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-1.5 w-52 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
            <div className="px-4 py-3 border-b border-gray-800">
              <p className="text-xs font-medium text-gray-200 truncate">
                {displayName}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            <div className="p-1.5">
              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    router.push("/settings/roles");
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors text-left"
                >
                  <Settings size={14} />
                  Settings
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-colors text-left"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
