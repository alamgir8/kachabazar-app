# KachaBazar Mobile - React Native E-Commerce App

A modern, production-ready React Native e-commerce mobile application built with Expo, NativeWind, and TypeScript. Features a unique design, comprehensive functionality, and seamless integration with the KachaBazar backend API.

## 🚀 Features

### Core E-Commerce Features
- ✅ **User Authentication**
  - Email/Password login and registration
  - Email verification
  - OAuth integration (Google, Facebook)
  - Forgot password & reset
  - JWT token-based authentication with refresh tokens
  - Secure token storage using Expo Secure Store

- 🛍️ **Product Management**
  - Product listing with pagination
  - Advanced filtering (category, price range, rating)
  - Sorting options (popular, newest, price, rating, discount)
  - Search with real-time results
  - Product details with image gallery
  - Product variants support
  - Stock availability tracking
  - Related products suggestions

- 🛒 **Shopping Cart**
  - Add/remove items
  - Quantity management with stock validation
  - Persistent cart (AsyncStorage)
  - Coupon code application
  - Real-time total calculations
  - Swipe-to-delete functionality
  - Offline cart support

- 💳 **Checkout & Orders**
  - Multi-step checkout process
  - Multiple shipping addresses
  - Payment integration (Stripe, PayPal, Razorpay, COD)
  - Order history
  - Order tracking
  - Invoice download
  - Reorder functionality
  - Order status updates

- ⭐ **Reviews & Ratings**
  - View product reviews
  - Add/edit reviews
  - Rating distribution
  - Review images
  - Helpful votes
  - Purchase verification

- 💝 **Wishlist**
  - Add/remove products
  - Move to cart
  - Persistent wishlist
  - Wishlist sync across devices

- 🎟️ **Coupons & Discounts**
  - Browse available coupons
  - Apply coupon codes
  - Discount validation
  - Automatic discount calculation

- 🔔 **Notifications**
  - Push notifications
  - In-app notifications
  - Order updates
  - Promotional offers
  - Notification preferences

- 👤 **User Profile**
  - Profile management
  - Multiple shipping addresses
  - Password change
  - Order history
  - Wishlist management
  - Notification preferences

### Technical Features
- 📱 **Modern UI/UX**
  - Clean, intuitive interface
  - Smooth animations using React Native Reanimated
  - Gesture handlers
  - Custom design system
  - Dark mode support (planned)
  - Responsive layouts

- 🎨 **Design System**
  - NativeWind (TailwindCSS for React Native)
  - Custom color palette
  - Consistent typography
  - Reusable components
  - Accessibility support

- 🔧 **State Management**
  - React Context API
  - React Query for server state
  - AsyncStorage for persistence
  - Optimistic updates

- 🌐 **Offline Support**
  - Offline cart
  - Cached product data
  - Network status detection
  - Retry mechanisms

- ⚡ **Performance**
  - FlashList for optimized lists
  - Image lazy loading
  - Code splitting
  - Efficient re-renders

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- KachaBazar Backend API running

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd mobile
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_BASE_URL=http://your-backend-url/api/v1
EXPO_PUBLIC_API_PORT=5000

