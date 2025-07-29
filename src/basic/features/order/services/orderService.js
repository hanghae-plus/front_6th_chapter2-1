// 리액트처럼 간단한 state import
import { productState } from "../../product/store/ProductStore.js";
import { renderOrderSummaryDetails } from "../components/OrderSummaryDetails.js";

export const updateOrderSummary = (cartResults) => {
  const products = productState.products;

  // 간단한 주문 요약 업데이트
  renderOrderSummaryDetails(cartResults, products);
};
