import CartStore from "../store/cartStore.js";

// 장바구니 검증 헬퍼
export const CartValidationHelper = {
  // 선택된 상품의 유효성을 검증합니다.
  validateSelectedProduct(selectedProductId, productList) {
    if (!selectedProductId) return null;

    const targetProduct = productList.find(product => product.id === selectedProductId);
    return targetProduct && targetProduct.quantity > 0 ? targetProduct : null;
  },

  // 재고 유효성을 검증합니다.
  validateStock(product, quantity) {
    return product && quantity > 0 && product.quantity >= quantity;
  },
};

// 장바구니 계산 헬퍼
export const CartCalculationHelper = {
  // 소계 계산
  calculateSubtotal(cartItems) {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  // 아이템 수량 계산
  calculateItemCount(cartItems) {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  // 장바구니 총액 계산
  calculateCartTotals(cartItems) {
    const subtotal = this.calculateSubtotal(cartItems);
    const itemCount = this.calculateItemCount(cartItems);

    return {
      subtotal,
      totalAmount: subtotal,
      itemCount,
      discountRate: 0,
      savedAmount: 0,
      itemDiscounts: [],
      isTuesday: false,
    };
  },
};

// 장바구니 아이템 헬퍼
export const CartItemHelper = {
  // 기존 아이템 찾기
  findExistingItem(cartItems, productId) {
    return cartItems.find(item => item.id === productId);
  },

  // 장바구니 아이템 생성
  createCartItem(product, quantity) {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      originalPrice: product.originalPrice || product.price,
    };
  },

  // 아이템 수량 업데이트
  updateItemQuantity(cartItem, newQuantity) {
    return { ...cartItem, quantity: newQuantity };
  },

  // 아이템 제거
  removeItem(cartItems, productId) {
    return cartItems.filter(item => item.id !== productId);
  },

  // 아이템 업데이트
  updateItem(cartItems, productId, updatedItem) {
    return cartItems.map(item => (item.id === productId ? updatedItem : item));
  },
};

// 장바구니 상태 헬퍼
export const CartStateHelper = {
  // 장바구니 상태 생성
  createCartState(cartItems, totals) {
    return {
      cartItems,
      totalAmount: totals.totalAmount,
      itemCount: totals.itemCount,
      discountRate: totals.discountRate,
      savedAmount: totals.savedAmount,
    };
  },

  // 초기화 상태 생성
  createResetState() {
    return {
      cartItems: [],
      totalAmount: 0,
      itemCount: 0,
      discountRate: 0,
      savedAmount: 0,
      lastSelectedProduct: null,
    };
  },
};

// 장바구니 서비스
export class CartService {
  constructor() {
    this.cartStore = new CartStore();
  }

  // 선택된 상품의 유효성을 검증합니다.
  validateSelectedProduct(selectedProductId, productList) {
    return CartValidationHelper.validateSelectedProduct(selectedProductId, productList);
  }

  // 재고 유효성을 검증합니다.
  validateStock(product, quantity) {
    return CartValidationHelper.validateStock(product, quantity);
  }

  // 장바구니 상품 추가
  addProductToCart(product, quantity = 1) {
    if (!this.validateStock(product, quantity)) {
      alert("재고가 부족합니다.");
      return false;
    }

    const { cartItems } = this.cartStore.getState();
    const existingItem = CartItemHelper.findExistingItem(cartItems, product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      this.cartStore.setState({
        cartItems: CartItemHelper.updateItem(cartItems, product.id, existingItem),
      });
    } else {
      const newItem = CartItemHelper.createCartItem(product, quantity);
      this.cartStore.setState({
        cartItems: [...cartItems, newItem],
      });
    }

    product.quantity -= quantity;
    this.updateCartTotals();
    return true;
  }

  // 장바구니에서 상품 수량을 변경합니다.
  updateCartItemQuantity(productId, quantityChange, productList) {
    const { cartItems } = this.cartStore.getState();
    const cartItem = CartItemHelper.findExistingItem(cartItems, productId);
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
    const updatedItem = CartItemHelper.updateItemQuantity(cartItem, newQuantity);

    this.cartStore.setState({
      cartItems: CartItemHelper.updateItem(cartItems, productId, updatedItem),
    });

    product.quantity -= quantityDiff;

    this.updateCartTotals();
    return true;
  }

  // 장바구니에서 상품을 제거합니다.
  removeProductFromCart(productId, productList) {
    const { cartItems } = this.cartStore.getState();
    const cartItem = CartItemHelper.findExistingItem(cartItems, productId);
    const product = productList.find(p => p.id === productId);

    if (!cartItem || !product) return false;

    product.quantity += cartItem.quantity;
    this.cartStore.setState({
      cartItems: CartItemHelper.removeItem(cartItems, productId),
    });

    this.updateCartTotals();
    return true;
  }

  // 장바구니 총액을 계산합니다.
  updateCartTotals() {
    const { cartItems } = this.cartStore.getState();

    // 기본 총액 계산 (할인 없음)
    const totals = CartCalculationHelper.calculateCartTotals(cartItems);
    const cartState = CartStateHelper.createCartState(cartItems, totals);

    this.cartStore.setState(cartState);

    return totals;
  }

  // 장바구니를 초기화합니다.
  resetCart(productList) {
    const { cartItems } = this.cartStore.getState();

    // 재고 복원
    for (const cartItem of cartItems) {
      const product = productList.find(p => p.id === cartItem.id);
      if (product) {
        product.quantity += cartItem.quantity;
      }
    }

    this.cartStore.setState(CartStateHelper.createResetState());
  }

  // 장바구니 아이템 개수를 반환합니다.
  getItemCount() {
    return this.cartStore.getState().itemCount;
  }

  // 장바구니 총액을 반환합니다.
  getTotalAmount() {
    return this.cartStore.getState().totalAmount;
  }

  // 마지막 선택된 상품 ID를 반환합니다.
  getLastSelectedProduct() {
    return this.cartStore.getState().lastSelectedProduct;
  }

  // 마지막 선택된 상품을 설정합니다.
  setLastSelectedProduct(productId) {
    this.cartStore.setState({ lastSelectedProduct: productId });
  }

  // 장바구니 상태를 반환합니다.
  getState() {
    return this.cartStore.getState();
  }
}
