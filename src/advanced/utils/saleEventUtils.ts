import { SaleEvent, Product } from '../types/index.js';
import { DISCOUNT_POLICY } from '../constants/index.js';

// ============== 세일 이벤트 처리 관련 유틸리티 함수들 ==============

// 새로운 세일 이벤트 확인
export const findNewSales = (
  currentSales: SaleEvent[], 
  previousSales: SaleEvent[]
): SaleEvent[] => {
  return currentSales.filter(sale => 
    !previousSales.some(prevSale => 
      prevSale.productId === sale.productId && prevSale.type === sale.type
    )
  );
};

// 종료된 세일 이벤트 확인
export const findEndedSales = (
  currentSales: SaleEvent[], 
  previousSales: SaleEvent[]
): SaleEvent[] => {
  return previousSales.filter(prevSale => 
    !currentSales.some(sale => 
      sale.productId === prevSale.productId && sale.type === prevSale.type
    )
  );
};

// 세일 타입별 메시지 생성
export const createSaleMessage = (sale: SaleEvent, product: Product): string => {
  const { type, productId } = sale;
  
  switch (type) {
    case 'lightning':
      return `⚡번개세일! ${product.name}이(가) ${Math.round(DISCOUNT_POLICY.LIGHTNING_SALE_RATE * 100)}% 할인 중입니다!`;
    case 'suggested':
      return `💝 ${product.name}은(는) 어떠세요? 지금 구매하시면 ${Math.round(DISCOUNT_POLICY.SUGGESTED_SALE_RATE * 100)}% 추가 할인!`;
    default:
      return `${product.name} 세일 알림`;
  }
};

// 세일 이벤트 처리 함수 타입
export interface SaleEventHandlers {
  startLightningSale: (productId: string) => void;
  startSuggestedSale: (productId: string) => void;
  resetSaleStatus: (productId: string) => void;
}

// 새로운 세일 이벤트 처리
export const handleNewSales = (
  newSales: SaleEvent[],
  getProductById: (id: string) => Product | undefined,
  handlers: SaleEventHandlers
): void => {
  newSales.forEach(sale => {
    const product = getProductById(sale.productId);
    if (!product) return;

    // 알림 메시지 표시
    const message = createSaleMessage(sale, product);
    alert(message);

    // 세일 상태 적용
    switch (sale.type) {
      case 'lightning':
        handlers.startLightningSale(sale.productId);
        break;
      case 'suggested':
        handlers.startSuggestedSale(sale.productId);
        break;
    }
  });
};

// 종료된 세일 이벤트 처리
export const handleEndedSales = (
  endedSales: SaleEvent[],
  handlers: SaleEventHandlers
): void => {
  endedSales.forEach(sale => {
    handlers.resetSaleStatus(sale.productId);
  });
}; 