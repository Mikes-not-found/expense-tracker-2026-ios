/**
 * Categories configuration — mirrors the PWA's categorySubcategories.
 * Single source of truth for all expense categories.
 */
export const categorySubcategories: Record<string, readonly string[]> = {
  Housing: ['Rent', 'SpeseCondo', 'Internet', 'Furniture', 'Insurances', 'Cleaning', 'TV', 'Electricity', 'Phone'],
  Health: ['Dottori', 'Medicine', 'Sport', 'Palestra'],
  Groceries: ['Migros', 'Coop', 'OtherGrocerie'],
  Transport: ['Treno', 'Benzina', 'AltroMacchina'],
  Out: ['Restaurants', 'Bar', 'Asporto&Domicilio', 'Cinema', 'AltreEsperienze'],
  Travel: ['Travel', 'Concerts'],
  Clothing: ['Robe', 'Accessori', 'Scarpe', 'Makeup', 'Skincare', 'Hair'],
  Leisure: ['Tech', 'Books', 'Leisure', 'Learning', 'Games', 'OtherLeisure'],
  Gifts: ['Gifts'],
  Fees: ['Brokers', 'Banks', 'Consulting', 'OtherFees'],
  OtherExpenses: ['Pepe', 'OtherExpenses'],
} as const;

export const categoryNames = Object.keys(categorySubcategories);

export const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;

export type MonthKey = (typeof months)[number];

export const monthNames: Record<MonthKey, string> = {
  jan: 'January',
  feb: 'February',
  mar: 'March',
  apr: 'April',
  may: 'May',
  jun: 'June',
  jul: 'July',
  aug: 'August',
  sep: 'September',
  oct: 'October',
  nov: 'November',
  dec: 'December',
};

export const monthShortNames: Record<MonthKey, string> = {
  jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
  may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug',
  sep: 'Sep', oct: 'Oct', nov: 'Nov', dec: 'Dec',
};

/** Returns '01' for jan, '02' for feb, etc. */
export const getMonthNumber = (month: MonthKey): string =>
  (months.indexOf(month) + 1).toString().padStart(2, '0');
