import { LIGHTNING_DELAY, LIGHTNING_INTERVAL, SUGGEST_DELAY, SUGGEST_INTERVAL } from '../constant';
import { dispatch, state } from '../store.js';

let lightningSaleTimerId = null;
let suggestSaleTimerId = null;

const startLightningSale = () => {
  const luckyIdx = Math.floor(Math.random() * state.products.length);
  const luckyItem = state.products[luckyIdx];
  if (luckyItem) {
    dispatch({ type: 'START_LIGHTNING_SALE', payload: { productId: luckyItem.id } });
  }
};

const startSuggestSale = () => {
  if (!state.lastSelectedId) return;
  const luckyItem = state.products.find(
    (p) => p.id !== state.lastSelectedId && p.quantity > 0 && !p.suggestSale,
  );
  if (luckyItem) {
    dispatch({ type: 'START_SUGGEST_SALE', payload: { productId: luckyItem.id } });
  }
};

export function startSaleTimers() {
  setTimeout(() => {
    lightningSaleTimerId = setInterval(startLightningSale, LIGHTNING_INTERVAL);
  }, LIGHTNING_DELAY);

  setTimeout(() => {
    suggestSaleTimerId = setInterval(startSuggestSale, SUGGEST_INTERVAL);
  }, SUGGEST_DELAY);
}

export function stopSaleTimers() {
  clearInterval(lightningSaleTimerId);
  clearInterval(suggestSaleTimerId);
}
