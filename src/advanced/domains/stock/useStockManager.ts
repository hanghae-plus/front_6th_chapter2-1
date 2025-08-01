import { useCallback } from "react";
import { STOCK_THRESHOLDS } from "./constants";
import { IProduct } from "../../types";

/**
 * Stock 도메인 - 재고 관리 훅
 *
 * 기존 useStockManager 객체를 React 훅으로 변환
 * - 재고 경고 메시지 생성
 * - 재고 상태 확인 로직
 */
export function useStockManager() {
  /**
   * 재고 경고 메시지 생성 (React 버전)
   * @param {IProduct[]} products - 상품 목록
   * @returns {string} 재고 경고 메시지
   */
  const generateStockWarningMessage = useCallback((products: IProduct[]): string => {
    let warningMsg = "";

    products.forEach((item) => {
      if (item.quantity < STOCK_THRESHOLDS.LOW_STOCK_WARNING) {
        if (item.quantity > 0) {
          warningMsg += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
        } else {
          warningMsg += `${item.name}: 품절\n`;
        }
      }
    });

    return warningMsg;
  }, []);

  /**
   * 재고 부족 상품 목록 반환
   * @param {IProduct[]} products - 상품 목록
   * @returns {IProduct[]} 재고 부족 상품들
   */
  const getLowStockProducts = useCallback((products: IProduct[]): IProduct[] => {
    return products.filter((product) => product.quantity < STOCK_THRESHOLDS.LOW_STOCK_WARNING);
  }, []);

  /**
   * 품절 상품 목록 반환
   * @param {IProduct[]} products - 상품 목록
   * @returns {IProduct[]} 품절 상품들
   */
  const getOutOfStockProducts = useCallback((products: IProduct[]): IProduct[] => {
    return products.filter((product) => product.quantity === 0);
  }, []);

  /**
   * 전체 재고 수량 계산
   * @param {IProduct[]} products - 상품 목록
   * @returns {number} 전체 재고 수량
   */
  const getTotalStock = useCallback((products: IProduct[]): number => {
    return products.reduce((total, product) => total + product.quantity, 0);
  }, []);

  /**
   * 재고 상태 확인
   * @param {IProduct[]} products - 상품 목록
   * @returns {Object} 재고 상태 정보
   */
  const getStockStatus = useCallback(
    (products: IProduct[]) => {
      const totalStock = getTotalStock(products);
      const lowStockProducts = getLowStockProducts(products);
      const outOfStockProducts = getOutOfStockProducts(products);
      const warningMessage = generateStockWarningMessage(products);

      return {
        totalStock,
        lowStockProducts,
        outOfStockProducts,
        warningMessage,
        hasLowStock: lowStockProducts.length > 0,
        hasOutOfStock: outOfStockProducts.length > 0,
        isStockCritical: totalStock < STOCK_THRESHOLDS.TOTAL_STOCK_WARNING,
      };
    },
    [getTotalStock, getLowStockProducts, getOutOfStockProducts, generateStockWarningMessage],
  );

  return {
    generateStockWarningMessage,
    getLowStockProducts,
    getOutOfStockProducts,
    getTotalStock,
    getStockStatus,
  };
}
