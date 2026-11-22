// PRICING & PROMOTION CONFIGURATION
// Clearly labelled as "sample demo pricing" throughout the UI.
// TODO: confirm with client final delivery fees, free delivery threshold, and coupon logic.

export interface PricingConfig {
  deliveryFee: number;
  freeDeliveryThreshold: number;
  currencySymbol: string;
  currencyCode: string;
  sampleCoupons: {
    code: string;
    discountPercent: number;
    description: string;
    minOrderAmount: number;
  }[];
  referralRewardAmount: number;
  referredRewardAmount: number;
  defaultPincodeList: string[];
}

export const pricingConfig: PricingConfig = {
  deliveryFee: 40,
  freeDeliveryThreshold: 499,
  currencySymbol: '₹',
  currencyCode: 'INR',
  sampleCoupons: [
    {
      code: 'ANNA10',
      discountPercent: 10,
      description: '10% discount on all farm fresh orders (Demo coupon)',
      minOrderAmount: 0,
    },
    {
      code: 'ORGANIC20',
      discountPercent: 20,
      description: '20% off on first organic order over ₹599 (Demo coupon)',
      minOrderAmount: 599,
    },
  ],
  referralRewardAmount: 100, // ₹100 for referrer
  referredRewardAmount: 50,  // ₹50 for referee
  defaultPincodeList: ['110001', '110017', '122001', '122002', '201301', '201307', '560001', '400001'],
};

export function calculateDeliveryFee(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= pricingConfig.freeDeliveryThreshold ? 0 : pricingConfig.deliveryFee;
}

export function calculateDiscount(subtotal: number, couponCode?: string): number {
  if (!couponCode) return 0;
  const match = pricingConfig.sampleCoupons.find(
    (c) => c.code.toUpperCase() === couponCode.trim().toUpperCase()
  );
  if (!match) return 0;
  if (subtotal < match.minOrderAmount) return 0;
  return Math.round((subtotal * match.discountPercent) / 100);
}

