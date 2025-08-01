import { IProduct } from "../../types";
import { PRODUCT_IDS } from "../../constants";

export const useProductData = {
  products: [
    {
      id: PRODUCT_IDS.KEYBOARD,
      name: "버그 없애는 키보드",
      val: 10000,
      originalVal: 10000,
      q: 50,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MOUSE,
      name: "생산성 폭발 마우스",
      val: 20000,
      originalVal: 20000,
      q: 30,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.MONITOR_ARM,
      name: "거북목 탈출 모니터암",
      val: 30000,
      originalVal: 30000,
      q: 20,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.LAPTOP_POUCH,
      name: "에러 방지 노트북 파우치",
      val: 15000,
      originalVal: 15000,
      q: 0,
      onSale: false,
      suggestSale: false,
    },
    {
      id: PRODUCT_IDS.SPEAKER,
      name: `코딩할 때 듣는 Lo-Fi 스피커`,
      val: 25000,
      originalVal: 25000,
      q: 10,
      onSale: false,
      suggestSale: false,
    },
  ],

  /**
   * 상품 목록 반환
   * @returns {Array} 상품 목록 배열
   */
  getProducts(): IProduct[] {
    return [...this.products];
  },

  /**
   * 총 재고 계산
   * @returns {number} 총 재고 수량
   */
  getTotalStock(): number {
    return this.products.reduce((total, product) => total + product.q, 0);
  },

  /**
   * 상품 ID로 상품 찾기
   * @param {string} id - 상품 ID
   * @returns {Object|null} 찾은 상품 객체 또는 null
   */
  findProductById(id: string): IProduct | null {
    return this.products.find((product) => product.id === id) || null;
  },

  /**
   * 상품 재고 수량 업데이트 (불변 업데이트)
   * @param {string} id - 상품 ID
   * @param {number} stockChange - 재고 변경량 (음수면 감소, 양수면 증가)
   * @returns {boolean} 업데이트 성공 여부
   */
  updateProductStock(id: string, stockChange: number): boolean {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return false;
    }

    const currentProduct = this.products[productIndex];
    const newStock = currentProduct.q + stockChange;

    if (newStock < 0) {
      return false;
    }

    this.products[productIndex] = {
      ...currentProduct,
      q: newStock,
    };

    return true;
  },

  /**
   * 상품 가격 업데이트 (불변 업데이트)
   * @param {string} id - 상품 ID
   * @param {number} newPrice - 새로운 가격
   * @returns {boolean} 업데이트 성공 여부
   */
  updateProductPrice(id: string, newPrice: number): boolean {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return false;
    }

    const currentProduct = this.products[productIndex];

    this.products[productIndex] = {
      ...currentProduct,
      val: newPrice,
    };

    return true;
  },

  /**
   * 상품 세일 상태 업데이트 (불변 업데이트)
   * @param {string} id - 상품 ID
   * @param {Object} saleUpdates - 세일 상태 업데이트 객체
   * @param {boolean} [saleUpdates.onSale] - 번개세일 상태
   * @param {boolean} [saleUpdates.suggestSale] - 추천세일 상태
   * @returns {boolean} 업데이트 성공 여부
   */
  updateProductSaleStatus(id: string, saleUpdates: { onSale: boolean; suggestSale: boolean }): boolean {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return false;
    }

    const currentProduct = this.products[productIndex];

    this.products[productIndex] = {
      ...currentProduct,
      ...saleUpdates,
    };

    return true;
  },

  /**
   * 상품 추천 할인 적용 (불변 업데이트)
   * @param {string} id - 상품 ID
   * @param {number} discountRate - 할인율 (백분율)
   * @returns {boolean} 업데이트 성공 여부
   */
  applyRecommendationDiscount(id: string, discountRate: number): boolean {
    const productIndex = this.products.findIndex((product) => product.id === id);
    if (productIndex === -1) {
      return false;
    }

    const currentProduct = this.products[productIndex];
    const discountedPrice = Math.round((currentProduct.val * (100 - discountRate)) / 100);

    this.products[productIndex] = {
      ...currentProduct,
      val: discountedPrice,
      suggestSale: true,
    };

    return true;
  },
};
