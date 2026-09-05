"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { plotAdminSchema, type Plot } from "@/lib/schemas/plot";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MediaUrlEditor,
  ThumbnailImageField,
} from "@/components/admin/media-url-editor";
import { HISTORY_LIMIT } from "@/lib/content/paths";
import {
  findPlotSlugConflict,
  slugify,
  type PlotSlugRef,
} from "@/lib/admin/slugs";
import {
  arrayFieldError,
  fieldError,
  flattenFormErrors,
} from "@/lib/admin/form-errors";
import { cn } from "@/lib/utils";

type PlotFormValues = Plot;

const emptyPlot = (): PlotFormValues => ({
  id: 0,
  title: "",
  slug: "",
  area: "",
  location: "",
  guests: "",
  price: "",
  description: "",
  phone: "",
  features: [],
  images: [],
  media: [],
  coordinates: { latitude: "", longitude: "" },
});

function slugConflictMessage(conflict: PlotSlugRef | undefined) {
  if (!conflict) return "This slug is already used";
  return `This slug is already used (area: ${conflict.area})`;
}

export function PlotEditor({
  initial,
  historyCount = 0,
  isNew = false,
  existingPlots = [],
}: {
  initial?: Plot;
  historyCount?: number;
  isNew?: boolean;
  existingPlots?: PlotSlugRef[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [histCount, setHistCount] = useState(historyCount);
  const [slugManual, setSlugManual] = useState(!isNew);
  const [featuresText, setFeaturesText] = useState(
    (initial?.features || []).join("\n")
  );
  const [openSections, setOpenSections] = useState<string[]>([
    "images",
    "coords",
  ]);

  const schema = useMemo(
    () =>
      plotAdminSchema.superRefine((data, ctx) => {
        const conflict = findPlotSlugConflict(
          existingPlots,
          data.slug,
          data.id || 0
        );
        if (conflict) {
          ctx.addIssue({
            code: "custom",
            message: slugConflictMessage(conflict),
            path: ["slug"],
          });
        }
      }),
    [existingPlots]
  );

  const form = useForm<PlotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? emptyPlot(),
    mode: "onBlur",
  });

  const images = form.watch("images");
  const media = form.watch("media");
  const title = form.watch("title");
  const slug = form.watch("slug");
  const { errors } = form.formState;
  const suggestedSlug = slugify(title || "");
  const slugConflict = findPlotSlugConflict(
    existingPlots,
    slug || "",
    initial?.id || 0
  );
  const slugTaken = Boolean(slugConflict);

  function revealInvalid(fieldErrors: FieldErrors<PlotFormValues>) {
    const messages = flattenFormErrors(
      fieldErrors as unknown as Record<string, unknown>
    );
    setStatus(
      messages.length
        ? messages.join(" · ")
        : "Please fix the highlighted fields before saving."
    );

    const next = new Set(openSections);
    if (fieldErrors.images) next.add("images");
    if (fieldErrors.media) next.add("media");
    if (fieldErrors.coordinates) next.add("coords");
    if (fieldErrors.host) next.add("host");
    setOpenSections(Array.from(next));

    requestAnimationFrame(() => {
      document
        .querySelector("[data-field-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  async function save(values: PlotFormValues) {
    setStatus("");
    const conflict = findPlotSlugConflict(
      existingPlots,
      values.slug,
      values.id || 0
    );
    if (conflict) {
      const message = slugConflictMessage(conflict);
      setStatus(message);
      form.setError("slug", { message });
      return;
    }

    const features = featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const hostName = values.host?.name?.trim();
    const hostImage = values.host?.imageUrl?.trim();
    const hostDate = values.host?.listingDate?.trim();
    const host =
      hostName || hostImage || hostDate
        ? {
            name: hostName || "",
            imageUrl: hostImage || "",
            isPremier: values.host?.isPremier,
            listingDate: hostDate || undefined,
          }
        : undefined;

    const payload = {
      ...values,
      features,
      host,
      slug: values.slug || slugify(values.title),
      images: (values.images || []).filter((u) => u.trim()),
      media: (values.media || []).filter((m) => m.url?.trim()),
    };

    const res = await fetch(
      isNew ? "/api/admin/plots" : `/api/admin/plots/${values.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isNew ? (({ id, ...rest }) => rest)(payload) : payload
        ),
      }
    );
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Save failed");
      return;
    }
    setStatus("Saved (Publish to refresh public site)");
    if (typeof data.historyCount === "number") setHistCount(data.historyCount);
    if (isNew) {
      router.push(`/admin/plots/${data.plot.id}`);
      router.refresh();
    } else {
      form.reset(data.plot);
      router.refresh();
    }
  }

  async function rollback() {
    if (!initial) return;
    setStatus("");
    const res = await fetch(`/api/admin/plots/${initial.id}/rollback`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Rollback failed");
      return;
    }
    form.reset(data.plot);
    setFeaturesText((data.plot.features || []).join("\n"));
    setHistCount(data.historyCount);
    setStatus("Rolled back to previous save");
    router.refresh();
  }

  async function remove() {
    if (!initial) return;
    if (!confirm("Move this plot to trash?")) return;
    const res = await fetch(`/api/admin/plots/${initial.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Delete failed");
      return;
    }
    router.push("/admin/plots");
    router.refresh();
  }

  const imagesError = arrayFieldError(
    errors as Record<string, unknown>,
    "images"
  );
  const slugError =
    errors.slug?.message ||
    (slugTaken ? slugConflictMessage(slugConflict) : undefined);

  return (
    <form
      onSubmit={form.handleSubmit(save, revealInvalid)}
      className="space-y-4 pb-28"
      noValidate
    >
      <p className="text-sm text-stone-600">
        Fields marked <span className="text-red-600">*</span> are required.
      </p>

      <Field label="Title" required error={errors.title?.message}>
        <Input
          className="min-h-11"
          placeholder="e.g. Sea Nest Villa"
          value={title}
          onChange={(e) => {
            const nextTitle = e.target.value;
            form.setValue("title", nextTitle, { shouldValidate: true });
            if (!slugManual) {
              form.setValue("slug", slugify(nextTitle), {
                shouldValidate: true,
              });
            }
          }}
          onBlur={() => form.trigger("title")}
        />
      </Field>
      <Field
        label="Slug"
        required
        hint={
          slugTaken
            ? undefined
            : suggestedSlug
              ? `Suggested from title: ${suggestedSlug}`
              : "Lowercase letters, numbers, hyphens"
        }
        error={slugError}
      >
        <div className="space-y-2">
          <Input
            className="min-h-11"
            value={slug}
            onChange={(e) => {
              setSlugManual(true);
              const raw = e.target.value;
              form.setValue("slug", slugify(raw) || raw, {
                shouldValidate: true,
              });
            }}
            onBlur={() => form.trigger("slug")}
          />
          {slugManual && suggestedSlug && suggestedSlug !== slug ? (
            <Button
              type="button"
              variant="outline"
              className="min-h-9 text-xs"
              onClick={() => {
                setSlugManual(false);
                form.setValue("slug", suggestedSlug, { shouldValidate: true });
              }}
            >
              Use suggested: {suggestedSlug}
            </Button>
          ) : null}
        </div>
      </Field>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Area" required error={errors.area?.message}>
          <Input
            className="min-h-11"
            placeholder="e.g. Ratnagiri"
            {...form.register("area")}
          />
        </Field>
        <Field label="Location" required error={errors.location?.message}>
          <Input
            className="min-h-11"
            placeholder="e.g. Ratnagiri"
            {...form.register("location")}
          />
        </Field>
        <Field
          label="Guests"
          required
          hint="Whole number, e.g. 8"
          error={errors.guests?.message}
        >
          <Input
            className="min-h-11"
            inputMode="numeric"
            {...form.register("guests")}
          />
        </Field>
        <Field
          label="Price"
          required
          hint="Must include a number, e.g. ₹4,000"
          error={errors.price?.message}
        >
          <Input className="min-h-11" {...form.register("price")} />
        </Field>
      </div>
      <Field
        label="Phone"
        required
        hint="8–15 digits"
        error={errors.phone?.message}
      >
        <Input
          className="min-h-11"
          inputMode="tel"
          placeholder="9834069861"
          {...form.register("phone")}
        />
      </Field>
      <Field
        label="Description"
        required
        hint="At least 20 characters"
        error={errors.description?.message}
      >
        <Textarea className="min-h-32" {...form.register("description")} />
      </Field>
      <Field label="Features" hint="Optional — one per line">
        <Textarea
          className="min-h-28"
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
        />
      </Field>

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="rounded-xl border bg-white px-3"
      >
        <AccordionItem value="images">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Images <span className="text-red-600">*</span>
              {imagesError ? (
                <span className="text-xs font-normal text-red-600">
                  Needs attention
                </span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div data-field-invalid={imagesError ? "true" : undefined}>
              <MediaUrlEditor
                urls={images}
                folder="plots"
                accept="image/*"
                onChange={(urls) =>
                  form.setValue("images", urls, { shouldValidate: true })
                }
              />
            </div>
            {imagesError ? (
              <p className="text-sm text-red-600">{imagesError}</p>
            ) : (
              <p className="text-xs text-stone-500">
                At least one image required.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="media">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Videos
              {errors.media ? (
                <span className="text-xs font-normal text-red-600">
                  Needs attention
                </span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <p className="text-xs text-stone-500">Optional.</p>
            <MediaUrlEditor
              urls={(media || []).map((m) => m.url).filter(Boolean)}
              previewUrls={(media || [])
                .filter((m) => m.url)
                .map((m) => m.thumbnail)}
              folder="plots"
              accept="video/*"
              onChange={(urls) => {
                const byUrl = new Map(
                  (media || []).map((m) => [m.url, m] as const)
                );
                form.setValue(
                  "media",
                  urls.map((url) => {
                    const existing = byUrl.get(url);
                    return {
                      type: "video" as const,
                      url,
                      thumbnail: existing?.thumbnail || "",
                    };
                  }),
                  { shouldValidate: true }
                );
              }}
            />
            {(media || [])
              .filter((m) => m.url)
              .map((item, index) => (
                <ThumbnailImageField
                  key={`${item.url}-thumb-${index}`}
                  label={`Thumbnail for video ${index + 1}`}
                  value={item.thumbnail || ""}
                  folder="plots"
                  onChange={(thumbnail) => {
                    const next = [...(media || [])];
                    const realIndex = (media || []).findIndex(
                      (m) => m.url === item.url
                    );
                    if (realIndex < 0) return;
                    next[realIndex] = {
                      ...next[realIndex],
                      thumbnail,
                    };
                    form.setValue("media", next, { shouldValidate: true });
                  }}
                />
              ))}
            {arrayFieldError(errors as Record<string, unknown>, "media") ? (
              <p className="text-sm text-red-600">
                {arrayFieldError(errors as Record<string, unknown>, "media")}
              </p>
            ) : null}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="coords">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Coordinates <span className="text-red-600">*</span>
              {errors.coordinates ? (
                <span className="text-xs font-normal text-red-600">
                  Needs attention
                </span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent className="grid gap-3 sm:grid-cols-2">
            <p className="text-xs text-stone-500 sm:col-span-2">
              Plain numbers are fine — ° N / ° E are assumed if omitted.
            </p>
            <Field
              label="Latitude"
              required
              hint="e.g. 17.1045 or 17.1045° N"
              error={fieldError(
                errors as Record<string, unknown>,
                "coordinates.latitude"
              )}
            >
              <Input
                className="min-h-11"
                {...form.register("coordinates.latitude")}
              />
            </Field>
            <Field
              label="Longitude"
              required
              hint="e.g. 73.2906 or 73.2906° E"
              error={fieldError(
                errors as Record<string, unknown>,
                "coordinates.longitude"
              )}
            >
              <Input
                className="min-h-11"
                {...form.register("coordinates.longitude")}
              />
            </Field>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="host">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Host{" "}
              <span className="text-xs font-normal text-stone-500">
                (optional)
              </span>
              {errors.host ? (
                <span className="text-xs font-normal text-red-600">
                  Needs attention
                </span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <p className="text-xs text-stone-500">
              Skip this section if you do not want to show a host.
            </p>
            <Field
              label="Host name"
              hint="Optional"
              error={fieldError(errors as Record<string, unknown>, "host.name")}
            >
              <Input className="min-h-11" {...form.register("host.name")} />
            </Field>
            <ThumbnailImageField
              label="Host photo (optional)"
              value={form.watch("host.imageUrl") || ""}
              folder="plots"
              onChange={(imageUrl) => {
                form.setValue("host.imageUrl", imageUrl, {
                  shouldValidate: true,
                });
              }}
            />
            <Field
              label="Listing date"
              hint="Optional"
              error={fieldError(
                errors as Record<string, unknown>,
                "host.listingDate"
              )}
            >
              <Input
                className="min-h-11"
                type="date"
                {...form.register("host.listingDate")}
              />
            </Field>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
          <Button type="submit" className="min-h-11 flex-1">
            Save
          </Button>
          {!isNew ? (
            <Button
              type="button"
              variant="outline"
              className="min-h-11"
              disabled={histCount <= 0}
              onClick={rollback}
            >
              Rollback ({histCount}/{HISTORY_LIMIT})
            </Button>
          ) : null}
          {!isNew ? (
            <Button
              type="button"
              variant="destructive"
              className="min-h-11"
              onClick={remove}
            >
              Delete
            </Button>
          ) : null}
        </div>
        {status ? (
          <p
            className={`mx-auto mt-2 max-w-3xl text-sm ${
              status.startsWith("Please fix") ||
              status.includes("failed") ||
              status.includes("already used") ||
              status.includes("required") ||
              status.includes("must") ||
              status.includes("valid") ||
              status.includes("Add at least")
                ? "text-red-600"
                : "text-stone-600"
            }`}
          >
            {status}
          </p>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  required,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
  error?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-1.5",
        error &&
          "[&_input]:border-red-500 [&_textarea]:border-red-500 [&_button]:border-red-500"
      )}
      data-field-invalid={error ? "true" : undefined}
    >
      <Label>
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </Label>
      {children}
      {hint && !error ? (
        <p className="text-xs text-stone-500">{hint}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
