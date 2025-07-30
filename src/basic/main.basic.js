import { renderMainLayout, renderManualOverlay } from "./ui/render";
import { initAddButtonEvent } from "./events/addBtnEventHandler";
import { initCartDOMEvent } from "./events/cartEventHandler";
import { initManualOverlayEvent } from "./events/manualOverlayEventHandler";

// 비즈니스 서비스들
import {
  initializeApplication,
  initializeUIState,
} from "./services/initializationService";
import { initializeTimers } from "./services/timerService";
import { handleCalculateCartStuff } from "./services/cartCalculationService";

function main() {
  const root = document.getElementById("app");

  // HTML 렌더링으로 DOM 생성
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
