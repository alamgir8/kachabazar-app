# Product Variant Selection - Usage Guide

## 🎯 **How to Use the Updated Product Page**

### For End Users:

1. **View Product**
   - Navigate to any product detail page
   - See product images, price, and description

2. **Select Variants** (if product has variants)
   - Look for variant options below the price (e.g., Size, Color, Weight)
   - Tap on any option to select it
   - Selected option will highlight in green
   - Price, stock, and image may update based on selection

3. **Choose Quantity**
   - Use - / + buttons to adjust quantity
   - Minimum quantity is 1

4. **Add to Cart**
   - Tap "Add to Cart" button
   - If variants exist, all must be selected first
   - Success alert shows if added successfully
   - Error alert shows if:
     - Stock insufficient
     - Variant not fully selected

### For Developers:

#### **Quick Start**

The product page now automatically handles variants. No additional configuration needed!

#### **How It Works Under the Hood**

```typescript
// 1. Fetch product, attributes, and related data
const productQuery = useProduct(slug);
const attributesQuery = useAttributes();

// 2. Initialize variant management hook
const {
  price,          // Current price based on variant
  stock,          // Current stock based on variant
  discount,       // Current discount percentage
  selectedImage,  // Variant-specific image
  originalPrice,  // Original price for comparison
  selectVariant,  // Currently selected variant object
  setSelectVariant, // Function to update selection
  setValue,       // Function to trigger recalculation
  variantTitle,   // Attribute definitions
  handleAddToCart // Smart add-to-cart with validation
} = useProductAction({ product, attributes, globalSetting });

// 3. Handle variant selection
<Pressable
  onPress={() => {
    setValue(variant._id);
    setSelectVariant({
      ...selectVariant,
      [attributeId]: variantId,
    });
  }}
>
  {/* Variant Option UI */}
</Pressable>

// 4. Add to cart
const handleAddToCartClick = () => {
  const result = addToCartAction(quantity);
  if (!result.success) {
    Alert.alert("Error", result.message);
  }
};
```

#### **API Requirements**

Your backend must support:

1. **Product Variants Structure:**
```json
{
  "_id": "product123",
  "title": { "en": "T-Shirt" },
  "variants": [
    {
      "_id": "var1",
      "attributeId1": "variantOptionId1",
      "attributeId2": "variantOptionId2",
      "price": 29.99,
      "originalPrice": 39.99,
      "quantity": 10,
      "image": "https://..."
    }
  ]
}
```

2. **Attributes Structure:**
```json
{
  "_id": "attr1",
  "name": { "en": "Size" },
  "variants": [
    {
      "_id": "size_m",
      "name": { "en": "Medium" },
      "status": "show"
    }
  ],
  "option": "radio",
  "status": "show"
}
```

3. **Endpoints:**
   - `GET /products/:slug` - Get product with variants
   - `GET /attributes/show` - Get all active attributes

#### **Customization**

**Change Variant Button Style:**
```tsx
// In /mobile/src/app/product/[slug].tsx
<Pressable
  className={`px-4 py-2.5 rounded-xl border-2 ${
    isSelected
      ? "bg-primary-50 border-primary-500"  // ← Change these
      : "bg-white border-slate-200"          // ← Change these
  }`}
>
```

**Change Success/Error Messages:**
```tsx
// In /mobile/src/hooks/useProductAction.ts
if (stock <= 0) {
  return { success: false, message: "Insufficient stock" }; // ← Change message
}
```

**Add Custom Validation:**
```typescript
// In handleAddToCart function
const handleAddToCartClick = () => {
  // Your custom validation here
  if (quantity > 10) {
    Alert.alert("Error", "Maximum 10 items per order");
    return;
  }
  
  const result = addToCartAction(quantity);
  // ... rest of the code
};
```

### 🔍 **Troubleshooting**

**Problem: Variants not showing**
- ✅ Check if product has `variants` array with items
- ✅ Verify attributes endpoint returns data
- ✅ Ensure variant status is "show"

**Problem: Price not updating**
- ✅ Check if variant has `price` field
- ✅ Verify `setValue()` is being called
- ✅ Check console for errors

**Problem: Can't add to cart**
- ✅ Ensure all variants are selected
- ✅ Check stock > 0
- ✅ Verify product data structure matches expected format

**Problem: Images not switching**
- ✅ Verify variant has `image` field
- ✅ Check if selectedImage is in displayImages array
- ✅ Ensure image URL is valid

### 📱 **Testing Checklist**

Before deploying, test:

- [ ] Product without variants loads correctly
- [ ] Product with 1 variant attribute works
- [ ] Product with multiple variant attributes works
- [ ] Price updates when variant changes
- [ ] Stock updates when variant changes
- [ ] Image switches when variant has image
- [ ] Add to cart with no variants
- [ ] Add to cart with variants selected
- [ ] Add to cart error when variant not selected
- [ ] Add to cart error when out of stock
- [ ] Quantity increment/decrement
- [ ] Success alert shows on add
- [ ] Cart displays correct variant in title

### 🚀 **Performance Tips**

1. **Attributes are cached** - They're fetched once and reused
2. **Images are lazy loaded** - Only load when visible
3. **Efficient re-renders** - Only updates when data changes
4. **Optimistic UI** - Button states update immediately

### 📚 **Related Files**

- `/mobile/src/app/product/[slug].tsx` - Main product page
- `/mobile/src/hooks/useProductAction.ts` - Variant logic
- `/mobile/src/services/attributes.ts` - Attributes API
- `/mobile/src/hooks/queries/useAttributes.ts` - Attributes query
- `/mobile/src/components/ui/QuantityStepper.tsx` - Quantity selector

### 💡 **Pro Tips**

1. **Variant Names**: Use descriptive names in the admin panel
2. **Images**: Add variant-specific images for better UX
3. **Stock**: Keep variant quantities updated in real-time
4. **Pricing**: Test discount calculations with edge cases
5. **Localization**: Add translations for all languages

---

**Need Help?** Check the implementation in the web version at `/store/src/hooks/useProductAction.js` for reference.
