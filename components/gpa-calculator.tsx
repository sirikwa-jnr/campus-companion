"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { createUnit, upsertGpaEntry, deleteGpaEntry } from "@/lib/db";
import { calculateWeightedAverage, percentageToLetter } from "@/lib/gpa";
import { TEMP_USER_ID } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const SEMESTER = "2025-S1"; // hardcoded for v1; add a selector later

export function GpaCalculator() {
  const [unitCode, setUnitCode] = useState("");
  const [unitName, setUnitName] = useState("");
  const [credits, setCredits] = useState(3);
  const [percentage, setPercentage] = useState("");

  const entries = useLiveQuery(
    () =>
      db.gpaEntries
        .where("userId")
        .equals(TEMP_USER_ID)
        .and((e) => e.semester === SEMESTER)
        .toArray(),
    []
  );

  const units = useLiveQuery(
    () => db.units.where("userId").equals(TEMP_USER_ID).toArray(),
    []
  );

  const unitMap = new Map(units?.map((u) => [u.id, u]) ?? []);

  // Compute weighted average
  const inputs = (entries ?? []).map((e) => ({
    percentage: e.percentage,
    credits: e.credits,
  }));
  const weightedAverage = calculateWeightedAverage(inputs);
  const letter = percentageToLetter(weightedAverage);
  const totalCredits = inputs.reduce((s, i) => s + i.credits, 0);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const pct = parseFloat(percentage);
    if (!unitCode || isNaN(pct) || pct < 0 || pct > 100) return;

    // Create unit if it doesn't exist, then create gpa entry
    const newUnit = await createUnit({
      userId: TEMP_USER_ID,
      name: unitName || unitCode,
      code: unitCode,
      credits,
    });

    await upsertGpaEntry({
      userId: TEMP_USER_ID,
      unitId: newUnit.id,
      percentage: pct,
      credits,
      semester: SEMESTER,
    });

    setUnitCode("");
    setUnitName("");
    setPercentage("");
    setCredits(3);
  }

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">
              {weightedAverage.toFixed(2)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Weighted Average
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold">{letter}</div>
            <div className="text-xs text-muted-foreground mt-1">Grade</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{totalCredits}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Total Credits
            </div>
          </div>
        </div>
      </Card>

      {/* Add form */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Add Result</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <Label className="text-xs">Unit Code</Label>
            <Input
              placeholder="CSC 201"
              value={unitCode}
              onChange={(e) => setUnitCode(e.target.value)}
              required
            />
          </div>
          <div>
            <Label className="text-xs">Unit Name</Label>
            <Input
              placeholder="Data Structures"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Credits</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <Label className="text-xs">Percentage (%)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              placeholder="75"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">Add</Button>
          </div>
        </form>
      </Card>

      {/* Entries table */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Results</h3>
        {!entries || entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No results yet. Add your first unit above.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="pb-2">Unit</th>
                <th className="pb-2">Credits</th>
                <th className="pb-2">%</th>
                <th className="pb-2">Grade</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => {
                const unit = unitMap.get(e.unitId);
                return (
                  <tr key={e.id} className="border-b last:border-0">
                    <td className="py-2">
                      {unit?.code ?? "—"}{" "}
                      <span className="text-muted-foreground">
                        {unit?.name}
                      </span>
                    </td>
                    <td className="py-2">{e.credits}</td>
                    <td className="py-2">{e.percentage}%</td>
                    <td className="py-2 font-medium">
                      {percentageToLetter(e.percentage)}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => deleteGpaEntry(e.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}