import { StripeMode } from "./hooks/useStripeMode";

// Test mode price IDs
const TEST_PRICE_IDS = {
  one: "price_test_1",
  three: "price_test_3",
};

// Live mode price IDs
const LIVE_PRICE_IDS = {
  one: "price_live_1",
  three: "price_live_3",
};

export function getStripePriceId(mode: StripeMode, plan: "one" | "three"): string {
  return mode === "test" ? TEST_PRICE_IDS[plan] : LIVE_PRICE_IDS[plan];
} 