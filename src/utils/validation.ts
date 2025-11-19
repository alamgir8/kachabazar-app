import { z } from "zod";

/**
 * Comprehensive validation schemas using Zod
 * Provides type-safe form validation for all user inputs
 */

// Email validation
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .trim()
  .toLowerCase();

// Password validation (minimum 8 characters, at least one letter and one number)
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[A-Za-z])(?=.*\d)/,
    "Password must contain at least one letter and one number"
  );

// Phone number validation (international format)
export const phoneSchema = z
  .string()
  .regex(
    /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
    "Invalid phone number"
  )
  .optional()
  .or(z.literal(""));

// Name validation
export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .trim();

// Address validation
export const addressSchema = z
  .string()
  .min(5, "Address must be at least 5 characters")
  .max(200, "Address must be less than 200 characters")
  .trim();

// Zip code validation
export const zipCodeSchema = z
  .string()
  .regex(/^[0-9]{4,10}$/, "Invalid zip code")
  .optional()
  .or(z.literal(""));

// City validation
export const citySchema = z
  .string()
  .min(2, "City must be at least 2 characters")
  .max(50, "City must be less than 50 characters")
  .trim();

// Country validation
export const countrySchema = z
  .string()
  .min(2, "Country is required")
  .max(50, "Country must be less than 50 characters")
  .trim();

/**
 * Authentication Schemas
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const newPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Profile Schemas
 */
export const updateProfileSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema.optional(),
  city: citySchema.optional(),
  country: countrySchema.optional(),
});

/**
 * Shipping Address Schema
 */
export const shippingAddressSchema = z.object({
  name: nameSchema,
  contact: phoneSchema,
  email: emailSchema.optional(),
  address: addressSchema,
  city: citySchema,
  country: countrySchema,
  zipCode: zipCodeSchema,
});

/**
 * Review Schema
 */
export const reviewSchema = z.object({
  product: z.string().min(1, "Product ID is required"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters")
    .trim(),
  images: z.array(z.string().url()).optional(),
});

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be less than 100 characters")
    .trim(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .trim(),
});

/**
 * Search Schema
 */
export const searchSchema = z.object({
  query: z
    .string()
    .min(2, "Search query must be at least 2 characters")
    .max(100, "Search query must be less than 100 characters")
    .trim(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: z.enum(["popular", "price-asc", "price-desc", "newest"]).optional(),
});

/**
 * Coupon Code Schema
 */
export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be less than 20 characters")
    .trim()
    .toUpperCase(),
});

/**
 * Type inference helpers
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type CouponInput = z.infer<typeof couponSchema>;

/**
 * Validation helper function
 */
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown) => {
  try {
    schema.parse(value);
    return { success: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Validation failed",
      };
    }
    return { success: false, error: "Validation failed" };
  }
};


