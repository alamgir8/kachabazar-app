# KachaBazar Mobile - Architecture Documentation

## 🏗️ Architecture Overview

This document describes the architecture and design patterns used in the KachaBazar mobile application.

## 📁 Project Structure

```
mobile/
├── src/
│   ├── app/                    # Expo Router screens
│   │   ├── (tabs)/            # Tab navigation screens
│   │   ├── auth/              # Authentication screens
│   │   ├── checkout/          # Checkout flow
│   │   ├── orders/            # Order management
│   │   ├── product/           # Product details
│   │   └── _layout.tsx        # Root layout
│   │
│   ├── components/            # Reusable components
│   │   ├── cards/            # Card components
│   │   ├── cart/             # Cart-related components
│   │   ├── common/           # Common UI components
│   │   ├── home/             # Home screen components
│   │   ├── layout/           # Layout components
│   │   └── ui/               # Base UI components
│   │
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.tsx   # Authentication state
│   │   ├── CartContext.tsx   # Shopping cart state
│   │   └── SettingsContext.tsx # App settings
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── mutations/        # React Query mutations
│   │   ├── queries/          # React Query queries
│   │   └── useDebounce.ts    # Utility hooks
│   │
│   ├── services/             # API services
│   │   ├── http.ts           # HTTP client
│   │   ├── http-enhanced.ts  # Enhanced HTTP with retry
│   │   ├── auth.ts           # Auth API
│   │   ├── products.ts       # Products API
│   │   ├── orders.ts         # Orders API
│   │   └── ...               # Other services
│   │
│   ├── utils/                # Utility functions
│   │   ├── logger.ts         # Logging system
│   │   ├── analytics.ts      # Analytics tracking
│   │   ├── security.ts       # Security utilities
│   │   ├── validation.ts     # Form validation (Zod)
│   │   ├── accessibility.ts  # A11y utilities
│   │   ├── performance.ts    # Performance utilities
│   │   └── offline.ts        # Offline support
│   │
│   ├── config/               # Configuration
│   │   └── environment.ts    # Environment config
│   │
│   ├── types/                # TypeScript types
│   │   └── index.ts          # Shared types
│   │
│   ├── constants/            # Constants
│   │   └── index.ts          # App constants
│   │
│   ├── theme/                # Theme configuration
│   │   └── index.ts          # Theme colors, spacing
│   │
│   └── styles/               # Global styles
│       └── global.css        # Tailwind/NativeWind styles
│
├── app.config.js             # Expo configuration
├── eas.json                  # EAS Build configuration
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🎯 Design Patterns

### 1. Component Architecture

#### Atomic Design Principles
- **Atoms**: Basic UI elements (Button, Input, Text)
- **Molecules**: Simple component groups (SearchBar, ProductCard)
- **Organisms**: Complex components (Header, ProductCarousel)
- **Templates**: Page layouts (Screen wrapper)
- **Pages**: Complete screens (HomeScreen, ProductDetailScreen)

#### Component Structure
```typescript
// Good component structure
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
}) => {
  // Hooks at the top
  const navigation = useNavigation();
  
  // Event handlers
  const handlePress = useCallback(() => {
    analytics.trackProductView(product.id, product.name, product.price);
    onPress?.(product);
  }, [product, onPress]);
  
  // Render
  return (
    <Pressable onPress={handlePress}>
      {/* Component JSX */}
    </Pressable>
  );
};
```

### 2. State Management

#### Context for Global State
```typescript
// AuthContext for authentication
<AuthProvider>
  <App />
</AuthProvider>

// CartContext for shopping cart
<CartProvider>
  <App />
</CartProvider>
```

#### React Query for Server State
```typescript
// Queries for fetching data
const { data, isLoading } = useProducts();

// Mutations for updates
const { mutate } = useCreateOrderMutation();
```

#### Local State with useState/useReducer
```typescript
// Simple local state
const [isOpen, setIsOpen] = useState(false);

// Complex local state
const [state, dispatch] = useReducer(reducer, initialState);
```

### 3. Data Fetching

#### React Query Pattern
```typescript
// Query hook
export const useProducts = (params?: ProductQueryParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.products, params],
    queryFn: () => fetchProducts(params),
    staleTime: 1000 * 60, // 1 minute
  });

// Mutation hook
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries([QUERY_KEYS.orders]);
    },
  });
};
```

### 4. Error Handling

#### Error Boundary
```typescript
<ErrorBoundary fallback={CustomErrorUI}>
  <App />
</ErrorBoundary>
```

#### API Error Handling
```typescript
try {
  const data = await api.fetchData();
} catch (error) {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      // Handle unauthorized
    } else {
      // Handle other errors
    }
  }
  logger.error("Operation failed", error);
}
```

### 5. Navigation

#### File-Based Routing (Expo Router)
```
app/
├── (tabs)/
│   ├── index.tsx      -> /
│   ├── categories.tsx -> /categories
│   └── profile.tsx    -> /profile
├── product/
│   └── [slug].tsx     -> /product/:slug
└── _layout.tsx
```

#### Navigation Usage
```typescript
import { useRouter } from "expo-router";

