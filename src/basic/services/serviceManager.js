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
    // 등록된 모든 Service를 순회하며 초기화
    for (const [, service] of this.services) {
      if (service && typeof service.initializeUI === "function") {
        await service?.initializeUI?.();
      }
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
