import { GpaCalculator } from "@/components/gpa-calculator";

export default function GpaPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">GPA Calculator (KAFU)</h1>
      <p className="text-sm text-muted-foreground">
        Weighted average = Σ(percentage × credits) ÷ Σ credits.
      </p>
      <GpaCalculator />
    </div>
  );
}