import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { ToastProvider } from "@/components/providers/ToastProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Boaflow — Lead Discovery",
  description: "VA placement lead discovery platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>
        {
          <Providers>
            {children}
            <ToastProvider />
          </Providers>
        }
      </body>
    </html>
  );
}