const router = useRouter();
router.push("/product/123");
router.back();
```

## 🔐 Security Architecture

### 1. Authentication Flow

```
User Login -> API Request -> JWT Token -> Secure Storage
                                       -> Refresh Token -> Secure Storage
```

### 2. Token Management
- Access tokens stored in SecureStore
- Automatic token refresh on 401
- Token expiration handling
- Logout clears all tokens

### 3. Data Encryption
- Sensitive data encrypted before storage
- HTTPS for all API calls
- Certificate pinning (production)

### 4. Input Validation
- Zod schemas for all forms
- XSS prevention
- SQL injection prevention
- Rate limiting

## 📊 Performance Optimization

### 1. Code Splitting
```typescript
// Lazy load heavy components
const HeavyComponent = React.lazy(() => import('./Heavy'));
```

### 2. Memoization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data);
}, [data]);

// Memoize callbacks
const handlePress = useCallback(() => {
  doSomething();
}, [dependency]);
```

### 3. List Optimization
```typescript
// Use FlashList for better performance
<FlashList
  data={items}
  renderItem={renderItem}
  estimatedItemSize={100}
/>
```

### 4. Image Optimization
```typescript
// Use OptimizedImage component
<OptimizedImage
  source={imageUrl}
  cachePolicy="memory-disk"
  priority="high"
/>
```

## 🎨 Styling Architecture

### NativeWind (Tailwind CSS)

#### Utility-First Approach
```typescript
<View className="flex-1 bg-white p-4">
  <Text className="text-xl font-bold text-gray-900">
    Hello World
  </Text>
</View>
```

#### Theme Configuration
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {...},
      accent: {...},
    },
  },
}
```

#### Responsive Design
```typescript
<View className="w-full md:w-1/2 lg:w-1/3">
  {/* Responsive width */}
</View>
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Component tests
describe('ProductCard', () => {
  it('renders correctly', () => {
    // Test implementation
  });
});
```

### Integration Tests
```typescript
// API integration tests
describe('Products API', () => {
  it('fetches products successfully', async () => {
    // Test implementation
  });
});
```

### E2E Tests
```typescript
// End-to-end flow tests
describe('Checkout Flow', () => {
  it('completes purchase successfully', async () => {
    // Test implementation
  });
});
```

## 📱 Platform-Specific Code

### Conditional Rendering
```typescript
import { Platform } from 'react-native';

const styles = Platform.select({
  ios: { paddingTop: 20 },
  android: { paddingTop: 10 },
});
```

### Platform Files
```
Component.tsx       # Shared
Component.ios.tsx   # iOS only
Component.android.tsx # Android only
```

## 🔄 Offline Support

### Strategy
1. Cache API responses
2. Queue mutations when offline
3. Sync when back online
4. Show offline indicator

### Implementation
```typescript
// Check network status
const isOnline = offlineManager.getIsOnline();

// Queue request when offline
if (!isOnline) {
  offlineManager.queueRequest(url, method, data);
}
```

## 📈 Analytics Architecture

### Event Tracking
```typescript
// Track screen view
analytics.trackScreenView("ProductDetail");

// Track user action
analytics.trackEvent("add_to_cart", {
  product_id: "123",
  price: 29.99,
});
```

### User Properties
```typescript
analytics.setUserProperties({
  userId: user.id,
  email: user.email,
  plan: "premium",
});
```

## 🌐 Internationalization (i18n)

### Structure
```typescript
// Load translations
const t = useTranslation();

// Use translations
<Text>{t('common.welcome')}</Text>
```

### Language Files
```
locales/
├── en/
│   └── common.json
├── es/
│   └── common.json
└── fr/
    └── common.json
```

## 🚀 Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
eas build --platform all --profile production
```

### OTA Updates
```bash
eas update --branch production
```

## 📝 Code Quality

### Linting
```bash
npm run lint
```

### Type Checking
```bash
npm run typecheck
```

### Formatting
```bash
npm run format
```

## 🔍 Monitoring

### Crash Reporting
- Sentry for crash tracking
- Error boundaries for graceful failures
- Comprehensive logging

### Performance Monitoring
- Track app startup time
- Monitor API latency
- Measure screen render times

### User Analytics
- Track user flows
- Monitor conversion rates
- Analyze user behavior

## 🎓 Best Practices

### 1. Component Design
- Keep components small and focused
- Use TypeScript for type safety
- Write meaningful prop types
- Document complex components

### 2. State Management
- Lift state only when necessary
- Use Context for global state
- Use React Query for server state
- Keep local state minimal

### 3. Performance
- Memoize expensive operations
- Use proper list components
- Optimize images
- Lazy load when possible

### 4. Security
- Never commit secrets
- Validate all inputs
- Use HTTPS everywhere
- Implement proper authentication

### 5. Accessibility
- Add accessibility labels
- Support screen readers
- Ensure proper contrast
- Make touch targets large enough

---

This architecture is designed to be:
- **Scalable**: Easy to add new features
- **Maintainable**: Clear code organization
- **Performant**: Optimized for mobile
- **Secure**: Following security best practices
- **Accessible**: Usable by everyone

