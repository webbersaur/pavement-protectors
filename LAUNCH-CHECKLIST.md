# Pavement Protectors — Launch Checklist

Migrating pavement-protectors.com from the **legacy Rails CMS** (`/page/NNNNN-Name` URLs) to this **static rebuild on Vercel**.

## Status: wired up, NOT yet cut over

The new site is live on Vercel but the **custom domain still points at the legacy CMS**. Cutover (DNS) is the only remaining step and is deliberate — it takes the old site offline.

### Done
- [x] Vercel project `pavement-protectors` (team: *chris' projects*) created
- [x] Deployed → **https://pavement-protectors.vercel.app**
- [x] GitHub `webbersaur/pavement-protectors` connected → push to `main` auto-deploys
- [x] `vercel.json` redirects verified (308 permanent) for every legacy `/page/NNNNN-*` URL → new page; `/page/*` catch-all → home
- [x] `sitemap.xml` (clean .html URLs + image entries), `robots.txt`, `llms.txt`
- [x] Self-referencing canonicals on all pages
- [x] `LocalBusiness` JSON-LD (homepage) + `Service` schema (commercial page) sharing one `@id`

## Cutover (domain switch) — do deliberately

> ⚠️ This points the domain away from the legacy Rails host; the old CMS goes dark once DNS propagates. Confirm you have DNS/registrar access first.

1. Vercel → Project `pavement-protectors` → **Settings → Domains** → add `pavement-protectors.com` **and** `www.pavement-protectors.com`.
2. Pick the canonical host — **recommend apex (non-www)** since the current Google index uses `https://pavement-protectors.com`. Set the other to redirect to it.
3. Update DNS at the registrar using the **exact records Vercel shows** in Settings → Domains (typically an A record for the apex and a CNAME `cname.vercel-dns.com` for `www` — use Vercel's displayed values, they change over time).
4. Wait for DNS propagation + automatic SSL issuance (minutes–hours).

## Post-cutover verification
- [ ] `https://pavement-protectors.com/` serves the **new** site (look for the "Commercial" nav item, not the legacy layout)
- [ ] `https://pavement-protectors.com/commercial-sealcoating.html` → 200
- [ ] `curl -I https://pavement-protectors.com/page/24790-Services` → 308 → `/services.html` (spot-check 2–3 legacy URLs)
- [ ] HTTPS valid, no mixed-content warnings
- [ ] www vs non-www both resolve and collapse to the chosen canonical

## Google Search Console
- [ ] Confirm/verify the `pavement-protectors.com` property
- [ ] Submit `https://pavement-protectors.com/sitemap.xml`
- [ ] URL Inspection → Request indexing for: `/`, `/commercial-sealcoating.html`, `/services.html`
- [ ] Over 2–4 weeks: watch legacy `/page/*` URLs drop out and new URLs get indexed
- [ ] **No "Change of Address"** is needed — same domain, only the platform/URLs changed (that tool is only for moving between domains)

## Notes
- Redirects are **308** (Vercel's permanent redirect); Google treats 308 == 301 for passing ranking equity.
- External backlinks to legacy `/page/*` URLs will carry over via the 308s.
- Legacy URL → new page map lives in `vercel.json`.
