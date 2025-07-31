/**
 * 장바구니 상태를 UI Props로 변환하는 유틸리티 함수들
 * React 호환성을 위한 데이터 변환 레이어
 */

// CartItem 컴포넌트는 UI 컴포넌트이므로 shared에서 import하지 않음
// 대신 각 앱에서 필요한 UI 로직을 처리

/**
 * DOM에서 현재 장바구니 아이템들을 추출하여 Props 형태로 변환
 * @param {HTMLElement} cartDisplayArea - 장바구니 표시 영역
 * @param {Array} productInventory - 상품 인벤토리
 * @returns {Array} CartItems in props format
 */
export const extractCartItemsFromDOM = (cartDisplayArea, productInventory) => {
  const cartItems = [];
  const cartElements = cartDisplayArea.children;

  for (const cartElement of cartElements) {
    const productId = cartElement.id;
    const quantityElement = cartElement.querySelector('.quantity-number');

    if (quantityElement) {
      const quantity = parseInt(quantityElement.textContent, 10);
      const product = productInventory.find(p => p.id === productId);

      if (product) {
        cartItems.push({
          product: { ...product },
          quantity,
        });
      }
    }
  }

  return cartItems;
};

// createCartItemElement 함수는 UI 컴포넌트에 의존하므로 각 앱에서 별도로 구현
// Shared에서는 기본적인 데이터 변환 로직만 제공

/**
 * 장바구니 상태에서 총 아이템 수 계산
 * @param {HTMLElement} cartDisplayArea - 장바구니 표시 영역
 * @returns {number} Total item count
 */
export const calculateTotalItemCount = cartDisplayArea => {
  let totalCount = 0;
  const cartElements = cartDisplayArea.children;

  for (const cartElement of cartElements) {
    const quantityElement = cartElement.querySelector('.quantity-number');
    if (quantityElement) {
      totalCount += parseInt(quantityElement.textContent, 10);
    }
  }

  return totalCount;
};

/**
 * 장바구니 상태에서 총 금액 계산
 * @param {HTMLElement} cartDisplayArea - 장바구니 표시 영역
 * @param {Array} productInventory - 상품 인벤토리
 * @returns {number} Total amount
 */
export const calculateTotalAmount = (cartDisplayArea, productInventory) => {
  let totalAmount = 0;
  const cartElements = cartDisplayArea.children;

  for (const cartElement of cartElements) {
    const productId = cartElement.id;
    const quantityElement = cartElement.querySelector('.quantity-number');

    if (quantityElement) {
      const quantity = parseInt(quantityElement.textContent, 10);
      const product = productInventory.find(p => p.id === productId);

      if (product) {
        totalAmount += product.val * quantity;
      }
    }
  }

  return totalAmount;
};

/**
 * 재고 상태 메시지 생성
 * @param {Array} productInventory - 상품 인벤토리
 * @returns {string} Stock status message
 */
export const generateStockStatus = productInventory => {
  const outOfStockItems = productInventory.filter(product => product.q <= 0);

  if (outOfStockItems.length === 0) {
    return '';
  }

  return outOfStockItems.map(product => `${product.name}: 품절`).join('\n');
};

/**
 * 화요일 여부 확인
 * @returns {boolean} Is Tuesday
 */
export const isTuesday = () => {
  return new Date().getDay() === 2;
};
