// 리액트처럼 간단한 state import
import {
  productState,
  setProductState,
} from "../../product/store/ProductStore.js";
import CartCalculator from "./CartCalculator.js";
import { renderCartTotal } from "../components/CartTotal.js";
import { BUSINESS_CONSTANTS } from "../../../shared/constants/business.js";
import { PRODUCTS } from "../../product/constants/productConstants.js";

let cartCalculator;

export const initializeCartService = () => {
  cartCalculator = new CartCalculator(BUSINESS_CONSTANTS, PRODUCTS);
};

// 간단한 카트 계산
export const calculateCartTotals = () => {
  // DOM에서 카트 요소들 가져오기
  const cartDisplayElement = document.getElementById("cart-items");
  const cartElements = cartDisplayElement.children;

  const cartResults = cartCalculator.calculateCart(
    cartElements,
    productState.products
  );

  // 리액트처럼 간단하게 state 업데이트
  setProductState({
    amount: cartResults.totalAmount,
    itemCount: cartResults.totalItemCount,
  });

  return cartResults;
};

export const updateCartUI = (cartResults) => {
  const { subtotal, totalAmount, totalItemCount, isTuesday, discountRate } =
    cartResults;

  // 할인 정보 업데이트
  const discountInfoElement = document.getElementById("discount-info");
  if (discountInfoElement) {
    if (discountRate > 0 && totalAmount > 0) {
      const savedAmount = subtotal - totalAmount;
      discountInfoElement.innerHTML = `
        <div class="bg-green-500/20 rounded-lg p-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
            <span class="text-sm font-medium text-green-400">${(
              discountRate * 100
            ).toFixed(1)}%</span>
          </div>
          <div class="text-2xs text-gray-300">₩${Math.round(
            savedAmount
          ).toLocaleString()} 할인되었습니다</div>
        </div>
      `;
    } else {
      discountInfoElement.innerHTML = "";
    }
  }

  // 화요일 특별 할인 배너 업데이트
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (tuesdaySpecial) {
    if (isTuesday && totalAmount > 0) {
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  }

  // 헤더 아이템 수 업데이트
  const itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${totalItemCount} items in cart`;
  }
};

export const renderCartTotalComponent = (pointsResults) => {
  const totalAmount = productState.amount;

  // DOM에서 카트 요소들 가져오기 (할인율 계산용)
  const cartDisplayElement = document.getElementById("cart-items");
  const cartElements = cartDisplayElement.children;

  // 최신 할인율 계산
  const cartResults = cartCalculator.calculateCart(
    cartElements,
    productState.products
  );
  const discountRate = cartResults.discountRate;

  renderCartTotal({
    amount: totalAmount,
    discountRate,
    point: pointsResults.points || 0,
  });

  const cartItems = document.querySelectorAll("#cart-items > *");
  const products = productState.products;

  const cartData = Array.from(cartItems).map((item) => {
    const productId = item.id;
    const product = products.find((p) => p.id === productId);
    const quantityElement = item.querySelector(".quantity-number");
    const quantity = parseInt(quantityElement?.textContent || "0");

    return { product, quantity };
  });

  return { cartData, totalAmount, discountRate };
};
