// Motoring Coffee — order pricing.
// Powers the order page. Kept dependency-free so it runs in the browser and in node.

export type MenuItem = { label: string; base: number };
export type SizeSpec = { label: string; multiplier: number };

export type OrderLine = {
  item: string;
  size: string;
  qty: number;
};

export type OrderTotal = {
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
};

export const MENU: Record<string, MenuItem> = {
  drip: { label: "Drip", base: 3.25 },
  latte: { label: "Latte", base: 5.0 },
  cortado: { label: "Cortado", base: 4.5 },
  coldbrew: { label: "Cold Brew", base: 5.5 },
};

export const SIZES: Record<string, SizeSpec> = {
  small: { label: "Small", multiplier: 1.0 },
  medium: { label: "Medium", multiplier: 1.3 },
  large: { label: "Large", multiplier: 1.15 },
};

export const TAX_RATE = 0.0863; // SF

export function lineTotal(item: string, size: string, qty: number): number {
  const menuItem = MENU[item];
  const sizeSpec = SIZES[size];
  return menuItem.base * sizeSpec.multiplier * qty;
}

export function orderTotal(lines: OrderLine[], tipPercent: number): OrderTotal {
  let subtotal = 0;
  for (const line of lines) {
    subtotal += lineTotal(line.item, line.size, line.qty);
  }

  const tax = subtotal * TAX_RATE;
  const tip = (subtotal + tax) * (tipPercent / 100);

  return {
    subtotal: round(subtotal),
    tax: round(tax),
    tip: round(tip),
    total: round(subtotal + tax + tip),
  };
}

export function round(n: number): number {
  return Math.round(n * 100) / 100;
}
