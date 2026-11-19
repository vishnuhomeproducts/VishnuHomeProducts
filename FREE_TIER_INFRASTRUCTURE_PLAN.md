# Vishnu Home Products — Free-Tier Infrastructure & Global Scaling Plan

> **Objective:** Maintain a 100% free ($0/month) operational infrastructure for Vishnu Home Products that scales reliably from Bengaluru local delivery to Pan-India and worldwide shipping without hitting compute limits, database pauses, or bandwidth throttles.

---

## 1. Executive Summary & Root Cause Analysis

### What Happened to `nammamangalorefoods`?
Based on the live Vercel telemetry from the sister store (`nammamangalorefoods`), the project came dangerously close to its Hobby tier limits:

| Metric | Observed Usage | Hobby Plan Cap | % Consumed | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Fluid Active CPU** | **2h 40m** | **4h** | **66.7%** | ⚠️ Critical Bottleneck |
| **Function Invocations** | **115,781** | **1,000,000** | **11.6%** | Elevated |
| **Fast Origin Transfer** | **1.86 GB** | **10 GB** | **18.6%** | Moderate |
| **Fast Data Transfer (CDN)**| **2.63 GB** | **100 GB** | **2.6%** | Safe |
| **CDN Requests** | **225,744** | **1,000,000** | **22.6%** | Healthy |
| **Build CPU Minutes** | **13h 24m** | Unmetered (fair use)| Normal | Safe |

### Why Did CPU Spike on a Small Catalog?
1. **Dynamic SSR on Cacheable Pages:** Invocations were triggered on product and catalog pages because response headers lacked edge CDN caching directives (`s-maxage`). Every user visit spun up a node runtime container.
2. **Function Math:** 115,781 invocations × ~80ms average execution time = **~2.57 hours of active CPU time**.
3. **Database Network Latency:** Cold database queries to Supabase held serverless function execution threads open for 200–500ms while waiting for responses, compounding compute duration.
4. **Un-cached Client Polling:** Multiple browser tabs repeatedly queried status endpoints, directly burning through monthly invocation allowances.

---

## 2. Architectural Defenses Built into Vishnu Home Products

To prevent Vishnu Home Products from experiencing the same CPU and function exhaustion, the following core architecture is implemented:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   VISHNU HOME PRODUCTS TRAFFIC FLOW                    │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   [ Global End User / Buyer ]                                          │
│                │                                                       │
│                ▼                                                       │
│   [ Vercel / Cloudflare Edge CDN ]                                     │
│     ├── 25 of 27 Pages Cached (0ms CPU, 0 Function Invocations) ──────► Instant Response (2ms)
│     │   (Home, About, Shop, Combos, Bulk, Recipes, Policies)           │
│     │                                                                  │
│     └── Dynamic Action Required (Cart checkout, payment, auth)         │
│                │                                                       │
│                ▼                                                       │
│   [ 7 Consolidated Catch-All Serverless Routers ]                     │
│     ├── /api/orders/[...slug]                                          │
│     ├── /api/razorpay/[...slug]                                        │
│     ├── /api/admin/[...slug]                                           │
│     └── /api/delhivery/[...slug]                                       │
│                │                                                       │
│                ▼                                                       │
│   [ Shielded Storage & Fast Fallback Store ]                           │
│     ├── In-memory & local JSON fast store                              │
│     └── Offloaded Media (Cloudinary CDN — Zero Vercel bandwidth used) │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Static Site Generation (SSG) for 93% of the Site:**
   - In production (`next build`), **25 out of 27 routes** are pre-rendered as `○ (Static)` HTML files.
   - When visitors browse products, read recipes, or review combos, the requests are served directly from edge CDN cache. **Zero serverless functions are invoked and 0.00ms of CPU time is billed.**
2. **Consolidated Serverless Routers (7 Functions vs 30+ Functions):**
   - Vercel Hobby limits applications to 12 serverless functions.
   - All backend operations are unified into 7 catch-all `[...slug]` routers. This eliminates cold-start cascades and reduces memory footprints.
3. **Stateless HMAC Authentication & Local Session Hydration:**
   - Client applications use cryptographic HMAC-SHA256 session tokens.
   - User sessions and tenant scoping are resolved synchronously without firing outbound network calls to Supabase on every route change.
4. **Tenant Isolation at Query Layer:**
   - Strict `getOrdersForUser(email, userId)` prevents cross-account data leakage and keeps customer queries scoped, fast, and lightweight.

---

## 3. Alternative Hosting & Database Platforms for Zero-Cost Worldwide Scale

If traffic expands rapidly across India and international markets, the following alternative platforms offer significantly higher or unlimited free allowances:

