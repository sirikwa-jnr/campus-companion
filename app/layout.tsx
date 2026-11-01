import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SerwistProvider } from "@/components/serwist-provider";
import { AppShell } from "@/components/app-shell";
import { ErrorBoundary } from "@/components/error-boundary";
import { InstallPrompt } from "@/components/install-prompt";
import { Navbar } from "@/components/navbar";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Companion",
  description: "Timetable, assignments, GPA and notes for university students",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Campus Companion",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
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
              
              {/* Replaced the old static nav with the new Navbar */}
              <Navbar />

              <main className="max-w-5xl mx-auto px-4 py-6">
                <ErrorBoundary>
                  <AppShell>{children}</AppShell>
                </ErrorBoundary>
              </main>
              <InstallPrompt />
            </div>
          </ThemeProvider>
        </SerwistProvider>
        <Analytics /> {/* <-- NEW ANALYTICS COMPONENT */}
      </body>
    </html>
  );
}