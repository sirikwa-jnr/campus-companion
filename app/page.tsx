"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { Onboarding } from "@/components/onboarding";

const tools = [
  { href: "/timetable", title: "Timetable", desc: "Your weekly class schedule", icon: "📅" },
  { href: "/assignments", title: "Assignments", desc: "Deadlines and reminders", icon: "📝" },
  { href: "/gpa", title: "GPA", desc: "KAFU percentage weighted average", icon: "🎓" },
  { href: "/notes", title: "Notes", desc: "Per-unit notes with autosave", icon: "🗒️" },
];

export default function HomePage() {
  const { user, loading } = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Your offline-first campus companion.
        </p>
      </div>

      {user && <Onboarding userId={user.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card className="p-5 hover:border-primary transition-colors h-full">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <h2 className="font-semibold">{t.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <footer className="pt-6 mt-6 border-t text-center">
        <p className="text-xs text-muted-foreground">
          Welcome to your HQ. No clutter, just what matters. <span className="text-red-500">🎓</span> By{" "}
          <span className="font-medium text-foreground">Rodney Achota</span>
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Campus Companion · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}