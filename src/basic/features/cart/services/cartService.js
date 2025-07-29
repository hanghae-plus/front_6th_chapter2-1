import { BUSINESS_CONSTANTS } from "../../../shared/constants/business.js";
import { PRODUCTS } from "../../product/constants/productConstants.js";
import CartCalculator from "./CartCalculator.js";
import PriceUpdater from "./PriceUpdater.js";
import { renderCartTotal } from "../components/CartTotal.js";

// Service instances
let cartCalculator;
let priceUpdater;

export const initializeCartService = () => {
  cartCalculator = new CartCalculator(BUSINESS_CONSTANTS, PRODUCTS);
  priceUpdater = new PriceUpdater(BUSINESS_CONSTANTS);
};

export const calculateCartTotals = () => {
  const cartDisplayElement = document.getElementById("cart-items");
  const cartElements = cartDisplayElement.children;

  // Calculate cart totals
  const cartResults = cartCalculator.calculateCart(
    cartElements,
    window.productStore.getProducts()
  );

  // Update Store
  window.productStore.setAmount(cartResults.totalAmount);
  window.productStore.setItemCount(cartResults.totalItemCount);

  return cartResults;
};

export const updateCartUI = (cartResults) => {
  const { subtotal, totalAmount, totalItemCount, isTuesday, discountRate } =
    cartResults;

  // Update Tuesday special banner
  const tuesdaySpecial = document.getElementById("tuesday-special");
  if (tuesdaySpecial) {
    if (isTuesday && totalAmount > 0) {
      tuesdaySpecial.classList.remove("hidden");
    } else {
      tuesdaySpecial.classList.add("hidden");
    }
  }

  // Update item count in header
  const itemCountElement = document.getElementById("item-count");
  if (itemCountElement) {
    const previousCount = parseInt(
      itemCountElement.textContent.match(/\d+/) || 0
    );
    itemCountElement.textContent = `🛍️ ${totalItemCount} items in cart`;
    if (previousCount !== totalItemCount) {
      itemCountElement.setAttribute("data-changed", "true");
    }
  }

  // Update discount info
  updateDiscountInfo(discountRate, subtotal, totalAmount);
};

export const updatePricesInCart = () => {
  const cartDisplayElement = document.getElementById("cart-items");
  priceUpdater.updatePricesInCart(
    cartDisplayElement,
    window.productStore.getProducts(),
    () => window.dispatchEvent(new CustomEvent("cart-updated"))
  );
};

export const renderCartTotalComponent = (pointsData) => {
  const cartResults = calculateCartTotals();

  renderCartTotal({
    amount: cartResults.totalAmount,
    discountRate: cartResults.discountRate,
    point: pointsData?.points || 0,
  });

  return cartResults;
};

// Helper function to update discount information display
function updateDiscountInfo(discountRate, originalTotal, totalAmount) {
  const discountInfoDiv = document.getElementById("discount-info");
  if (!discountInfoDiv) return;

  discountInfoDiv.innerHTML = "";

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    discountInfoDiv.innerHTML = `
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
  }
}
