import { discountService } from "../services/discountService.js";

export class CartStore {
  constructor() {
    this.cartItems = [];
    this.totalAmount = 0;
    this.itemCount = 0;
    this.discountRate = 0;
    this.savedAmount = 0;
    this.lastSelectedProduct = null;
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
    return true;
  }

  // 장바구니 아이템 찾기
  findCartItem(productId) {
    return this.cartItems.find(item => item.id === productId) || null;
  }

  // 장바구니 총액과 할인 계산 (discountService 사용)
  updateCartTotals() {
    // discountService를 사용하여 할인 계산
    const discountResult = discountService.applyAllDiscounts(this.cartItems, []);

    this.totalAmount = discountResult.finalAmount;
    this.itemCount = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    this.discountRate = discountResult.originalAmount > 0 ? (discountResult.originalAmount - discountResult.finalAmount) / discountResult.originalAmount : 0;
    this.savedAmount = discountResult.savedAmount;

    return {
      subtotal: discountResult.originalAmount,
      totalAmount: this.totalAmount,
      itemCount: this.itemCount,
      discountRate: this.discountRate,
      savedAmount: this.savedAmount,
      itemDiscounts: discountResult.individualDiscounts,
      isTuesday: discountResult.tuesdayDiscount.applied,
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

    this.lastSelectedProduct = null;
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
  }
}

export default CartStore;
