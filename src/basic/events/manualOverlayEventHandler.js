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

  if (manualToggle) {
    manualToggle.onclick = () => {
      manualOverlay.classList.toggle("hidden");
      manualColumn.classList.toggle("translate-x-full");
    };
  }

  if (manualOverlay) {
    manualOverlay.onclick = (e) => {
      if (e.target === manualOverlay) {
        manualOverlay.classList.add("hidden");
        manualColumn.classList.add("translate-x-full");
      }
    };
  }

  if (manualClose) {
    manualClose.onclick = () => {
      manualOverlay.classList.add("hidden");
      manualColumn.classList.add("translate-x-full");
    };
  }
};
