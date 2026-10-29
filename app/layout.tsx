import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          <nav className="border-b">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
              <Link href="/" className="font-semibold tracking-tight">Campus Companion</Link>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <Link href="/timetable" className="hover:text-foreground transition-colors">Timetable</Link>
                <Link href="/assignments" className="hover:text-foreground transition-colors">Assignments</Link>
                <Link href="/gpa" className="hover:text-foreground transition-colors">GPA</Link>
              </div>
            </div>
          </nav>
          <main className="max-w-5xl mx-auto px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}