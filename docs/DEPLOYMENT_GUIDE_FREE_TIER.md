# Complete Free-Tier Deployment & Migration Guide for Vishnu Home Products

This guide provides step-by-step instructions to run Vishnu Home Products on **100% Free Cloud Infrastructure** that completely bypasses Vercel and Supabase limits.

---

## Architecture Comparison Summary

| Platform Option | Monthly Cost | Bandwidth Limit | Compute / CPU Limits | Database Inactivity Pause? | Best Use Case |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **Option 1: Oracle Cloud Always Free + Coolify** | **$0.00** | **10 TB / month** | **4 ARM CPU Cores + 24 GB RAM** (Dedicated) | ❌ Never pauses | **Unbeatable free power** (Run frontend + backend + DB without any limits) |
| **Option 2: Cloudflare Pages + Turso DB** | **$0.00** | **UNLIMITED** | **100,000 requests/day** (3M/mo) | ❌ Never pauses | **Pure Edge Serverless** with 300+ global edge nodes |
| **Option 3: Optimized Vercel** | **$0.00** | 100 GB / month | 4h Fluid CPU / month | ⚠️ 7-day Supabase pause | Current state (now hardened with 1h CDN caching) |

---

## Option 1: Deploy on Oracle Cloud "Always Free" (Recommended for Ultimate Scale)

Oracle Cloud gives every account a **permanently free** Ampere A1 Compute instance:
- **4 OCPU (Ampere ARM64 cores)**
- **24 GB RAM**
- **200 GB NVMe Storage**
- **10 Terabytes outbound data transfer per month**

### Step 1: Create Your Oracle Cloud Always Free Account
1. Sign up at [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/).
2. Select your home region (e.g. **India South - Hyderabad** or **India Central - Mumbai**).

### Step 2: Create the Ampere VM
1. Go to **Compute** → **Instances** → **Create Instance**.
2. Image: **Ubuntu 22.04 LTS (Minimal)**.
3. Shape: Select **Ampere (ARM)** → **VM.Standard.A1.Flex**.
4. Configure: **4 OCPU**, **24 GB Memory**.
5. Save your SSH Key and create the instance.

### Step 3: Install Docker & Coolify (1-Command PaaS)
SSH into your instance:
```bash
ssh -i /path/to/key ubuntu@<YOUR_INSTANCE_IP>
```
Install Coolify (a free, self-hosted Vercel alternative):
```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

### Step 4: Deploy Vishnu Home Products
1. Open `http://<YOUR_INSTANCE_IP>:8000` in your browser.
2. Connect your GitHub repository: `https://github.com/vishnuhomeproducts/VishnuHomeProducts`.
3. Coolify will automatically detect the [Dockerfile](file:///d:/VishnuHomeProducts/Dockerfile) we just created.
4. Click **Deploy**. Your store is now live with **24 GB of RAM, 10 TB of bandwidth, and $0 monthly cost forever**.

---

## Option 2: Deploy to Cloudflare Pages (Unlimited Bandwidth)

If you prefer serverless edge hosting without managing a server:

### Step 1: Connect to Cloudflare Pages
1. Sign in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select `VishnuHomeProducts` repository.

### Step 2: Build Settings
- **Framework preset**: `Next.js`
- **Build command**: `npx @cloudflare/next-on-pages`
- **Build output directory**: `.vercel/output/static`
- **Environment variables**:
  - `NODE_VERSION`: `18`

### Why this beats Vercel:
- **Unlimited bandwidth** (no 100GB cap).
- **100,000 free requests per day** (3,000,000 per month).
- Edge nodes across Mumbai, Bengaluru, Delhi, Chennai, Hyderabad, and 300+ cities globally.

---

## Option 3: Replace Supabase with Turso Database (1 Billion Reads Free)

To eliminate the 7-day inactivity pause and connection pool limits of Supabase:

### Step 1: Sign up for Turso
1. Visit [https://turso.tech/](https://turso.tech/).
2. Free tier includes:
   - **1,000,000,000 row reads / month**
   - **9 GB of database storage**
   - **500 databases**
   - **Never pauses or goes to sleep**

### Step 2: Create Database
```bash
# Using Turso CLI
turso db create vishnu-db
turso db show vishnu-db --url
turso db tokens create vishnu-db
```

### Step 3: Add to `.env.local`
```env
TURSO_DATABASE_URL=libsql://vishnu-db-[username].turso.io
TURSO_AUTH_TOKEN=your-turso-jwt-token
```
The application will automatically detect these credentials using [src/lib/tursoDb.ts](file:///d:/VishnuHomeProducts/src/lib/tursoDb.ts) without installing heavy client libraries.

---

## Local Development & Docker Verification
You can also run the entire production container on your local machine:
```bash
docker compose up --build -d
```
Then visit `http://localhost:3000`.
