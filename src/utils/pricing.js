/**
 * Pricing and Discount calculation utilities for Mahendra Footwear
 * 
 * Formula:
 * Discount Amount = Original Price * (Discount Percentage / 100)
 * Final Price = Original Price - Discount Amount
 */

export function calculatePricing(originalPriceInput, discountPercentageInput = 0) {
  const originalPrice = Math.max(0, Number(originalPriceInput) || 0);
  const discountPercentage = Math.min(100, Math.max(0, Number(discountPercentageInput) || 0));

  if (discountPercentage === 0) {
    return {
      originalPrice: Math.round(originalPrice),
      discountPercentage: 0,
      discountAmount: 0,
      finalPrice: Math.round(originalPrice),
      savings: 0,
      hasDiscount: false,
    };
  }

  const discountAmount = Math.round((originalPrice * discountPercentage) / 100);
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const savings = originalPrice - finalPrice;

  return {
    originalPrice: Math.round(originalPrice),
    discountPercentage: Math.round(discountPercentage),
    discountAmount,
    finalPrice,
    savings,
    hasDiscount: savings > 0,
  };
}

export function validatePricingInputs(originalPrice, discountPercentage, stockQuantity) {
  const errors = {};

  if (originalPrice === undefined || originalPrice === null || originalPrice === '') {
    errors.originalPrice = 'Original price is required';
  } else if (Number(originalPrice) < 0) {
    errors.originalPrice = 'Price cannot be negative';
  }

  if (discountPercentage !== undefined && discountPercentage !== '') {
    const disc = Number(discountPercentage);
    if (isNaN(disc) || disc < 0 || disc > 100) {
      errors.discountPercentage = 'Discount must be between 0% and 100%';
    }
  }

  if (stockQuantity === undefined || stockQuantity === null || stockQuantity === '') {
    errors.stockQuantity = 'Stock quantity is required';
  } else if (Number(stockQuantity) < 0 || !Number.isInteger(Number(stockQuantity))) {
    errors.stockQuantity = 'Stock must be a whole non-negative number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
