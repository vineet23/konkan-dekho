# Admin CMS — architecture notes

For partner review. This describes how content management works in this repo and how it fits **Netlify + Firebase**.

---

## Goals

- Edit **plots** and **experiences** without changing TypeScript hand-data.
- Keep the public site mostly static/ISR (cheap, fast).
- Survive Netlify hosting (no durable local disk; Vercel Blob is not our primary store).

---

## High-level flow

```
Admin Save  →  write JSON to store
Admin Publish  →  refresh public site
Public pages  →  read JSON from store at build / request time
```

| Action | What happens |
| --- | --- |
| **Save** | Validates with Zod → writes `plots` / `experiences` (and history/trash) |
| **Publish** | Best-effort `revalidatePath` + **Netlify build hook** (if configured) |
| **Media** | Images/videos upload to **Firebase Storage** (client SDK) or paste URL |

---

## Where content lives

### Local development (default)

- Files under `content/` (`plots.json`, `experiences.json`, trash, history).
- Used when **Firebase Admin is not configured**.
- Seed: `npm run seed:content` (from `lib/data/*`).
- Day-to-day: edit via `/admin`, inspect diffs in `content/`.

### Production (Netlify)

- Same logical keys, stored as files in **Firebase Storage**:
  - `content/plots.json`
  - `content/experiences.json`
  - `content/trash/*.json`
  - `content/history/...`
- Used when **Firebase Admin** env is set (`FIREBASE_SERVICE_ACCOUNT_JSON` or `_BASE64` + storage bucket).
- First-time / sync from local: `npm run push:content`.

`lib/content/store.ts` chooses the backend:

1. Firebase Admin configured → Firebase Storage  
2. Else → local `content/` disk  

*(Older Vercel Blob path was removed in favor of Firebase for Netlify.)*

---

## Why not only `revalidatePath`?

`/api/admin/publish` still calls `revalidatePath` (Next on-demand cache bust).

On **Vercel**, that often refreshes ISR pages in place.

On **Netlify**, many pages are effectively **build-time static**. Relying only on revalidate is unreliable. So Publish also:

```http
POST $NETLIFY_BUILD_HOOK_URL
```

That starts a **production rebuild**. During the build, the app reads the latest JSON from Firebase Storage, then Netlify deploys. Live site updates in a few minutes.

| Mechanism | Role on Netlify |
| --- | --- |
| `revalidatePath` | Best-effort, may help little |
| **Build hook** | Source of truth for “make the public site match Storage” |

Save does **not** trigger a rebuild — only **Publish** does (when the hook env is set).

---

## Auth

- Simple password login: `ADMIN_PASSWORD` + signed session cookie (`ADMIN_SESSION_SECRET`).
- Admin UI: `/admin/*`
- APIs: `/api/admin/*` wrapped with `withAdmin`.

Not Firebase Auth for CMS operators (media uploads use the public Firebase client config; content JSON writes use the **Admin service account** on the server).

---

## Validation & UX

- Zod schemas: `lib/schemas/plot.ts`, `lib/schemas/experience.ts` (+ shared `validators.ts`).
- Slug uniqueness (plots: slug globally unique in admin checks).
- Coordinates: plain numbers OK; `° N` / `° E` optional.
- Field errors + summary under Save; accordions open to invalid sections.

---

## Env checklist

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | Admin login |
| `NEXT_PUBLIC_FIREBASE_*` | Browser uploads + bucket name |
| `FIREBASE_SERVICE_ACCOUNT_JSON` or `_BASE64` | Server read/write of content JSON |
| `NETLIFY_BUILD_HOOK_URL` | Publish → Netlify rebuild |

**Netlify:** set the above on the site env (production).  
**Local:** usually omit service account + hook; use `content/`.

Build hook: Netlify → Project configuration → Build & deploy → Build hooks → branch `main` (or your prod branch).

---

## Cost (ballpark)

- Firebase Storage for ~hundreds of KB of JSON: effectively free at our scale.
- Existing media already on Firebase; same project.
- Publish rebuilds consume **Netlify** build minutes/credits — main variable if you publish often.

---

## Operator playbook

1. `/admin/login`
2. Edit plot/experience → **Save** (writes store)
3. **Publish** (Netlify rebuild if hook set)
4. Wait for Netlify deploy → verify public pages

Rollback / trash: per-item history (5 deep) and trash restore in admin.

---

## Key files

| Area | Path |
| --- | --- |
| Content I/O | `lib/content/store.ts`, `plots.ts`, `experiences.ts` |
| Firebase Admin | `lib/firebase/admin.ts` |
| Firebase client uploads | `lib/firebase/client.ts` |
| Publish API | `app/api/admin/publish/route.ts` |
| Admin UI | `components/admin/*`, `app/admin/*` |
| Push local → Storage | `scripts/push-content-firebase.ts` |
| Seed local JSON | `scripts/seed-content.ts` |

---

## Open / follow-ups

- Ensure Netlify build has Firebase Admin env so **build-time** `getPlots()` reads Storage (not empty fallback).
- Disconnect unused **Vercel** Git integration if Netlify is the only host (avoids duplicate failing checks).
- Optional later: Netlify Blobs instead of Firebase JSON, or Firestore documents instead of whole-file JSON.
