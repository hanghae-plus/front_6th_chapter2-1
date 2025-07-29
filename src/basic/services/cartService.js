import CartStore from "../store/cartStore.js";

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
   * @param {Array} productList - 전체 상품 목록
   * @returns {boolean} 성공 여부
   */
  updateCartItemQuantity(productId, quantityChange, productList) {
    return this.cartStore.updateCartItemQuantity(productId, quantityChange, productList);
  }

  /**
   * 장바구니에서 상품을 제거합니다.
   *
   * @param {string} productId - 상품 ID
   * @param {Array} productList - 전체 상품 목록
   * @returns {boolean} 성공 여부
   */
  removeProductFromCart(productId, productList) {
    return this.cartStore.removeFromCart(productId, productList);
  }

  /**
   * 장바구니 아이템을 찾습니다.
   *
   * @param {string} productId - 상품 ID
   * @returns {Object|null} 장바구니 아이템 또는 null
   */
  findCartItem(productId) {
    return this.cartStore.findCartItem(productId);
  }

  /**
   * 장바구니를 초기화합니다.
   *
   * @param {Array} productList - 전체 상품 목록
   */
  resetCart(productList) {
    this.cartStore.resetCart(productList);
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
    return this.cartStore.getCartState();
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
   * 마지막 선택된 상품 ID를 설정합니다.
   *
   * @param {string} productId - 상품 ID
   */
  setLastSelectedProduct(productId) {
    this.cartStore.setLastSelectedProduct(productId);
  }

  /**
   * 보너스 포인트를 설정합니다.
   *
   * @param {number} points - 포인트
   */
  setBonusPoints(points) {
    this.cartStore.setBonusPoints(points);
  }

  /**
   * 보너스 포인트를 반환합니다.
   *
   * @returns {number} 보너스 포인트
   */
  getBonusPoints() {
    return this.cartStore.getBonusPoints();
  }

  /**
   * 장바구니 변경 구독
   *
   * @param {Function} callback - 콜백 함수
   * @returns {Function} 구독 해제 함수
   */
  subscribeToChanges(callback) {
    return this.cartStore.subscribe(callback);
  }

  /**
   * 서비스 정리
   */
  destroy() {
    // EventBus 제거로 인해 정리할 것이 없음
  }
}
