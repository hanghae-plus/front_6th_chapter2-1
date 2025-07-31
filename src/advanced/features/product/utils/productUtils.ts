/**
 * Product Utils - TypeScript version
 * 상품 관련 순수 함수들
 */

import { Product } from '@/advanced/features/cart/utils/stockUtils.ts';

/**
 * 상품 ID로 상품 찾기
 */
export const findProductById = (
  productId: string,
  products: Product[],
): Product | undefined => {
  return products.find(p => p.id === productId);
};

/**
 * 총 재고 수량 계산
 */
export const getTotalStock = (products: Product[]): number => {
  return products.reduce((sum: number, product: Product) => sum + product.q, 0);
};

/**
 * 재고 상태 메시지 생성
 */
export const generateStockStatusMessage = (
  products: Product[],
  threshold: number = 5,
): string => {
  let infoMsg = '';

  products.forEach(item => {
    if (item.q < threshold) {
      if (item.q > 0) {
        infoMsg += `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
      } else {
        infoMsg += `${item.name}: 품절\n`;
      }
    }
  });

  return infoMsg;
};

/**
 * 재고 부족 여부 확인 (총 재고가 임계값 미만인지)
 */
export const isLowTotalStock = (
  products: Product[],
  threshold: number = 50,
): boolean => {
  const totalStock = getTotalStock(products);
  return totalStock < threshold;
};
