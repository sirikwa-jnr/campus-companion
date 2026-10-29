// lib/gpa.ts

/**
 * KAFU uses a percentage-weighted average, NOT a 4.0 GPA scale.
 *
 * Formula:
 *   Weighted Average = Σ (percentage × credits) / Σ credits
 *
 * Example:
 *   Unit A: 75% × 3 credits = 225
 *   Unit B: 62% × 4 credits = 248
 *   Total: 473 / 7 credits = 67.57%
 */

export interface GpaInput {
  percentage: number;   // 0–100
  credits: number;      // e.g., 3, 4
}

export function calculateWeightedAverage(inputs: GpaInput[]): number {
  if (inputs.length === 0) return 0;

  const totalWeighted = inputs.reduce(
    (sum, item) => sum + item.percentage * item.credits,
    0
  );
  const totalCredits = inputs.reduce((sum, item) => sum + item.credits, 0);

  if (totalCredits === 0) return 0;
  return totalWeighted / totalCredits;
}

/**
 * KAFU letter grade mapping (approximate — verify with your handbook):
 *   70–100: A
 *   60–69:  B
 *   50–59:  C
 *   40–49:  D
 *   below 40: E (Fail)
 */
export function percentageToLetter(percentage: number): string {
  if (percentage >= 70) return 'A';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'E';
}