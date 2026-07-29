// Minimal assertions for order pricing. Run: node test.ts
import { lineTotal, orderTotal, round } from "./src/pricing.ts";

let failed = 0;

const check = (name: string, fn: () => void): void => {
  try {
    fn();
    console.log(`  ok   ${name}`);
  } catch (err) {
    failed++;
    console.log(`  FAIL ${name}\n       ${(err as Error).message}`);
  }
};

const eq = (actual: number, expected: number, msg = ""): void => {
  if (actual !== expected) {
    throw new Error(`${msg} expected ${expected}, got ${actual}`.trim());
  }
};

console.log("pricing");

check("drip small is base price", () => {
  eq(round(lineTotal("drip", "small", 1)), 3.25);
});

check("quantity multiplies the line", () => {
  eq(round(lineTotal("drip", "small", 3)), 9.75);
});

check("bigger sizes never cost less than smaller ones", () => {
  const order = ["small", "medium", "large"];
  for (let i = 1; i < order.length; i++) {
    const smaller = lineTotal("latte", order[i - 1], 1);
    const bigger = lineTotal("latte", order[i], 1);
    if (bigger < smaller) {
      throw new Error(
        `${order[i]} ($${round(bigger)}) costs less than ${order[i - 1]} ($${round(smaller)})`,
      );
    }
  }
});

check("an empty order totals zero", () => {
  eq(orderTotal([], 18).total, 0);
});

check("tip is calculated on the pre-tax subtotal", () => {
  const t = orderTotal([{ item: "drip", size: "small", qty: 1 }], 20);
  eq(t.tip, 0.65, "20% of $3.25 —");
});

check("a zero-quantity line adds nothing", () => {
  eq(orderTotal([{ item: "latte", size: "large", qty: 0 }], 0).total, 0);
});

check("a negative quantity contributes nothing, rather than discounting the order", () => {
  const t = orderTotal([{ item: "latte", size: "large", qty: -5 }], 0);
  eq(t.total, 0, "a negative-quantity line should contribute $0 to the total —");
});

check("an unknown drink does not crash the order", () => {
  orderTotal([{ item: "unicorn-frappe", size: "small", qty: 1 }], 18);
});

console.log(failed ? `\n${failed} failing` : "\nall passing");
process.exit(failed ? 1 : 0);
