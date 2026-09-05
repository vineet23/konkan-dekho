"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  experienceAdminSchema,
  type Experience,
  type ExperienceCategory,
} from "@/lib/schemas/experience";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MediaUrlEditor } from "@/components/admin/media-url-editor";
import { HISTORY_LIMIT } from "@/lib/content/paths";
import {
  isExperienceSlugTaken,
  slugify,
  type ExperienceSlugRef,
} from "@/lib/admin/slugs";
import {
  arrayFieldError,
  fieldError,
  flattenFormErrors,
} from "@/lib/admin/form-errors";
import { cn } from "@/lib/utils";

const categories: ExperienceCategory[] = [
  "beach",
  "temples",
  "adventure",
  "nature",
  "culture",
  "scenic",
];

type FormValues = Experience;

const emptyExperience = (): FormValues => ({
  id: 0,
  name: "",
  slug: "",
  description: "",
  rate: "",
  guideline: "",
  language: [],
  photos: [],
  location: "",
  phone: "",
  category: "nature",
  coordinates: { latitude: "", longitude: "" },
});

export function ExperienceEditor({
  initial,
  historyCount = 0,
  isNew = false,
  existingExperiences = [],
}: {
  initial?: Experience;
  historyCount?: number;
  isNew?: boolean;
  existingExperiences?: ExperienceSlugRef[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [histCount, setHistCount] = useState(historyCount);
  const [slugManual, setSlugManual] = useState(!isNew);
  const [languageText, setLanguageText] = useState(
    Array.isArray(initial?.language)
      ? initial!.language.join(", ")
      : String(initial?.language || "")
  );
  const [openSections, setOpenSections] = useState<string[]>(["photos"]);

  const schema = useMemo(
    () =>
      experienceAdminSchema.superRefine((data, ctx) => {
        if (
          isExperienceSlugTaken(
            existingExperiences,
            data.slug,
            data.id || 0
          )
        ) {
          ctx.addIssue({
            code: "custom",
            message: "This slug is already used",
            path: ["slug"],
          });
        }
      }),
    [existingExperiences]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ?? emptyExperience(),
    mode: "onBlur",
  });

  const photos = form.watch("photos");
  const name = form.watch("name");
  const slug = form.watch("slug");
  const { errors } = form.formState;
  const suggestedSlug = slugify(name || "");
  const slugTaken = isExperienceSlugTaken(
    existingExperiences,
    slug || "",
    initial?.id || 0
  );

  function revealInvalid(fieldErrors: FieldErrors<FormValues>) {
    const messages = flattenFormErrors(
      fieldErrors as unknown as Record<string, unknown>
    );
    setStatus(
      messages.length
        ? messages.join(" · ")
        : "Please fix the highlighted fields before saving."
    );

    const next = new Set(openSections);
    if (fieldErrors.photos) next.add("photos");
    if (fieldErrors.coordinates) next.add("coords");
    setOpenSections(Array.from(next));

    requestAnimationFrame(() => {
      document
        .querySelector("[data-field-invalid='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  async function save(values: FormValues) {
    setStatus("");
    if (
      isExperienceSlugTaken(
        existingExperiences,
        values.slug,
        values.id || 0
      )
    ) {
      setStatus("This slug is already used.");
      form.setError("slug", {
        message: "This slug is already used",
      });
      return;
    }

    const language = languageText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const payload: Experience = {
      ...values,
      language,
      slug: values.slug || slugify(values.name),
      photos: (values.photos || []).filter((u) => u.trim()),
      coordinates:
        values.coordinates?.latitude?.trim() ||
        values.coordinates?.longitude?.trim()
          ? values.coordinates
          : undefined,
    };

    const res = await fetch(
      isNew
        ? "/api/admin/experiences"
        : `/api/admin/experiences/${values.id}`,
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
      router.push(`/admin/experiences/${data.experience.id}`);
      router.refresh();
    } else {
      form.reset(data.experience);
      router.refresh();
    }
  }

  async function rollback() {
    if (!initial) return;
    const res = await fetch(`/api/admin/experiences/${initial.id}/rollback`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Rollback failed");
      return;
    }
    form.reset(data.experience);
    setLanguageText(
      Array.isArray(data.experience.language)
        ? data.experience.language.join(", ")
        : String(data.experience.language || "")
    );
    setHistCount(data.historyCount);
    setStatus("Rolled back to previous save");
    router.refresh();
  }

  async function remove() {
    if (!initial) return;
    if (!confirm("Move this experience to trash?")) return;
    const res = await fetch(`/api/admin/experiences/${initial.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Delete failed");
      return;
    }
    router.push("/admin/experiences");
    router.refresh();
  }

  const photosError = arrayFieldError(
    errors as Record<string, unknown>,
    "photos"
  );

  return (
    <form
      onSubmit={(e) => {
        const language = languageText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        form.setValue("language", language, { shouldValidate: false });
        void form.handleSubmit(
          (values) => save({ ...values, language }),
          revealInvalid
        )(e);
      }}
      className="space-y-4 pb-28"
      noValidate
    >
      <p className="text-sm text-stone-600">
        Fields marked <span className="text-red-600">*</span> are required.
      </p>

      <Field label="Name" required error={errors.name?.message}>
        <Input
          className="min-h-11"
          value={name}
          onChange={(e) => {
            const nextName = e.target.value;
            form.setValue("name", nextName, { shouldValidate: true });
            if (!slugManual) {
              form.setValue("slug", slugify(nextName), {
                shouldValidate: true,
              });
            }
          }}
          onBlur={() => form.trigger("name")}
        />
      </Field>
      <Field
        label="Slug"
        required
        hint={
          slugTaken
            ? undefined
            : suggestedSlug
              ? `Suggested from name: ${suggestedSlug}`
              : "Lowercase letters, numbers, hyphens"
        }
        error={
          errors.slug?.message ||
          (slugTaken ? "This slug is already used" : undefined)
        }
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
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Location" required error={errors.location?.message}>
          <Input className="min-h-11" {...form.register("location")} />
        </Field>
        <Field
          label="Phone"
          hint="Optional — 8–15 digits if set"
          error={errors.phone?.message}
        >
          <Input
            className="min-h-11"
            inputMode="tel"
            {...form.register("phone")}
          />
        </Field>
        <Field
          label="Rate"
          hint="Blank, Free, or include a number"
          error={
            typeof errors.rate?.message === "string"
              ? errors.rate.message
              : undefined
          }
        >
          <Input className="min-h-11" {...form.register("rate")} />
        </Field>
        <Field label="Category" required>
          <Select
            value={form.watch("category")}
            onValueChange={(v) =>
              form.setValue("category", v as ExperienceCategory, {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger className="min-h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field
        label="Languages"
        required
        hint="Comma separated, e.g. English, Marathi"
        error={
          typeof errors.language?.message === "string"
            ? errors.language.message
            : fieldError(errors as Record<string, unknown>, "language")
        }
      >
        <Input
          className="min-h-11"
          value={languageText}
          onChange={(e) => {
            setLanguageText(e.target.value);
            form.setValue(
              "language",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
              { shouldValidate: true }
            );
          }}
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
      <Field label="Guideline" hint="Optional">
        <Textarea className="min-h-24" {...form.register("guideline")} />
      </Field>

      <Accordion
        type="multiple"
        value={openSections}
        onValueChange={setOpenSections}
        className="rounded-xl border bg-white px-3"
      >
        <AccordionItem value="photos">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Photos <span className="text-red-600">*</span>
              {photosError ? (
                <span className="text-xs font-normal text-red-600">
                  Needs attention
                </span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <div data-field-invalid={photosError ? "true" : undefined}>
              <MediaUrlEditor
                urls={photos}
                folder="experiences"
                accept="image/*"
                onChange={(urls) =>
                  form.setValue("photos", urls, { shouldValidate: true })
                }
              />
            </div>
            {photosError ? (
              <p className="text-sm text-red-600">{photosError}</p>
            ) : (
              <p className="text-xs text-stone-500">
                At least one photo required.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="coords">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Coordinates
              {errors.coordinates ? (
                <span className="text-xs font-normal text-red-600">
                  Needs attention
                </span>
              ) : null}
            </span>
          </AccordionTrigger>
          <AccordionContent className="grid gap-3 sm:grid-cols-2">
            <p className="text-xs text-stone-500 sm:col-span-2">
              Optional. Plain numbers are fine — ° N / ° E are assumed if
              omitted. If you set one, provide both.
            </p>
            <Field
              label="Latitude"
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
              status.includes("required") ||
              status.includes("valid") ||
              status.includes("already used") ||
              status.includes("must") ||
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
