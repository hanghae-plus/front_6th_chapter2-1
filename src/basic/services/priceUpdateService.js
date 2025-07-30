import { updateCartItemPrices } from "../ui/update/updateCartItemPrices";
import { getCartContainer } from "../ui/dom/getDOMElements";
import { handleCalculateCartStuff } from "./cartCalculationService";

/**
 * 가격 업데이트 서비스
 * 카트 아이템들의 가격을 업데이트하고 카트 디스플레이를 새로고침하는 함수
 */
export const updateCartPricesAndRefresh = () => {
  // 카트 아이템 가격 업데이트
  updateCartItemPrices(getCartContainer());

  // 카트 디스플레이 새로고침
  handleCalculateCartStuff();
};
