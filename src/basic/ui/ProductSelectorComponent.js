import {
  DOM_IDS,
  MAGIC_NUMBERS,
  QUANTITY_THRESHOLDS,
} from "../shared/constants";

export function ProductSelector({ onAddToCart }) {
  const selectorContainer = document.createElement("div");
  selectorContainer.className = "mb-6 pb-6 border-b border-gray-200";

  const selectElement = document.createElement("select");
  selectElement.id = DOM_IDS.PRODUCT_SELECT;
  selectElement.className =
    "w-full p-3 border border-gray-300 rounded-lg text-base mb-3";

  const addBtn = document.createElement("button");
  addBtn.id = DOM_IDS.ADD_TO_CART;
  addBtn.innerHTML = "Add to Cart";
  addBtn.className =
    "w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all";

  const stockInfo = document.createElement("div");
  stockInfo.id = DOM_IDS.STOCK_STATUS;
  stockInfo.className = "text-xs text-red-500 mt-3 whitespace-pre-line";

  if (onAddToCart) {
    addBtn.addEventListener("click", onAddToCart);
  }

  selectorContainer.appendChild(selectElement);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockInfo);

  return { selectorContainer, selectElement, stockInfo };
}

export function updateProductOptions({ selectElement, products }) {
  let totalStock = 0;
  let discountText = "";

  selectElement.innerHTML = "";

  for (let idx = 0; idx < products.length; idx++) {
    const product = products[idx];
    totalStock = totalStock + product.quantity;
  }

  for (let i = 0; i < products.length; i++) {
    const item = products[i];
    const optionElement = document.createElement("option");
    optionElement.value = item.id;

    discountText = "";
    if (item.isOnLightningSale) discountText += " ⚡SALE";
    if (item.isSuggestedSale) discountText += " 💝추천";

    if (item.quantity === 0) {
      optionElement.textContent =
        item.name + " - " + item.price + "원 (품절)" + discountText;
      optionElement.disabled = true;
      optionElement.className = "text-gray-400";
    } else {
      if (item.isOnLightningSale && item.isSuggestedSale) {
        optionElement.textContent =
          "⚡💝" +
          item.name +
          " - " +
          item.originalPrice +
          "원 → " +
          item.price +
          "원 (25% SUPER SALE!)";
        optionElement.className = "text-purple-600 font-bold";
      } else if (item.isOnLightningSale) {
        optionElement.textContent =
          "⚡" +
          item.name +
          " - " +
          item.originalPrice +
          "원 → " +
          item.price +
          "원 (20% SALE!)";
        optionElement.className = "text-red-500 font-bold";
      } else if (item.isSuggestedSale) {
        optionElement.textContent =
          "💝" +
          item.name +
          " - " +
          item.originalPrice +
          "원 → " +
          item.price +
          "원 (5% 추천할인!)";
        optionElement.className = "text-blue-500 font-bold";
      } else {
        optionElement.textContent =
          item.name + " - " + item.price + "원" + discountText;
      }
    }
    selectElement.appendChild(optionElement);
  }

  if (totalStock < MAGIC_NUMBERS.STOCK_WARNING_THRESHOLD) {
    selectElement.style.borderColor = "orange";
  } else {
    selectElement.style.borderColor = "";
  }
}

export function updateStockInfo({ stockInfo, products }) {
  let stockMsg = "";
  for (let stockIdx = 0; stockIdx < products.length; stockIdx++) {
    const item = products[stockIdx];
    if (item.quantity < QUANTITY_THRESHOLDS.LOW_STOCK) {
      if (item.quantity > 0) {
        stockMsg += item.name + ": 재고 부족 (" + item.quantity + "개 남음)\n";
      } else {
        stockMsg += item.name + ": 품절\n";
      }
    }
  }
  stockInfo.textContent = stockMsg;
}
