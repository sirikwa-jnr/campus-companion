import Link from "next/link";
import { Card } from "@/components/ui/card";

const tools = [
  { href: "/timetable", title: "Timetable", desc: "Your weekly class schedule" },
  { href: "/assignments", title: "Assignments", desc: "Deadlines and reminders" },
  { href: "/gpa", title: "GPA", desc: "KAFU percentage weighted average" },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back 👋</h1>
        <p className="text-muted-foreground mt-1">
          Your offline-first campus companion.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map((t) => (
          <Link key={t.href} href={t.href} className="block group">
            <Card className="p-6 h-full transition-all group-hover:border-primary group-hover:shadow-md cursor-pointer">
              <h2 className="font-semibold text-lg">{t.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}