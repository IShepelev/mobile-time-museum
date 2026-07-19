"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Pencil } from "lucide-react";
import { useMuseum } from "@/lib/useMuseum";
import { deleteYear, renameYear, upsertYear } from "@/lib/store";

export default function AdminYears() {
  const data = useMuseum();
  const [newYear, setNewYear] = useState("");
  const [newIntro, setNewIntro] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editIntro, setEditIntro] = useState("");
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState("");

  const years = Object.keys(data.years).sort((a, b) => Number(a) - Number(b));
  const phoneCount = (y: string) => data.phones.filter((p) => String(p.year) === y).length;

  function addYear() {
    const y = newYear.trim();
    if (!/^\d{4}$/.test(y)) {
      alert("Enter a 4-digit year.");
      return;
    }
    if (data.years[y] !== undefined) {
      alert("That year already exists.");
      return;
    }
    upsertYear(y, newIntro.trim());
    setNewYear("");
    setNewIntro("");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-pagetitle text-ink">Years</h1>
        <p className="mt-2 text-meta text-secondary">
          {years.length} years on the timeline. Each year can carry an intro shown on its page.
        </p>
      </div>

      {/* Add */}
      <div className="card p-6">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">Add a year</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            placeholder="Year (e.g. 2026)"
            className="field sm:w-40"
          />
          <input
            value={newIntro}
            onChange={(e) => setNewIntro(e.target.value)}
            placeholder="Intro sentence (optional)"
            className="field flex-1"
          />
          <button onClick={addYear} className="btn-primary">
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="card divide-y divide-hairline">
        {years.map((y) => (
          <div key={y} className="px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              {renaming === y ? (
                <div className="flex items-center gap-2">
                  <input
                    value={renameVal}
                    onChange={(e) => setRenameVal(e.target.value)}
                    className="field !w-28 !py-1.5"
                  />
                  <button
                    onClick={() => {
                      if (!/^\d{4}$/.test(renameVal.trim())) {
                        alert("Enter a 4-digit year.");
                        return;
                      }
                      renameYear(y, renameVal.trim());
                      setRenaming(null);
                    }}
                    className="btn-secondary !px-3 !py-1.5"
                  >
                    Save
                  </button>
                  <button onClick={() => setRenaming(null)} className="btn-ghost !px-3 !py-1.5">
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-semibold text-ink">{y}</span>
                  <span className="text-caption text-tertiary">
                    {phoneCount(y)} phone{phoneCount(y) === 1 ? "" : "s"}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditing(editing === y ? null : y);
                    setEditIntro(data.years[y] ?? "");
                  }}
                  className="rounded-lg p-2 text-tertiary hover:bg-paper hover:text-accent"
                  title="Edit intro"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => {
                    setRenaming(y);
                    setRenameVal(y);
                  }}
                  className="rounded-lg px-2.5 py-2 text-caption text-tertiary hover:bg-paper hover:text-ink"
                  title="Rename year"
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    const n = phoneCount(y);
                    if (n > 0) {
                      alert(`${n} phone(s) are dated ${y}. Deleting only removes the year's intro; the phones remain.`);
                    }
                    if (confirm(`Delete year ${y} from the timeline intros?`)) deleteYear(y);
                  }}
                  className="rounded-lg p-2 text-tertiary hover:bg-paper hover:text-warn"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {editing === y ? (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <textarea
                  value={editIntro}
                  onChange={(e) => setEditIntro(e.target.value)}
                  rows={2}
                  className="field flex-1"
                />
                <button
                  onClick={() => {
                    upsertYear(y, editIntro.trim());
                    setEditing(null);
                  }}
                  className="btn-secondary self-start"
                >
                  <Save size={15} /> Save
                </button>
              </div>
            ) : (
              data.years[y] && <p className="mt-2 max-w-3xl text-caption leading-relaxed text-secondary">{data.years[y]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
