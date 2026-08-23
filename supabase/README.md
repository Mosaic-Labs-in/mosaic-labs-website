# Inquiry form → Supabase

Both sites write to the same `public.inquiries` table. The `source` column
records which one a row came from (`website-4` or `website-5`).

## 1. Create the table

Open the Supabase dashboard → **SQL Editor** → **New query**, paste
[`schema.sql`](./schema.sql), and run it.

The table has RLS on with a single `insert` policy. There is no `select`
policy, so the anon key can write inquiries but cannot read anyone's back.
Read submissions in the dashboard under **Table Editor → inquiries**.

## 2. Add the env vars

Both values come from **Project Settings → API**. The anon key is designed to
ship in the browser bundle — it is not a secret. Never put the *service role*
key in either of these files.

`Mosaic-Website-4/.env.local` (Next.js):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
```

`Mosaic-Website-4/website-5/.env.local` (Vite):

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon public key>
```

Restart the dev server after adding them — neither bundler picks up new env
vars on hot reload.

Without the vars the form still validates and submits, but instead of writing
a row it surfaces a "not connected yet" message with a pre-filled mailto to
contact@mosaiclabs.in, so nothing is silently lost.

## 3. Get notified of new rows (optional)

Database → **Webhooks** → new hook on `inquiries` / `INSERT`, pointed at
whatever you use for alerts (Slack, Resend, a Zap). Nothing in the site code
depends on it.
