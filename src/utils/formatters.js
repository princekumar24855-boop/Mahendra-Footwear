/**
 * Category Definitions and Formatting helpers
 */

export const CATEGORIES = [
  {
    id: "Men's Shoes",
    name: "Men's Shoes",
    section: "Men",
    description: "Formal, casual, sports & everyday walking shoes for men",
    defaultSizes: ['6', '7', '8', '9', '10', '11'],
  },
  {
    id: "Men's Slippers",
    name: "Men's Slippers",
    section: "Men",
    description: "Comfort slides, flip-flops, leather chappals & house slippers",
    defaultSizes: ['6', '7', '8', '9', '10'],
  },
  {
    id: "Ladies' Sandals",
    name: "Ladies' Sandals",
    section: "Ladies",
    description: "Flats, wedges, festive heels & daily wear stylish sandals",
    defaultSizes: ['4', '5', '6', '7', '8'],
  },
  {
    id: "Ladies' Slippers",
    name: "Ladies' Slippers",
    section: "Ladies",
    description: "Soft orthopedic, casual flip-flops & lightweight home slides",
    defaultSizes: ['4', '5', '6', '7', '8'],
  },
];

export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  const num = Math.round(Number(amount));
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function getStockStatus(stockQuantity) {
  const stock = Number(stockQuantity) || 0;
  if (stock <= 0) {
    return {
      status: 'out_of_stock',
      label: 'Out of Stock',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      isAvailable: false,
    };
  }
  if (stock <= 5) {
    return {
      status: 'low_stock',
      label: `Only ${stock} left`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      isAvailable: true,
    };
  }
  return {
    status: 'in_stock',
    label: 'In Stock',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    isAvailable: true,
  };
}
