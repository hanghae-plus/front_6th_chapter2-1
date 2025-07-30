import CartStore from "../store/cartStore.js";
import { uiEventBus } from "../core/eventBus.js";
import { discountService } from "./discountService.js";

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
   * 재고 유효성을 검증합니다.
   *
   * @param {Object} product - 상품 객체
   * @param {number} quantity - 요청 수량
   * @returns {boolean} 재고 유효성
   */
  validateStock(product, quantity) {
    return product && quantity > 0 && product.quantity >= quantity;
  }

  /**
   * 장바구니에 상품을 추가합니다.
   *
   * @param {Object} product - 추가할 상품
   * @param {number} quantity - 추가할 수량
   * @returns {boolean} 성공 여부
   */
  addProductToCart(product, quantity = 1) {
    if (!this.validateStock(product, quantity)) {
      return false;
    }

    const existingItem = this.cartStore.findItem(product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartStore.updateItem(product.id, existingItem);
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        originalPrice: product.originalPrice || product.price,
      };
      this.cartStore.addItem(newItem);
    }

    product.quantity -= quantity;
    this.updateCartTotals();
    return true;
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
    const cartItem = this.cartStore.findItem(productId);
    const product = productList.find(p => p.id === productId);

    if (!cartItem || !product) return false;

    const newQuantity = cartItem.quantity + quantityChange;

    if (newQuantity <= 0) {
      // 장바구니에서 제거
      return this.removeProductFromCart(productId, productList);
    }

    if (newQuantity > cartItem.quantity + product.quantity) {
      return false; // 재고 부족
    }

    const quantityDiff = newQuantity - cartItem.quantity;
    cartItem.quantity = newQuantity;
    this.cartStore.updateItem(productId, cartItem);
    product.quantity -= quantityDiff;

    this.updateCartTotals();
    return true;
  }

  /**
   * 장바구니에서 상품을 제거합니다.
   *
   * @param {string} productId - 상품 ID
   * @param {Array} productList - 상품 목록
   * @returns {boolean} 성공 여부
   */
  removeProductFromCart(productId, productList) {
    const cartItem = this.cartStore.findItem(productId);
    const product = productList.find(p => p.id === productId);

    if (!cartItem || !product) return false;

    product.quantity += cartItem.quantity;
    this.cartStore.removeItem(productId);

    this.updateCartTotals();
    return true;
  }

  /**
   * 장바구니 총액과 할인을 계산합니다.
   */
  updateCartTotals() {
    const cartItems = this.cartStore.getCartItems();
    const discountResult = discountService.applyAllDiscounts(cartItems, []);

    this.cartStore.setTotalAmount(discountResult.finalAmount);
    this.cartStore.setItemCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    this.cartStore.setDiscountRate(discountResult.originalAmount > 0 ? (discountResult.originalAmount - discountResult.finalAmount) / discountResult.originalAmount : 0);
    this.cartStore.setSavedAmount(discountResult.savedAmount);

    return {
      subtotal: discountResult.originalAmount,
      totalAmount: this.cartStore.getTotalAmount(),
      itemCount: this.cartStore.getItemCount(),
      discountRate: this.cartStore.getDiscountRate(),
      savedAmount: this.cartStore.getSavedAmount(),
      itemDiscounts: discountResult.individualDiscounts,
      isTuesday: discountResult.tuesdayDiscount.applied,
    };
  }

  /**
   * 장바구니를 초기화합니다.
   *
   * @param {Array} productList - 상품 목록
   */
  resetCart(productList) {
    const cartItems = this.cartStore.getCartItems();

    // 재고 복원
    for (const cartItem of cartItems) {
      const product = productList.find(p => p.id === cartItem.id);
      if (product) {
        product.quantity += cartItem.quantity;
      }
    }

    this.cartStore.clearCart();
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
   * 마지막 선택된 상품을 설정합니다.
   *
   * @param {string} productId - 상품 ID
   */
  setLastSelectedProduct(productId) {
    this.cartStore.setLastSelectedProduct(productId);
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
