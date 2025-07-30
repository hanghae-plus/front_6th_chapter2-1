// Service Manager - 모든 Service를 중앙에서 관리
export class ServiceManager {
  constructor() {
    this.services = new Map();
  }

  /**
   * Service를 등록합니다.
   *
   * @param {string} name - Service 이름
   * @param {Object} service - Service 인스턴스
   */
  register(name, service) {
    this.services.set(name, service);
  }

  /**
   * Service를 조회합니다.
   *
   * @param {string} name - Service 이름
   * @returns {Object|null} Service 인스턴스
   */
  get(name) {
    return this.services.get(name);
  }

  /**
   * 모든 Service를 초기화합니다.
   */
  async initializeAll() {
    const productService = this.get("product");
    const cartService = this.get("cart");

    if (productService && productService.initializeUI) {
      await productService.initializeUI();
    }

    if (cartService && cartService.initializeUI) {
      await cartService.initializeUI();
    }
  }

  /**
   * 모든 Service를 반환합니다.
   *
   * @returns {Object} Service 객체들
   */
  getAllServices() {
    return {
      productService: this.get("product"),
      cartService: this.get("cart"),
      orderService: this.get("order"),
      discountService: this.get("discount"),
    };
  }
}
