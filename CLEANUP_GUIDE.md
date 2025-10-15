# 🧹 Cleanup & Optimization Guide

This document identifies files that can be safely removed or consolidated to reduce redundancy and improve maintainability.

## Files Analysis

### ✅ Keep - Essential Enhanced Components
These are the new, production-ready components we created:

```
src/components/ui/
├── EnhancedButton.tsx    ✅ KEEP - Enhanced version with gradient support
├── EnhancedInput.tsx     ✅ KEEP - Enhanced with password toggle, icons
├── Card.tsx              ✅ KEEP - New composable card system
├── Badge.tsx             ✅ KEEP - Complete badge system
├── Skeleton.tsx          ✅ KEEP - Loading states
├── Modal.tsx             ✅ KEEP - Bottom sheets and dialogs
└── index.ts              ✅ KEEP - Export aggregator
```

### ⚠️ Consider - Existing Components
These existing components might overlap with new ones:

```
src/components/ui/
├── Button.tsx            ⚠️ CONSOLIDATE - Replace usage with EnhancedButton
├── Input.tsx             ⚠️ CONSOLIDATE - Replace usage with EnhancedInput
├── Surface.tsx           ⚠️ REVIEW - Might be replaced by Card
├── SearchBar.tsx         ✅ KEEP - Specific component
├── QuantityStepper.tsx   ✅ KEEP - Specific component
├── BackButton.tsx        ✅ KEEP - Specific component
├── FilterChip.tsx        ✅ KEEP - Specific component
├── SectionHeader.tsx     ✅ KEEP - Specific component
└── Typography.tsx        ✅ KEEP - Typography helpers
```

### ✅ Keep - Essential Services
All service files should be kept:

```
src/services/
├── http.ts                  ✅ KEEP - HTTP client
├── auth.ts                  ✅ KEEP - Authentication
├── products.ts              ⚠️ MERGE - Can merge with products-enhanced.ts
├── products-enhanced.ts     ✅ KEEP - Enhanced product services
├── orders.ts                ⚠️ MERGE - Can merge with orders-enhanced.ts
├── orders-enhanced.ts       ✅ KEEP - Enhanced order services
├── categories.ts            ✅ KEEP - Category services
├── reviews.ts               ✅ KEEP - Review services
├── coupons.ts               ✅ KEEP - Coupon services
├── wishlist.ts              ✅ KEEP - Wishlist services
├── notifications.ts         ✅ KEEP - Notification services
├── settings.ts              ✅ KEEP - Settings services
└── index.ts                 ✅ KEEP - Export aggregator
```

### ✅ Keep - Contexts
All contexts are essential:

```
src/contexts/
├── AuthContext.tsx          ✅ KEEP - Authentication state
├── CartContext.tsx          ⚠️ EVALUATE - Compare with EnhancedCartContext
├── EnhancedCartContext.tsx  ✅ KEEP - Enhanced cart with persistence
└── SettingsContext.tsx      ✅ KEEP - App settings
```

## 🔄 Recommended Actions

### Phase 1: Consolidate Components (Optional)

If you want to fully migrate to enhanced components:

1. **Replace Button with EnhancedButton**
   ```bash
   # Find all usages
   grep -r "import.*Button.*from.*@/components/ui/Button" src/
   
   # Replace imports in files
   # from: import { Button } from '@/components/ui/Button'
   # to:   import { EnhancedButton as Button } from '@/components/ui/EnhancedButton'
   ```

2. **Replace Input with EnhancedInput**
   ```bash
   # Find all usages
   grep -r "import.*Input.*from.*@/components/ui/Input" src/
   
   # Replace imports
   # from: import { Input } from '@/components/ui/Input'
   # to:   import { EnhancedInput as Input } from '@/components/ui/EnhancedInput'
   ```

3. **After migration, remove old files:**
   ```bash
   # Only after confirming all usages are migrated
   rm src/components/ui/Button.tsx
   rm src/components/ui/Input.tsx
   ```

### Phase 2: Merge Service Files

1. **Merge products.ts into products-enhanced.ts**
   - Copy any unique functions from `products.ts`
   - Update all imports to use `products-enhanced.ts`
   - Delete `products.ts`

2. **Merge orders.ts into orders-enhanced.ts**
   - Copy any unique functions from `orders.ts`
   - Update all imports to use `orders-enhanced.ts`
   - Delete `orders.ts`

3. **Choose one Cart Context**
   - Migrate to `EnhancedCartContext.tsx` (recommended)
   - Update all imports
   - Delete `CartContext.tsx`

### Phase 3: Remove Unused Files

Check for truly unused files:

