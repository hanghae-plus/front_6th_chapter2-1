/**
 * 앱 초기화 관련 함수들
 * 애플리케이션 시작 및 초기 설정을 관리
 */
import { initializeProductList } from "../services/productService.js";
import { updateStockInfo } from "../ui/cartUI.js";
import { updateSelectOptions } from "../ui/productUI.js";
import { setupEventListeners } from "./eventHandlers.js";
import { startPromotions } from "./promotions.js";

/**
 * 쇼핑 카트 애플리케이션 초기화
 * @param {Object} appState - 앱 상태 객체
 */
export function initializeShoppingCart(appState) {
  // 상품 목록 초기화
  appState.productList = initializeProductList();

  // 상품 선택 옵션 초기화
  updateSelectOptions(appState.productSelector, appState.productList);

  // 재고 정보 초기화
  updateStockInfo(appState.productList);

  // 이벤트 리스너 설정
  setupEventListeners(
    appState.addToCartButton,
    appState.cartDisplay,
    appState.productList,
    appState,
  );

  // 프로모션 시작
  startPromotions(appState.productList, appState);

  console.log("🛒 쇼핑 카트 애플리케이션이 시작되었습니다.");
}

/**
 * 앱 시작
 * @param {Object} appState - 앱 상태 객체
 */
export function startApp(appState) {
  // DOM이 로드된 후 초기화
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      initializeShoppingCart(appState);
    });
  } else {
    initializeShoppingCart(appState);
  }
}
