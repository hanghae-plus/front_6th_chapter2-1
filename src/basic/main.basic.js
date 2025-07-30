import { renderMainLayout } from "./ui/render/renderMainLayout";
import { renderManualOverlay } from "./ui/render/renderManualOverlay";
import { initAddButtonEvent } from "./events/addBtnEventHandler";
import { initCartDOMEvent } from "./events/cartEventHandler";

import productStore from "./store/product";

import {
  startLightningSaleTimer,
  startRecommendationTimer,
} from "./utils/discountTimer";
import { updateSelectOptions } from "./utils/select/selectUtils";

import { updateCartUIAfterCalculation } from "./ui/update/updateCartUIAfterCalculation";
import { updateCartItemPrices } from "./ui/update/updateCartItemPrices";

// 비즈니스 서비스들
import { calculateAllBusinessLogic } from "./services/cartCalculationService";

// DOM 접근 함수들
import {
  getProductSelect,
  getAddToCartButton,
  getCartContainer,
  getStockInfo,
  getManualToggle,
  getManualOverlay,
  getManualColumn,
  getManualClose,
} from "./ui/dom/getDOMElements";

function main() {
  const root = document.getElementById("app");

  // HTML 렌더링으로 DOM 생성
  root.innerHTML = renderMainLayout() + renderManualOverlay();

  // 매뉴얼 오버레이 이벤트 설정
  setupManualOverlayEvents();

  // 초기화
  onUpdateSelectOptions();
  handleCalculateCartStuff();

  const prodList = productStore.getState().products;

  // 번개할인 타이머 시작
  startLightningSaleTimer({
    prodList,
    onUpdateSelectOptions,
    updateCartPricesAndRefresh,
  });

  // 추천할인 타이머 시작
  startRecommendationTimer({
    prodList,
    onUpdateSelectOptions,
    updateCartPricesAndRefresh,
  });
}

/**
 * 드롭다운 메뉴를 실시간으로 업데이트 하는 함수
 */
const onUpdateSelectOptions = () => {
  const prodList = productStore.getState().products;
  updateSelectOptions(getProductSelect(), prodList);
};

/**
 * 장바구니 계산 및 렌더링을 담당하는 함수
 */
const handleCalculateCartStuff = () => {
  // 계산 수행
  const businessData = calculateAllBusinessLogic();

  // UI 업데이트 수행
  updateCartUIAfterCalculation(getCartContainer(), businessData);
};

/**
 * 카트 아이템들의 가격을 업데이트하고 카트 디스플레이를 새로고침하는 함수
 */
const updateCartPricesAndRefresh = () => {
  // 카트 아이템 가격 업데이트
  updateCartItemPrices(getCartContainer());

  // 카트 디스플레이 새로고침
  handleCalculateCartStuff();
};

/**
 * 매뉴얼 오버레이 이벤트 설정
 */
const setupManualOverlayEvents = () => {
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

main();

initAddButtonEvent(
  getAddToCartButton(),
  getProductSelect(),
  getCartContainer(),
  handleCalculateCartStuff
);
initCartDOMEvent(getCartContainer(), handleCalculateCartStuff);
