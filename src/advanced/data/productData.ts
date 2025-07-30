import { Product } from '../types';
import { PRODUCT_CONSTANTS } from '../constants';

// 상품 데이터
export const productList: Product[] = [
  {
    id: 'product1',
    name: '버그 없애는 키보드',
    price: 10000,
    stockQuantity: 10,
    isFlashSale: false,
    isRecommended: false,
    category: 'keyboard',
  },
  {
    id: 'product2',
    name: '생산성 폭발 마우스',
    price: 20000,
    stockQuantity: 15,
    isFlashSale: false,
    isRecommended: false,
    category: 'mouse',
  },
  {
    id: 'product3',
    name: '거북목 탈출 모니터암',
    price: 30000,
    stockQuantity: 8,
    isFlashSale: false,
    isRecommended: false,
    category: 'monitor',
  },
  {
    id: 'product4',
    name: '에러 방지 노트북 파우치',
    price: 15000,
    stockQuantity: 0,
    isFlashSale: false,
    isRecommended: false,
    category: 'accessory',
  },
  {
    id: 'product5',
    name: '코딩할 때 듣는 Lo-Fi 스피커',
    price: 25000,
    stockQuantity: 3,
    isFlashSale: false,
    isRecommended: false,
    category: 'audio',
  },
];

// 상품 검색 함수
export const findProductById = (id: string): Product | undefined => {
  return productList.find((product) => product.id === id);
};

// 전체 재고 계산 함수
export const getTotalStock = (): number => {
  return productList.reduce(
    (total, product) => total + product.stockQuantity,
    0
  );
};

// 재고 부족 상품 조회 함수
export const getLowStockProducts = (): Product[] => {
  return productList.filter(
    (product) =>
      product.stockQuantity > 0 &&
      product.stockQuantity <= PRODUCT_CONSTANTS.STOCK_WARNING_THRESHOLD
  );
};

// 품절 상품 조회 함수
export const getOutOfStockProducts = (): Product[] => {
  return productList.filter((product) => product.stockQuantity === 0);
};

// 재고 상태 표시 함수
export const getStockStatusDisplay = (product: Product): string => {
  if (product.stockQuantity === 0) {
    return '품절';
  }
  if (product.stockQuantity <= PRODUCT_CONSTANTS.LOW_STOCK_THRESHOLD) {
    return `재고 부족 (${product.stockQuantity}개)`;
  }
  if (product.stockQuantity <= PRODUCT_CONSTANTS.STOCK_WARNING_THRESHOLD) {
    return `재고 적음 (${product.stockQuantity}개)`;
  }
  return `재고 있음 (${product.stockQuantity}개)`;
};
