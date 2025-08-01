import { generateProductOptions } from '../components/ui';
import { PriceSummary } from '../components/ui';
import { updateCartUI } from '../uiEffects';
import {
  calculateCartTotals,
  calculateDiscountedTotal,
  applyBulkDiscount,
  applyTuesdayDiscount,
} from '../utils/cartUtils';
import { isTuesday } from '../utils/utils';

// React useReducer 스타일의 상태 객체
function createCartState() {
  return {
    totalAmount: 0,
    itemCount: 0,
    bonusPoints: 0,
    lastSelectedProductId: null,

    // 계산된 값들 (React의 useMemo와 유사)
    subTotal: 0,
    originalTotal: 0,
    discountRate: 0,
    itemDiscounts: [],
    lowStockItems: [],
  };
}

// React useCallback 스타일의 계산 함수들
export function createCartCalculations({
  productList,
  cartContainer,
  selectElement,
  findProductById,
  sumElement,
  stockInfoElement,
}) {
  // 내부 상태 (React useState와 유사)
  const cartState = createCartState();

  // 상품 옵션 업데이트 (React useCallback 패턴)
  const updateSelectOptions = () => {
    generateProductOptions({ selectElement, productList });
  };

  // 장바구니 가격 업데이트 (React useCallback 패턴)
  const updatePricesInCart = () => {
    let totalCount = 0;

    // 총 수량 계산
    for (let j = 0; j < cartContainer.children.length; j++) {
      const quantityElem =
        cartContainer.children[j].querySelector('.quantity-number');
      totalCount += quantityElem ? parseInt(quantityElem.textContent) : 0;
    }

    // 각 장바구니 아이템의 가격 업데이트
    const cartItems = cartContainer.children;
    for (let i = 0; i < cartItems.length; i++) {
      const itemId = cartItems[i].id;
      const product = findProductById(itemId);

      if (product) {
        const priceDiv = cartItems[i].querySelector('.text-lg');
        const nameDiv = cartItems[i].querySelector('h3');

        // 할인 상태에 따른 가격 및 이름 표시
        PriceSummary(priceDiv, product);
        nameDiv.textContent =
          (product.onSale && product.suggestSale
            ? '⚡💝'
            : product.onSale
              ? '⚡'
              : product.suggestSale
                ? '💝'
                : '') + product.name;
      }
    }

    // 장바구니 계산 재실행
    calculateCartStuff();
  };

  // 메인 장바구니 계산 로직 (React useMemo 패턴)
  const calculateCartStuff = () => {
    const cartItems = cartContainer.children;
    const itemDiscounts = [];
    const lowStockItems = [];

    // 상태 초기화
    cartState.totalAmount = 0;
    cartState.itemCount = 0;
    cartState.subTotal = 0;

    // ----------------------------------------
    // 재고 부족 상품 체크
    // ----------------------------------------
    for (let idx = 0; idx < productList.length; idx++) {
      if (
        productList[idx].availableStock < 5 &&
        productList[idx].availableStock > 0
      ) {
        lowStockItems.push(productList[idx].name);
      }
    }

    // ----------------------------------------
    // 장바구니 아이템별 계산 (순수 함수 사용)
    // ----------------------------------------
    const cartTotals = calculateCartTotals(cartItems, findProductById);
    cartState.subTotal = cartTotals.subTotal;
    cartState.itemCount = cartTotals.itemCount;
    itemDiscounts.push(...cartTotals.itemDiscounts);

    // 개별 상품 할인 적용된 총액 계산
    cartState.totalAmount = calculateDiscountedTotal(
      cartItems,
      findProductById,
    );

    // ----------------------------------------
    // 대량 구매 할인 적용 (순수 함수 사용)
    // ----------------------------------------
    cartState.originalTotal = cartState.subTotal;
    const bulkDiscountResult = applyBulkDiscount(
      cartState.itemCount,
      cartState.totalAmount,
      cartState.subTotal,
    );
    cartState.totalAmount = bulkDiscountResult.discountedAmount;
    cartState.discountRate = bulkDiscountResult.discountRate;

    // ----------------------------------------
    // 화요일 특별 할인 적용 (순수 함수 사용)
    // ----------------------------------------
    const tuesdayDiscountResult = applyTuesdayDiscount(
      cartState.totalAmount,
      cartState.originalTotal,
      isTuesday(),
    );
    cartState.totalAmount = tuesdayDiscountResult.discountedAmount;
    cartState.discountRate = tuesdayDiscountResult.finalDiscountRate;

    // ----------------------------------------
    // UI 업데이트 (React useEffect 패턴)
    // ----------------------------------------

    // 화요일 특별 할인 UI 업데이트
    const tuesdaySpecial = document.getElementById('tuesday-special');
    if (tuesdayDiscountResult.showTuesdaySpecial) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }

    // 전체 UI 업데이트
    const uiUpdateResult = updateCartUI({
      // 계산된 데이터
      itemCount: cartState.itemCount,
      subTotal: cartState.subTotal,
      totalAmount: cartState.totalAmount,
      originalTotal: cartState.originalTotal,
      discountRate: cartState.discountRate,
      itemDiscounts,
      cartItems,

      // 의존성
      productList,
      findProductById,
      showTuesdaySpecial: tuesdayDiscountResult.showTuesdaySpecial,

      // DOM 요소들
      sumElement,
      stockInfoElement,

      // 이전 상태 (최적화용)
      previousCount: null,
    });

    // 상태 업데이트
    cartState.bonusPoints = uiUpdateResult.bonusPoints || 0;
    cartState.itemDiscounts = itemDiscounts;
    cartState.lowStockItems = lowStockItems;

    return cartState;
  };

  // 상태 setter 함수들 (React useState setter 패턴)
  const setLastSelectedProductId = (id) => {
    cartState.lastSelectedProductId = id;
  };

  // 상태 getter 함수들 (React state 패턴)
  const getCartState = () => ({ ...cartState });

  const getTotalAmount = () => cartState.totalAmount;
  const getItemCount = () => cartState.itemCount;
  const getBonusPoints = () => cartState.bonusPoints;
  const getLastSelectedProductId = () => cartState.lastSelectedProductId;

  // React 커스텀 훅의 반환값과 유사한 구조
  return {
    // 상태값들
    getCartState,
    getTotalAmount,
    getItemCount,
    getBonusPoints,
    getLastSelectedProductId,

    // 액션 함수들
    calculateCartStuff,
    updatePricesInCart,
    updateSelectOptions,
    setLastSelectedProductId,

    // 내부 상태 (직접 접근용 - 임시)
    _state: cartState,
  };
}

// React Provider 패턴과 유사한 전역 상태 관리
let globalCartState = null;

export function initializeCartState(dependencies) {
  globalCartState = createCartCalculations(dependencies);
  return globalCartState;
}

export function getGlobalCartState() {
  return globalCartState;
}
