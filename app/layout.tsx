import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SerwistProvider } from "@/components/serwist-provider";
import { SyncIndicator } from "@/components/sync-indicator";
import { AppShell } from "@/components/app-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import { InstallPrompt } from "@/components/install-prompt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Companion",
  description: "Timetable, assignments, GPA and notes for university students",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const stored = localStorage.getItem('theme');
                const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = stored || (systemDark ? 'dark' : 'light');
                if (theme === 'dark' || (theme === 'system' && systemDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SerwistProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-background">
              <nav className="border-b">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
                  <Link href="/" className="font-semibold">Campus Companion</Link>
                  <div className="flex gap-4 text-sm text-muted-foreground flex-1 overflow-x-auto whitespace-nowrap">
                    <Link href="/timetable" className="hover:text-foreground">Timetable</Link>
                    <Link href="/assignments" className="hover:text-foreground">Assignments</Link>
                    <Link href="/gpa" className="hover:text-foreground">GPA</Link>
                    <Link href="/notes" className="hover:text-foreground">Notes</Link>
                    <Link href="/units" className="hover:text-foreground">Units</Link>
                    <Link href="/settings" className="hover:text-foreground">Settings</Link>
                  </div>
                  <SyncIndicator />
                  <ThemeToggle />
                </div>
              </nav>
              <main className="max-w-5xl mx-auto px-4 py-6">
                <ErrorBoundary>
                  <AppShell>{children}</AppShell>
                </ErrorBoundary>
              </main>
              <InstallPrompt />
            </div>
          </ThemeProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}