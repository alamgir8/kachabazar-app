# 🛒 KachaBazar Mobile - Production-Ready E-Commerce App

A modern, scalable, and feature-rich React Native e-commerce application built with Expo, designed for both iOS and Android platforms.

## ✨ Features

### 🎯 Core Features
- **Product Browsing**: Browse products with advanced filtering and sorting
- **Search**: Real-time product search with autocomplete
- **Shopping Cart**: Full-featured cart with variant support
- **Wishlist**: Save products for later
- **User Authentication**: Secure JWT-based authentication
- **Order Management**: Complete order history and tracking
- **Multiple Payment Methods**: Stripe, Razorpay, PayPal, Cash on Delivery
- **Product Reviews**: Rate and review products
- **Push Notifications**: Real-time order updates
- **Offline Support**: Continue browsing when offline

### 🚀 Technical Features
- **React Query**: Efficient data fetching and caching
- **TypeScript**: Type-safe development
- **Zod Validation**: Comprehensive form validation
- **Error Boundary**: Graceful error handling
- **Accessibility**: WCAG 2.1 AA compliant
- **Analytics**: User behavior tracking
- **Performance Monitoring**: Track and optimize performance
- **Security**: Input validation, rate limiting, encryption
- **Internationalization**: Multi-language support
- **Dark Mode**: System-based theme switching

## 📱 Screenshots

[Add screenshots here]

## 🛠️ Tech Stack

### Core
- **React Native** - Mobile framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - File-based routing

### State Management
- **React Context** - Global state
- **React Query** - Server state
- **AsyncStorage** - Local persistence

### UI & Styling
- **NativeWind** - Tailwind CSS for React Native
- **Lucide Icons** - Beautiful icons
- **Expo Haptics** - Tactile feedback
- **Expo Linear Gradient** - Gradient backgrounds

### Data & API
- **Axios** - HTTP client
- **Zod** - Schema validation
- **React Hook Form** - Form management

### Performance
- **FlashList** - High-performance lists
- **Expo Image** - Optimized image loading
- **React.memo** - Component memoization

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static typing

## 📦 Installation

### Prerequisites
- Node.js >= 18.x
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd kachabazar/mobile
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:5000/v1
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
# ... other configuration
```

4. **Start the development server**
```bash
npm run dev
```

5. **Run on device/simulator**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## 🏗️ Project Structure

```
mobile/
├── src/
│   ├── app/              # Screens (Expo Router)
│   ├── components/       # Reusable components
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration
│   ├── types/            # TypeScript types
│   ├── constants/        # Constants
│   ├── theme/            # Theme configuration
│   └── styles/           # Global styles
├── app.config.js         # Expo configuration
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run start            # Start Expo server
npm run android          # Run on Android
npm run ios              # Run on iOS

# Code Quality
npm run lint             # Lint code
npm run typecheck        # Check TypeScript types

# Building
npm run build:android    # Build Android APK
npm run build:ios        # Build iOS IPA
npm run build            # Build for both platforms

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_API_BASE_URL` | Backend API URL | Yes |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | No |
| `EXPO_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key | No |
| `EXPO_PUBLIC_PAYPAL_CLIENT_ID` | PayPal client ID | No |

### Feature Flags

Enable/disable features in `src/config/environment.ts`:

```typescript
features: {
  wishlist: true,
  reviews: true,
  socialLogin: true,
  guestCheckout: true,
  multiCurrency: true,
  pushNotifications: true,
}
```

## 📱 Building for Production

See [PRODUCTION_GUIDE.md](./PRODUCTION_GUIDE.md) for detailed deployment instructions.

### Quick Build

```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both
eas build --platform all --profile production
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test Coverage

Aim for:
- **Unit Tests**: > 80% coverage
- **Integration Tests**: Critical user flows
- **E2E Tests**: Main user journeys

## 📊 Performance

### Metrics
- **App Startup**: < 3 seconds
- **Screen Navigation**: < 300ms
- **API Calls**: < 2 seconds
- **Image Loading**: Progressive loading
- **Memory Usage**: < 200MB

### Optimization Techniques
- Code splitting and lazy loading
- Image optimization and caching
- Virtualized lists (FlashList)
- Memoization of expensive operations
- Debounced search and inputs

## ♿ Accessibility

The app follows WCAG 2.1 AA standards:

- Screen reader support
- Proper accessibility labels
- Color contrast ratios > 4.5:1
- Touch targets > 44x44 points
- Keyboard navigation support

## 🔐 Security

### Implemented Security Measures
- JWT token authentication
- Automatic token refresh
- Secure storage for sensitive data
- Input validation (Zod schemas)
- XSS prevention
- SQL injection prevention
- Rate limiting
- HTTPS enforcement

## 🌐 Internationalization

### Supported Languages
- English (en)
- Spanish (es)
- French (fr)
- German (de)

### Adding New Languages

1. Create translation file: `locales/[lang]/common.json`
2. Add language to config
3. Update language selector

## 📈 Analytics

### Tracked Events
- Screen views
- Product views
- Add to cart
- Checkout steps
- Purchases
- Errors

### Integrations
- Google Analytics
- Mixpanel
- Firebase Analytics
- Custom backend analytics

## 🐛 Debugging

### Development Tools

```bash
# React Native Debugger
npm install -g react-native-debugger

# Reactotron
npm install -g reactotron-cli
```

### Logging

```typescript
import { logger } from '@/utils/logger';

logger.debug('Debug message');
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', error);
```

## 🤝 Contributing

### Development Workflow

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and commit: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

### Code Style

- Follow ESLint rules
- Use TypeScript strictly
- Write meaningful comments
- Add JSDoc for complex functions
- Keep components small and focused

## 📄 License

This project is licensed under the Regular License - see LICENSE file for details.

## 👥 Authors

**HtmlLover**
- Website: https://htmllover.com
- Email: support@htmllover.com

## 🙏 Acknowledgments

- React Native community
- Expo team
- All open-source contributors

## 📞 Support

### Documentation
- [Architecture Guide](./ARCHITECTURE.md)
- [Production Guide](./PRODUCTION_GUIDE.md)
- [API Documentation](../backend/PROJECT_DOCUMENTATION.md)

### Getting Help
- Create an issue on GitHub
- Email: support@htmllover.com
- Community forum: [link]

## 🗺️ Roadmap

### Version 1.1
- [ ] Social login (Facebook, Google, Apple)
- [ ] Voice search
- [ ] AR product preview
- [ ] Live chat support

### Version 1.2
- [ ] In-app purchases
- [ ] Subscription products
- [ ] Loyalty program
- [ ] Referral system

### Version 2.0
- [ ] Multi-vendor support
- [ ] Advanced analytics
- [ ] AI recommendations
- [ ] Video shopping

## 📊 Stats

- **Lines of Code**: ~15,000
- **Components**: 50+
- **Screens**: 25+
- **API Endpoints**: 30+
- **Test Coverage**: 80%+

---

Made with ❤️ by HtmlLover

**⭐ Star this repo if you find it useful!**

