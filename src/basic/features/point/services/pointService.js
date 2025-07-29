import { BUSINESS_CONSTANTS } from "../../../shared/constants/business.js";
import { PRODUCTS } from "../../product/constants/productConstants.js";
import PointsCalculator from "./PointsCalculator.js";

// Service instance
let pointsCalculator;

export const initializePointService = () => {
  pointsCalculator = new PointsCalculator(BUSINESS_CONSTANTS, PRODUCTS);
};

export const calculateAndRenderPoints = (cartResults) => {
  const { totalAmount, totalItemCount } = cartResults;
  const cartDisplayElement = document.getElementById("cart-items");
  const cartElements = cartDisplayElement.children;

  // Calculate and render bonus points
  const pointsResults = pointsCalculator.calculateAndRender(
    totalAmount,
    totalItemCount,
    cartElements,
    window.productStore.getProducts()
  );

  // Update Store
  window.productStore.setPoint(pointsResults.points);

  return pointsResults;
};
