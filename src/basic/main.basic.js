// UI 렌더링
import { renderMainLayout, renderManualOverlay } from "./ui/render";

// 이벤트 핸들러
import {
  initAddButtonEvent,
  initCartDOMEvent,
  initManualOverlayEvent,
} from "./events";

// 비즈니스 서비스
import {
  initializeApplication,
  initializeUIState,
  initializeTimers,
} from "./services";

function main() {
  // HTML 렌더링으로 DOM 생성
  const root = document.getElementById("app");
  root.innerHTML = renderMainLayout() + renderManualOverlay();

  // 초기화
  initializeApplication();
  initializeUIState();
  initializeTimers();

  // 이벤트 핸들러 설정
  initManualOverlayEvent();
  initAddButtonEvent();
  initCartDOMEvent();
}

main();
