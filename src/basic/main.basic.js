import { MESSAGES, DOM_IDS, CSS_SELECTORS } from "./shared/constants/index.js";

import { CartItem, updateCartItemPrices } from "./ui/CartDisplayComponent.js";

import { GridContainer, LeftColumn } from "./ui/GridContainerComponent.js";

import { Header } from "./ui/HeaderComponent.js";
import { updateItemCount } from "./ui/ItemCountComponent.js";
import { ManualModal } from "./ui/ManualModalComponent.js";

import {
  OrderSummary,
  updateSummaryDetails,
  updateCartTotal,
  updateLoyaltyPoints,
  updateDiscountInfo,
  updateTuesdaySpecial,
  updateBonusPointsDisplay,
} from "./ui/OrderSummaryComponent.js";

import {
  ProductSelector,
  updateProductOptions,
  updateStockInfo,
} from "./ui/ProductSelectorComponent.js";

// Business Logic Imports
import {
  findProductById,
  startLightningSaleTimer,
  startSuggestionTimer,
} from "./domains/products/index.js";

import { calculateTotalDiscount } from "./domains/cart/index.js";

import { calculateTotalPoints } from "./domains/points/index.js";

import { parseInteger, isTuesday as checkIsTuesday } from "./utils/index.js";
import { appState } from "./state/AppState.js";
import { createCartEventHandler } from "./handlers/cartHandlers.js";
import { updateAllDisplays } from "./ui/DisplayUpdater.js";

const onAddToCart = () => {
  const selectedItem = selectElement.value;
  const prodList = appState.getProdList();

  if (!selectedItem || !findProductById(prodList, selectedItem)) {
    return;
  }

  const itemToAdd = findProductById(prodList, selectedItem);

  if (itemToAdd && itemToAdd.quantity > 0) {
    const existingItem = document.getElementById(itemToAdd.id);

    if (existingItem) {
      const qtyElem = existingItem.querySelector(CSS_SELECTORS.QUANTITY_NUMBER);
      const currentQty = parseInteger(qtyElem.textContent);
      const newQty = currentQty + 1;

      if (newQty <= itemToAdd.quantity + currentQty) {
        qtyElem.textContent = newQty;
        itemToAdd.quantity--;
        appState.setProdList(prodList);
      } else {
        alert(MESSAGES.OUT_OF_STOCK);
      }
    } else {
      const newItem = CartItem({ product: itemToAdd });
      appState.getCartDisplay().appendChild(newItem);
      itemToAdd.quantity--;
      appState.setProdList(prodList);
    }

    calculateAndUpdateCart();
    appState.setLastSel(selectedItem);
  }
};

const { selectorContainer, selectElement, stockInfo } = ProductSelector({
  onAddToCart,
});

function main() {
  const root = document.getElementById(DOM_IDS.APP);
  const header = Header({ itemCount: appState.getItemCount() });
  const gridContainer = GridContainer();
  const leftColumn = LeftColumn();

  leftColumn.appendChild(selectorContainer);
  const cartDisplay = document.createElement("div");
  leftColumn.appendChild(cartDisplay);
  cartDisplay.id = DOM_IDS.CART_ITEMS;
  appState.setCartDisplay(cartDisplay);

  const orderSummary = OrderSummary();
  appState.setSum(orderSummary.querySelector("#cart-total"));

  const { manualToggle, manualOverlay } = ManualModal();

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(orderSummary);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  updateProductOptions({ selectElement, products: appState.getProdList() });
  calculateAndUpdateCart();

  startLightningSaleTimer(appState.getProdList(), () => {
    appState.setProdList(appState.getProdList()); // Trigger state update
    updateProductOptions({ selectElement, products: appState.getProdList() });
    updateCartItemPrices({
      cartDisplay: appState.getCartDisplay(),
      products: appState.getProdList(),
    });
    calculateAndUpdateCart();
  });

  startSuggestionTimer(
    appState.getProdList(),
    () => appState.getLastSel(),
    () => {
      appState.setProdList(appState.getProdList()); // Trigger state update
      updateProductOptions({ selectElement, products: appState.getProdList() });
      updateCartItemPrices({
        cartDisplay: appState.getCartDisplay(),
        products: appState.getProdList(),
      });
      calculateAndUpdateCart();
    }
  );
}

function calculateAndUpdateCart() {
  const cartItems = Array.from(appState.getCartDisplay().children);
  const summaryDetails = document.getElementById(DOM_IDS.SUMMARY_DETAILS);
  const itemCountElement = document.getElementById(DOM_IDS.ITEM_COUNT);

  if (cartItems.length === 0) {
    appState.setTotalAmt(0);
    appState.setItemCount(0);
    updateAllDisplays({
      sum: appState.getSum(),
      totalAmt: appState.getTotalAmt(),
      itemCount: appState.getItemCount(),
      products: appState.getProdList(),
      stockInfo,
      isTuesday: checkIsTuesday(),
    });
    return;
  }

  let subtotal = 0;
  let totalItemCount = 0;

  for (const cartItem of cartItems) {
    const product = findProductById(appState.getProdList(), cartItem.id);
    if (product) {
      const quantity = parseInteger(
        cartItem.querySelector(CSS_SELECTORS.QUANTITY_NUMBER).textContent
      );
      subtotal += product.price * quantity;
      totalItemCount += quantity;
    }
  }

  const discountResult = calculateTotalDiscount(
    subtotal,
    cartItems,
    appState.getProdList()
  );

  appState.setTotalAmt(discountResult.finalTotal);
  appState.setItemCount(totalItemCount);

  const pointsResult = calculateTotalPoints(
    appState.getTotalAmt(),
    cartItems,
    appState.getProdList(),
    totalItemCount
  );
  appState.setBonusPts(pointsResult.totalPoints);

  updateSummaryDetails({
    summaryDetails,
    cartItems,
    products: appState.getProdList(),
    subTotalPrice: subtotal,
    itemCount: totalItemCount,
    itemDiscounts: discountResult.itemDiscounts,
    isTuesday: discountResult.isTuesday,
    totalAmt: appState.getTotalAmt(),
  });

  const totalPriceElement = appState.getSum().querySelector(".text-2xl");
  updateCartTotal({ totalPriceElement, totalAmt: appState.getTotalAmt() });

  updateLoyaltyPoints({ totalAmt: appState.getTotalAmt() });

  updateDiscountInfo({
    discRate: discountResult.discountRate,
    originalTotal: discountResult.originalTotal,
    totalAmt: appState.getTotalAmt(),
  });

  updateTuesdaySpecial({
    isTuesday: discountResult.isTuesday,
    totalAmt: appState.getTotalAmt(),
  });

  updateItemCount({ itemCountElement, itemCount: appState.getItemCount() });

  updateStockInfo({ stockInfo, products: appState.getProdList() });

  updateBonusPointsDisplay({
    bonusPts: appState.getBonusPts(),
    pointsResult,
  });
}

main();

const cartEventHandler = createCartEventHandler(
  appState,
  calculateAndUpdateCart,
  updateProductOptions,
  selectElement
);

appState.getCartDisplay().addEventListener("click", cartEventHandler);
