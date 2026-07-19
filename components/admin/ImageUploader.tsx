"use client";

import { useRef, useState } from "react";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { fileToDataUrl } from "@/lib/store";

/**
 * Upload one image (stored as a base64 data URL) or paste an image URL.
 * Used for phone main image, phone gallery items, and brand logos — all
 * fully in-browser, no backend.
 */
export default function ImageUploader({
  label,
  value,
  onChange,
  square = false,
}: {
  label: string;
  value: string;
  onChange: (dataUrl: string) => void;
  square?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");

  async function handleFile(file?: File) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex items-start gap-4">
        <div
          className={`flex items-center justify-center overflow-hidden rounded-xl border border-hairline bg-paper ${
            square ? "h-24 w-24" : "h-24 w-20"
          }`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="max-h-full max-w-full object-contain p-1.5" />
          ) : (
            <span className="text-caption text-tertiary">None</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-secondary !px-4 !py-2"
              disabled={busy}
            >
              <Upload size={15} /> {busy ? "Reading…" : "Upload"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="btn-ghost !px-3 !py-2">
                <X size={15} /> Remove
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-1.5">
              <LinkIcon size={14} className="text-tertiary" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="…or paste an image URL"
                className="w-full bg-transparent text-caption text-ink outline-none placeholder:text-tertiary"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (url.trim()) onChange(url.trim());
                setUrl("");
              }}
              className="btn-secondary !px-4 !py-2"
            >
              Use
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}
