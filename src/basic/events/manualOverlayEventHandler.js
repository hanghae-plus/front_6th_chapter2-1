import {
  getManualToggle,
  getManualOverlay,
  getManualColumn,
  getManualClose,
} from "../ui/dom/getDOMElements";

/**
 * 매뉴얼 오버레이 이벤트 초기화
 */
export const initManualOverlayEvent = () => {
  const manualToggle = getManualToggle();
  const manualOverlay = getManualOverlay();
  const manualColumn = getManualColumn();
  const manualClose = getManualClose();

  // 매뉴얼 토글 체크
  if (manualToggle) {
    manualToggle.onclick = () => {
      manualOverlay.classList.toggle("hidden");
      manualColumn.classList.toggle("translate-x-full");
    };
  }

  // 매뉴얼 오버레이 체크
  if (manualOverlay) {
    manualOverlay.onclick = (e) => {
      if (e.target === manualOverlay) {
        manualOverlay.classList.add("hidden");
        manualColumn.classList.add("translate-x-full");
      }
    };
  }

  // 매뉴얼 닫기 체크
  if (manualClose) {
    manualClose.onclick = () => {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    };
  }
};
