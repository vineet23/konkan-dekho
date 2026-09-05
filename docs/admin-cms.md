# Admin CMS — architecture notes

For partner review. **Host: Vercel.** **Content: Firebase Storage.**

---

## Goals

- Edit **plots** and **experiences** without changing TypeScript hand-data.
- Keep the public site mostly static / on-demand ISR (cheap, fast).
- Durable content on Firebase (works on Vercel serverless; no local disk in prod).

---

## High-level flow

```
Admin Save  →  write JSON to Firebase Storage
Admin Publish  →  revalidatePath on Vercel (public pages refresh)
Public pages  →  read JSON from Firebase (or local content/ in dev)
```

| Action | What happens |
| --- | --- |
| **Save** | Validates with Zod → writes `plots` / `experiences` (and history/trash) to Firebase when Admin is configured |
| **Publish** | `revalidatePath` so Vercel regenerates cached pages from fresh Firebase JSON |
| **Media** | Uploads via `/api/admin/upload` (Firebase Admin SDK) or paste URL |

Optional: if `NETLIFY_BUILD_HOOK_URL` is set, Publish also POSTs it (soft-fail; Vercel revalidate is primary).

---

## Where content lives

### Local development

- Default: `content/` on disk when Firebase Admin is **not** set.
- With Admin + `NEXT_PUBLIC_FIREBASE_*`: same as prod (Firebase Storage).
- Seed: `npm run seed:content`
- First sync to Storage: `npm run push:content`

### Production (Vercel)

- Firebase Storage keys:
  - `content/plots.json`
  - `content/experiences.json`
  - `content/trash/*.json`
  - `content/history/...`
- Set Firebase Admin env on the Vercel project so build and runtime both read Storage.

`lib/content/store.ts`:

1. Firebase Admin configured → Firebase Storage  
2. Else → local `content/`

---

## Publish on Vercel

`/api/admin/publish` calls `revalidatePath` on the site layout and main listing routes.

After Publish, the **next visitor** gets pages rebuilt from Firebase. No full project redeploy required.

Save does **not** revalidate — only **Publish** does.

---

## Auth

- `ADMIN_PASSWORD` + signed cookie (`ADMIN_SESSION_SECRET`).
- Admin UI: `/admin/*`
- APIs: `/api/admin/*` via `withAdmin`.
- Media and content writes use **Firebase Admin** on the server (not open Storage rules).

---

## Env checklist

See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` | Admin login |
| `NEXT_PUBLIC_FIREBASE_*` | Client config / bucket name |
| `FIREBASE_SERVICE_ACCOUNT_JSON` or `_BASE64` | Server content + uploads |
| `NETLIFY_BUILD_HOOK_URL` | Optional legacy hook (ignored if unset) |

**Vercel:** set admin + Firebase vars on the project. Redeploy after changing env.

---

## Cost (ballpark)

- Firebase Storage for JSON + existing media: free / very cheap at our scale.
- Vercel: hosting + on-demand revalidation (no rebuild-per-publish required).

---

## Operator playbook

1. `/admin/login`
2. Edit → **Save** (Firebase Storage)
3. **Publish** (Vercel cache revalidate)
4. Hard-refresh public pages

---

## Key files

| Area | Path |
| --- | --- |
| Content I/O | `lib/content/store.ts`, `plots.ts`, `experiences.ts` |
| Firebase Admin | `lib/firebase/admin.ts` |
| Uploads | `app/api/admin/upload/route.ts`, `lib/firebase/client.ts` |
| Publish | `app/api/admin/publish/route.ts` |
| Push seed | `scripts/push-content-firebase.ts` |
