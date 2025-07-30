import { CartContainer } from './components/CartContainer';
import { Header } from './components/Header';
import { Manual } from './components/Manual';
import { OrderSummary } from './components/OrderSummary';
import { state, dispatch, subscribe, getCartSummary, getBonusPoints } from './store';
import { DOMElements, cacheDOMElements } from './utils/dom';
import { handleSelectChange, handleAddItemToCart, handleCartItemActions } from './utils/handlers';
import {
  renderCartContent,
  renderOrderSummary,
  renderProductSelector,
  renderTotalQuantity,
} from './utils/renderHelper';
import { startSaleTimers, stopSaleTimers } from './utils/saleTimers';

const renderInitialLayout = () => {
  const root = document.getElementById('app');

  root.innerHTML = `
    ${Header()}
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      ${CartContainer()}
      ${OrderSummary()}
    </div>
    ${Manual()}
  `;
};

const attachEventListeners = () => {
  const {
    productSelect,
    addToCart,
    cartItems,
    manualToggle,
    manualOverlay,
    manualColumn,
    manualCloseBtn,
  } = DOMElements;

  const toggleManual = () => {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  productSelect.addEventListener('change', handleSelectChange);

  addToCart.addEventListener('click', handleAddItemToCart);
  cartItems.addEventListener('click', handleCartItemActions);

  manualToggle.addEventListener('click', toggleManual);
  manualCloseBtn.addEventListener('click', toggleManual);
  manualOverlay.addEventListener('click', toggleManual);

  window.addEventListener('beforeunload', stopSaleTimers);
};

function render() {
  const summary = getCartSummary(state);
  const { bonusPoints, pointsDetail } = getBonusPoints(state, summary);

  renderTotalQuantity(DOMElements, summary);
  renderProductSelector(DOMElements);
  renderCartContent(DOMElements, summary);
  renderOrderSummary(DOMElements, summary, bonusPoints, pointsDetail);

  alertNotifications();
}

const alertNotifications = () => {
  if (state.notifications.length > 0) {
    state.notifications.forEach((noti) => {
      alert(noti.message);
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: { notificationId: noti.id } });
    });
  }
};

function init() {
  renderInitialLayout();
  cacheDOMElements();
  attachEventListeners();
  subscribe(render);
  render();
  startSaleTimers();
}

export default { init };
