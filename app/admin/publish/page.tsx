"use client";

import { useState } from "react";
import { Download, UploadCloud, RotateCcw, CheckCircle2 } from "lucide-react";
import { useMuseum } from "@/lib/useMuseum";
import { exportFiles, publishAllDrafts, resetToPublished, hasUnpublishedChanges } from "@/lib/store";

function downloadFile(name: string, content: string) {
  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminPublish() {
  const data = useMuseum();
  const [done, setDone] = useState(false);
  const drafts = data.phones.filter((p) => (p.status ?? "published") === "draft").length;
  const dirty = hasUnpublishedChanges();

  function downloadAll() {
    for (const f of exportFiles()) downloadFile(f.name, f.content);
    setDone(true);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-pagetitle text-ink">Publish</h1>
        <p className="mt-2 text-meta text-secondary">
          Turn your working edits into the committed dataset.
        </p>
      </div>

      {/* Status */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-6">
          <Stat label="Total phones" value={data.phones.length} />
          <Stat label="Drafts" value={drafts} />
          <Stat label="Brands" value={Object.keys(data.brands).length} />
          <Stat label="Years" value={Object.keys(data.years).length} />
          <div className="ml-auto">
            <span
              className={`rounded-full px-3 py-1 text-caption font-medium ${
                dirty ? "bg-warn/10 text-warn" : "bg-success/10 text-success"
              }`}
            >
              {dirty ? "Unpublished changes" : "In sync with committed data"}
            </span>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <div className="card p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-caption font-semibold text-accent">
            1
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Publish drafts</h2>
            <p className="mt-1 text-caption text-secondary">
              Promote every draft to “published” so it appears on the live site after export.
              {drafts === 0 && " (No drafts right now.)"}
            </p>
            <button onClick={() => publishAllDrafts()} disabled={drafts === 0} className="btn-secondary mt-4">
              <UploadCloud size={16} /> Publish {drafts} draft{drafts === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="card p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-caption font-semibold text-accent">
            2
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Export the data files</h2>
            <p className="mt-1 text-caption text-secondary">
              Downloads <code className="rounded bg-paper px-1.5 py-0.5 text-ink">phones.json</code>,{" "}
              <code className="rounded bg-paper px-1.5 py-0.5 text-ink">brands.json</code> and{" "}
              <code className="rounded bg-paper px-1.5 py-0.5 text-ink">years.json</code>.
            </p>
            <button onClick={downloadAll} className="btn-primary mt-4">
              <Download size={16} /> Download data files
            </button>
            {done && (
              <p className="mt-3 inline-flex items-center gap-2 text-caption text-success">
                <CheckCircle2 size={15} /> Downloaded. See step 3.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="card p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-caption font-semibold text-accent">
            3
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-tight text-ink">Commit &amp; deploy</h2>
            <p className="mt-1 text-caption leading-relaxed text-secondary">
              Move the three downloaded files into the project&rsquo;s{" "}
              <code className="rounded bg-paper px-1.5 py-0.5 text-ink">/data</code> folder (replacing the
              existing ones), then redeploy. The live site reads from those files — your changes go public
              on the next build. No code editing required.
            </p>
          </div>
        </div>
      </div>

      {/* Danger */}
      <div className="card border-warn/30 p-6">
        <h2 className="text-lg font-semibold tracking-tight text-ink">Discard working changes</h2>
        <p className="mt-1 text-caption text-secondary">
          Reset the editor back to the committed <code className="text-ink">/data</code> files. This cannot be undone.
        </p>
        <button
          onClick={() => {
            if (confirm("Discard ALL local edits and reset to the committed data?")) resetToPublished();
          }}
          className="btn-ghost mt-4 !text-warn"
        >
          <RotateCcw size={15} /> Reset to committed data
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-2xl font-semibold tracking-tight text-ink">{value}</div>
      <div className="text-caption text-tertiary">{label}</div>
    </div>
  );
}
