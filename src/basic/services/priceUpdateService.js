import { updateCartItemPrices } from "../ui/update/updateCartItemPrices";
import { getCartContainer } from "../ui/dom/getDOMElements";
import { handleCalculateCartStuff } from "./cartCalculationService";

/**
 * 가격 업데이트 서비스
 */
export const updateCartPricesAndRefresh = () => {
  // 카트 아이템 가격 업데이트
  updateCartItemPrices(getCartContainer());

  // 카트 디스플레이 새로고침
  handleCalculateCartStuff();
};
