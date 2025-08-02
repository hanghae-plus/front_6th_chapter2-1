import { CSS_CLASS_NAMES, CSS_SELECTORS, MESSAGES } from "../shared/constants/index.js";
import { findProductById } from "../domains/products/index.js";
import { parseInteger } from "../utils/index.js";

export function handleQuantityChange(product, qtyElem, qtyChange, prodList) {
  const currentQty = parseInteger(qtyElem.textContent);
  const newQty = currentQty + qtyChange;

  if (newQty > 0 && newQty <= product.quantity + currentQty) {
    product.quantity -= qtyChange;
    return {
      success: true,
      newQuantity: newQty,
      updatedProdList: prodList,
      shouldRemove: false
    };
  } else if (newQty <= 0) {
    product.quantity += currentQty;
    return {
      success: true,
      newQuantity: 0,
      updatedProdList: prodList,
      shouldRemove: true
    };
  } else {
    return {
      success: false,
      error: MESSAGES.OUT_OF_STOCK
    };
  }
}

export function handleItemRemoval(product, qtyElem, prodList) {
  const remQty = parseInteger(qtyElem.textContent);
  product.quantity += remQty;
  
  return {
    success: true,
    updatedProdList: prodList,
    shouldRemove: true
  };
}

export function createCartEventHandler(appState, calculateAndUpdateCart, updateProductOptions, selectElement) {
  return (event) => {
    const target = event.target;

    if (
      target.classList.contains(CSS_CLASS_NAMES.QUANTITY_CHANGE) ||
      target.classList.contains(CSS_CLASS_NAMES.REMOVE_ITEM)
    ) {
      const prodId = target.dataset.productId;
      const itemElem = document.getElementById(prodId);
      const prodList = appState.getProdList();
      const product = findProductById(prodList, prodId);

      if (!product) return;

      let result;

      if (target.classList.contains(CSS_CLASS_NAMES.QUANTITY_CHANGE)) {
        const qtyChange = parseInteger(target.dataset.change);
        const qtyElem = itemElem.querySelector(".quantity-number");
        result = handleQuantityChange(product, qtyElem, qtyChange, prodList);

        if (result.success) {
          if (result.shouldRemove) {
            itemElem.remove();
          } else {
            qtyElem.textContent = result.newQuantity;
          }
          appState.setProdList(result.updatedProdList);
        } else {
          alert(result.error);
        }
      } else if (target.classList.contains(CSS_CLASS_NAMES.REMOVE_ITEM)) {
        const qtyElem = itemElem.querySelector(CSS_SELECTORS.QUANTITY_NUMBER);
        result = handleItemRemoval(product, qtyElem, prodList);

        if (result.success) {
          itemElem.remove();
          appState.setProdList(result.updatedProdList);
        }
      }

      calculateAndUpdateCart();
      updateProductOptions({ selectElement, products: appState.getProdList() });
    }
  };
}