import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Proxy handles only static redirects.
// Auth protection is handled client-side in (dashboard)/layout.tsx
// via Zustand which reads from localStorage.
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
