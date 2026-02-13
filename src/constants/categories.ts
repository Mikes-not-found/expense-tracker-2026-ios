/**
 * Categories configuration — kawaii version with emoji.
 * Single source of truth for all expense categories.
 */
export const categorySubcategories: Record<string, readonly string[]> = {
  'Housing': ['Rent', 'SpeseCondo', 'Internet', 'Furniture', 'Insurances', 'Cleaning', 'TV', 'Electricity', 'Phone'],
  'Health': ['Dottori', 'Medicine', 'Sport', 'Palestra'],
  'Groceries': ['Migros', 'Coop', 'OtherGrocerie'],
  'Transport': ['Treno', 'Benzina', 'AltroMacchina'],
  'Out': ['Restaurants', 'Bar', 'Asporto&Domicilio', 'Cinema', 'AltreEsperienze'],
  'Travel': ['Travel', 'Concerts'],
  'Clothing': ['Robe', 'Accessori', 'Scarpe', 'Makeup', 'Skincare', 'Hair'],
  'Leisure': ['Tech', 'Books', 'Leisure', 'Learning', 'Games', 'OtherLeisure'],
  'Gifts': ['Gifts'],
  'Fees': ['Brokers', 'Banks', 'Consulting', 'OtherFees'],
  'OtherExpenses': ['Pepe', 'OtherExpenses'],
} as const;

export const categoryNames = Object.keys(categorySubcategories);

/** Category emoji map — matches the kawaii HTML */
export const categoryEmojis: Record<string, string> = {
  Housing: '\u{1F3E0}',
  Health: '\u{1F48A}',
  Groceries: '\u{1F6D2}',
  Transport: '\u{1F697}',
  Out: '\u{1F355}',
  Travel: '\u{2708}\uFE0F',
  Clothing: '\u{1F457}',
  Leisure: '\u{1F3AE}',
  Gifts: '\u{1F381}',
  Fees: '\u{1F4B3}',
  OtherExpenses: '\u{1F4E6}',
};

/** Month emoji map — matches the kawaii HTML */
export const monthEmojis: Record<string, string> = {
  jan: '\u{1F338}',
  feb: '\u{1F49D}',
  mar: '\u{1F337}',
  apr: '\u{1F33A}',
  may: '\u{1F33B}',
  jun: '\u2600\uFE0F',
  jul: '\u{1F308}',
  aug: '\u{1F349}',
  sep: '\u{1F342}',
  oct: '\u{1F383}',
  nov: '\u{1F341}',
  dec: '\u2744\uFE0F',
};

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
