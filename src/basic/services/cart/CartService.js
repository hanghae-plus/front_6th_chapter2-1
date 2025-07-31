/**
 * 장바구니 관련 비즈니스 로직을 담당하는 함수들
 */

/**
 * 장바구니 상태 초기화
 */
export function createInitialCartState() {
  return {
    items: [],
    totalAmount: 0,
    itemCount: 0,
    lastSelectedProductId: null,
  };
}

/**
 * 장바구니에 상품 추가
 */
export function addItemToCart(cartState, productId, quantity, productService) {
  const product = productService.getProductById(productId);

  if (!product) {
    return {
      success: false,
      message: '상품을 찾을 수 없습니다.',
      cartState,
    };
  }

  if (product.quantity < quantity) {
    return {
      success: false,
      message: '재고가 부족합니다.',
      cartState,
    };
  }

  const existingItem = cartState.items.find((item) => item.id === productId);

  if (existingItem) {
    // 기존 상품의 추가 수량이 재고를 초과하는지 확인
    if (product.quantity < quantity) {
      return {
        success: false,
        message: '재고가 부족합니다.',
        cartState,
      };
    }

    // 기존 상품 수량 증가
    const updatedItems = cartState.items.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + quantity } : item,
    );

    const newCartState = {
      ...cartState,
      items: updatedItems,
      lastSelectedProductId: productId,
    };

    // 재고 감소
    const stockResult = productService.decreaseStock(productId, quantity);
    if (!stockResult.success) {
      return {
        success: false,
        message: stockResult.message || '재고 업데이트에 실패했습니다.',
        cartState,
      };
    }

    return {
      success: true,
      cartState: updateCartSummary(newCartState, productService),
    };
  } else {
    // 새 상품 추가
    const newItem = {
      id: productId,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      quantity,
      onSale: product.onSale || false,
      suggestSale: product.suggestSale || false,
    };

    const newCartState = {
      ...cartState,
      items: [...cartState.items, newItem],
      lastSelectedProductId: productId,
    };

    // 재고 감소
    const stockResult = productService.decreaseStock(productId, quantity);
    if (!stockResult.success) {
      return {
        success: false,
        message: stockResult.message || '재고 업데이트에 실패했습니다.',
        cartState,
      };
    }

    return {
      success: true,
      cartState: updateCartSummary(newCartState, productService),
    };
  }
}

/**
 * 장바구니에서 상품 수량 변경
 */
export function updateCartItemQuantity(cartState, productId, newQuantity, productService) {
  const item = cartState.items.find((item) => item.id === productId);
  if (!item) {
    return {
      success: false,
      message: '상품을 찾을 수 없습니다.',
      cartState,
    };
  }

  if (newQuantity <= 0) {
    // 상품 제거
    return removeItemFromCart(cartState, productId, productService);
  }

  const quantityDifference = newQuantity - item.quantity;
  const product = productService.getProductById(productId);

  if (!product) {
    return {
      success: false,
      message: '상품 정보를 찾을 수 없습니다.',
      cartState,
    };
  }

  // 수량 증가 시 재고 확인
  if (quantityDifference > 0 && product.quantity < quantityDifference) {
    return {
      success: false,
      message: '재고가 부족합니다.',
      cartState,
    };
  }

  // 수량 변경
  const updatedItems = cartState.items.map((item) =>
    item.id === productId ? { ...item, quantity: newQuantity } : item,
  );

  const newCartState = {
    ...cartState,
    items: updatedItems,
  };

  // 재고 업데이트 (양수면 감소, 음수면 증가)
  const stockResult = productService.decreaseStock(productId, quantityDifference);
  if (!stockResult.success) {
    return {
      success: false,
      message: stockResult.message || '재고 업데이트에 실패했습니다.',
      cartState,
    };
  }

  return {
    success: true,
    cartState: updateCartSummary(newCartState, productService),
  };
}

/**
 * 장바구니에서 상품 제거
 */
export function removeItemFromCart(cartState, productId, productService) {
  const itemIndex = cartState.items.findIndex((item) => item.id === productId);
  if (itemIndex === -1) {
    return {
      success: false,
      message: '상품을 찾을 수 없습니다.',
      cartState,
    };
  }

  const item = cartState.items[itemIndex];

  // 재고 복구
  const stockResult = productService.increaseStock(productId, item.quantity);
  if (!stockResult.success) {
    return {
      success: false,
      message: stockResult.message || '재고 복구에 실패했습니다.',
      cartState,
    };
  }

  // 장바구니에서 제거
  const newItems = cartState.items.filter((item) => item.id !== productId);
  const newCartState = {
    ...cartState,
    items: newItems,
  };

  return {
    success: true,
    cartState: updateCartSummary(newCartState, productService),
  };
}

/**
 * 장바구니 비우기
 */
export function clearCart(cartState, productService) {
  // 모든 상품의 재고 복구
  cartState.items.forEach((item) => {
    productService.increaseStock(item.id, item.quantity);
  });

  const newCartState = {
    ...cartState,
    items: [],
  };

  return updateCartSummary(newCartState, productService);
}

/**
 * 장바구니 요약 정보 업데이트
 */
export function updateCartSummary(cartState, productService) {
  const itemCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  // 각 상품별 합계 계산
  let totalAmount = 0;

  cartState.items.forEach((item) => {
    const product = productService.getProductById(item.id);
    if (product) {
      // 현재 상품의 실제 가격 사용 (할인이 적용된 가격)
      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;
    }
  });

  return {
    ...cartState,
    itemCount,
    totalAmount,
  };
}

/**
 * 장바구니 상태 조회
 */
export function getCartState(cartState, productService, discountService, pointService) {
  const updatedCartState = updateCartSummary(cartState, productService);

  // 포인트 정보 계산 (pointService 주입 필요)
  const pointInfo = {
    totalPoints: 0,
    details: [],
    displayText: '적립 포인트: 0p',
  };

  // 할인 정보 계산 (discountService 주입 필요)
  const discountInfo = [];

  return {
    items: [...updatedCartState.items],
    summary: {
      subtotal: updatedCartState.items.reduce((total, item) => {
        const product = productService.getProductById(item.id);
        return total + (product ? product.originalPrice || product.price : 0) * item.quantity;
      }, 0),
      totalAmount: updatedCartState.totalAmount,
      itemCount: updatedCartState.itemCount,
      itemDiscounts: [],
      discountRate: 0,
      isTuesday: false,
    },
    pointInfo,
    discountInfo,
    lastSelectedProductId: updatedCartState.lastSelectedProductId,
  };
}

/**
 * 장바구니가 비어있는지 확인
 */
export function isCartEmpty(cartState) {
  return cartState.items.length === 0;
}

/**
 * 특정 상품이 장바구니에 있는지 확인
 */
export function hasCartItem(cartState, productId) {
  return cartState.items.some((item) => item.id === productId);
}

/**
 * 장바구니 아이템 수 조회
 */
export function getCartItemCount(cartState) {
  return cartState.items.reduce((total, item) => total + item.quantity, 0);
}

/**
 * 총 금액 조회
 */
export function getCartTotalAmount(cartState) {
  return cartState.totalAmount;
}

/**
 * 장바구니 아이템 조회
 */
export function getCartItems(cartState) {
  return [...cartState.items];
}

/**
 * 특정 상품의 장바구니 아이템 조회
 */
export function getCartItem(cartState, productId) {
  return cartState.items.find((item) => item.id === productId);
}
