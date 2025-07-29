// 리액트처럼 간단한 state import
import { BUSINESS_CONSTANTS } from "../../../shared/constants/business.js";
import { ELEMENT_IDS } from "../../../shared/constants/element-ids.js";
import {
  productState,
  setProductState,
} from "../../product/store/ProductStore.js";
import { calculateAndRenderPoints as calculatePointsFunction } from "./PointsCalculator.js";
import { PRODUCTS } from "../../product/constants/productConstants.js";

// PointsCalculator 클래스 제거하고 순수 함수 사용
export const initializePointService = () => {
  // 더 이상 인스턴스 생성 필요 없음
};

export const calculateAndRenderPoints = (cartResults) => {
  // DOM에서 카트 요소들 가져오기
  const cartDisplayElement = document.getElementById("cart-items");
  const cartElements = cartDisplayElement.children;

  const { totalAmount, totalItemCount } = cartResults;

  // 순수 함수로 포인트 계산 및 렌더링
  const pointsResults = calculatePointsFunction(
    totalAmount,
    totalItemCount,
    cartElements,
    productState.products,
    BUSINESS_CONSTANTS,
    PRODUCTS
  );

  return pointsResults;
};
