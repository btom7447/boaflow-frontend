"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { useState } from "react";
import {
  LogOut,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { NAVIGATION } from "@/app/config/navigation";

type SidebarProps = {
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
};

export function Sidebar({
  mobileOpen,
  setMobileOpen,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const toggleSection = (href: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const visibleNav = NAVIGATION.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role)),
  );

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-black/10 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 bg-gray-950 border-r border-gray-800 flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-56",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-gray-800 group relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>

              {!collapsed && (
                <span className="font-semibold text-white tracking-tight">
                  Boaflow
                </span>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={clsx(
                "hidden lg:flex p-1.5 rounded-md hover:bg-gray-800 transition-opacity",
                collapsed ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              {collapsed ? (
                <PanelRightOpen size={14} />
              ) : (
                <PanelRightClose size={14} />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-md hover:bg-gray-800"
            >
              <PanelRightClose size={16} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleNav.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            const hasChildren = !!item.children;

            if (hasChildren) {
              const isOpen =
                openSections[item.href] || pathname.startsWith(item.href);

              return (
                <div key={item.href}>
                  <button
                    onClick={() => toggleSection(item.href)}
                    title={collapsed ? item.label : undefined}
                    className={clsx(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                      collapsed && "justify-center",
                      isActive
                        ? "text-emerald-400"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
                    )}
                  >
                    <item.icon size={16} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          size={13}
                          className={clsx(
                            "transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      </>
                    )}
                  </button>

                  {!collapsed && (
                    <div
                      className={clsx(
                        "ml-3 pl-3 border-l border-gray-800 space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                        isOpen
                          ? "max-h-96 opacity-100 mt-1"
                          : "max-h-0 opacity-0",
                      )}
                    >
                      {item.children!.map((child) => {
                        const active = pathname.startsWith(child.href);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className={clsx(
                              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm",
                              active
                                ? "bg-emerald-600/15 text-emerald-400 font-medium"
                                : "text-gray-500 hover:text-gray-200 hover:bg-gray-800",
                            )}
                          >
                            <child.icon size={14} />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  collapsed && "justify-center",
                  isActive
                    ? "bg-emerald-600/15 text-emerald-400 font-medium"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800",
                )}
              >
                <item.icon size={16} />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            title={collapsed ? "Sign out" : undefined}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-950/30 transition-all",
              collapsed && "justify-center",
            )}
          >
            <LogOut size={16} />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}
