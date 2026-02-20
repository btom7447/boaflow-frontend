import {
  LayoutDashboard,
  Play,
  Crosshair,
  Search,
  Building2,
  User,
  Users,
  Sparkles,
  Gauge,
} from "lucide-react";

export type AppRole = "admin" | "sales" | "client";

export type NavItem = {
  href: string;
  label: string;
  icon: any;
  roles?: AppRole[];
  children?: NavItem[];
};

export const NAVIGATION: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "sales", "client"],
  },
  {
    href: "/leads",
    label: "Leads",
    icon: Crosshair,
    roles: ["admin", "sales", "client"],
  },
  {
    href: "/configurations",
    label: "My Searches",
    icon: Search,
    roles: ["admin", "sales", "client"],
  },
  {
    href: "/pipeline",
    label: "Pipeline",
    icon: Play,
    roles: ["admin"],
  },
  {
    href: "/organization",
    label: "Organization",
    icon: Building2,
    roles: ["admin"],
    children: [
      {
        href: "/organization/overview",
        label: "Overview",
        icon: Gauge,
      },
      {
        href: "/organization/team",
        label: "Team",
        icon: Users,
      },
      {
        href: "/organization/plans",
        label: "Upgrade Plan",
        icon: Sparkles,
      },
    ],
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    roles: ["admin", "sales", "client"],
  },
];
