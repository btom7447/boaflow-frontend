import {
  LayoutDashboard,
  Play,
  Shield,
  Users,
  CheckSquare,
  User,
  Cog,
  UserCog,
  ClipboardCheck,
  Target,
  Crosshair,
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
    href: "/pipeline",
    label: "Pipeline",
    icon: Play,
    roles: ["admin"],
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
    roles: ["admin", "sales", "client"],
  },
  {
    href: "/settings",
    label: "Configure",
    icon: Cog,
    roles: ["admin"],
    children: [
      {
        href: "/settings/roles",
        label: "Role Config",
        icon: UserCog,
      },
      {
        href: "/settings/criteria",
        label: "Fit Criteria",
        icon: ClipboardCheck,
      },
      {
        href: "/settings/users",
        label: "Users",
        icon: Users,
      },
    ],
  },
];
