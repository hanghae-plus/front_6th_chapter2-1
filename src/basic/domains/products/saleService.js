import { TIMING, MESSAGES } from "../../shared/constants/index.js";
import {
  applyLightningSale,
  applySuggestedSale,
  getRandomProduct,
  findAvailableProductForSuggestion,
} from "./productService.js";

export function startLightningSaleTimer(products, onUpdate) {
  const lightningDelay = Math.random() * 10000;

  setTimeout(() => {
    setInterval(() => {
      const luckyProduct = getRandomProduct(products);
      if (luckyProduct && applyLightningSale(luckyProduct)) {
        alert(
          MESSAGES.LIGHTNING_SALE.replace("{productName}", luckyProduct.name)
        );
        onUpdate();
      }
    }, TIMING.LIGHTNING_SALE_INTERVAL);
  }, lightningDelay);
}

export function startSuggestionTimer(products, getLastSelected, onUpdate) {
  const suggestedDelay = Math.random() * TIMING.SUGGESTION_DELAY_MAX;
  setTimeout(() => {
    setInterval(() => {
      const lastSelected = getLastSelected();
      if (lastSelected) {
        const suggestedProduct = findAvailableProductForSuggestion(
          products,
          lastSelected
        );
        if (suggestedProduct && applySuggestedSale(suggestedProduct)) {
          alert(
            MESSAGES.SUGGESTED_SALE.replace(
              "{productName}",
              suggestedProduct.name
            )
          );
          onUpdate();
        }
      }
    }, TIMING.SUGGESTION_INTERVAL);
  }, suggestedDelay);
}
