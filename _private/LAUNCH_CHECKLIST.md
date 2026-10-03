# SolarSizer — Launch Checklist

Site files: `HermesVault/40-Content/sites/solarsizer/`
Target URL: `https://solar-sizer.com/` (GitHub Pages)
Source pattern: `HermesVault/40-Content/sites/generatorsizer/` (same site network as GeneratorSizer / Battery Bank Sizer).

## 0. Pre-launch (before anything public)
- [ ] Jeremy approves publish (charter human gate — no live URL without his yes)
- [ ] Final domain is set in: sitemap.xml, robots.txt, and each page's canonical + og:url (search `jpanasuk-netizen.github.io/solarsizer` across files); update if a custom domain (e.g. solarsizer.pro) is later purchased
- [ ] Verify load/wattage and sun-hour figures against current NREL/DOE and manufacturer sources (figures are 2026-typical published values)
- [ ] Decide affiliate monetization timing — apply to programs BEFORE adding real links; placeholder slots are marked `<!-- AFFILIATE SLOT -->` in index.html and both articles

## 1. Hosting — GitHub Pages ($0)
- [ ] Create repo `jpanasuk-netizen/solarsizer` (public), push the site folder contents to `main`
- [ ] Settings → Pages → Deploy from branch: `main` / root → confirm green URL `jpanasuk-netizen.github.io/solarsizer/`
- [ ] If buying solarsizer.pro: registrar (Namecheap/Porkbun), then repo Settings → Pages → Custom domain → `solarsizer.pro`, DNS: A records for apex (185.199.108-111.153) + CNAME www → jpanasuk-netizen.github.io, enable "Enforce HTTPS"
- [ ] Optional: mirror to Hugging Face Space `jpanasuk/solarsizer` (sdk: static) — matches the existing packet-twin pattern

## 2. Search Console
- [ ] Verify the github.io URL via HTML file (or DNS TXT if solarsizer.pro is purchased)
- [ ] Submit `sitemap.xml`
- [ ] URL Inspection → Request indexing on all 3 pages
- [ ] Week 2: check Coverage + Performance; then submit to Bing Webmaster Tools (imports GSC property in 2 clicks)

## 3. Affiliate programs (apply in this order)
- [ ] **Solar kit affiliate programs** — high payouts ($50–200): e.g. ShopSolar, Unbound Solar, Renogy, ACOPOWER; check terms with Jeremy before signing
- [ ] **Amazon Associates** — panels, LiFePO4 batteries, MPPT controllers, pure-sine inverters; needs 3 qualifying sales in 180 days to stick; keep disclosure paragraph on pages
- [ ] Later: AdSense once organic traffic exists (~20+ sessions/day)

## 4. Distribution (per NICHE_SITES_PLAN 2-engine model)
- [ ] r/solar, r/OffGridCabins, r/OffGrid, r/SolarDIY: answer 2–3 sizing threads/week with genuinely useful replies; link the calculator only when it's actually the tool for the question
- [ ] Cross-link: add a "SolarSizer ↗" line to the battery-bank-sizer index + llms.txt AFTER this site is live (reciprocal, not orphan)
- [ ] Update battery-bank-sizer llms.txt "Coming pages" to point the solar page at this hub

## 5. Post-launch QA
- [ ] Test all 4 calculator tabs on a phone (mobile-first build; verify load-row grid at 375px)
- [ ] Rich Results Test: SoftwareApplication + FAQPage validate
- [ ] Lighthouse mobile ≥ 95 perf (static site, single CSS/JS — should pass clean)
- [ ] Confirm no affiliate links ship before program approval (slots are placeholders by design)
