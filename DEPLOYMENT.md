# Dream Weaver Deployment Guide 🚀

This guide covers deploying Dream Weaver to production with all services properly configured.

## 📋 Pre-Deployment Checklist

### Required Services
- [ ] **OpenAI API Key** - For dream interpretation
- [ ] **Encryption Key** - 32+ character string for data encryption
- [ ] **Domain/Hosting** - Where your app will be deployed

### Optional Services (Recommended for Production)
- [ ] **Privy App** - For user authentication
- [ ] **Supabase Project** - For cloud database
- [ ] **Stripe Account** - For payment processing

## 🔧 Service Configuration

### 1. OpenAI Setup
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get an API key
3. Set usage limits to control costs
4. Note: The app gracefully falls back to mock responses if no key is provided

### 2. Privy Authentication (Optional but Recommended)
1. Go to [Privy Console](https://console.privy.io/)
2. Create a new app
3. Configure settings:
   ```json
   {
     "name": "Dream Weaver",
     "logo_url": "https://yourdomain.com/logo.png",
     "login_methods": ["email", "google", "twitter"],
     "theme": {
       "accent_color": "#0000FF"
     }
   }
   ```
4. Add your production domain to allowed origins
5. Copy your App ID

### 3. Supabase Database (Optional but Recommended)
1. Create project at [Supabase](https://supabase.com/)
2. Go to SQL Editor and run this schema:
   ```sql
   -- Enable UUID extension
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Users table
   CREATE TABLE users (
     user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     subscription_tier TEXT DEFAULT 'free',
     privy_user_id TEXT UNIQUE
   );

   -- Dream entries table
   CREATE TABLE dream_entries (
     dream_entry_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
     dream_date DATE NOT NULL,
     dream_text TEXT,
     interpretation TEXT,
     tags TEXT[],
     emotions TEXT[],
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Indexes for performance
   CREATE INDEX idx_dream_entries_user_id ON dream_entries(user_id);
   CREATE INDEX idx_dream_entries_dream_date ON dream_entries(dream_date);
   CREATE INDEX idx_users_privy_user_id ON users(privy_user_id);

   -- Row Level Security (RLS)
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE dream_entries ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can view own data" ON users
     FOR SELECT USING (auth.uid()::text = privy_user_id);

   CREATE POLICY "Users can update own data" ON users
     FOR UPDATE USING (auth.uid()::text = privy_user_id);

   CREATE POLICY "Users can view own dreams" ON dream_entries
     FOR SELECT USING (user_id IN (
       SELECT user_id FROM users WHERE privy_user_id = auth.uid()::text
     ));

   CREATE POLICY "Users can insert own dreams" ON dream_entries
     FOR INSERT WITH CHECK (user_id IN (
       SELECT user_id FROM users WHERE privy_user_id = auth.uid()::text
     ));

   CREATE POLICY "Users can update own dreams" ON dream_entries
     FOR UPDATE USING (user_id IN (
       SELECT user_id FROM users WHERE privy_user_id = auth.uid()::text
     ));

   CREATE POLICY "Users can delete own dreams" ON dream_entries
     FOR DELETE USING (user_id IN (
       SELECT user_id FROM users WHERE privy_user_id = auth.uid()::text
     ));
   ```
3. Go to Settings > API and copy:
   - Project URL
   - Anon public key

### 4. Stripe Payments (Optional)
1. Create account at [Stripe](https://stripe.com/)
2. Create products in Dashboard:
   - **Pro Plan**: $5/month recurring
   - **Premium Plan**: $15/month recurring
3. Copy price IDs and update `src/services/stripe.js`:
   ```javascript
   export const SUBSCRIPTION_TIERS = {
     pro: {
       priceId: 'price_1234567890abcdef', // Your actual price ID
       // ... other config
     },
     premium: {
       priceId: 'price_0987654321fedcba', // Your actual price ID
       // ... other config
     }
   };
   ```
4. Copy your publishable key (starts with `pk_`)

## 🌐 Deployment Platforms

### Vercel (Recommended)
1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Environment Variables**
   In Vercel dashboard, add:
   ```
   VITE_OPENAI_API_KEY=sk-...
   VITE_PRIVY_APP_ID=clp...
   VITE_SUPABASE_URL=https://...
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_...
   VITE_ENCRYPTION_KEY=your-32-char-encryption-key-here
   VITE_APP_URL=https://yourdomain.vercel.app
   ```

3. **Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Netlify
1. **Deploy from Git**
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**
   Add the same variables as above in Site Settings > Environment Variables

### Railway
1. **Deploy from GitHub**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway link
   railway up
   ```

2. **Environment Variables**
   Add variables in Railway dashboard

### Docker Deployment
1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   events {
     worker_connections 1024;
   }

   http {
     include /etc/nginx/mime.types;
     default_type application/octet-stream;

     server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;

       location / {
         try_files $uri $uri/ /index.html;
       }

       # Security headers
       add_header X-Frame-Options DENY;
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
     }
   }
   ```

3. **Build and Deploy**
   ```bash
   docker build -t dream-weaver .
   docker run -p 80:80 dream-weaver
   ```

## 🔒 Security Configuration

### Environment Variables
- **Never commit** `.env` files to version control
- Use **strong encryption keys** (32+ characters, random)
- **Rotate keys** periodically in production
- Use **different keys** for different environments

### API Security
- **Restrict API keys** to your domain only
- **Set usage limits** on OpenAI API
- **Enable CORS** properly for your domain
- **Use HTTPS** in production (most platforms do this automatically)

### Database Security
- **Enable Row Level Security** (RLS) in Supabase
- **Use environment-specific** database instances
- **Regular backups** of your data
- **Monitor access logs** for suspicious activity

## 📊 Monitoring & Analytics

### Error Tracking
Add error tracking service like Sentry:
```bash
npm install @sentry/react @sentry/tracing
```

### Performance Monitoring
- Use Vercel Analytics or similar
- Monitor Core Web Vitals
- Track API response times
- Monitor encryption/decryption performance

### User Analytics (Privacy-Friendly)
- Use privacy-focused analytics like Plausible
- Track feature usage without personal data
- Monitor subscription conversion rates

## 🚀 Production Optimizations

### Build Optimizations
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          crypto: ['crypto-js'],
          charts: ['recharts']
        }
      }
    }
  }
}
```

### Performance
- **Enable gzip compression** on your server
- **Use CDN** for static assets
- **Implement service worker** for offline functionality
- **Lazy load** non-critical components

### SEO & Meta Tags
Update `index.html`:
```html
<head>
  <title>Dream Weaver - AI-Powered Dream Analysis</title>
  <meta name="description" content="Unlock the secrets of your subconscious with AI-powered dream interpretation and pattern tracking.">
  <meta property="og:title" content="Dream Weaver">
  <meta property="og:description" content="Privacy-focused dream analysis with AI">
  <meta property="og:image" content="https://yourdomain.com/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