```bash
# Find files not imported anywhere
find src -name "*.tsx" -o -name "*.ts" | while read file; do
  filename=$(basename "$file" .tsx)
  filename=$(basename "$filename" .ts)
  if ! grep -r "from.*$filename" src/ --exclude="$file" > /dev/null; then
    echo "Potentially unused: $file"
  fi
done
```

## ⚡ Quick Cleanup Script

Create a file `cleanup.sh` in mobile directory:

```bash
#!/bin/bash

echo "🧹 Kachabazar Mobile Cleanup Script"
echo "======================================"

# Backup first
echo "📦 Creating backup..."
tar -czf ../mobile-backup-$(date +%Y%m%d-%H%M%S).tar.gz .

# Remove duplicate documentation lint errors (optional)
echo "📝 Documentation files ready..."

# Clean build artifacts
echo "🗑️  Cleaning build artifacts..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf .expo-shared

# Clean temp files
echo "🗑️  Cleaning temp files..."
find . -name ".DS_Store" -delete
find . -name "*.log" -delete
find . -name "npm-debug.log*" -delete

echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Review CLEANUP_GUIDE.md"
echo "2. Gradually migrate to enhanced components"
echo "3. Test thoroughly after each change"
echo "4. Update imports as needed"
```

## 🎯 Migration Priority

### High Priority (Do First)
1. ✅ Use `EnhancedCartContext` everywhere
2. ✅ Create `index.ts` files for easy imports
3. ✅ Consolidate duplicate services

### Medium Priority (Do Soon)
1. ⚠️ Migrate to `EnhancedButton` and `EnhancedInput`
2. ⚠️ Merge products/orders services
3. ⚠️ Remove unused components

### Low Priority (Do Later)
1. 📝 Add more component variants
2. 📝 Add more utility functions
3. 📝 Optimize bundle size

## 📊 File Organization Best Practices

### Current Structure (Good)
```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── cards/       # Card-specific components
│   ├── cart/        # Cart-specific components
│   ├── home/        # Home screen components
│   ├── layout/      # Layout components
│   └── common/      # Common/shared components
```

### Recommended Additions
```
src/
├── hooks/
│   ├── queries/     # React Query hooks
│   ├── mutations/   # React Query mutations
│   └── common/      # Common hooks
├── utils/
│   ├── formatting/  # Formatting utilities
│   ├── validation/  # Validation utilities
│   └── helpers/     # Helper functions
```

## 🔍 Before Deleting Any File

Always check:

1. **Search for imports:**
   ```bash
   grep -r "import.*from.*fileName" src/
   ```

2. **Search for dynamic imports:**
   ```bash
   grep -r "require.*fileName" src/
   ```

3. **Check for type-only imports:**
   ```bash
   grep -r "import type.*from.*fileName" src/
   ```

4. **Run TypeScript check:**
   ```bash
   npm run typecheck
   ```

5. **Run linter:**
   ```bash
   npm run lint
   ```

## ✅ Safe to Delete (After Migration)

These files can be safely deleted ONLY after:
1. All references are updated
2. Tests pass
3. App runs without errors

```
# Only delete after migration is complete and tested
src/components/ui/Button.tsx (after migrating to EnhancedButton)
src/components/ui/Input.tsx (after migrating to EnhancedInput)  
src/services/products.ts (after merging to products-enhanced)
src/services/orders.ts (after merging to orders-enhanced)
src/contexts/CartContext.tsx (after migrating to EnhancedCartContext)
```

## 🎨 Code Quality Improvements

### 1. Consistent Imports
Use the index files for cleaner imports:

```typescript
// Before
import { EnhancedButton } from '@/components/ui/EnhancedButton';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// After
import { EnhancedButton, Card, Badge } from '@/components/ui';
```

### 2. Consistent Service Imports
```typescript
// Before
import { getProducts } from '@/services/products-enhanced';
import { getCategories } from '@/services/categories';

// After
import { getProducts, fetchCategories } from '@/services';
```

### 3. Use Type Imports
```typescript
// Optimize bundle size
import type { Product, Category } from '@/types';
```

## 📈 Bundle Size Optimization

After cleanup:

1. **Analyze bundle:**
   ```bash
   npx expo-cli bundle-size
   ```

2. **Remove unused dependencies:**
   ```bash
   npx depcheck
   ```

3. **Update imports to be more specific:**
   ```typescript
   // Instead of
   import * as Icons from 'lucide-react-native';
   
   // Use
   import { Heart, ShoppingCart } from 'lucide-react-native';
   ```

## 🎉 Post-Cleanup Checklist

- [ ] All imports updated
- [ ] TypeScript check passes
- [ ] Linter passes
- [ ] App builds successfully
- [ ] All features work correctly
- [ ] No console errors
- [ ] Performance is good
- [ ] Bundle size reduced

---

**Remember:** Don't delete files until you're certain they're not needed. Always test thoroughly after each change.
