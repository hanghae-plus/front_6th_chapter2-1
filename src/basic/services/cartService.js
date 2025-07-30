import CartStore from "../store/cartStore.js";
import { uiEventBus } from "../core/eventBus.js";

// 장바구니 서비스
export class CartService {
  constructor() {
    this.cartStore = new CartStore();
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
    return this.cartStore.addToCart(product, quantity);
  }

  /**
   * 장바구니에서 상품 수량을 변경합니다.
   *
   * @param {string} productId - 상품 ID
   * @param {number} quantityChange - 수량 변경값
   * @param {Array} productList - 상품 목록
   * @returns {boolean} 성공 여부
   */
  updateCartItemQuantity(productId, quantityChange, productList) {
    return this.cartStore.updateCartItemQuantity(productId, quantityChange, productList);
  }

  /**
   * 장바구니에서 상품을 제거합니다.
   *
   * @param {string} productId - 상품 ID
   * @param {Array} productList - 상품 목록
   * @returns {boolean} 성공 여부
   */
  removeProductFromCart(productId, productList) {
    return this.cartStore.removeFromCart(productId, productList);
  }

  /**
   * 장바구니 아이템 개수를 반환합니다.
   *
   * @returns {number} 장바구니 아이템 개수
   */
  getItemCount() {
    return this.cartStore.getItemCount();
  }

  /**
   * 장바구니 총액을 반환합니다.
   *
   * @returns {number} 장바구니 총액
   */
  getTotalAmount() {
    return this.cartStore.getTotalAmount();
  }

  /**
   * 마지막 선택된 상품 ID를 반환합니다.
   *
   * @returns {string|null} 마지막 선택된 상품 ID
   */
  getLastSelectedProduct() {
    return this.cartStore.getLastSelectedProduct();
  }

  /**
   * 장바구니 추가 요청을 처리합니다.
   * UI에서 호출되는 메서드로, 이벤트 발송을 담당합니다.
   */
  addToCart() {
    // 이벤트 발송
    uiEventBus.emit("cart:add:requested");
  }
}