</head>
```

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🧪 Testing in Production

### Smoke Tests
After deployment, verify:
- [ ] App loads without errors
- [ ] User can create account (if Privy enabled)
- [ ] Dream entry creation works
- [ ] AI interpretation generates (if OpenAI enabled)
- [ ] Subscription modal opens
- [ ] Data persists between sessions

### Load Testing
Use tools like:
- **Artillery** for API load testing
- **Lighthouse** for performance auditing
- **WebPageTest** for real-world performance

## 📈 Scaling Considerations

### Database Scaling
- **Connection pooling** for high traffic
- **Read replicas** for better performance
- **Database indexing** optimization
- **Query optimization** for large datasets

### API Rate Limiting
- **Implement rate limiting** for AI API calls
- **Queue system** for batch processing
- **Caching** for repeated interpretations
- **Graceful degradation** when limits hit

### CDN & Caching
- **Static asset caching** (images, CSS, JS)
- **API response caching** where appropriate
- **Browser caching** headers
- **Service worker** for offline functionality

## 🆘 Troubleshooting

### Common Issues
1. **White screen on deployment**
   - Check build logs for errors
   - Verify environment variables
   - Check browser console for errors

2. **API calls failing**
   - Verify API keys are correct
   - Check CORS configuration
   - Ensure HTTPS in production

3. **Database connection issues**
   - Verify Supabase URL and key
   - Check RLS policies
   - Ensure proper authentication

4. **Encryption errors**
   - Verify encryption key length (32+ chars)
   - Check for special characters in key
   - Ensure consistent key across deployments

### Debug Mode
Enable debug logging in production:
```javascript
// Add to your .env for debugging
VITE_DEBUG_MODE=true
```

## 📞 Support

If you encounter issues during deployment:
1. Check the [GitHub Issues](https://github.com/vistara-apps/this-is-a-6316/issues)
2. Review the [README.md](README.md) for configuration details
3. Join our [GitHub Discussions](https://github.com/vistara-apps/this-is-a-6316/discussions)

---

**Happy Deploying!** 🚀 Your users' dreams are waiting to be analyzed!