# Optional: OAuth credentials
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EXPO_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
```

### 4. Start the development server
```bash
npm run dev
# or
expo start --clear
```

### 5. Run on device/simulator

**iOS:**
```bash
npm run ios
# or press 'i' in the terminal
```

**Android:**
```bash
npm run android
# or press 'a' in the terminal
```

**Web:**
```bash
npm run web
# or press 'w' in the terminal
```

## 📁 Project Structure

```
mobile/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── (tabs)/            # Tab navigation screens
│   │   │   ├── index.tsx      # Home screen
│   │   │   ├── categories.tsx # Categories screen
│   │   │   ├── cart.tsx       # Cart screen
│   │   │   └── profile.tsx    # Profile screen
│   │   ├── auth/              # Authentication screens
│   │   ├── product/           # Product screens
│   │   ├── checkout/          # Checkout flow
│   │   ├── orders/            # Orders screens
│   │   └── _layout.tsx        # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   │   ├── EnhancedButton.tsx
│   │   │   ├── EnhancedInput.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── cards/            # Card components
│   │   ├── cart/             # Cart components
│   │   ├── home/             # Home screen components
│   │   └── layout/           # Layout components
│   ├── contexts/             # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── EnhancedCartContext.tsx
│   │   └── SettingsContext.tsx
│   ├── hooks/                # Custom hooks
│   │   ├── queries/          # React Query hooks
│   │   └── useAuth.ts
│   ├── services/             # API services
│   │   ├── http.ts           # HTTP client
│   │   ├── auth.ts
│   │   ├── products-enhanced.ts
│   │   ├── categories.ts
│   │   ├── orders-enhanced.ts
│   │   ├── reviews.ts
│   │   ├── coupons.ts
│   │   ├── wishlist.ts
│   │   └── notifications.ts
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   ├── constants/            # App constants
│   ├── theme/                # Theme configuration
│   └── styles/               # Global styles
├── assets/                   # Static assets
├── tailwind.config.js        # TailwindCSS config
├── app.json                  # Expo config
└── package.json

```

## 🎨 Design System

### Colors
- **Primary**: Fresh green palette (#10b981)
- **Accent**: Orange for CTAs (#f97316)
- **Neutral**: Grayscale for text and backgrounds
- **Semantic**: Success, Error, Warning, Info colors

### Typography
- Font sizes: 2xs to 5xl
- System fonts for native look
- Consistent line heights

### Components
- **Buttons**: 5 sizes, 7 variants, gradient support
- **Cards**: Multiple variants and padding options
- **Badges**: Size and color variants
- **Inputs**: Enhanced with icons, validation, password toggle
- **Modals**: Bottom sheets and dialogs
- **Skeletons**: Loading states

## 🔌 API Integration

### Base Configuration
The app uses Axios for HTTP requests with automatic token management, request/response interceptors, and error handling.

### Available Services
- **auth.ts**: Authentication (login, register, OAuth)
- **products-enhanced.ts**: Product operations
- **categories.ts**: Category management
- **orders-enhanced.ts**: Order operations
- **reviews.ts**: Reviews and ratings
- **coupons.ts**: Coupon management
- **wishlist.ts**: Wishlist operations
- **notifications.ts**: Notifications

### Error Handling
- Network error detection
- Token refresh on 401
- User-friendly error messages
- Retry mechanisms

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 📦 Building for Production

### Android
```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

### iOS
```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

## 🚀 Deployment

### Configure EAS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### Submit to Stores
```bash
# Android
eas submit --platform android

# iOS
eas submit --platform ios
```

## 🔧 Configuration

### Backend URL
Update the backend URL in:
1. `.env` file for development
2. `app.json` for production builds
3. `src/constants/index.ts` as fallback

### App Icon & Splash
- Icon: `src/assets/icon.png` (1024x1024)
- Splash: `src/assets/splash.png`
- Adaptive icon: `src/assets/adaptive-icon.png`

## 📊 Performance Optimization

- **FlashList** for large lists (60fps scrolling)
- **Image optimization** with lazy loading
- **Code splitting** with Expo Router
- **Memoization** for expensive calculations
- **React Query** caching strategies
- **AsyncStorage** for offline data

## 🐛 Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
```

## 📄 License

This project is licensed for regular use. See the LICENSE file for details.

## 👥 Support

For support, email support@kachabazar.com or open an issue in the repository.

## 🎯 Roadmap

- [ ] Dark mode support
- [ ] Multi-language support (i18n)
- [ ] Social sharing
- [ ] Product comparisons
- [ ] Live chat support
- [ ] Augmented reality product preview
- [ ] Voice search
- [ ] Barcode scanning
- [ ] Price alerts
- [ ] Order scheduling

## 🙏 Acknowledgments

- Expo team for the amazing framework
- NativeWind for TailwindCSS support
- React Native community
- All contributors

---

Built with ❤️ for KachaBazar
