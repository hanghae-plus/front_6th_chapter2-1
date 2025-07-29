// 리액트처럼 간단한 state import
import {
  productState,
  setProductState,
} from "../../product/store/ProductStore.js";
import PointsCalculator from "./PointsCalculator.js";
import { BUSINESS_CONSTANTS } from "../../../shared/constants/business.js";
import { PRODUCTS } from "../../product/constants/productConstants.js";

let pointsCalculator;

export const initializePointService = () => {
  pointsCalculator = new PointsCalculator(BUSINESS_CONSTANTS, PRODUCTS);
};

export const calculateAndRenderPoints = (cartResults) => {
  // DOM에서 카트 요소들 가져오기
  const cartDisplayElement = document.getElementById("cart-items");
  const cartElements = cartDisplayElement.children;

  const pointsResults = pointsCalculator.calculateAndRender(
    cartResults.totalAmount,
    cartResults.totalItemCount,
    cartElements,
    productState.products
  );

  // 리액트처럼 간단하게 state 업데이트
  setProductState({
    point: pointsResults.points,
  });

  return pointsResults;
};
