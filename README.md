# RefundSavior - AI-Powered Refund Retention System

RefundSavior is a Shopify app that uses AI to intercept refund requests and offer customers attractive alternatives like store credit bonuses or free exchanges, helping merchants retain revenue while keeping customers happy.

## 🚀 Features

- **AI-Powered Negotiations**: GPT-4o-mini dynamically generates personalized retention offers
- **Shopify Integration**: Seamless OAuth, Admin API, and theme app extensions
- **Smart Widget**: Intercepts return requests on customer order pages
- **Real-time Analytics**: Track retention rates, revenue saved, and customer behavior
- **Flexible Incentives**: Store credit multipliers, free exchanges, discount codes
- **Escape Hatch**: Always allows customers to proceed with refund if they insist

## 🏗️ Tech Stack

- **Frontend**: React 19, Tailwind CSS, Remix
- **Backend**: Remix (Node.js), Shopify App Bridge
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **Hosting**: Vercel-ready (can be deployed anywhere)

## 📋 Prerequisites

- Node.js 18+ 
- Shopify Partner account
- Supabase account
- OpenAI API key

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/refundsaviour.git
cd refundsaviour
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in the Supabase SQL Editor
3. Copy your project URL and service role key

### 4. Set up Shopify App

1. Go to [partners.shopify.com](https://partners.shopify.com)
2. Create a new app
3. Set up your app URL (e.g., `https://your-domain.com`)
4. Configure OAuth redirect URLs:
   - `https://your-domain.com/auth/callback`
   - `https://your-domain.com/auth/shopify/callback`
5. Copy your API key and API secret

### 5. Configure environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Shopify
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SHOPIFY_APP_URL=https://your-app-url.com
SCOPES=write_products,write_customers,write_draft_orders,write_discounts,write_orders,read_orders,write_script_tags

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini

# Session
SESSION_SECRET=your_random_session_secret
NODE_ENV=development
```

### 6. Update shopify.app.toml

Edit `shopify.app.toml` with your app details:

```toml
name = "refund-saviour"
client_id = "your_shopify_client_id"
application_url = "https://your-app-url.com"
```

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Deploy the theme extension

```bash
shopify app deploy
```

This will deploy the storefront widget to your Shopify app.

## 🎯 Usage

### For Merchants

1. **Install the app** from the Shopify App Store
2. **Configure settings** in the admin dashboard:
   - Set store credit multiplier (e.g., 1.10 = 10% bonus)
   - Choose AI tone (friendly, professional, casual)
   - Enable/disable widget
3. **Add the widget** to your theme:
   - Go to your theme editor
   - Add the "Refund Saviour Widget" app block to your order pages
4. **Monitor analytics** in the dashboard

### For Customers

1. Customer visits order history page
2. Clicks "Return" or "Refund" button
3. RefundSavior widget intercepts the request
4. AI chatbot offers alternatives:
   - Store credit with bonus value
   - Free exchange for different size
   - Discount on next purchase
5. Customer chooses an option or proceeds with refund

## 📊 API Endpoints

### Admin API (Authenticated)

- `GET /app/dashboard` - Dashboard stats and recent activity
- `GET /app/analytics` - Detailed analytics
- `GET /app/settings` - Merchant settings
- `POST /app/settings` - Update merchant settings

### Public API (Widget)

- `POST /api/negotiate` - Start AI negotiation
- `POST /api/accept-offer` - Accept an offer (store credit, exchange, refund)

### Webhooks

- `POST /api/webhooks/app-uninstalled` - Handle app uninstallation
- `POST /api/webhooks/orders-fulfilled` - Track fulfilled orders

## 🗄️ Database Schema

### Tables

- **merchants**: Store Shopify merchant info and settings
- **interceptions**: Log every return attempt and outcome
- **conversations**: Store AI chat history
- **analytics_daily**: Aggregated daily metrics

See `supabase-schema.sql` for complete schema.

## 🎨 Customization

### Modify AI Behavior

Edit `app/openai.server.js`:
- Change system prompts for different tones
- Adjust offer generation logic
- Customize sentiment analysis

### Customize Widget Appearance

Edit `extensions/refund-widget/blocks/refund_widget.liquid`:
- Update styles
- Change colors
- Modify layout

### Adjust Retention Strategy

Edit merchant settings in the dashboard:
- Store credit multiplier
- AI tone
- Widget trigger behavior

## 🐛 Troubleshooting

### Widget not appearing

1. Check that widget is enabled in settings
2. Verify theme extension is installed
3. Check browser console for errors

### AI responses not working

1. Verify OpenAI API key is valid
2. Check API usage limits
3. Review server logs for errors

### Shopify API errors

1. Verify API scopes are correct
2. Check access token is valid
3. Ensure merchant hasn't uninstalled app

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📧 Support

For issues and questions:
- GitHub Issues: [github.com/yourusername/refundsaviour/issues](https://github.com/yourusername/refundsaviour/issues)
- Email: support@refundsavior.com

## 🙏 Acknowledgments

- Built with [Remix](https://remix.run)
- Powered by [OpenAI](https://openai.com)
- Database by [Supabase](https://supabase.com)
- E-commerce by [Shopify](https://shopify.com)

---

Made with ❤️ for merchants who care about customer retention
