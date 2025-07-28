// 상태 관리
import { appState, domElements } from "./state/appState.js";

// 초기화 서비스
import {
  initializeAppData,
  createDOMStructure,
} from "./initialization/initService.js";

// UI 서비스
import {
  updateSelectOptions,
  calculateAndRenderCart,
} from "./services/ui/uiService.js";

// 이벤트 서비스
import {
  handleAddToCart,
  handleCartItemAction,
  setupTimerEvents,
} from "./services/event/eventService.js";

// 이벤트 리스너 등록
function setupEventListeners() {
  // 장바구니 추가 버튼 이벤트
  domElements.addBtn.addEventListener("click", () =>
    handleAddToCart(appState, domElements)
  );

  // 장바구니 아이템 조작 이벤트
  domElements.cartDisp.addEventListener("click", (event) =>
    handleCartItemAction(event, appState, domElements)
  );
}

// 메인 애플리케이션 실행
function main() {
  // 1. 데이터 초기화
  initializeAppData(appState);

  // 2. DOM 구조 생성
  createDOMStructure(domElements);

  // 3. 이벤트 리스너 등록
  setupEventListeners();

  // 4. 초기 화면 렌더링
  updateSelectOptions(domElements.sel, appState.prodList);
  calculateAndRenderCart(appState, domElements);

  // 5. 타이머 기반 이벤트 설정
  setupTimerEvents(appState, domElements);
}

// 애플리케이션 시작
main();
