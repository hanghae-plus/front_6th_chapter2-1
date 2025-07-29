import { DISCOUNT_RATES, PRODUCT_DISCOUNTS, QUANTITY_THRESHOLDS } from "../constants/index.js";

export class CartStore {
  constructor() {
    this.cartItems = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.discountRate = 0;
    this.savedAmount = 0;
    this.lastSelectedProduct = null;
    this.bonusPoints = 0;
    this.subscribers = new Set();
  }

  // 장바구니 아이템 추가
  addToCart(product, quantity = 1) {
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
    this.notifySubscribers();
    return true;
  }

  // 장바구니 아이템 수량 변경
  updateCartItemQuantity(productId, quantityChange, productList) {
    const cartItem = this.findCartItem(productId);
    const product = productList.find(p => p.id === productId);

    if (!cartItem || !product) return false;

    const newQuantity = cartItem.quantity + quantityChange;

    if (newQuantity <= 0) {
      // 장바구니에서 제거
      this.removeFromCart(productId, productList);
      return true;
    }

    if (newQuantity > cartItem.quantity + product.quantity) {
      return false; // 재고 부족
    }

    const quantityDiff = newQuantity - cartItem.quantity;
    cartItem.quantity = newQuantity;
    product.quantity -= quantityDiff;

    this.updateCartTotals();
    this.notifySubscribers();
    return true;
  }

  // 장바구니에서 상품 제거
  removeFromCart(productId, productList) {
    const cartItem = this.findCartItem(productId);
    const product = productList.find(p => p.id === productId);

    if (!cartItem || !product) return false;

    product.quantity += cartItem.quantity;
    this.cartItems = this.cartItems.filter(item => item.id !== productId);

    this.updateCartTotals();
    this.notifySubscribers();
    return true;
  }

  // 장바구니 아이템 찾기
  findCartItem(productId) {
    return this.cartItems.find(item => item.id === productId) || null;
  }

  // 개별 상품 할인 계산
  calculateIndividualDiscount(cartItem) {
    const discount = PRODUCT_DISCOUNTS[cartItem.id];
    return cartItem.quantity >= QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT ? discount : 0;
  }

  // 벌크 할인 계산
  calculateBulkDiscount(totalQuantity) {
    if (totalQuantity >= QUANTITY_THRESHOLDS.BULK_DISCOUNT) {
      return DISCOUNT_RATES.BULK_DISCOUNT;
    }
    return 0;
  }

  // 화요일 할인 적용
  applyTuesdayDiscount(amount) {
    const today = new Date().getDay();
    return today === 2 ? amount * DISCOUNT_RATES.TUESDAY_DISCOUNT : amount;
  }

  // 장바구니 총액과 할인 계산
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

  // 장바구니 초기화
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
    this.bonusPoints = 0;
    this.lastSelectedProduct = null;
    this.notifySubscribers();
  }

  // 장바구니 상태 조회
  getCartState() {
    return {
      items: this.cartItems,
      totalAmount: this.totalAmount,
      itemCount: this.itemCount,
      discountRate: this.discountRate,
      savedAmount: this.savedAmount,
      bonusPoints: this.bonusPoints,
      lastSelectedProduct: this.lastSelectedProduct,
    };
  }

  // 장바구니 아이템 개수 조회
  getItemCount() {
    return this.itemCount;
  }

  // 장바구니 총액 조회
  getTotalAmount() {
    return this.totalAmount;
  }

  // 마지막 선택된 상품 조회
  getLastSelectedProduct() {
    return this.lastSelectedProduct;
  }

  // 마지막 선택된 상품 설정
  setLastSelectedProduct(productId) {
    this.lastSelectedProduct = productId;
    this.notifySubscribers();
  }

  // 보너스 포인트 설정
  setBonusPoints(points) {
    this.bonusPoints = points;
    this.notifySubscribers();
  }

  // 보너스 포인트 조회
  getBonusPoints() {
    return this.bonusPoints;
  }

  // 구독자 등록
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback); // 구독 해제 함수 반환
  }

  // 구독자들에게 변경 알림
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getCartState());
      } catch (error) {
        console.error("CartStore subscriber error:", error);
      }
    });
  }
}

// 싱글톤 인스턴스 생성
export const cartStore = new CartStore();
