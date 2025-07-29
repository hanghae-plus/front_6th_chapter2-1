import { Cart, CartItem } from './CartData.js';
import { ProductService } from '../product/ProductService.js';

/**
 * 장바구니 관리 서비스
 */
export class CartService {
  constructor(productService) {
    this.cart = new Cart();
    this.productService = productService;
  }

  /**
   * 상품을 장바구니에 추가
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 수량
   * @returns {boolean} 성공 여부
   */
  addItemToCart(productId, quantity = 1) {
    const product = this.productService.getProductById(productId);
    if (!product) {
      return false;
    }

    const success = this.cart.addItem(product, quantity);
    if (success) {
      this.productService.decreaseProductStock(productId, quantity);
    }

    return success;
  }

  /**
   * 장바구니에서 상품 제거
   * @param {string} productId - 상품 ID
   * @returns {boolean} 성공 여부
   */
  removeItemFromCart(productId) {
    const item = this.cart.getItem(productId);
    if (!item) {
      return false;
    }

    const success = this.cart.removeItem(productId);
    if (success) {
      this.productService.increaseProductStock(productId, item.quantity);
    }

    return success;
  }

  /**
   * 장바구니 상품 수량 변경
   * @param {string} productId - 상품 ID
   * @param {number} newQuantity - 새로운 수량
   * @returns {boolean} 성공 여부
   */
  updateItemQuantity(productId, newQuantity) {
    const item = this.cart.getItem(productId);
    if (!item) {
      return false;
    }

    const quantityDifference = newQuantity - item.quantity;

    if (quantityDifference > 0) {
      // 수량 증가
      const product = this.productService.getProductById(productId);
      if (!product || product.q < quantityDifference) {
        return false;
      }

      this.productService.decreaseProductStock(productId, quantityDifference);
    } else if (quantityDifference < 0) {
      // 수량 감소
      this.productService.increaseProductStock(productId, Math.abs(quantityDifference));
    }

    return this.cart.updateItemQuantity(productId, newQuantity);
  }

  /**
   * 장바구니 상품 수량 증가
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 증가할 수량
   * @returns {boolean} 성공 여부
   */
  increaseItemQuantity(productId, quantity = 1) {
    const item = this.cart.getItem(productId);
    if (!item) {
      return false;
    }

    const newQuantity = item.quantity + quantity;
    return this.updateItemQuantity(productId, newQuantity);
  }

  /**
   * 장바구니 상품 수량 감소
   * @param {string} productId - 상품 ID
   * @param {number} quantity - 감소할 수량
   * @returns {boolean} 성공 여부
   */
  decreaseItemQuantity(productId, quantity = 1) {
    const item = this.cart.getItem(productId);
    if (!item) {
      return false;
    }

    const newQuantity = item.quantity - quantity;
    return this.updateItemQuantity(productId, newQuantity);
  }

  /**
   * 장바구니 아이템 조회
   * @param {string} productId - 상품 ID
   * @returns {CartItem|null} 장바구니 아이템 또는 null
   */
  getCartItem(productId) {
    return this.cart.getItem(productId);
  }

  /**
   * 모든 장바구니 아이템 조회
   * @returns {CartItem[]} 장바구니 아이템 목록
   */
  getAllCartItems() {
    return this.cart.getAllItems();
  }

  /**
   * 장바구니 총 수량 조회
   * @returns {number} 총 수량
   */
  getTotalQuantity() {
    return this.cart.getTotalQuantity();
  }

  /**
   * 장바구니 소계 조회
   * @returns {number} 소계
   */
  getSubtotal() {
    return this.cart.getSubtotal();
  }

  /**
   * 장바구니 원래 소계 조회
   * @returns {number} 원래 소계
   */
  getOriginalSubtotal() {
    return this.cart.getOriginalSubtotal();
  }

  /**
   * 장바구니가 비어있는지 확인
   * @returns {boolean} 비어있음 여부
   */
  isEmpty() {
    return this.cart.isEmpty();
  }

  /**
   * 장바구니 비우기
   */
  clearCart() {
    // 모든 아이템의 재고를 복원
    this.cart.getAllItems().forEach((item) => {
      this.productService.increaseProductStock(item.id, item.quantity);
    });

    this.cart.clear();
  }

  /**
   * 장바구니 아이템 할인 상태 업데이트
   */
  updateCartItemDiscounts() {
    this.cart.getAllItems().forEach((item) => {
      const product = this.productService.getProductById(item.id);
      if (product) {
        item.updateDiscountStatus(product);
      }
    });
  }
}
