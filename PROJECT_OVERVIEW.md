# Boaflow Frontend — Project Overview

> Last updated: February 2026
> Stack: Next.js 16 · React 19 · TypeScript · Tailwind CSS 4

---

## Table of Contents

1. [Project Summary](#1-project-summary)
2. [Directory Structure](#2-directory-structure)
3. [Configuration Files](#3-configuration-files)
4. [Environment Variables](#4-environment-variables)
5. [Dependencies](#5-dependencies)
6. [Routing — App Router](#6-routing--app-router)
7. [Authentication](#7-authentication)
8. [API Layer](#8-api-layer)
9. [State Management](#9-state-management)
10. [Type Definitions](#10-type-definitions)
11. [Layout & Navigation](#11-layout--navigation)
12. [Pages](#12-pages)
13. [UI Components](#13-ui-components)
14. [Hooks](#14-hooks)
15. [Constants](#15-constants)
16. [Styling](#16-styling)
17. [Data Fetching Pattern](#17-data-fetching-pattern)

---

## 1. Project Summary

Boaflow is a **lead discovery and sales pipeline platform** for VA (virtual assistant) placement. The frontend connects to a separately deployed backend API (FastAPI on Railway) and provides:

- Role-based access control across three user tiers (`admin`, `sales`, `client`)
- Lead management with filtering, bulk actions, CSV export, and an inline detail panel
- Pipeline run management — trigger, monitor, and review AI-classification jobs
- Analytics dashboard with charts (Recharts)
- Admin settings for roles, fit criteria, and user management
- User profile editing with avatar upload

---

## 2. Directory Structure

```
boaflow-frontend/
├── src/
│   ├── app/                          # Next.js App Router root
│   │   ├── layout.tsx                # Root layout (font, providers, toasts)
│   │   ├── globals.css               # Global styles / Tailwind base
│   │   ├── providers.tsx             # React Query QueryClientProvider
│   │   ├── config/
│   │   │   ├── navigation.ts         # Nav items with roles & icons
│   │   │   └── favicon.ico
│   │   ├── (auth)/                   # Auth route group (no dashboard shell)
│   │   │   ├── login/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   └── (dashboard)/              # Protected route group
│   │       ├── layout.tsx            # Auth guard + Sidebar + TopBar shell
│   │       ├── page.tsx              # Dashboard home (analytics)
│   │       ├── leads/page.tsx        # Lead table, filters, detail panel
│   │       ├── pipeline/page.tsx     # Pipeline runs table + trigger modal
│   │       ├── profile/page.tsx      # Profile info + password change
│   │       └── settings/
│   │           ├── roles/page.tsx    # Role config management
│   │           ├── criteria/page.tsx # Fit criteria management
│   │           └── users/page.tsx    # User management
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx           # Collapsible sidebar with role-filtered nav
│   │   │   └── TopBar.tsx            # Header with page title + user dropdown
│   │   ├── providers/
│   │   │   └── ToastProvider.tsx     # Sonner Toaster (dark theme)
│   │   └── ui/
│   │       ├── Badge.tsx             # Inline label badge
│   │       ├── Button.tsx            # Button with variants & loading state
│   │       ├── Input.tsx             # Labelled text input
│   │       ├── Pagination.tsx        # Offset-based pagination
│   │       └── Skeleton.tsx          # Loading skeleton variants
│   ├── hooks/
│   │   └── useKeyboardShortcuts.ts   # Ctrl+K (search), Esc, Ctrl+N
│   ├── lib/
│   │   ├── api.ts                    # Axios client + all API modules
│   │   ├── auth.ts                   # localStorage token/user helpers
│   │   ├── constants.ts              # Label & colour maps for enums
│   │   └── types.ts                  # All shared TypeScript interfaces
│   ├── store/
│   │   └── authStore.ts              # Zustand auth store
│   └── proxy.ts                      # Thin Next.js middleware stub
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── package.json
├── .env.local
└── .env.example
```

---

## 3. Configuration Files

### `next.config.ts`
Minimal — empty `NextConfig` object. No custom rewrites or image domains configured yet.

### `tsconfig.json`
| Setting | Value |
|---|---|
| `target` | `ES2017` |
| `module` | `esnext` |
| `moduleResolution` | `bundler` |
| `jsx` | `react-jsx` |
| `strict` | `true` |
| `noEmit` | `true` |
| `paths` | `@/*` → `./src/*` |

### `eslint.config.mjs`
- ESLint 9 flat config format
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores `.next/`, `out/`, `build/`, `next-env.d.ts`

### `postcss.config.mjs`
- Tailwind CSS 4 PostCSS plugin (`@tailwindcss/postcss`)

---

## 4. Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (e.g. `https://boaflow-production.up.railway.app`) |

Falls back to `http://localhost:8000` in development when the variable is absent.

---

## 5. Dependencies

### Runtime
| Package | Version | Purpose |
|---|---|---|
| `next` | 16.1.6 | Framework |
| `react` / `react-dom` | 19.2.3 | UI runtime |
| `@tanstack/react-query` | ^5.90.21 | Server state & caching |
| `@tanstack/react-table` | ^8.21.3 | Headless table (available, not yet used) |
| `zustand` | ^5.0.11 | Client state (auth) |
| `axios` | ^1.13.5 | HTTP client |
| `recharts` | ^3.7.0 | Charts (Line, Pie) |
| `lucide-react` | ^0.564.0 | Icons |
| `sonner` | ^2.0.7 | Toast notifications |
| `clsx` | ^2.1.1 | Conditional class names |
| `tailwind-merge` | ^3.4.1 | Tailwind class merging |

### Dev / Build
| Package | Version | Purpose |
|---|---|---|
| `tailwindcss` | ^4 | CSS framework |
| `@tailwindcss/postcss` | ^4 | Tailwind PostCSS plugin |
| `typescript` | ^5 | Type checking |
| `eslint` | ^9 | Linting |
| `eslint-config-next` | 16.1.6 | Next.js lint rules |

---

## 6. Routing — App Router

The project uses Next.js **App Router** with **route groups** to separate auth and dashboard layouts.

```
/                      → (dashboard)/page.tsx       [Analytics dashboard]
/leads                 → (dashboard)/leads/page.tsx  [Lead management]
/pipeline              → (dashboard)/pipeline/page.tsx [Pipeline runs]
/profile               → (dashboard)/profile/page.tsx  [User profile]
/settings/roles        → (dashboard)/settings/roles/page.tsx
/settings/criteria     → (dashboard)/settings/criteria/page.tsx
/settings/users        → (dashboard)/settings/users/page.tsx
/login                 → (auth)/login/page.tsx
/forgot-password       → (auth)/forgot-password/page.tsx
```

All pages under `(dashboard)/` are **client components** (`"use client"`). The dashboard layout handles the auth guard and renders the full shell.

---

## 7. Authentication

Authentication is **custom JWT-based**, stored client-side in `localStorage`. There is no NextAuth or third-party auth library.

### Flow

1. User submits email + password on `/login`
2. `authApi.login()` POSTs to `/api/auth/login` → returns `access_token` and `role`
3. Token and user object are saved to `localStorage` via `authStorage` helpers (`src/lib/auth.ts`)
4. `useAuthStore` (Zustand) is hydrated from `localStorage` on dashboard layout mount
5. If not authenticated after hydration, the dashboard layout redirects to `/login`
6. The Axios request interceptor (`src/lib/api.ts`) injects the `Authorization: Bearer <token>` header on every request
7. A 401 response interceptor clears storage and redirects to `/login`

### Key files

| File | Role |
|---|---|
| `src/lib/auth.ts` | `authStorage` — raw localStorage read/write helpers |
| `src/store/authStore.ts` | Zustand store — `setAuth`, `clearAuth`, `hydrate` |
| `src/app/(dashboard)/layout.tsx` | Guards the dashboard; calls `hydrate()` on mount |

### localStorage keys
- `boaflow_token` — JWT access token
- `boaflow_user` — JSON-serialised `User` object
- `boaflow_sidebar_collapsed` — sidebar UI state

---

## 8. API Layer

All HTTP calls live in `src/lib/api.ts`. A single Axios instance (`client`) is shared across all modules.

### Modules

| Export | Endpoints covered |
|---|---|
| `authApi` | `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/change-password` |
| `profileApi` | `PATCH /api/profile/`, `POST /api/profile/change-password` |
| `leadsApi` | `GET /api/leads/`, `GET /api/leads/:id`, `PATCH /api/leads/:id`, `PATCH /api/leads/bulk-update` |
| `exportApi` | `GET /api/export/leads` (returns Blob for CSV download) |
| `pipelineApi` | `GET /api/pipeline/runs`, `GET /api/pipeline/runs/:id`, `POST /api/pipeline/run` |
| `settingsApi` | Roles CRUD, Criteria CRUD, Users CRUD |
| `dashboardApi` | `GET /api/dashboard/stats` |

### Interceptors
- **Request** — injects `Authorization: Bearer <token>` from `localStorage`
- **Response** — on 401, clears `localStorage` and redirects to `/login`

---

## 9. State Management

| Concern | Solution |
|---|---|
| Server/async data | **TanStack React Query** — query keys, stale time (30 s), retry (1) |
| Auth session | **Zustand** (`useAuthStore`) — persisted to `localStorage` |
| UI-local state | React `useState` / `useRef` within each page component |

The `QueryClient` is instantiated once inside `src/app/providers.tsx` with `staleTime: 30_000` and `retry: 1` as defaults.

---

## 10. Type Definitions

All shared types are in `src/lib/types.ts`.

### Auth
- `User` — `id, email, role, full_name, avatar`
- `TokenResponse` — login API response

### Leads
- `FitType` — `"yes" | "no" | "maybe" | "unclassified"`
- `LeadStatus` — `"new" | "contacted" | "interested" | "not_interested" | "converted" | "ignored"`
- `Lead` — full lead record
- `LeadUpdate` — mutable fields (`lead_status`, `notes`, `assigned_to`)
- `LeadFilters` — query params for `GET /api/leads/`

### Pipeline
- `RunStatus` — `"queued" | "running" | "completed" | "failed"`
- `PipelineRun` — full run record
- `TriggerPipelineRequest` — payload for starting a run
- `CompanyRow` — CSV row shape

### Settings
- `RoleConfig` — named role with label, description, examples
- `FitCriteria` — required-for-fit or automatic-disqualifier criterion
- `AppUser` — platform user record

---

## 11. Layout & Navigation

### Root layout (`src/app/layout.tsx`)
- Sets `<html lang="en">` with **DM Sans** (Google Fonts via `next/font`)
- Wraps children in `<Providers>` (React Query) and `<ToastProvider>` (Sonner)
- Page title: **"Boaflow — Lead Discovery"**

### Dashboard layout (`src/app/(dashboard)/layout.tsx`)
- Client component — runs auth hydration and redirect logic
- Manages sidebar collapsed state, persisted to `localStorage` and synced across browser tabs via `StorageEvent`
- Keyboard shortcut: **Ctrl/Cmd + B** toggles sidebar
- Renders `<Sidebar>` (fixed left) and `<TopBar>` (sticky top)

### Sidebar (`src/components/layout/Sidebar.tsx`)
- Collapsible: `w-56` expanded → `w-16` collapsed
- Mobile: off-canvas overlay (backdrop + slide-in)
- Filters nav items by `user.role` using `NAVIGATION` config
- Supports nested nav sections with animated expand/collapse
- Logout clears auth store and redirects to `/login`

### TopBar (`src/components/layout/TopBar.tsx`)
- Derives page title from `pathname` using `PAGE_TITLES` map
- Shows user avatar (base64 image or initials fallback)
- Dropdown: Settings link (admin only), Sign out

### Navigation config (`src/app/config/navigation.ts`)

| Route | Label | Roles | Children |
|---|---|---|---|
| `/` | Dashboard | all | — |
| `/leads` | Leads | all | — |
| `/pipeline` | Pipeline | admin | — |
| `/profile` | Profile | all | — |
| `/settings` | Configure | admin | Roles, Criteria, Users |

---

## 12. Pages

### Dashboard (`/`)
- Fetches stats via `dashboardApi.getStats()`
- **4 stat cards** — Total Leads, High Fit Leads, Conversion Rate, Avg Confidence
- **Line chart** — leads over time (Recharts `LineChart`)
- **Donut chart** — fit distribution Yes/Maybe/No (Recharts `PieChart`)
- **Recent pipeline runs** table with link to `/pipeline`
- Full loading skeleton (`DashboardSkeleton`)

### Leads (`/leads`)
- Paginated table (30 per page, offset-based)
- Server-side filters: `fit`, `status` (via query params)
- Client-side search across `title`, `role_type`, `location`
- **Inline detail panel** (modal overlay) — view reasons, edit status & notes, link to job URL
- **Bulk selection** with bulk status update modal
- **CSV export** — respects active filters, triggers browser download
- Keyboard shortcuts: **Ctrl+K** focuses search, **Esc** closes panel / clears search
- Responsive: table on `md+`, card list on mobile

### Pipeline (`/pipeline`)
- Lists all pipeline runs in a table / mobile card view
- Auto-polls every 3 s while any run is `queued` or `running`
- **Trigger modal** — CSV file upload (parsed client-side), company limit, dry-run toggle, async-mode toggle with concurrency input
- Run metrics: jobs found, leads (yes / maybe), duration, triggered by

### Profile (`/profile`)
- Edit full name and upload avatar (base64 encoded, previewed before save)
- Change password form (current → new → confirm, min 8 chars)

### Settings — Roles (`/settings/roles`) *(admin only)*
- CRUD for named role configurations used by the classification backend

### Settings — Fit Criteria (`/settings/criteria`) *(admin only)*
- CRUD for `required_for_fit` and `automatic_disqualifier` criteria

### Settings — Users (`/settings/users`) *(admin only)*
- List all app users, create new users, deactivate users

### Login (`/login`)
- Email + password form
- Show/hide password toggle
- Link to `/forgot-password`
- On success: stores auth, redirects to `/leads`

---

## 13. UI Components

All shared components live in `src/components/ui/`.

### `Button`
Props: `variant` (`primary` | `secondary` | `danger` | `ghost`), `size` (`sm` | `md` | `lg`), `loading` (shows spinner inline).

### `Badge`
Props: `label` (string), `colorClass` (Tailwind bg+text classes). Used for fit type, lead status, run status labels.

### `Input`
Labelled input with consistent dark theme styling.

### `Pagination`
Offset-based. Props: `total`, `limit`, `offset`, `onChange(offset)`.

### `Skeleton`
- `TableSkeleton` — animated rows for lead/pipeline tables
- `PipelineRunSkeleton` — pipeline-specific skeleton
- `DashboardSkeleton` — inline within dashboard page

### `ToastProvider`
Renders Sonner `<Toaster>` with dark gray/blue theme matching the app's colour palette.

---

## 14. Hooks

### `useKeyboardShortcuts` (`src/hooks/useKeyboardShortcuts.ts`)
Attaches `keydown` listener with handlers:
| Shortcut | Handler key |
|---|---|
| Ctrl/Cmd + K | `search` |
| Escape | `escape` |
| Ctrl/Cmd + N | `create` |

---

## 15. Constants

`src/lib/constants.ts` exports label and Tailwind colour maps for all enums:

| Constant | Maps |
|---|---|
| `FIT_LABELS` | `FitType` → display label |
| `FIT_COLORS` | `FitType` → Tailwind classes |
| `STATUS_LABELS` | `LeadStatus` → display label |
| `STATUS_COLORS` | `LeadStatus` → Tailwind classes |
| `RUN_STATUS_COLORS` | `RunStatus` → Tailwind classes |
| `REMOTE_FLAG_LABELS` | `remote_flag` → display label |
| `ROLE_TYPE_LABELS` | `role_type` → display label |

---

## 16. Styling

- **Tailwind CSS v4** via PostCSS plugin (no `tailwind.config.ts` — config is inline via CSS)
- **Dark theme** — `gray-950` background throughout; `gray-900` cards; `blue-600` primary accent
- Utility helpers: `clsx` for conditional classes, `tailwind-merge` for class merging (available in deps, used sparingly)
- Font: **DM Sans** loaded via `next/font/google`, CSS variable `--font-display`
- No component library (Radix, shadcn, etc.) — all UI is hand-built with Tailwind

---

## 17. Data Fetching Pattern

All data fetching follows the same pattern using TanStack React Query:

```tsx
// Fetch
const { data, isLoading } = useQuery({
  queryKey: ["resource", filters],
  queryFn: () => api.getResource(filters),
});

// Mutate
const mutation = useMutation({
  mutationFn: api.updateResource,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["resource"] });
    toast.success("Saved");
  },
  onError: (error: Error) => toast.error(error.message),
});
```

Pages render a **skeleton** while loading and show inline error states. Query keys are scoped by resource name and active filters so cache invalidation is precise.
