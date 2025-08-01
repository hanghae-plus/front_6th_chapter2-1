import { useState, useCallback } from "react";
import { IProduct } from "../../types";
import { PRODUCT_IDS } from "./constants";

/**
 * Products 도메인 - 상품 데이터 관리 훅
 *
 * 기존 useProductData 객체를 React 훅으로 변환
 * - useState로 상품 목록 상태 관리
 * - useCallback으로 메서드 최적화
 * - 불변성 업데이트 패턴 적용
 */
export function useProductData() {
  const [products, setProducts] = useState<IProduct[]>([
    {
      id: PRODUCT_IDS.KEYBOARD,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      quantity: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MOUSE,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      quantity: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MONITOR_ARM,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      quantity: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.LAPTOP_POUCH,
      name: "에러 방지 노트북 파우치",
      val: 15000,
      originalVal: 15000,
      quantity: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.SPEAKER,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      quantity: 10,
      onSale: false,
      suggestSale: false,
    },
  ]);

  /**
   * 상품 목록 반환
   * @returns {IProduct[]} 상품 목록 배열
   */
  const getProducts = useCallback((): IProduct[] => {
    return [...products];
  }, [products]);

  /**
   * 총 재고 계산
   * @returns {number} 총 재고 수량
   */
  const getTotalStock = useCallback((): number => {
    return products.reduce((total, product) => total + product.quantity, 0);
  }, [products]);

  /**
   * 상품 ID로 상품 찾기
   * @param {string} id - 상품 ID
   * @returns {IProduct|null} 찾은 상품 객체 또는 null
   */
  const findProductById = useCallback(
    (id: string): IProduct | null => {
      return products.find((product) => product.id === id) || null;
    },
    [products],
  );

  /**
   * 상품 재고 수량 업데이트 (React 불변 업데이트)
   * @param {string} id - 상품 ID
   * @param {number} stockChange - 재고 변경량 (음수면 감소, 양수면 증가)
   * @returns {boolean} 업데이트 성공 여부
   */
  const updateProductStock = useCallback(
    (id: string, stockChange: number): boolean => {
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        return false;
      }

      const currentProduct = products[productIndex];
      const newStock = currentProduct.quantity + stockChange;

      if (newStock < 0) {
        return false;
      }

      setProducts((prev) =>
        prev.map((product, index) => (index === productIndex ? { ...product, quantity: newStock } : product)),
      );

      return true;
    },
    [products],
  );

  /**
   * 상품 가격 업데이트 (React 불변 업데이트)
   * @param {string} id - 상품 ID
   * @param {number} newPrice - 새로운 가격
   * @returns {boolean} 업데이트 성공 여부
   */
  const updateProductPrice = useCallback(
    (id: string, newPrice: number): boolean => {
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        return false;
      }

      setProducts((prev) =>
        prev.map((product, index) => (index === productIndex ? { ...product, val: newPrice } : product)),
      );

      return true;
    },
    [products],
  );

  /**
   * 상품 세일 상태 업데이트 (React 불변 업데이트)
   * @param {string} id - 상품 ID
   * @param {Object} saleUpdates - 세일 상태 업데이트 객체
   * @param {boolean} [saleUpdates.onSale] - 번개세일 상태
   * @param {boolean} [saleUpdates.suggestSale] - 추천세일 상태
   * @returns {boolean} 업데이트 성공 여부
   */
  const updateProductSaleStatus = useCallback(
    (id: string, saleUpdates: { onSale: boolean; suggestSale: boolean }): boolean => {
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        return false;
      }

      setProducts((prev) =>
        prev.map((product, index) => (index === productIndex ? { ...product, ...saleUpdates } : product)),
      );

      return true;
    },
    [products],
  );

  /**
   * 상품 추천 할인 적용 (React 불변 업데이트)
   * @param {string} id - 상품 ID
   * @param {number} discountRate - 할인율 (백분율)
   * @returns {boolean} 업데이트 성공 여부
   */
  const applyRecommendationDiscount = useCallback(
    (id: string, discountRate: number): boolean => {
      const productIndex = products.findIndex((product) => product.id === id);
      if (productIndex === -1) {
        return false;
      }

      const currentProduct = products[productIndex];
      const discountedPrice = Math.round((currentProduct.val * (100 - discountRate)) / 100);

      setProducts((prev) =>
        prev.map((product, index) =>
          index === productIndex ? { ...product, val: discountedPrice, suggestSale: true } : product,
        ),
      );

      return true;
    },
    [products],
  );

  return {
    products,
    getProducts,
    getTotalStock,
    findProductById,
    updateProductStock,
    updateProductPrice,
    updateProductSaleStatus,
    applyRecommendationDiscount,
  };
}