### A. Hosting & Compute Alternatives

| Provider | Free Bandwidth | Request / CPU Allowance | Concurrency / Limits | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Vercel (Hobby)** | 100 GB / month | **4 hours Active CPU** (Fluid) · 1M invocations | 12 functions max | Fast iteration & Next.js native features |
| **Cloudflare Pages** | **UNLIMITED** | **100,000 Worker requests/day** (3M/mo) · Unlimited static | Unlimited static edge | High-traffic global e-commerce |
| **Oracle Cloud Always Free** | **10 TB / month** | **4 ARM Ampere Cores + 24 GB RAM** (100% Free Forever) | Fully dedicated VPS (no function caps) | Unlimited self-hosted backend + DB via Coolify |
| **Netlify (Free)** | 100 GB / month | 125k serverless invocations · 300 build mins | Similar to Vercel | Backup serverless hosting |

### B. Database & Storage Alternatives

| Database | Free Tier Storage | Read / Write Free Limits | Inactivity Sleep / Pause? | Verdict for Vishnu |
| :--- | :--- | :--- | :---: | :--- |
| **Turso (LibSQL)** | 9 GB | **1 Billion row reads/month** · 25M writes/month | ❌ **Never pauses** | **Top Recommendation** for global catalog & orders |
| **Cloudflare D1** | 5 GB | **5 Million reads/day** (150M/mo) · 100k writes/day | ❌ **Never pauses** | Excellent if hosted on Cloudflare Pages |
| **Neon PostgreSQL** | 0.5 GB | Unmetered within storage | ⚠️ Sleeps after 5 min idle | Fast cold boot, but causes ~1s first query delay |
| **Supabase** | 500 MB | 50,000 Monthly Active Users | ⚠️ Pauses after 7 days inactivity | Requires pooler on Port 6543 |

---

## 4. Scaling Strategy: 3-Phase Execution Roadmap

### Phase 1: Optimized Vercel Deployment (Current Phase — 0 to 50,000 monthly orders)
* **Status:** Fully configured and verified in repository.
* **Cost:** **$0.00 / month**.
* **Protective Measures:**
  1. Maintain 25 static pre-rendered routes.
  2. Maintain 7 consolidated catch-all serverless functions.
  3. Store catalog and customer data in fast local store with optional Supabase transaction pooler (port 6543).
  4. Offload all product images to Cloudinary / external CDN to protect Vercel Origin Transfer limits.

### Phase 2: Edge Migration to Cloudflare Pages + Turso (50,000 to 500,000 monthly visits)
* **Trigger:** If Vercel Fluid CPU usage consistently exceeds 3.0 hours (75% of limit).
* **Cost:** **$0.00 / month**.
* **Action Steps:**
  1. Deploy frontend Next.js application to **Cloudflare Pages** via `@cloudflare/next-on-pages` or OpenNext.
  2. Benefit from **unlimited free bandwidth** and global edge caching across 300+ edge locations.
  3. Connect backend data layer to **Turso Database**, taking advantage of **1,000,000,000 free monthly row reads** without project pauses.

### Phase 3: Dedicated Autonomous Cloud (Oracle Always Free + Coolify) (Enterprise Scale)
* **Trigger:** Worldwide brand expansion, high volume wholesale bulk ordering, continuous live logistics integrations.
* **Cost:** **$0.00 / month** (leveraging Oracle Cloud's permanent Free Tier).
* **Action Steps:**
  1. Provision an **Oracle Cloud Always Free VM.Standard.A1.Flex** instance (4 OCPU, 24 GB RAM, 200 GB SSD).
  2. Install **Coolify** (self-hosted open-source PaaS).
  3. Run the Next.js production build in Docker alongside a dedicated PostgreSQL instance.
  4. Enjoy **10 Terabytes of free monthly bandwidth** with zero function execution timeouts and zero vendor lock-in.

---

## 5. Production Optimization Checklist for Developers

- [x] Pre-render static pages (`○ (Static)`) in `next.config.mjs`
- [x] Consolidate API handlers into catch-all routers (`src/app/api/**/[...slug]/route.ts`)
- [x] Isolate customer tenant data at query level (`getOrdersForUser`)
- [x] Shield admin seed demo records from customer accounts
- [x] Clean and validate email input fields with no hardcoded placeholders
- [x] Offload product images to external CDN / Cloudinary
- [ ] Add `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` to static public product API responses
- [ ] In production Vercel dashboard, disable Speed Insights and Web Analytics if they approach their 10k/50k caps
- [ ] Maintain GitHub commit pushes with `vishnuhomeproduct@gmail.com` author identity

---
*Document maintained by the Vishnu Home Products Engineering Team.*
