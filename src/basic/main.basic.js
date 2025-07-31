/**
 * 쇼핑 카트 애플리케이션 - 모듈화된 버전
 *
 * 이 파일은 nBilly 규칙에 따라 리팩토링된 쇼핑 카트 애플리케이션입니다.
 * 모든 기능이 독립적인 모듈로 분리되어 유지보수성과 가독성이 향상되었습니다.
 *
 * @author nBilly Development Team
 * @version 1.0.0
 */
import { initializeShoppingCart as initApp } from "./app/appInit.js";
import { createUserInterface } from "./ui/productUI.js";

// 전역 상태 객체 (기존 전역 변수들을 객체로 관리)
const appState = {
  productList: [],
  cartDisplay: null,
  productSelector: null,
  addToCartButton: null,
  stockInfo: null,
  sumElement: null,
  totalAmount: 0,
  itemCount: 0,
  lastSelectedProduct: null,
  isTuesday: new Date().getDay() === 2, // 화요일 여부 (실제 날짜 기준)
};

/**
 * 쇼핑 카트 애플리케이션 초기화
 */
function initializeShoppingCart() {
  // 사용자 인터페이스 생성 및 DOM 요소 참조 가져오기
  const uiElements = createUserInterface();
  Object.assign(appState, uiElements);

  // 앱 초기화 실행
  initApp(appState);
}

// 애플리케이션 초기화
initializeShoppingCart();
