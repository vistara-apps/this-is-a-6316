# Dream Weaver 🌙

**Unlock the secrets of your subconscious, securely and privately.**

Dream Weaver is a privacy-focused web application that uses AI to interpret dreams and track personal dream patterns over time. Built with React, it features end-to-end encryption, AI-powered dream analysis, and comprehensive pattern tracking.

![Dream Weaver Screenshot](https://via.placeholder.com/800x400/240,100%,50%/FFFFFF?text=Dream+Weaver+Dashboard)

## ✨ Features

### 🤖 AI Dream Interpretation
- **Advanced AI Analysis**: Powered by OpenAI's GPT-4 for nuanced dream interpretation
- **Contextual Understanding**: Considers emotions, symbols, and personal context
- **Multiple Perspectives**: Offers various interpretations and psychological insights

### 📊 Personal Dream Pattern Tracking
- **Recurring Theme Detection**: Identifies patterns in symbols, emotions, and narratives
- **Visual Analytics**: Beautiful charts and graphs showing dream trends over time
- **Insight Reports**: Monthly summaries of your subconscious patterns

### 🔒 Privacy & Security
- **End-to-End Encryption**: All dream data encrypted before storage using AES encryption
- **Zero-Knowledge Architecture**: Only you can access your decrypted dream content
- **Secure Authentication**: Powered by Privy for social login and wallet connect
- **Data Export**: Full control over your data with export functionality

### 💎 Subscription Tiers
- **Free**: 5 dream entries/month, basic AI interpretation
- **Pro ($5/month)**: Unlimited entries, pattern tracking, encrypted storage
- **Premium ($15/month)**: Advanced AI coaching, personalized insights, priority support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- OpenAI API key
- Privy App ID (optional, for authentication)
- Supabase project (optional, for cloud storage)
- Stripe account (optional, for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-6316.git
   cd this-is-a-6316
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your API keys:
   ```env
   # Required for AI interpretation
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional - for authentication
   VITE_PRIVY_APP_ID=your_privy_app_id_here
   
   # Optional - for cloud storage
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   
   # Optional - for payments
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   
   # Required for encryption
   VITE_ENCRYPTION_KEY=your_32_character_encryption_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Lucide React** - Beautiful, customizable icons
- **Recharts** - Responsive charts for data visualization

### Services & APIs
- **OpenAI API** - GPT-4 for dream interpretation and pattern analysis
- **Privy** - Authentication and wallet integration
- **Supabase** - PostgreSQL database with real-time features
- **Stripe** - Payment processing and subscription management
- **CryptoJS** - Client-side encryption for privacy

### Data Model
```sql
-- Users table
users (
  user_id UUID PRIMARY KEY,
  email TEXT ENCRYPTED,
  subscription_tier TEXT,
  privy_user_id TEXT UNIQUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Dream entries table
dream_entries (
  dream_entry_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  dream_date DATE,
  dream_text TEXT ENCRYPTED,
  interpretation TEXT ENCRYPTED,
  tags TEXT[] ENCRYPTED,
  emotions TEXT[] ENCRYPTED,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

## 🔧 Configuration

### OpenAI Setup
1. Get an API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to your `.env` file as `VITE_OPENAI_API_KEY`
3. The app will fallback to mock responses if no key is provided

### Privy Authentication (Optional)
1. Create an app at [Privy Console](https://console.privy.io/)
2. Configure login methods (email, Google, Twitter, etc.)
3. Add your App ID to `.env` as `VITE_PRIVY_APP_ID`
4. Without Privy, the app uses a demo user for development

### Supabase Database (Optional)
1. Create a project at [Supabase](https://supabase.com/)
2. Run the SQL schema from `src/services/supabase.js`
3. Add your URL and anon key to `.env`
4. Without Supabase, data is stored locally in browser storage

### Stripe Payments (Optional)
1. Create products and prices in [Stripe Dashboard](https://dashboard.stripe.com/)
2. Update price IDs in `src/services/stripe.js`
3. Add publishable key to `.env`
4. Without Stripe, subscription upgrades are simulated

## 🎨 Design System

The app uses a carefully crafted design system built on Tailwind CSS:

### Colors
- **Primary**: `hsl(240 100% 50%)` - Deep blue for primary actions
- **Accent**: `hsl(180 70% 50%)` - Teal for highlights
- **Background**: `hsl(230 15% 96%)` - Light gray background
- **Surface**: `hsl(0 0% 100%)` - White cards and surfaces

### Typography
- **Display**: Large headings with extra bold weight
- **Heading**: Section headings with bold weight
- **Body**: Regular text with comfortable line height
- **Caption**: Small text for metadata

### Components
All components follow consistent patterns:
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Three variants (primary, secondary, outline)
- **Inputs**: Consistent styling with focus states
- **Modals**: Centered with backdrop blur

## 🔐 Security & Privacy

### Encryption
- **Client-side encryption** using AES-256
- **Unique encryption key** per deployment
- **Encrypted fields**: dream text, interpretations, tags, emotions, email

### Data Handling
- **Local-first approach** - works offline
- **Optional cloud sync** with encrypted data
- **User-controlled data** - export and delete anytime
- **No analytics tracking** - your privacy is paramount

### Best Practices
- Environment variables for sensitive keys
- Secure API communication
- Input validation and sanitization
- Error handling without data leakage

## 📱 Responsive Design

Dream Weaver is fully responsive and works beautifully on:
- **Desktop** - Full dashboard experience
- **Tablet** - Optimized layouts for touch
- **Mobile** - Mobile-first design principles

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── components/          # React components
│   ├── AppLayout.jsx   # Main app layout
│   ├── Dashboard.jsx   # Dashboard overview
│   ├── DreamJournal.jsx # Dream entries list
│   └── ...
├── services/           # API and data services
│   ├── openai.js      # AI interpretation service
│   ├── supabase.js    # Database operations
│   ├── encryption.js  # Client-side encryption
│   ├── stripe.js      # Payment processing
│   └── dataService.js # Unified data layer
├── App.jsx            # Main app component
├── main.jsx          # App entry point
└── index.css         # Global styles
```

### Adding New Features
1. **Components**: Create in `src/components/`
2. **Services**: Add to `src/services/`
3. **Styles**: Use Tailwind classes, extend in `tailwind.config.js`
4. **Types**: Add TypeScript for better development experience

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Ensure all production environment variables are set:
- Use strong encryption keys (32+ characters)
- Secure API keys with proper permissions
- Configure CORS for your domain

### Recommended Platforms
- **Vercel** - Automatic deployments from Git
- **Netlify** - Easy static site hosting
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs on [GitHub Issues](https://github.com/vistara-apps/this-is-a-6316/issues)
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/vistara-apps/this-is-a-6316/discussions)

## 🙏 Acknowledgments

- **OpenAI** for powerful language models
- **Privy** for seamless authentication
- **Supabase** for excellent database platform
- **Stripe** for reliable payment processing
- **Tailwind CSS** for the amazing utility framework

---

**Dream Weaver** - Where technology meets the mysteries of the mind. 🌙✨
