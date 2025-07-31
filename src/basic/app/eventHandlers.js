/**
 * 이벤트 핸들러 모듈
 * 사용자 상호작용에 대한 이벤트 처리 로직을 담당
 */
import { calculateBonusPoints, calculateCartTotal } from "../services/cartService.js";
import { updateStockInfo } from "../ui/cartUI.js";
import {
  updateBonusPoints,
  updateCartUI,
  updateDiscountInfo,
  updateOrderSummary,
  updateTuesdaySpecialDisplay,
} from "../ui/eventUI.js";
import { $, clearSelectorCache } from "../utils/$.js";
import { calculateCartTotals, extractCartItemInfo } from "../utils/businessLogic.js";
import {
  createAndAddNewCartItem,
  findExistingCartItem,
  updateExistingItemQuantity,
} from "../utils/cartHelpers.js";
import {
  validateDOMElement,
  validateProductAvailability,
  validateProductSelection,
  validateQuantity,
} from "../utils/validation.js";

/**
 * 상품 검증 및 찾기 함수
 * @param {string} selectedProductId - 선택된 상품 ID
 * @param {Array} productList - 상품 목록
 * @returns {Object} 검증 결과 { product, isValid, error }
 */
const validateAndFindProduct = (selectedProductId, productList) => {
  // 상품 선택 검증
  const selectionValidation = validateProductSelection(selectedProductId);
  if (!selectionValidation.isValid) {
    return { product: null, isValid: false, error: selectionValidation.error };
  }

  // 상품 찾기
  const product = productList.find((p) => p.id === selectedProductId);
  if (!product) {
    return { product: null, isValid: false, error: "상품을 찾을 수 없습니다." };
  }

  // 상품 가용성 검증
  const availabilityValidation = validateProductAvailability(product);
  if (!availabilityValidation.isValid) {
    return { product, isValid: false, error: availabilityValidation.error };
  }

  return { product, isValid: true, error: null };
};

/**
 * 캐시 무효화 및 UI 업데이트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
const invalidateCachesAndUpdateUI = (productList, appState) => {
  // 캐시 무효화
  appState.cache = null;

  // 화요일 상태 업데이트
  appState.isTuesday = new Date().getDay() === 2;

  // 장바구니 재계산 및 UI 업데이트
  recalculateCartAndUpdateUI(productList, appState);
};

/**
 * 장바구니에 상품 추가 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleAddToCart(event, productList, appState) {
  const selectedProductId = $("#product-select").value;
  const cartDisplay = $("#cart-items");

  // 상품 검증 및 찾기
  const { product, isValid, error } = validateAndFindProduct(selectedProductId, productList);

  if (!isValid) {
    console.error("[VALIDATION] INSUFFICIENT_STOCK:", error);
    window.alert(error.message);
    return;
  }

  // 기존 아이템 확인
  const existingItem = findExistingCartItem(product.id);

  if (existingItem) {
    // 기존 아이템 수량 증가
    const success = updateExistingItemQuantity(existingItem, product);
    if (!success) {
      console.error("[VALIDATION] INSUFFICIENT_STOCK: 재고가 부족합니다.");
      return;
    }
  } else {
    // 새 아이템 추가
    createAndAddNewCartItem(product, cartDisplay);
  }

  // 앱 상태 업데이트
  appState.lastSelectedProduct = selectedProductId;

  // 캐시 무효화
  clearSelectorCache();

  // UI 업데이트
  invalidateCachesAndUpdateUI(productList, appState);
}

/**
 * 장바구니 아이템 액션 핸들러
 * @param {Event} event - 클릭 이벤트
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleCartItemAction(event, productList, appState) {
  const target = event.target;
  const productId = target.getAttribute("data-product-id");

  if (!productId) return;

  const product = productList.find((p) => p.id === productId);
  if (!product) return;

  if (target.classList.contains("quantity-change")) {
    handleQuantityChange(target, productList, appState);
  } else if (target.classList.contains("remove-item")) {
    handleItemRemove(target, productList, appState);
  }
}

/**
 * 수량 변경 핸들러
 * @param {HTMLElement} target - 클릭된 요소
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleQuantityChange(target, productList, appState) {
  const productId = target.getAttribute("data-product-id");
  const change = parseInt(target.getAttribute("data-change"));
  const cartItem = $(`#${productId}`);

  if (!cartItem || !productId) return;

  const product = productList.find((p) => p.id === productId);
  if (!product) return;

  const quantityElement = cartItem.querySelector(".quantity-number");
  if (!quantityElement) return;

  const currentQuantity = parseInt(quantityElement.textContent);
  const newQuantity = currentQuantity + change;

  // 수량이 0이 되면 아이템 제거 (검증 없이)
  if (newQuantity <= 0) {
    cartItem.remove();
    invalidateCachesAndUpdateUI(productList, appState);
    return;
  }

  // 수량 검증 (0보다 클 때만)
  const quantityValidation = validateQuantity(newQuantity, product.q + currentQuantity);
  if (!quantityValidation.isValid) {
    console.error("[VALIDATION] INSUFFICIENT_STOCK:", quantityValidation.error);
    window.alert(quantityValidation.error.message);
    return;
  }

  // 수량 업데이트
  quantityElement.textContent = newQuantity;

  // 재고 업데이트
  product.q -= change;

  // 수량이 0이 되면 아이템 제거
  if (newQuantity <= 0) {
    cartItem.remove();
  }

  // 캐시 무효화
  clearSelectorCache();

  // UI 업데이트
  invalidateCachesAndUpdateUI(productList, appState);
}

/**
 * 아이템 제거 핸들러
 * @param {HTMLElement} target - 클릭된 요소
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function handleItemRemove(target, productList, appState) {
  const productId = target.getAttribute("data-product-id");
  const cartItem = $(`#${productId}`);

  if (!cartItem || !productId) return;

  const product = productList.find((p) => p.id === productId);
  if (!product) return;

  // 제거된 수량만큼 재고 복구
  const quantityElement = cartItem.querySelector(".quantity-number");
  if (quantityElement) {
    const removedQuantity = parseInt(quantityElement.textContent);
    product.q += removedQuantity;
  }

  // 아이템 제거
  cartItem.remove();

  // 캐시 무효화
  clearSelectorCache();

  // UI 업데이트
  invalidateCachesAndUpdateUI(productList, appState);
}

/**
 * 장바구니 재계산 및 UI 업데이트 - 원본과 동일
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
function recalculateCartAndUpdateUI(productList, appState) {
  const cartItems = Array.from(document.querySelectorAll("[id^='p']"));

  // 장바구니 아이템 정보 추출 - 원본과 동일하게 모든 아이템 포함
  const cartItemInfo = cartItems.map((item) => {
    const quantityElement = item.querySelector(".quantity-number");
    return {
      id: item.id,
      quantity: quantityElement ? parseInt(quantityElement.textContent) : 0,
    };
  });

  // 계산 결과
  const calculationResult = calculateCartTotals(cartItemInfo, productList, appState);

  // 앱 상태 업데이트
  updateAppStateFromCalculation(appState, calculationResult);

  // UI 업데이트
  updateCartUI(calculationResult);
  updateOrderSummary(calculationResult, cartItemInfo, productList);
  updateDiscountInfo(calculationResult);

  // 재고 정보 업데이트 - 원본과 동일
  updateStockInfo(productList);

  // 포인트 업데이트 - 원본과 동일하게 항상 호출
  updateBonusPoints(calculationResult, cartItems, productList, appState);
  updateTuesdaySpecialDisplay(calculationResult.isTuesday);
}

/**
 * 계산 결과로 앱 상태 업데이트 - 원본과 동일
 * @param {Object} appState - 앱 상태
 * @param {Object} calculationResult - 계산 결과
 */
