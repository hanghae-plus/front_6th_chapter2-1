export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  POUCH: 'p4',
  SPEAKER: 'p5',
} as const;

export type ProductId = (typeof PRODUCT_IDS)[keyof typeof PRODUCT_IDS];

export const PRODUCT_DISCOUNT_RATES_BY_PRODUCT_ID: Record<ProductId, number> = {
  [PRODUCT_IDS.KEYBOARD]: 10 / 100,
  [PRODUCT_IDS.MOUSE]: 15 / 100,
  [PRODUCT_IDS.MONITOR_ARM]: 20 / 100,
  [PRODUCT_IDS.POUCH]: 5 / 100,
  [PRODUCT_IDS.SPEAKER]: 25 / 100,
};
