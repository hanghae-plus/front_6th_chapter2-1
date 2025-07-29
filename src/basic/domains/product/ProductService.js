import { initializeProducts } from './ProductData.js';
import { UI_CONSTANTS } from '../../constants/UIConstants.js';

/**
 * 상품 관리 서비스
 */
export class ProductService {
  constructor() {
    this.products = initializeProducts();
  }

  /**
   * 모든 상품 조회
   * @returns {Product[]} 상품 목록
   */
  getAllProducts() {
    return this.products;
  }

  /**
   * ID로 상품 조회
   * @param {string} productId - 상품 ID
   * @returns {Product|null} 상품 객체 또는 null
   */
  getProductById(productId) {
    return this.products.find((product) => product.id === productId) || null;
  }

  /**
   * 재고 있는 상품만 조회
   * @returns {Product[]} 재고 있는 상품 목록
   */
  getAvailableProducts() {
    return this.products.filter((product) => !product.isSoldOut());
  }

  /**
   * 재고 부족 상품 조회
   * @param {number} threshold - 기준 수량
   * @returns {Product[]} 재고 부족 상품 목록
   */
  getLowStockProducts(threshold = UI_CONSTANTS.LOW_STOCK_THRESHOLD) {
    return this.products.filter((product) => product.isLowStock(threshold));
  }

  /**
   * 품절 상품 조회
   * @returns {Product[]} 품절 상품 목록
   */
  getSoldOutProducts() {
    return this.products.filter((product) => product.isSoldOut());
  }

  /**
   * 상품 재고 감소
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 감소할 수량
   * @returns {boolean} 성공 여부
   */
  decreaseProductStock(productId, quantity) {
    const product = this.getProductById(productId);
    if (!product || product.q < quantity) {
      return false;
    }

    product.decreaseStock(quantity);
    return true;
  }

  /**
   * 상품 재고 증가
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 증가할 수량
   * @returns {boolean} 성공 여부
   */
  increaseProductStock(productId, quantity) {
    const product = this.getProductById(productId);
    if (!product) {
      return false;
    }

    product.increaseStock(quantity);
    return true;
  }

  /**
   * 번개세일 적용
   * @param {string} productId - 상품 ID
   * @returns {boolean} 성공 여부
   */
  applyLightningSale(productId) {
    const product = this.getProductById(productId);
    if (!product || product.isSoldOut() || product.onSale) {
      return false;
    }

    product.applyLightningSale();
    return true;
  }

  /**
   * 추천할인 적용
   * @param {string} productId - 상품 ID
   * @returns {boolean} 성공 여부
   */
  applyRecommendationSale(productId) {
    const product = this.getProductById(productId);
    if (!product || product.isSoldOut() || product.suggestSale) {
      return false;
    }

    product.applyRecommendationSale();
    return true;
  }

  /**
   * 전체 재고 수량 계산
   * @returns {number} 전체 재고 수량
   */
  getTotalStock() {
    return this.products.reduce((total, product) => total + product.q, 0);
  }

  /**
   * 재고 부족 메시지 생성
   * @returns {string} 재고 부족 메시지
   */
  generateLowStockMessage() {
    const lowStockProducts = this.getLowStockProducts();
    const soldOutProducts = this.getSoldOutProducts();

    let message = '';

    lowStockProducts.forEach((product) => {
      message += `${product.name}: 재고 부족 (${product.q}개 남음)\n`;
    });

    soldOutProducts.forEach((product) => {
      message += `${product.name}: 품절\n`;
    });

    return message;
  }
}
