import { DISCOUNT_RATES, PRODUCT_DISCOUNTS, QUANTITY_THRESHOLDS } from "../constants/index.js";

/**
 * 장바구니 서비스 - 비즈니스 로직 담당
 * 클린코드 원칙: 단일 책임, 의미있는 이름, 중복 제거
 */
export class CartService {
  constructor() {
    this.cartItems = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.discountRate = 0;
    this.savedAmount = 0;
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
    if (!product || quantity <= 0 || product.quantity < quantity) {
      return false;
    }

    const existingItem = this.findCartItem(product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        originalPrice: product.originalPrice || product.price,
      });
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
   * @param {Array} productList - 전체 상품 목록
   * @returns {boolean} 성공 여부
   */
  updateCartItemQuantity(productId, quantityChange, productList) {
    const cartItem = this.findCartItem(productId);
    const product = productList.find(p => p.id === productId);

    if (!cartItem || !product) return false;

    const newQuantity = cartItem.quantity + quantityChange;

    if (newQuantity <= 0) {
      // 장바구니에서 제거
      this.removeProductFromCart(productId, productList);
      return true;
    }

    if (newQuantity > cartItem.quantity + product.quantity) {
      return false; // 재고 부족
    }

    const quantityDiff = newQuantity - cartItem.quantity;
    cartItem.quantity = newQuantity;
    product.quantity -= quantityDiff;

    this.updateCartTotals();
    return true;
  }

  /**
   * 장바구니에서 상품을 제거합니다.
   *
   * @param {string} productId - 상품 ID
   * @param {Array} productList - 전체 상품 목록
   * @returns {boolean} 성공 여부
   */
  removeProductFromCart(productId, productList) {
    const cartItem = this.findCartItem(productId);
    const product = productList.find(p => p.id === productId);

    if (!cartItem || !product) return false;

    product.quantity += cartItem.quantity;
    this.cartItems = this.cartItems.filter(item => item.id !== productId);

    this.updateCartTotals();
    return true;
  }

  /**
   * 개별 상품 할인율을 계산합니다.
   *
   * @param {Object} cartItem - 장바구니 아이템
   * @returns {number} 할인율 (0-1)
   */
  calculateIndividualDiscount(cartItem) {
    if (cartItem.quantity < QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT) {
      return 0;
    }

    const discountMap = {
      p1: PRODUCT_DISCOUNTS.KEYBOARD_10_PLUS,
      p2: PRODUCT_DISCOUNTS.MOUSE_10_PLUS,
      p3: PRODUCT_DISCOUNTS.MONITOR_ARM_10_PLUS,
      p4: PRODUCT_DISCOUNTS.LAPTOP_POUCH_10_PLUS,
      p5: PRODUCT_DISCOUNTS.SPEAKER_10_PLUS,
    };

    return discountMap[cartItem.id] || 0;
  }

  /**
   * 전체 수량 할인율을 계산합니다.
   *
   * @param {number} totalQuantity - 전체 수량
   * @returns {number} 할인율 (0-1)
   */
  calculateBulkDiscount(totalQuantity) {
    return totalQuantity >= QUANTITY_THRESHOLDS.BULK_PURCHASE ? DISCOUNT_RATES.BULK_PURCHASE : 0;
  }

  /**
   * 화요일 특별 할인을 적용합니다.
   *
   * @param {number} amount - 적용할 금액
   * @returns {number} 할인된 금액
   */
  applyTuesdayDiscount(amount) {
    const isTuesday = new Date().getDay() === 2;
    return isTuesday ? amount * DISCOUNT_RATES.TUESDAY_SPECIAL : amount;
  }

  /**
   * 장바구니 총액과 할인을 계산합니다.
   */
  updateCartTotals() {
    let subtotal = 0;
    let totalAmount = 0;
    let totalQuantity = 0;
    const itemDiscounts = [];

    // 개별 상품 계산
    for (const cartItem of this.cartItems) {
      const itemTotal = cartItem.price * cartItem.quantity;
      subtotal += itemTotal;
      totalQuantity += cartItem.quantity;
    }

    // 전체 수량 할인 확인
    const bulkDiscount = this.calculateBulkDiscount(totalQuantity);

    if (bulkDiscount > 0) {
      // 전체 수량 할인이 있으면 개별 할인 무시
      totalAmount = subtotal * bulkDiscount;
    } else {
      // 개별 상품 할인 적용
      for (const cartItem of this.cartItems) {
        const itemTotal = cartItem.price * cartItem.quantity;
        const individualDiscount = this.calculateIndividualDiscount(cartItem);

        if (individualDiscount > 0) {
          itemDiscounts.push({
            name: cartItem.name,
            discount: individualDiscount * 100,
          });
        }

        totalAmount += itemTotal * (1 - individualDiscount);
      }
    }

    // 화요일 할인 적용
    totalAmount = this.applyTuesdayDiscount(totalAmount);

    // 최종 계산
    this.totalAmount = totalAmount;
    this.itemCount = totalQuantity;
    this.discountRate = subtotal > 0 ? (subtotal - totalAmount) / subtotal : 0;
    this.savedAmount = subtotal - totalAmount;

    return {
      subtotal,
      totalAmount: this.totalAmount,
      itemCount: this.itemCount,
      discountRate: this.discountRate,
      savedAmount: this.savedAmount,
      itemDiscounts,
      isTuesday: new Date().getDay() === 2,
    };
  }

  /**
   * 장바구니 아이템을 찾습니다.
   *
   * @param {string} productId - 상품 ID
   * @returns {Object|null} 장바구니 아이템 또는 null
   */
  findCartItem(productId) {
    return this.cartItems.find(item => item.id === productId) || null;
  }

  /**
   * 장바구니를 초기화합니다.
   *
   * @param {Array} productList - 전체 상품 목록
   */
  resetCart(productList) {
    // 재고 복원
    for (const cartItem of this.cartItems) {
      const product = productList.find(p => p.id === cartItem.id);
      if (product) {
        product.quantity += cartItem.quantity;
      }
    }

    this.cartItems = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.discountRate = 0;
    this.savedAmount = 0;
  }

  /**
   * 재고 부족 상품 목록을 반환합니다.
   *
   * @param {Array} productList - 전체 상품 목록
   * @returns {Array} 재고 부족 상품 목록
   */
  getLowStockProducts(productList) {
    return productList.filter(product => product.quantity < QUANTITY_THRESHOLDS.LOW_STOCK_WARNING && product.quantity > 0);
  }

  /**
   * 장바구니 상태를 반환합니다.
   *
   * @returns {Object} 장바구니 상태
   */
  getCartState() {
    return {
      items: this.cartItems,
      totalAmount: this.totalAmount,
      itemCount: this.itemCount,
      discountRate: this.discountRate,
      savedAmount: this.savedAmount,
    };
  }
}

// 싱글톤 인스턴스 생성
export const cartService = new CartService();
