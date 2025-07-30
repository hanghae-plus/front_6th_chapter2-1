import cartStore from "../store/cart";
import { calculateCartTotals } from "../utils/cart/calculateCartTotals";
import { calculateBonusPoints } from "./bonusPointsService";
import { getLowStockItems } from "./stockService";
import { updateCartUIAfterCalculation } from "../ui/update/updateCartUIAfterCalculation";
import { getCartContainer } from "../ui/dom/getDOMElements";

/**
 * 모든 비즈니스 로직을 계산하는 함수
 */
export const calculateAllBusinessLogic = () => {
  // 장바구니 전체 계산 및 Store 업데이트
  const cartData = calculateAndUpdateCart();

  // 재고 부족 아이템 체크
  const lowStockItems = getLowStockItems();

  // 장바구니 상태 가져오기
  const cartState = getCartState();
  const bonusPointsData = calculateBonusPoints(cartState);

  return {
    cartData,
    lowStockItems,
    cartState,
    bonusPointsData,
  };
};

/**
 * 장바구니 전체 계산 및 Store 업데이트
 */
export const calculateAndUpdateCart = () => {
  // 장바구니 아이템 가져오기
  const cartItems = cartStore.getState().items;

  // 장바구니 전체 계산
  const totals = calculateCartTotals(cartItems);

  // 장바구니 상태 업데이트
  cartStore.updateTotals(totals);
  return { items: cartItems, totals };
};

/**
 * 장바구니 상태 가져오기
 */
export const getCartState = () => {
  return cartStore.getState();
};

/**
 * 장바구니 아이템 추가
 */
export const addCartItem = (product) => {
  cartStore.addCartItem(product);
};

/**
 * 장바구니 아이템 수량 업데이트
 * @param {string} productId - 상품 ID
 * @param {number} quantity - 새로운 수량
 */
export const updateItemQuantity = (productId, quantity) => {
  cartStore.updateItemQuantity(productId, quantity);
};

/**
 * 장바구니 아이템 제거
 * @param {string} productId - 제거할 상품 ID
 */
export const removeCartItem = (productId) => {
  cartStore.removeCartItem(productId);
};

/**
 * 장바구니 계산 및 렌더링을 담당하는 함수
 */
export const handleCalculateCartStuff = () => {
  // 계산 수행
  const businessData = calculateAllBusinessLogic();

  // UI 업데이트 수행
  updateCartUIAfterCalculation(getCartContainer(), businessData);
};
