"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, GripVertical, Upload, Link2, Play } from "lucide-react";
import { isFirebaseConfigured, uploadAdminFile } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

function isVideoUrl(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || url.includes("video");
}

export function MediaUrlEditor({
  urls,
  onChange,
  folder,
  accept = "image/*,video/*",
  previewUrls,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
  folder: "plots" | "experiences";
  accept?: string;
  /** Optional poster/thumbnail images aligned with urls (e.g. video thumbs) */
  previewUrls?: (string | undefined)[];
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const firebaseReady = isFirebaseConfigured();

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setError("");
    if (!firebaseReady) {
      setError(
        "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to .env.local and restart the dev server."
      );
      return;
    }
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of list) {
        uploaded.push(await uploadAdminFile(file, folder));
      }
      onChange([...urls.filter(Boolean), ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(urls.filter((_, i) => i !== index));
  }

  function onDragStart(index: number) {
    setDragIndex(index);
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setOverIndex(index);
  }

  function onDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...urls];
    const [item] = next.splice(dragIndex, 1);
    next.splice(index, 0, item);
    onChange(next);
    setDragIndex(null);
    setOverIndex(null);
  }

  function addUrl() {
    const value = urlDraft.trim();
    if (!value) return;
    onChange([...urls, value]);
    setUrlDraft("");
    setShowUrlInput(false);
  }

  return (
    <div className="space-y-3">
      {urls.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {urls.map((url, index) => {
            const preview = previewUrls?.[index];
            const showAsVideo = Boolean(url && isVideoUrl(url));
            const imageSrc =
              preview || (!showAsVideo && url ? url : undefined);

            return (
              <div
                key={`${url}-${index}`}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={() => onDrop(index)}
                onDragEnd={() => {
                  setDragIndex(null);
                  setOverIndex(null);
                }}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-lg border bg-stone-100",
                  dragIndex === index && "opacity-50",
                  overIndex === index &&
                    dragIndex !== index &&
                    "ring-2 ring-stone-900"
                )}
              >
                {imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageSrc}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-stone-800 text-xs text-white">
                    Video
                  </div>
                )}
                {showAsVideo ? (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/25">
                    <span className="rounded-full bg-black/60 p-2 text-white">
                      <Play className="h-5 w-5 fill-white" />
                    </span>
                  </div>
                ) : null}
                <div className="absolute left-1 top-1 rounded bg-black/50 p-0.5 text-white opacity-80">
                  <GripVertical className="h-3.5 w-3.5" />
                </div>
                <button
                  type="button"
                  aria-label="Remove"
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600"
                  onClick={() => removeAt(index)}
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                  {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-stone-500">
          No media yet. Upload or paste a URL.
        </p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            if (e.target.files?.length) void uploadFiles(e.target.files);
          }}
        />
        <Button
          type="button"
          className="min-h-11 flex-1"
          disabled={uploading}
          onClick={() => {
            if (!firebaseReady) {
              setError(
                "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to .env.local and restart the dev server."
              );
              return;
            }
            fileRef.current?.click();
          }}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading…" : "Upload to Firebase"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-11"
          onClick={() => setShowUrlInput((v) => !v)}
        >
          <Link2 className="mr-2 h-4 w-4" />
          Paste URL
        </Button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            className="min-h-11"
            placeholder="https://…"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
          />
          <Button type="button" className="min-h-11 shrink-0" onClick={addUrl}>
            Add
          </Button>
        </div>
      ) : null}

      {!firebaseReady ? (
        <p className="text-xs text-stone-500">
          Set{" "}
          <code className="rounded bg-stone-200 px-1">NEXT_PUBLIC_FIREBASE_*</code>{" "}
          in <code className="rounded bg-stone-200 px-1">.env.local</code> to
          enable Firebase uploads. You can still paste existing URLs.
        </p>
      ) : (
        <p className="text-xs text-stone-500">
          Uploads go to Firebase Storage. Drag tiles to reorder.
        </p>
      )}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

/** Single image thumbnail picker (preview square, not a raw URL field). */
export function ThumbnailImageField({
  value,
  onChange,
  folder,
  label,
}: {
  value?: string;
  onChange: (url: string) => void;
  folder: "plots" | "experiences";
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [draft, setDraft] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const firebaseReady = isFirebaseConfigured();

  async function onFile(file: File | null) {
    if (!file) return;
    setError("");
    if (!firebaseReady) {
      setError(
        "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to .env.local."
      );
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadAdminFile(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-stone-600">{label}</p>
      <div className="flex items-start gap-3">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-stone-100">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-[10px] text-stone-400">
              No thumbnail
            </div>
          )}
          {value ? (
            <button
              type="button"
              aria-label="Remove thumbnail"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600"
              onClick={() => onChange("")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => onFile(e.target.files?.[0] || null)}
          />
          <Button
            type="button"
            variant="outline"
            className="min-h-10 justify-start"
            disabled={uploading}
            onClick={() => {
              if (!firebaseReady) {
                setError(
                  "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to .env.local."
                );
                return;
              }
              fileRef.current?.click();
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? "Uploading…" : "Upload image"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="min-h-10 justify-start"
            onClick={() => setShowUrl((v) => !v)}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Paste image URL
          </Button>
        </div>
      </div>
      {showUrl ? (
        <div className="flex gap-2">
          <Input
            className="min-h-10"
            placeholder="https://… (image)"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <Button
            type="button"
            className="min-h-10 shrink-0"
            onClick={() => {
              if (!draft.trim()) return;
              onChange(draft.trim());
              setDraft("");
              setShowUrl(false);
            }}
          >
            Set
          </Button>
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
