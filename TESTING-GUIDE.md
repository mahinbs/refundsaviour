# RefundSavior — Testing Guide (Non-Technical)

This guide walks you through testing everything after the app is live on Vercel.
No coding knowledge needed. Just follow each step in order.

---

## Are environment variables safe on Vercel?

**Yes — 100% safe.** Vercel environment variables are the correct and secure way to store secrets. They are:
- Encrypted and stored securely by Vercel
- Never visible in your GitHub code
- Never sent to the browser — only your serverless functions can read them
- Not shown to anyone viewing your site

Never put secrets inside your code files or commit them to GitHub. Vercel's environment variables panel is exactly where they should live.

---

## Part 0 — Setting Up Environment Variables on Vercel

Do this BEFORE deploying. These are the secret keys your app needs to run.

### How to add them in Vercel

1. Go to [vercel.com](https://vercel.com) → open your project
2. Click **Settings** (top menu)
3. Click **Environment Variables** (left menu)
4. For each variable below: type the **Name** on the left, paste the **Value** on the right
5. Make sure **Production**, **Preview**, and **Development** are all ticked
6. Click **Save**
7. After all variables are added → go to **Deployments** → click the three dots on the latest deployment → **Redeploy**

---

### Variable by variable — where to get each value

---

#### `SUPABASE_URL`
**What it is:** The address of your Supabase database.

**Where to find it:**
1. Go to [supabase.com](https://supabase.com) → open your project
2. Click **Settings** (gear icon, bottom left)
3. Click **API**
4. Copy the **Project URL** — looks like `https://xxxxxxxxxxx.supabase.co`

---

#### `SUPABASE_SERVICE_KEY`
**What it is:** A secret key that gives your backend full access to the database.

**Where to find it:**
1. Same page as above (Supabase → Settings → API)
2. Scroll down to **Project API Keys**
3. Copy the **service_role** key (click the eye icon to reveal it)
4. ⚠️ Never share this key with anyone — it has full database access

---

#### `SUPABASE_ANON_KEY`
**What it is:** A public-safe key for Supabase (used for some read operations).

**Where to find it:**
1. Same page — Supabase → Settings → API
2. Copy the **anon / public** key

---

#### `SHOPIFY_API_KEY`
**What it is:** Identifies your app to Shopify.

**Where to find it:**
1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Click **Apps** → click your app name
3. Click **App setup** or **Overview**
4. Copy the **Client ID** — this is your API key

---

#### `SHOPIFY_API_SECRET`
**What it is:** A secret password Shopify uses to verify requests are really from your app.

**Where to find it:**
1. Same page — Shopify Partners → your app
2. Copy the **Client secret**
3. ⚠️ Never share this — keep it secret

---

#### `SCOPES`
**What it is:** Permissions your app requests from Shopify stores.

**Value — paste this exactly:**
```
read_orders,write_orders,write_customers,write_discounts,write_draft_orders
```
No quotes, no spaces.

---

#### `SHOPIFY_APP_URL`
**What it is:** The live URL of your app on Vercel — Shopify uses this to know where to redirect merchants.

**Value:** Your Vercel deployment URL, e.g.:
```
https://refund-saviour.vercel.app
```
Or your custom domain if you have one:
```
https://www.refundrescueer.com
```
No trailing slash at the end.

**Important:** After you get your Vercel URL, also update it in:
- Shopify Partners → your app → App setup → **App URL** field
- Shopify Partners → your app → App setup → **Allowed redirect URLs** → add `https://your-url.vercel.app/auth/callback`

---

#### `OPENAI_API_KEY`
**What it is:** The key that lets your app call the AI (GPT-4o-mini).

**Where to find it:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Click your profile (top right) → **API keys**
3. Click **Create new secret key**
4. Copy it immediately — it won't be shown again
5. ⚠️ Make sure your OpenAI account has credits/billing set up or the AI calls will fail

---

#### `SESSION_SECRET`
**What it is:** A random string used to encrypt user sessions. You make this up.

**Value:** Type any long random string — at least 32 characters. Example:
```
refundsavior2024xk92maplqz77secure
```
Just mash your keyboard — it doesn't need to mean anything, just needs to be long and random. Nobody ever needs to read this value.

---

#### `SUPER_ADMIN_SECRET`
**What it is:** The password to log into your private admin panel at `/super-admin`.

**Value:** Choose any password you want. Example:
```
MyAdminPassword2024!
```
Write it down somewhere safe — you'll need it to log into the admin panel.

---

### Final checklist before deploying

| Variable | Value source |
|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role key |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `SHOPIFY_API_KEY` | Shopify Partners → your app → Client ID |
| `SHOPIFY_API_SECRET` | Shopify Partners → your app → Client secret |
| `SCOPES` | Paste: `read_orders,write_orders,write_customers,write_discounts,write_draft_orders` |
| `SHOPIFY_APP_URL` | Your Vercel URL e.g. `https://refund-saviour.vercel.app` |
| `OPENAI_API_KEY` | platform.openai.com → API keys |
| `SESSION_SECRET` | Make up any long random string |
| `SUPER_ADMIN_SECRET` | Make up a password for the admin panel |

---

## Before You Start (Testing)

You need these things ready:
- The live Vercel app URL (e.g. `https://refund-saviour.vercel.app`)
- Your Shopify development store (created in Shopify Partners)
- Access to your Supabase project (supabase.com)
- The `SUPER_ADMIN_SECRET` password you set in Vercel

---

## Part 1 — Deploy & Connect

### Step 1: Set up the database

1. Go to [supabase.com](https://supabase.com) → open your project
2. Click **SQL Editor** in the left menu
3. Click **New Query**
4. Open the file `supabase-schema.sql` from this project, copy ALL the text inside it
5. Paste it into the SQL Editor box
6. Click **Run**
7. You should see a green "Success" message

**How to verify it worked:**
- Click **Table Editor** in the left menu
- You should see 4 tables listed: `merchants`, `interceptions`, `conversations`, `analytics_daily`
- ✅ If you see them, the database is ready

---

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub
2. Click **Add New Project** → select this GitHub repository
3. Vercel will detect it automatically — don't change any settings
4. Click **Environment Variables** and add every line from the `.env.example` file with your real values
5. Click **Deploy**
6. Wait ~2 minutes — you'll get a live URL

**How to verify it worked:**
- Visit your Vercel URL (e.g. `https://refund-saviour.vercel.app`)
- You should see a Shopify login page or be redirected
- ✅ If the page loads (no error), Vercel deployment is working

---

### Step 3: Install the app on your Shopify dev store

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Click **Apps** → find RefundSavior → click **Select store** → pick your dev store
3. Click **Install app** when Shopify asks you
4. You'll land on the RefundSavior dashboard inside Shopify admin
- ✅ You should see a dashboard with "Command Center Active"

**Check the database:**
- Go to Supabase → **Table Editor** → `merchants` table
- You should see 1 row with your store domain
- The `is_active` column should say `true`
- ✅ App is connected

---

## Part 2 — Test the Dashboard & Settings

### Step 4: Check the Settings page

1. In the app, click **Settings** in the left menu
2. You should see your store name and a green "Connected" badge
3. Change the **Store Credit Multiplier** to `1.20`
4. Change **AI Tone** to `Friendly`
5. Make sure the widget toggle is **ON**
6. Click **Save**

**Verify it saved:**
- Go to Supabase → `merchants` table
- The `multiplier` column should now show `1.20`
- ✅ Settings are saving correctly

---

### Step 5: Check the Super Admin panel

1. Open a new browser tab
2. Go to: `https://your-vercel-url.vercel.app/super-admin/login`
3. Enter your `SUPER_ADMIN_SECRET` password
4. You should see a black dashboard showing all merchants
5. Click on your store name
- ✅ You can see store details, stats (all zeros for now — that's fine)

---

## Part 3 — Test the Widget (The Main Feature)

### Step 6: Add the widget to your store

1. In your Shopify dev store admin, go to **Online Store** → **Themes**
2. Click **Customize** next to your active theme
3. In the theme editor, look for **"Add block"** or **"Add section"** 
4. Search for **RefundSavior** and add it
5. In the block settings panel on the right side, fill in:
   - **App Server URL**: paste your full Vercel URL (e.g. `https://refund-saviour.vercel.app`)
   - **Widget Title**: `Wait — we have a better offer!`
   - Turn on **Auto Trigger**
6. Click **Save**
- ✅ Widget is installed on the storefront

---

### Step 7: Create a test product and order

1. In Shopify admin → **Products** → **Add product**
   - Name: `Test Product`
   - Price: `$50.00`
   - Click **Save**

2. Go to **Orders** → **Create order**
   - Add your Test Product
   - Add a test customer (use any email like `test@test.com`)
   - Click **Create order**
   - Note the order number (e.g. #1001)

---

### Step 8: Trigger the widget as a customer

1. In Shopify admin, open the order you just created
2. Click **More actions** → **View order status page** (this is what the customer sees)
3. On the order page, look for a **"Return item"** or **"Request refund"** button
4. Click it

**What should happen:**
- A pop-up/modal should appear saying something like "Wait — we have a better offer!"
- An AI message should appear offering store credit (e.g. "$60 store credit instead of $50 refund")
- You should see 3 buttons: **Accept Store Credit**, **Free Exchange**, **Just give me my refund**
- ✅ Widget is working and AI is responding

**If the widget doesn't appear:**
- Check that you saved the Vercel URL correctly in the theme block settings (Step 6)
- Make sure the widget block was added to the right page in the theme editor

---

### Step 9: Test accepting store credit

1. In the widget, click **"Accept Store Credit"**
2. You should see a success message with a gift card code

**Verify it worked in Shopify:**
- Go to Shopify admin → **Customers** → find the test customer
- Scroll down to **Gift cards** — you should see a gift card for ~$60
- ✅ Store credit was created

**Verify it was logged:**
- Go to Supabase → `interceptions` table
- You should see 1 row with `outcome = store_credit` and `retained = true`
- ✅ Database is tracking it

**Check the dashboard:**
- Go back to the RefundSavior app dashboard
- You should now see: **Refunds Intercepted: 1**, **Retention Rate: 100%**, **Revenue Saved: ~$60**
- ✅ Dashboard is showing real data

---

### Step 10: Test accepting an exchange

1. Create another test order (repeat Step 7)
2. Trigger the widget again (repeat Step 8)
3. This time click **"Free Exchange"**
4. You should see a discount code

**Verify in Shopify:**
- Go to Shopify admin → **Discounts**
- You should see a new discount code starting with "RefundSavior"
- ✅ Exchange discount code was created

**Verify in database:**
- Supabase → `interceptions` → new row with `outcome = exchange`
- ✅ Logged correctly

---

### Step 11: Test the refund escape hatch

1. Create another test order
2. Trigger the widget
3. Click **"Just give me my refund"**
4. You should be taken to the normal Shopify refund page

**Verify:**
- Supabase → `interceptions` → new row with `outcome = refund`, `retained = false`
- ✅ Refund path is tracked

---

### Step 12: Test the AI conversation

1. Trigger the widget on a new order
2. Instead of clicking a button, type a message in the chat box (e.g. "The size was wrong")
3. The AI should respond with a relevant message
4. Type another reply
- ✅ Back-and-forth conversation is working

---

## Part 4 — Test Analytics

### Step 13: Check the Analytics page

After completing tests 9–12, go to the RefundSavior app → **Analytics** tab

You should see:
- A chart showing return reasons (e.g. "changed_mind", "size_issue")
- The total number of interceptions

**Verify in database:**
- Supabase → `analytics_daily` table
- You should see rows grouped by today's date with counts for each outcome
- ✅ Analytics are being tracked

---

## Part 5 — Test App Uninstall

### Step 14: Test uninstall (optional but good to verify)

1. In Shopify dev store → **Apps** → find RefundSavior → click **Delete**
2. Confirm deletion

**Verify:**
- Supabase → `merchants` table → find your store
- `is_active` should now be `false`
- `uninstalled_at` should have today's date and time
- ✅ Uninstall is being tracked

If you want to re-install, just go back to Shopify Partners and install again — it will reactivate the merchant record.

---

## Quick Troubleshooting

| Problem | What to check |
|---|---|
| Widget doesn't appear | Go to Themes → Customize → check the App Server URL is your full Vercel URL |
| AI doesn't respond | Go to Vercel dashboard → check `OPENAI_API_KEY` is set correctly |
| Gift card not created | Go to Vercel dashboard → check `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` are correct |
| Dashboard shows all zeros | Check Supabase `interceptions` table — if rows are there, refresh the dashboard |
| Can't log into super admin | Check `SUPER_ADMIN_SECRET` is set in Vercel environment variables |
| Vercel deployment failed | Check all environment variables are filled in — no empty values |
| "Merchant not found" error | The app needs to be installed via Shopify first (Step 3) before the widget can talk to it |

---

## Summary Checklist

- [ ] Database tables created in Supabase
- [ ] App deployed on Vercel with all env variables
- [ ] App installed on Shopify dev store
- [ ] Merchant row appears in `merchants` table
- [ ] Widget added to storefront theme with correct URL
- [ ] Widget fires on order page
- [ ] Store credit flow works (gift card created)
- [ ] Exchange flow works (discount code created)
- [ ] Refund escape hatch works
- [ ] Dashboard shows real numbers
- [ ] Analytics page shows reason breakdown
- [ ] Super admin panel loads and shows merchant
