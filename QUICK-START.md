# RefundSavior - Quick Start Guide

Get RefundSavior running in under 30 minutes!

## 🚀 Super Quick Setup

### 1. Install Dependencies (2 minutes)

```bash
npm install
```

### 2. Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) → Create Project
2. SQL Editor → Paste & run `supabase-schema.sql`
3. SQL Editor → Paste & run `supabase-sessions.sql`
4. Settings → API → Copy URL and service_role key

### 3. Create Shopify App (5 minutes)

1. Go to [partners.shopify.com](https://partners.shopify.com) → Apps → Create App
2. Copy API key and API secret
3. Set App URL to `http://localhost:3000` (temporary)
4. Add redirect URL: `http://localhost:3000/auth/callback`

### 4. Get OpenAI Key (2 minutes)

1. Go to [platform.openai.com](https://platform.openai.com) → API Keys
2. Create new key → Copy it

### 5. Configure Environment (3 minutes)

```bash
cp .env.example .env
```

Edit `.env`:
```env
SHOPIFY_API_KEY=your_key_here
SHOPIFY_API_SECRET=your_secret_here
SHOPIFY_APP_URL=http://localhost:3000
SCOPES=write_products,write_customers,write_draft_orders,write_discounts,write_orders,read_orders,write_script_tags

SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_key_here

OPENAI_API_KEY=sk-your_key_here
OPENAI_MODEL=gpt-4o-mini

SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NODE_ENV=development
```

### 6. Start Development (1 minute)

```bash
npm run dev
```

Open `http://localhost:3000`

### 7. Test in Shopify (5 minutes)

1. Shopify Partners → Your App → Test on development store
2. Install app
3. Check dashboard loads
4. Update settings

### 8. Deploy Widget (5 minutes)

```bash
npm install -g @shopify/cli
shopify auth login
shopify app deploy
```

Add widget block to your theme in Theme Editor.

## 🎯 What You Get

✅ **Backend**: Fully functional Remix + Shopify + Supabase + OpenAI
✅ **Frontend**: Admin dashboard with real data
✅ **Widget**: Storefront interception widget
✅ **AI**: GPT-4o-mini powered negotiations
✅ **Actions**: Gift cards and discount codes working
✅ **Analytics**: Real-time tracking

## 🐛 Quick Troubleshooting

**Port already in use?**
```bash
killall node
npm run dev
```

**Shopify OAuth not working?**
- Check App URL in partners.shopify.com
- Verify redirect URLs include `/auth/callback`
- Make sure SHOPIFY_APP_URL in .env matches

**Database errors?**
- Verify SUPABASE_SERVICE_KEY (not anon key)
- Check both SQL files ran successfully
- Look for errors in Supabase logs

**OpenAI not responding?**
- Verify API key is correct
- Check billing is set up at platform.openai.com
- Look for rate limit errors in console

## 📚 Next Steps

1. **Read**: `README.md` for full documentation
2. **Deploy**: Follow `DEPLOYMENT.md` for production
3. **Customize**: Edit AI prompts in `app/openai.server.js`
4. **Extend**: Add features based on `PROJECT-SUMMARY.md`

## 💬 Need Help?

- Full docs: `README.md`
- Deployment: `DEPLOYMENT.md`
- Setup checklist: `SETUP-CHECKLIST.md`
- Implementation details: `PROJECT-SUMMARY.md`

---

**Time to first working prototype**: ~30 minutes ⚡
**Time to production deployment**: ~2 hours 🚀

Let's save those refunds! 💰
