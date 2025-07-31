import { STOCK_THRESHOLD } from "../constants";
import type { Product } from "../constants";

export interface LowStockItem {
  name: string;
  stock: number;
  message: string;
}

/**
 * 재고 부족 상품 정보 가져오기
 * @param products - 상품 리스트
 * @returns 재고 부족 상품 정보 배열
 */
export const getLowStockItems = (products: Product[]): LowStockItem[] => {
  const lowStockItems: LowStockItem[] = [];

  products.forEach((product) => {
    const currentStock = product.quantity;

    // 재고 부족 상품 체크
    if (currentStock >= STOCK_THRESHOLD) return;

    // 품절 상품 체크
    const isOutOfStock = currentStock === 0;
    const message = isOutOfStock
      ? `${product.name}: 품절`
      : `${product.name}: 재고 부족 (${currentStock}개 남음)`;

    lowStockItems.push({
      name: product.name,
      stock: currentStock,
      message,
    });
  });

  return lowStockItems;
};

/**
 * 상품 재고 확인
 * @param products - 상품 리스트
 * @param productId - 상품 ID
 * @param requestedQuantity - 요청 수량
 * @returns 재고 충분 여부
 */
export const checkStockAvailability = (
  products: Product[],
  productId: string,
  requestedQuantity: number
): boolean => {
  const product = products.find((p) => p.id === productId);
  return product ? product.quantity >= requestedQuantity : false;
};

/**
 * 총 재고 수량 계산
 * @param products - 상품 리스트
 * @returns 총 재고 수량
 */
export const calculateTotalStock = (products: Product[]): number => {
  return products.reduce((total, product) => total + product.quantity, 0);
};

/**
 * 재고 상태 메시지 생성
 * @param lowStockItems - 재고 부족 상품 정보 배열
 * @returns 재고 상태 메시지
 */
export const createStockStatusMessage = (
  lowStockItems: LowStockItem[]
): string => {
  if (lowStockItems.length === 0) return "";

  return lowStockItems.map((item) => item.message).join("\n");
};
