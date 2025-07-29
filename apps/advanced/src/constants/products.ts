import { Product } from '../types/product.types';

export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  LAPTOP_POUCH: 'p4',
  LOFI_SPEAKER: 'p5'
} as const;

export const DISCOUNT_THRESHOLDS = {
  INDIVIDUAL_DISCOUNT_MIN: 10, // 개별 상품 할인 최소 수량
  BULK_DISCOUNT_MIN: 30 // 전체 수량 할인 최소 수량
} as const;

export const PRODUCTS: Product[] = [
  {
    id: PRODUCT_IDS.KEYBOARD,
    name: '버그 없애는 키보드',
    price: 10000,
    stock: 50,
    category: 'electronics',
    description: '버그를 없애는 마법의 키보드',
    discountRate: 0.1,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  },
  {
    id: PRODUCT_IDS.MOUSE,
    name: '생산성 폭발 마우스',
    price: 20000,
    stock: 30,
    category: 'electronics',
    description: '생산성을 폭발시키는 마우스',
    discountRate: 0.15,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  },
  {
    id: PRODUCT_IDS.MONITOR_ARM,
    name: '거북목 탈출 모니터암',
    price: 30000,
    stock: 20,
    category: 'accessories',
    description: '거북목을 탈출시켜주는 모니터암',
    discountRate: 0.2,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  },
  {
    id: PRODUCT_IDS.LAPTOP_POUCH,
    name: '에러 방지 노트북 파우치',
    price: 15000,
    stock: 0, // 품절
    category: 'accessories',
    description: '에러를 방지하는 노트북 파우치',
    discountRate: 0.05,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  },
  {
    id: PRODUCT_IDS.LOFI_SPEAKER,
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    stock: 10,
    category: 'electronics',
    description:
      '코딩할 때 듣는 Lo-Fi 스피커로 편안한 코딩 환경을 만들어보세요',
    discountRate: 0.25,
    discountThreshold: DISCOUNT_THRESHOLDS.INDIVIDUAL_DISCOUNT_MIN
  }
];

export function getProductList(): Product[] {
  return PRODUCTS;
}

export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find(product => product.id === productId);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(product => product.category === category);
}

export function getAvailableProducts(): Product[] {
  return PRODUCTS.filter(product => product.stock > 0);
}

export const LEGACY_PRODUCT_IDS = {
  PRODUCT_ONE: PRODUCT_IDS.KEYBOARD,
  p2: PRODUCT_IDS.MOUSE,
  product_3: PRODUCT_IDS.MONITOR_ARM,
  p4: PRODUCT_IDS.LAPTOP_POUCH,
  PRODUCT_5: PRODUCT_IDS.LOFI_SPEAKER
} as const;
