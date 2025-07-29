import { cartStore } from "../store/cartStore.js";
import { eventBus, EVENT_TYPES } from "../utils/EventBus.js";

/**
 * 장바구니 서비스 - 비즈니스 로직 담당
 * 클린코드 원칙: 단일 책임, 의미있는 이름, 중복 제거
 */
export class CartService {
  constructor() {
    // cartStore 구독
    this.unsubscribe = cartStore.subscribe(this.handleCartChange.bind(this));
  }

  /**
   * 장바구니 변경 이벤트 처리
   */
  handleCartChange(cartState) {
    eventBus.emit(EVENT_TYPES.CART_UPDATED, cartState);
  }

  /**
   * 선택된 상품의 유효성을 검증합니다.
   *
   * @param {string} selectedProductId - 선택된 상품 ID
   * @param {Array} productList - 상품 목록
   * @returns {Object|null} 유효한 상품 객체 또는 null
   */
  validateSelectedProduct(selectedProductId, productList) {
    if (!selectedProductId) return null;

    const targetProduct = productList.find(product => product.id === selectedProductId);
    return targetProduct && targetProduct.quantity > 0 ? targetProduct : null;
  }

  /**
   * 장바구니에 상품을 추가합니다.
   *
   * @param {Object} product - 추가할 상품
   * @param {number} quantity - 추가할 수량
   * @returns {boolean} 성공 여부
   */
  addProductToCart(product, quantity = 1) {
    const success = cartStore.addToCart(product, quantity);

    if (success) {
      eventBus.emit(EVENT_TYPES.ITEM_ADDED, { product, quantity });
    }

    return success;
  }

  /**
   * 장바구니에서 상품 수량을 변경합니다.
   *
   * @param {string} productId - 상품 ID
   * @param {number} quantityChange - 수량 변경값
   * @param {Array} productList - 전체 상품 목록
   * @returns {boolean} 성공 여부
   */
  updateCartItemQuantity(productId, quantityChange, productList) {
    const success = cartStore.updateCartItemQuantity(productId, quantityChange, productList);

    if (success) {
      eventBus.emit(EVENT_TYPES.QUANTITY_CHANGED, { productId, quantityChange });
    }

    return success;
  }

  /**
   * 장바구니에서 상품을 제거합니다.
   *
   * @param {string} productId - 상품 ID
   * @param {Array} productList - 전체 상품 목록
   * @returns {boolean} 성공 여부
   */
  removeProductFromCart(productId, productList) {
    const success = cartStore.removeFromCart(productId, productList);

    if (success) {
      eventBus.emit(EVENT_TYPES.ITEM_REMOVED, { productId });
    }

    return success;
  }

  /**
   * 장바구니 아이템을 찾습니다.
   *
   * @param {string} productId - 상품 ID
   * @returns {Object|null} 장바구니 아이템 또는 null
   */
  findCartItem(productId) {
    return cartStore.findCartItem(productId);
  }

  /**
   * 장바구니를 초기화합니다.
   *
   * @param {Array} productList - 전체 상품 목록
   */
  resetCart(productList) {
    cartStore.resetCart(productList);
  }

  /**
   * 재고 부족 상품 목록을 반환합니다.
   *
   * @param {Array} productList - 전체 상품 목록
   * @returns {Array} 재고 부족 상품 목록
   */
  getLowStockProducts(productList) {
    return productList.filter(product => product.quantity < 5 && product.quantity > 0);
  }

  /**
   * 장바구니 상태를 반환합니다.
   *
   * @returns {Object} 장바구니 상태
   */
  getCartState() {
    return cartStore.getCartState();
  }

  /**
   * 장바구니 아이템 개수를 반환합니다.
   *
   * @returns {number} 장바구니 아이템 개수
   */
  getItemCount() {
    return cartStore.getItemCount();
  }

  /**
   * 장바구니 총액을 반환합니다.
   *
   * @returns {number} 장바구니 총액
   */
  getTotalAmount() {
    return cartStore.getTotalAmount();
  }

  /**
   * 마지막 선택된 상품 ID를 반환합니다.
   *
   * @returns {string|null} 마지막 선택된 상품 ID
   */
  getLastSelectedProduct() {
    return cartStore.getLastSelectedProduct();
  }

  /**
   * 마지막 선택된 상품 ID를 설정합니다.
   *
   * @param {string} productId - 상품 ID
   */
  setLastSelectedProduct(productId) {
    cartStore.setLastSelectedProduct(productId);
    eventBus.emit(EVENT_TYPES.PRODUCT_SELECTED, { productId });
  }

  /**
   * 보너스 포인트를 설정합니다.
   *
   * @param {number} points - 포인트
   */
  setBonusPoints(points) {
    cartStore.setBonusPoints(points);
  }

  /**
   * 보너스 포인트를 반환합니다.
   *
   * @returns {number} 보너스 포인트
   */
  getBonusPoints() {
    return cartStore.getBonusPoints();
  }

  /**
   * 장바구니 변경 구독
   *
   * @param {Function} callback - 콜백 함수
   * @returns {Function} 구독 해제 함수
   */
  subscribeToChanges(callback) {
    return cartStore.subscribe(callback);
  }

  /**
   * 서비스 정리
   */
  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// 싱글톤 인스턴스 생성
export const cartService = new CartService();
