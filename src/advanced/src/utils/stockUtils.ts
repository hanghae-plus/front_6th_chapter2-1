import { STOCK_THRESHOLD } from "../constants";
import type { Product } from "../types";

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
