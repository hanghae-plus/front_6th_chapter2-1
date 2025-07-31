// 장바구니 액션 타입들 (React Redux 스타일)
export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  REMOVE_ITEM: 'REMOVE_ITEM',
  VALIDATE_PRODUCT: 'VALIDATE_PRODUCT',
};

// 상품 유효성 검사 순수 함수
export function validateProductSelection(selectedProductId, productList) {
  if (!selectedProductId) {
    return { isValid: false, error: '상품을 선택해주세요.' };
  }

  const product = productList.find((p) => p.id === selectedProductId);
  if (!product) {
    return { isValid: false, error: '유효하지 않은 상품입니다.' };
  }

  if (product.availableStock <= 0) {
    return { isValid: false, error: '재고가 부족합니다.' };
  }

  return { isValid: true, product };
}

// 장바구니 아이템 수량 업데이트 계산 순수 함수
export function calculateQuantityUpdate(
  currentQuantity,
  change,
  availableStock,
) {
  const newQuantity = currentQuantity + change;

  if (newQuantity <= 0) {
    return {
      action: 'REMOVE',
      newQuantity: 0,
      stockChange: currentQuantity, // 전체 수량 복구
    };
  }

  if (newQuantity > availableStock + currentQuantity) {
    return {
      action: 'INVALID',
      newQuantity: currentQuantity,
      stockChange: 0,
      error: '재고가 부족합니다.',
    };
  }

  return {
    action: 'UPDATE',
    newQuantity,
    stockChange: -change, // 재고에서 차감/복구
  };
}

// 장바구니 추가 로직 순수 함수
export function processAddToCart(product, existingCartElement) {
  if (existingCartElement) {
    // 기존 아이템 수량 증가
    const quantityElem = existingCartElement.querySelector('.quantity-number');
    const currentQuantity = parseInt(quantityElem.textContent);

    if (currentQuantity < product.availableStock + currentQuantity) {
      return {
        action: 'INCREMENT_EXISTING',
        element: existingCartElement,
        newQuantity: currentQuantity + 1,
        stockChange: -1,
      };
    }
    return {
      action: 'ERROR',
      error: '재고가 부족합니다.',
    };
  }
  // 새 아이템 추가
  return {
    action: 'ADD_NEW',
    product,
    stockChange: -1,
  };
}

// 도움말 모달 상태 토글 순수 함수
export function toggleManualModal(isHidden) {
  return {
    overlayClasses: isHidden ? ['hidden'] : [],
    columnClasses: isHidden ? ['translate-x-full'] : [],
  };
}
