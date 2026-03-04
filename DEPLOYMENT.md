# RefundSavior Deployment Guide

This guide will walk you through deploying RefundSavior to production.

## Prerequisites Checklist

- [ ] Shopify Partner account with app created
- [ ] Supabase project with schema deployed
- [ ] OpenAI API key with credits
- [ ] Domain/hosting setup (Vercel, Railway, etc.)
- [ ] SSL certificate (automatically provided by most hosts)

## Step-by-Step Deployment

### 1. Prepare Supabase Database

1. **Create Supabase Project**
   ```bash
   # Go to supabase.com and create a new project
   # Note your project URL and keys
   ```

2. **Run Database Schema**
   - Open Supabase SQL Editor
   - Copy contents of `supabase-schema.sql`
   - Execute the SQL
   - Verify tables were created in Table Editor

3. **Configure Row Level Security (RLS)**
   - The schema includes RLS policies
   - For production, you may want to customize policies
   - Use service role key in your backend (never expose to client)

### 2. Configure Shopify App

1. **Create Shopify App**
   ```bash
   # Log in to partners.shopify.com
   # Navigate to Apps > Create App
   # Choose "Custom App" or "Public App"
   ```

2. **Configure App Settings**
   - **App URL**: `https://your-domain.com`
   - **Redirect URLs**:
     - `https://your-domain.com/auth/callback`
     - `https://your-domain.com/auth/shopify/callback`
   
3. **Set API Scopes**
   Required scopes:
   - `write_products`
   - `write_customers`
   - `write_draft_orders`
   - `write_discounts`
   - `write_orders`
   - `read_orders`
   - `write_script_tags`

4. **Configure Webhooks**
   - `APP_UNINSTALLED` → `https://your-domain.com/api/webhooks/app-uninstalled`
   - `ORDERS_FULFILLED` → `https://your-domain.com/api/webhooks/orders-fulfilled`

5. **Get API Credentials**
   - Copy API Key
   - Copy API Secret Key
   - Save these securely

### 3. Deploy Backend (Vercel Example)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   
   # Follow prompts
   # Select project settings
   ```

3. **Configure Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables:
   
   ```env
   SHOPIFY_API_KEY=your_api_key
   SHOPIFY_API_SECRET=your_api_secret
   SHOPIFY_APP_URL=https://your-app.vercel.app
   SCOPES=write_products,write_customers,write_draft_orders,write_discounts,write_orders,read_orders,write_script_tags
   
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_role_key
   
   OPENAI_API_KEY=sk-your-key
   OPENAI_MODEL=gpt-4o-mini
   
   SESSION_SECRET=your-random-32-char-string
   NODE_ENV=production
   ```

4. **Generate Session Secret**
   ```bash
   # Run this to generate a secure secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

### 4. Update Shopify App Configuration

1. Go back to Shopify Partners Dashboard
2. Update **App URL** to your Vercel URL
3. Update **Redirect URLs** with your Vercel URL
4. Update **Webhook URLs** with your Vercel URL
5. Save changes

### 5. Deploy Theme Extension

1. **Install Shopify CLI**
   ```bash
   npm install -g @shopify/cli @shopify/app
   ```

2. **Authenticate**
   ```bash
   shopify auth login
   ```

3. **Deploy Extension**
   ```bash
   cd extensions/refund-widget
   shopify app deploy
   ```

4. **Approve Extension**
   - Go to your development store
   - Approve the extension in admin
   - Add to your theme

### 6. Testing in Development Store

1. **Install App**
   ```bash
   # In your partners dashboard, get the test install link
   # Or use: shopify app dev
   ```

2. **Verify Installation**
   - App should appear in Shopify admin
   - Check Settings page loads correctly
   - Verify database connection (merchant record created)

3. **Test Widget**
   - Go to storefront
   - Navigate to order history page
   - Add the widget block to the theme
   - Test return flow

4. **Test AI Negotiation**
   - Trigger a return
   - Verify AI responses
   - Check offers display correctly
   - Test accepting store credit
   - Test accepting exchange
   - Test refund "escape hatch"

5. **Verify Backend**
   - Check Dashboard shows data
   - Verify Analytics work
   - Test Settings updates
   - Check interceptions are logged

### 7. Production Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Database schema deployed and tested
- [ ] Shopify OAuth flow working
- [ ] Webhooks receiving events
- [ ] AI responses generating correctly
- [ ] Store credit generation working
- [ ] Discount code creation working
- [ ] Widget appears on storefront
- [ ] Dashboard analytics displaying
- [ ] Settings updates persisting
- [ ] Error handling tested
- [ ] Rate limiting configured (if needed)
- [ ] Monitoring/logging set up
- [ ] Backup strategy in place

### 8. Monitoring & Maintenance

1. **Set up monitoring**
   ```bash
   # Use Vercel Analytics
   # Or integrate Sentry for error tracking
   npm install @sentry/remix
   ```

2. **Monitor OpenAI Usage**
   - Check OpenAI dashboard for API usage
   - Set up billing alerts
   - Monitor token consumption

3. **Monitor Supabase**
   - Check database size
   - Monitor query performance
   - Set up backups

4. **Check Logs**
   ```bash
   # Vercel logs
   vercel logs
   
   # Or use dashboard at vercel.com
   ```

## Alternative Deployment Options

### Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set SHOPIFY_API_KEY=xxx
# ... (set all variables)

# Deploy
railway up
```

### Deploy to Heroku

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create refund-saviour

# Add environment variables
heroku config:set SHOPIFY_API_KEY=xxx
# ... (set all variables)

# Deploy
git push heroku main
```

### Deploy to DigitalOcean App Platform

1. Connect GitHub repo
2. Select Node.js
3. Set build command: `npm run build`
4. Set run command: `npm start`
5. Add environment variables
6. Deploy

## Troubleshooting

### App not loading in Shopify admin

- Check App URL is correct (must be HTTPS)
- Verify OAuth redirect URLs are correct
- Check environment variables

### Widget not appearing

- Verify extension is deployed
- Check theme has the block added
- Look for JavaScript errors in console

### Database connection errors

- Verify Supabase credentials
- Check service role key (not anon key)
- Ensure RLS policies allow service role

### OpenAI API errors

- Check API key is valid
- Verify billing is set up
- Check rate limits

### Webhook not receiving events

- Verify webhook URLs in Shopify
- Check webhook signature validation
- Look at Vercel function logs

## Security Best Practices

1. **Never commit secrets**
   - Use `.env` (already in `.gitignore`)
   - Use environment variables in production

2. **Rotate credentials regularly**
   - Session secrets
   - API keys
   - Database passwords

3. **Use HTTPS everywhere**
   - Shopify requires HTTPS
   - Modern hosts provide it automatically

4. **Validate webhooks**
   - Shopify package handles this
   - Don't skip webhook verification

5. **Rate limit APIs**
   - Protect against abuse
   - Use middleware or API gateway

## Support

If you encounter issues:

1. Check logs in your hosting dashboard
2. Review Shopify Partner dashboard for app status
3. Test with Shopify's API testing tools
4. Review this guide and README.md
5. Open an issue on GitHub

---

Good luck with your deployment! 🚀
