# RefundSavior Setup Checklist

Use this checklist to ensure everything is configured correctly before deploying.

## 🎯 Initial Setup

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Code editor ready (VS Code recommended)

### 2. Clone & Install
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created from `.env.example`

## 🗄️ Supabase Setup

### 1. Create Project
- [ ] Supabase account created
- [ ] New project created
- [ ] Project name noted
- [ ] Database password saved securely

### 2. Database Schema
- [ ] `supabase-schema.sql` executed in SQL Editor
- [ ] `supabase-sessions.sql` executed in SQL Editor
- [ ] Tables created successfully:
  - [ ] `merchants`
  - [ ] `interceptions`
  - [ ] `conversations`
  - [ ] `analytics_daily`
  - [ ] `shopify_sessions`

### 3. API Keys
- [ ] Project URL copied (`https://xxx.supabase.co`)
- [ ] Anon key copied
- [ ] Service role key copied (keep secret!)
- [ ] Keys added to `.env`

### 4. Row Level Security
- [ ] RLS enabled on all tables
- [ ] Service role policies created
- [ ] Policies tested

## 🛍️ Shopify Setup

### 1. Partner Account
- [ ] Shopify Partner account created at partners.shopify.com
- [ ] Partner dashboard accessible

### 2. Create App
- [ ] New app created in Partner dashboard
- [ ] App name: "RefundSavior" (or your choice)
- [ ] App type selected (Public or Custom)

### 3. App Configuration
- [ ] API Key copied
- [ ] API Secret copied
- [ ] Keys added to `.env`
- [ ] App URL set (will update after deployment)
- [ ] Redirect URLs added:
  - [ ] `https://your-domain.com/auth/callback`
  - [ ] `https://your-domain.com/auth/shopify/callback`
  - [ ] `http://localhost:3000/auth/callback` (for local dev)

### 4. API Scopes
Required scopes enabled:
- [ ] `write_products`
- [ ] `write_customers`
- [ ] `write_draft_orders`
- [ ] `write_discounts`
- [ ] `write_orders`
- [ ] `read_orders`
- [ ] `write_script_tags`

### 5. Webhooks
- [ ] `APP_UNINSTALLED` webhook configured
- [ ] `ORDERS_FULFILLED` webhook configured
- [ ] Webhook URLs point to your domain

## 🤖 OpenAI Setup

### 1. Account & API Key
- [ ] OpenAI account created at platform.openai.com
- [ ] Billing configured
- [ ] API key generated
- [ ] API key added to `.env`
- [ ] Usage limits set (recommended)

### 2. Model Access
- [ ] GPT-4o-mini access confirmed
- [ ] Alternative model chosen if needed
- [ ] Model name in `.env` correct

## 🔐 Environment Variables

All variables in `.env` configured:

### Shopify
- [ ] `SHOPIFY_API_KEY`
- [ ] `SHOPIFY_API_SECRET`
- [ ] `SHOPIFY_APP_URL`
- [ ] `SCOPES`

### Supabase
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_KEY`

### OpenAI
- [ ] `OPENAI_API_KEY`
- [ ] `OPENAI_MODEL`

### Session & Environment
- [ ] `SESSION_SECRET` (generated randomly)
- [ ] `NODE_ENV`

## 🚀 Deployment

### 1. Choose Hosting
- [ ] Hosting provider selected (Vercel, Railway, etc.)
- [ ] Account created
- [ ] Billing configured (if needed)

### 2. Deploy Backend
- [ ] Code pushed to GitHub
- [ ] Project imported to hosting platform
- [ ] Environment variables configured in hosting dashboard
- [ ] Build successful
- [ ] App URL obtained

### 3. Update Shopify
- [ ] App URL updated in Shopify Partner dashboard
- [ ] Redirect URLs updated
- [ ] Webhook URLs updated
- [ ] Changes saved

### 4. Deploy Theme Extension
- [ ] Shopify CLI installed (`npm i -g @shopify/cli`)
- [ ] Authenticated with Shopify (`shopify auth login`)
- [ ] Extension deployed (`shopify app deploy`)
- [ ] Extension approved in development store

## ✅ Testing

### 1. Local Testing
- [ ] Dev server starts (`npm run dev`)
- [ ] No console errors
- [ ] Can access localhost:3000

### 2. Shopify Integration
- [ ] App installs in development store
- [ ] OAuth flow completes successfully
- [ ] Merchant record created in Supabase
- [ ] Dashboard loads

### 3. Admin Features
- [ ] Dashboard displays (even with mock data initially)
- [ ] Settings page loads
- [ ] Settings can be updated
- [ ] Analytics page loads

### 4. Storefront Widget
- [ ] Widget block added to theme
- [ ] Widget appears on order page
- [ ] Widget opens on return button click
- [ ] Widget displays correctly on mobile

### 5. AI Negotiation
- [ ] Widget triggers return flow
- [ ] AI response generated
- [ ] Offers displayed correctly
- [ ] Can select offer type

### 6. Backend Actions
- [ ] Store credit generation works
- [ ] Gift card created in Shopify
- [ ] Exchange discount code created
- [ ] Refund "escape hatch" works
- [ ] Order tagged correctly

### 7. Database
- [ ] Interception records created
- [ ] Conversation messages saved
- [ ] Analytics updated
- [ ] No database errors in logs

### 8. Webhooks
- [ ] `APP_UNINSTALLED` webhook received
- [ ] `ORDERS_FULFILLED` webhook received
- [ ] Webhook handlers process correctly
- [ ] Database updated by webhooks

## 🔍 Pre-Launch

### Security
- [ ] All secrets in environment variables (not code)
- [ ] `.env` in `.gitignore`
- [ ] No API keys exposed in frontend
- [ ] HTTPS enabled
- [ ] Webhook signatures validated

### Performance
- [ ] Build optimized
- [ ] Images optimized
- [ ] Database indexes created
- [ ] No unnecessary API calls

### Monitoring
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Logging configured
- [ ] Alerts configured for critical errors
- [ ] OpenAI usage monitoring enabled

### Documentation
- [ ] README.md reviewed
- [ ] DEPLOYMENT.md reviewed
- [ ] Team members briefed
- [ ] Support process defined

## 📊 Post-Launch

### Week 1
- [ ] Monitor error logs daily
- [ ] Check database performance
- [ ] Review OpenAI costs
- [ ] Gather initial user feedback
- [ ] Fix any critical bugs

### Month 1
- [ ] Analyze retention metrics
- [ ] Review AI response quality
- [ ] Optimize offers based on data
- [ ] Plan feature improvements
- [ ] Consider A/B testing

## 🆘 Troubleshooting Resources

- [ ] README.md bookmarked
- [ ] DEPLOYMENT.md bookmarked
- [ ] Shopify Partner docs bookmarked
- [ ] Supabase docs bookmarked
- [ ] OpenAI docs bookmarked
- [ ] Support contacts saved

## 📝 Notes

Use this space for any additional notes or custom configuration:

```
_____________________________________________

_____________________________________________

_____________________________________________

_____________________________________________
```

---

**Last Updated**: [Date]
**Completed By**: [Name]
**Status**: [ ] In Progress [ ] Ready to Deploy [ ] Deployed
