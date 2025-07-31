import { SALE_EVENTS, TIMERS } from '../../shared/constants/business-rules.js';
import { updateProductSaleStatus, getProductInventory } from '../state/cart.js';
import { updateProductOptions, updatePricesInCart } from '../modules/index.js';

const DELAY_SUGGESTION = 60000;
const DELAY_LIGHTNING = Math.random() * TIMERS.lightningDelayMax;

/**
 * 번개세일 효과 Hook
 */
export function useLightningSaleEffect(cartState, ui) {
  setTimeout(() => {
    intervalLightning(cartState, ui);
  }, DELAY_LIGHTNING);
}

function intervalLightning(cartState, ui) {
  setInterval(() => {
    const productInventory = getProductInventory(cartState);
    const luckyItem = findLuckyItem(productInventory);

    if (luckyItem) {
      const newState = applyLightningSale(cartState, luckyItem);
      updateUIAfterSale(newState, ui);
    }
  }, TIMERS.saleInterval);
}

/**
 * 추천세일 효과 Hook
 */
export function useSuggestionSaleEffect(cartState, ui) {
  setTimeout(() => {
    intervalSuggestion(cartState, ui);
  }, DELAY_LIGHTNING);
}

function intervalSuggestion(cartState, ui) {
  setInterval(() => {
    const suggestedProduct = findSuggestedProduct(cartState);

    if (suggestedProduct) {
      const newState = applySuggestionSale(cartState, suggestedProduct);
      updateUIAfterSale(newState, ui);
    }
  }, DELAY_SUGGESTION);
}

// 순수 비즈니스 로직 함수들
function findLuckyItem(productInventory) {
  const luckyIdx = Math.floor(Math.random() * productInventory.length);
  const luckyItem = productInventory[luckyIdx];

  return luckyItem.q > 0 && !luckyItem.onSale ? luckyItem : null;
}

function findSuggestedProduct(cartState) {
  const productInventory = getProductInventory(cartState);
  const lastSelectedProduct = getLastSelectedProduct(cartState);

  return productInventory.find(
    product =>
      product.id !== lastSelectedProduct &&
      product.q > 0 &&
      !product.suggestSale
  );
}

function applyLightningSale(cartState, luckyItem) {
  return updateProductSaleStatus(cartState, luckyItem.id, {
    val: Math.round(
      luckyItem.originalVal * SALE_EVENTS.lightning.priceMultiplier
    ),
    onSale: true,
  });
}

function applySuggestionSale(cartState, suggestedProduct) {
  return updateProductSaleStatus(cartState, suggestedProduct.id, {
    val: Math.round(
      suggestedProduct.val * SALE_EVENTS.suggestion.priceMultiplier
    ),
    suggestSale: true,
  });
}

function updateUIAfterSale(newState, ui) {
  const productInventory = getProductInventory(newState);

  updateProductOptions({
    sel: ui.productSelector.selector,
    prodList: productInventory,
  });

  updatePricesInCart({
    cartDisp: ui.cartDisplay.container,
    totalCount: 0,
  });
}

// 임시로 필요한 함수들 (나중에 적절한 위치로 이동)
function getLastSelectedProduct(cartState) {
  // 임시 구현 - 실제로는 cart state에서 가져와야 함
  return null;
}
