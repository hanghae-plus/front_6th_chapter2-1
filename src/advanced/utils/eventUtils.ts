import { Product, SaleEvent } from '../types/index.js';
import { PRODUCT_LIST } from '../constants/index.js';

// 랜덤 상품 선택
export const getRandomProduct = (excludeProductId?: string): Product => {
  const availableProducts = excludeProductId 
    ? PRODUCT_LIST.filter(p => p.id !== excludeProductId)
    : PRODUCT_LIST;
  
  if (availableProducts.length === 0) {
    throw new Error('사용 가능한 상품이 없습니다.');
  }
  
  return availableProducts[Math.floor(Math.random() * availableProducts.length)];
};

// 할인된 가격 계산
export const calculateDiscountedPrice = (originalPrice: number, discountRate: number): number => {
  return Math.round(originalPrice * (1 - discountRate));
};

// SaleEvent 객체 생성
export const createSaleEvent = (
  type: 'lightning' | 'suggested',
  product: Product,
  discountRate: number
): SaleEvent => ({
  type,
  productId: product.id,
  originalPrice: product.originalPrice,
  discountedPrice: calculateDiscountedPrice(product.originalPrice, discountRate),
  discountRate,
  startTime: new Date(),
});

// 기존 이벤트 필터링 (중복 방지)
export const filterExistingEvents = (
  currentEvents: SaleEvent[],
  newEvent: SaleEvent
): SaleEvent[] => {
  return currentEvents.filter(event => 
    !(event.productId === newEvent.productId && event.type === newEvent.type)
  );
}; 