function updateAppStateFromCalculation(appState, calculationResult) {
  appState.totalAmount = calculationResult.totalAmt;
  appState.itemCount = calculationResult.itemCnt;
  appState.discountRate = calculationResult.discRate;
  appState.isTuesday = calculationResult.isTuesday;
}

/**
 * 도움말 모달 이벤트 설정
 * @param {HTMLElement} manualToggle - 도움말 토글 버튼
 * @param {HTMLElement} manualOverlay - 모달 오버레이
 * @param {HTMLElement} slidePanel - 슬라이드 패널
 */
function setupHelpModalEvents(manualToggle, manualOverlay, slidePanel) {
  const toggleModal = () => {
    manualOverlay.classList.toggle("hidden");
    slidePanel.classList.toggle("translate-x-full");
  };

  const closeModal = (e) => {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add("hidden");
      slidePanel.classList.add("translate-x-full");
    }
  };

  manualToggle.addEventListener("click", toggleModal);
  manualOverlay.addEventListener("click", closeModal);
}

/**
 * 이벤트 리스너 설정
 * @param {HTMLElement} addToCartButton - 장바구니 추가 버튼
 * @param {HTMLElement} cartDisplay - 장바구니 표시 영역
 * @param {Array} productList - 상품 목록
 * @param {Object} appState - 앱 상태
 */
export function setupEventListeners(addToCartButton, cartDisplay, productList, appState) {
  // 장바구니 추가 버튼 이벤트
  addToCartButton.addEventListener("click", (event) => {
    handleAddToCart(event, productList, appState);
  });

  // 장바구니 아이템 액션 이벤트 (이벤트 위임)
  cartDisplay.addEventListener("click", (event) => {
    handleCartItemAction(event, productList, appState);
  });

  // 도움말 모달 이벤트 설정 - 원본과 동일
  const manualToggle = document.querySelector(".fixed.top-4.right-4");
  const manualOverlay = document.querySelector(".fixed.inset-0");
  const slidePanel = document.querySelector(".fixed.right-0.top-0");

  if (manualToggle && manualOverlay && slidePanel) {
    setupHelpModalEvents(manualToggle, manualOverlay, slidePanel);
  }
}
