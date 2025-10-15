// Export all services for easy imports
export * from "./auth";
export * from "./products-enhanced";
export * from "./categories";
export * from "./orders-enhanced";
export * from "./reviews";
export * from "./coupons";
export * from "./wishlist";
export * from "./notifications";
export * from "./settings";
export * from "./http";

// Re-export commonly used services
export { http } from "./http";
export { login, refreshSession } from "./auth";
export { getProducts, getProductBySlug } from "./products-enhanced";
export { fetchCategories } from "./categories";
export { getCustomerOrders, createOrder } from "./orders-enhanced";
