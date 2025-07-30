import productStore from "../store/product";
import { updateSelectOptions } from "../utils/select/selectUtils";
import { getProductSelect } from "../ui/dom/getDOMElements";
import { updateCartUIAfterCalculation } from "../ui/update/updateCartUIAfterCalculation";
import { getCartContainer } from "../ui/dom/getDOMElements";
import { calculateAllBusinessLogic } from "./cartCalculationService";

/**
 * 애플리케이션 초기화 서비스
 */
export const initializeApplication = () => {
  // 초기화 즉시 실행
  const productList = productStore.getState().products;
  updateSelectOptions(getProductSelect(), productList);
};

/**
 * 초기 UI 상태 설정
 * 애플리케이션 시작 시 UI를 초기 상태로 설정합니다.
 */
export const initializeUIState = () => {
  // 계산 수행
  const businessData = calculateAllBusinessLogic();

  // UI 업데이트 수행
  updateCartUIAfterCalculation(getCartContainer(), businessData);
};
