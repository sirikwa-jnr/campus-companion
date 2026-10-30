"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/schema";
import { createTimetableEntry, createUnit } from "@/lib/db";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 7, label: "Sunday" },
];

export function AddClassDialog() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [unitId, setUnitId] = useState("");
  const [newUnitName, setNewUnitName] = useState("");
  const [newUnitCode, setNewUnitCode] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [room, setRoom] = useState("");

  // Live list of units so the dropdown updates automatically
  const units = useLiveQuery(
    () => db.units.where("userId").equals(user?.id || "").toArray(),
    [user?.id]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    let finalUnitId = unitId;

    // If no unit selected, create a new one first
    if (!finalUnitId && newUnitCode) {
      const newUnit = await createUnit({
        userId: user.id,
        name: newUnitName || newUnitCode,
        code: newUnitCode,
        credits: 3,
      });
      finalUnitId = newUnit.id;
    }

    if (!finalUnitId) return;

    // Save the timetable entry
    await createTimetableEntry({
      userId: user.id,
      unitId: finalUnitId,
      dayOfWeek,
      startTime,
      endTime,
      room,
      lecturer: "",
    });

    // Reset form and close
    setUnitId("");
    setNewUnitCode("");
    setNewUnitName("");
    setRoom("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>+ Add Class</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Class to Timetable</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Unit</Label>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm mt-1 bg-transparent"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
            >
              <option value="">— Create new unit —</option>
              {units?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.code} — {u.name}
                </option>
              ))}
            </select>
          </div>

          {!unitId && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Unit Code</Label>
                <Input
                  placeholder="e.g. CSC 201"
                  value={newUnitCode}
                  onChange={(e) => setNewUnitCode(e.target.value)}
                  required={!unitId}
                />
              </div>
              <div>
                <Label>Unit Name</Label>
                <Input
                  placeholder="e.g. Data Structures"
                  value={newUnitName}
                  onChange={(e) => setNewUnitName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Day</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm mt-1 bg-transparent"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(Number(e.target.value))}
              >
                {DAYS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Start</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>End</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Room (optional)</Label>
            <Input
              placeholder="e.g. LT 4"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">Save Class</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}