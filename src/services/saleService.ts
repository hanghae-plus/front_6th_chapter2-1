import { Product } from '../types';

// 세일 타입 상수
const SALE_TYPES = {
  NONE: 'none',
  LIGHTNING: 'lightning',
  RECOMMENDATION: 'recommendation',
  SUPER: 'super', // lightning + recommendation
} as const;

type SaleType = (typeof SALE_TYPES)[keyof typeof SALE_TYPES];

interface SaleConfig {
  discount: number;
  emoji: string;
  color: string;
  label: string;
}

interface SaleDisplayResult {
  displayText: string;
  className: string;
}

// 세일 설정 객체
const SALE_CONFIG: Record<SaleType, SaleConfig> = {
  [SALE_TYPES.NONE]: {
    discount: 0,
    emoji: '',
    color: '',
    label: '',
  },
  [SALE_TYPES.LIGHTNING]: {
    discount: 20,
    emoji: '⚡',
    color: 'text-red-500',
    label: 'SALE!',
  },
  [SALE_TYPES.RECOMMENDATION]: {
    discount: 5,
    emoji: '💝',
    color: 'text-blue-500',
    label: '추천할인!',
  },
  [SALE_TYPES.SUPER]: {
    discount: 25,
    emoji: '⚡💝',
    color: 'text-purple-600',
    label: 'SUPER SALE!',
  },
};

// 세일 타입 결정 함수
function getSaleType(product: Product): SaleType {
  switch (true) {
    case product.lightningSale && product.suggestSale:
      return SALE_TYPES.SUPER;
    case product.lightningSale:
      return SALE_TYPES.LIGHTNING;
    case product.suggestSale:
      return SALE_TYPES.RECOMMENDATION;
    default:
      return SALE_TYPES.NONE;
  }
}

// 번개세일 적용 (20% 할인)
export function applyLightningSale(product: Product): boolean {
  if (product.quantity > 0 && !product.lightningSale) {
    product.price = Math.round((product.originalPrice! * 80) / 100);
    product.lightningSale = true;
    return true;
  }
  return false;
}

// 추천할인 적용 (5% 할인)
export function applyRecommendationSale(product: Product): boolean {
  if (product.quantity > 0 && !product.suggestSale) {
    product.price = Math.round((product.price * 95) / 100);
    product.suggestSale = true;
    return true;
  }
  return false;
}

// 세일 상태에 따른 표시 텍스트 생성
export function generateSaleDisplayText(product: Product): SaleDisplayResult {
  const saleType = getSaleType(product);

  if (saleType === SALE_TYPES.NONE) {
    return {
      displayText: `${product.name} - ${product.price}원`,
      className: '',
    };
  }

  const config = SALE_CONFIG[saleType];
  const displayText = `${config.emoji}${product.name} - ${product.originalPrice}원 → ${product.price}원 (${config.discount}% ${config.label})`;

  return {
    displayText,
    className: `${config.color} font-bold`,
  };
}

// 세일 상태에 따른 가격 표시 HTML 생성
export function generatePriceDisplayHTML(product: Product): string {
  const saleType = getSaleType(product);

  if (saleType === SALE_TYPES.NONE) {
    return `₩${product.price.toLocaleString()}`;
  }

  const config = SALE_CONFIG[saleType];
  return `<span class="line-through text-gray-400">₩${product.originalPrice!.toLocaleString()}</span> <span class="${config.color}">₩${product.price.toLocaleString()}</span>`;
}

// 세일 상태에 따른 상품명 표시 생성
export function generateProductNameDisplay(product: Product): string {
  const saleType = getSaleType(product);

  if (saleType === SALE_TYPES.NONE) {
    return product.name;
  }

  const config = SALE_CONFIG[saleType];
  return config.emoji + product.name;
}
