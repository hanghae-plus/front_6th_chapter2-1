import productStore from "../store/product";
import { updateSelectOptions } from "../utils/select/selectUtils";
import { getProductSelect } from "../ui/dom/getDOMElements";
import {
  startLightningSaleTimer,
  startRecommendationTimer,
} from "../utils/timer/discountTimer";
import { updateCartPricesAndRefresh } from "./priceUpdateService";

/**
 * 타이머 서비스
 * 애플리케이션의 모든 타이머를 관리합니다.
 */
export const initializeTimers = () => {
  const productList = productStore.getState().products;

  // 드롭다운 업데이트 함수
  const updateSelectOptionsHandler = () => {
    updateSelectOptions(getProductSelect(), productList);
  };

  // 번개할인 타이머 시작
  startLightningSaleTimer({
    productList,
    onUpdateSelectOptions: updateSelectOptionsHandler,
    updateCartPricesAndRefresh,
  });

  // 추천할인 타이머 시작
  startRecommendationTimer({
    productList,
    onUpdateSelectOptions: updateSelectOptionsHandler,
    updateCartPricesAndRefresh,
  });
};
