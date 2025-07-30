import { CartContainer } from './components/CartContainer';
import { CartProductItem } from './components/CartProductItem';
import { DiscountInfo } from './components/DiscountInfo';
import { Header } from './components/Header';
import { LoyaltyPoints } from './components/LoyaltyPoints';
import { Manual } from './components/Manual';
import { OrderItemSummary } from './components/OrderItemSummary';
import { OrderSummary } from './components/OrderSummary';
import { ProductSelectItem } from './components/ProductSelectItem';
import { StockStatus } from './components/StockStatus';
import { LIGHTNING_DELAY, LIGHTNING_INTERVAL, SUGGEST_DELAY, SUGGEST_INTERVAL } from './constant';
import { state, dispatch, subscribe, getCartSummary, getBonusPoints } from './store';

let lightningSaleTimerId = null;
let suggestSaleTimerId = null;

const elements = {};

function renderCartItems() {
  const { cartItems } = elements;

  state.cartList.forEach((cartItem) => {
    const product = state.products.find((p) => p.id === cartItem.productId);
    if (!product) return;

    const itemElement = document.getElementById(product.id);

    if (itemElement) {
      const qtyElement = itemElement.querySelector('.quantity-number');
      if (qtyElement.textContent !== String(cartItem.quantity)) {
        qtyElement.textContent = cartItem.quantity;
      }
    } else {
      const newItemHTML = CartProductItem({ product, quantity: cartItem.quantity });
      cartItems.insertAdjacentHTML('beforeend', newItemHTML);
    }
  });

  const currentItemIdsInState = state.cartList.map((item) => item.productId);
  Array.from(cartItems.children).forEach((element) => {
    if (!currentItemIdsInState.includes(element.id)) {
      element.remove();
    }
  });
}

function renderInitialLayout() {
  const root = document.getElementById('app');

  root.innerHTML = `
    ${Header()}
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      ${CartContainer()}
      ${OrderSummary()}
    </div>
    ${Manual()}
  `;
}

function attachEventListeners() {
  const { addToCart, cartItems, manualToggle, manualOverlay, manualColumn, manualCloseBtn } =
    elements;

  addToCart.addEventListener('click', handleAddItemToCart);
  cartItems.addEventListener('click', handleCartItemActions);

  const toggleManual = () => {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  manualToggle.addEventListener('click', toggleManual);
  manualCloseBtn.addEventListener('click', toggleManual);
  manualOverlay.addEventListener('click', (event) => {
    if (event.target === manualOverlay) {
      toggleManual();
    }
  });

  window.addEventListener('beforeunload', stopTimers);
}

function cacheDOMElements() {
  elements.itemCount = document.getElementById('item-count');
  elements.productSelect = document.getElementById('product-select');
  elements.stockStatus = document.getElementById('stock-status');
  elements.cartItems = document.getElementById('cart-items');
  elements.addToCart = document.getElementById('add-to-cart');

  elements.summaryDetails = document.getElementById('summary-details');
  elements.discountInfo = document.getElementById('discount-info');
  elements.totalAmount = document.querySelector('#cart-total .text-2xl');
  elements.loyaltyPoints = document.getElementById('loyalty-points');
  elements.tuesdaySpecial = document.getElementById('tuesday-special');

  elements.manualToggle = document.getElementById('manual-toggle');
  elements.manualOverlay = document.getElementById('manual-overlay');
  elements.manualColumn = document.getElementById('manual-column');
  elements.manualCloseBtn = document.getElementById('manual-close-btn');
}

function render() {
  const {
    itemCount,
    productSelect,
    stockStatus,
    summaryDetails,
    discountInfo,
    totalAmount,
    loyaltyPoints,
    tuesdaySpecial,
  } = elements;
  const summary = getCartSummary(state);
  const { bonusPoints, pointsDetail } = getBonusPoints(state, summary);

  alertNotifications();

  itemCount.textContent = `🛍️ ${summary.totalQuantity} items in cart`;

  loyaltyPoints.innerHTML = LoyaltyPoints(bonusPoints, pointsDetail);
  if (state.cartList.length === 0) {
    loyaltyPoints.style.display = 'none';
  } else {
    loyaltyPoints.style.display = 'block';
  }

  // 선택값 유지
  const currentSelection = productSelect.value;
  productSelect.innerHTML = state.products.map(ProductSelectItem).join('');
  productSelect.value = currentSelection;

  stockStatus.innerHTML = StockStatus(summary.stockMessages);

  renderCartItems();

  summaryDetails.innerHTML = OrderItemSummary(summary);
  discountInfo.innerHTML = DiscountInfo(summary);
  totalAmount.textContent = `₩${Math.round(summary.finalTotal).toLocaleString()}`;

  tuesdaySpecial.classList.toggle('hidden', !summary.isTuesday || summary.totalQuantity === 0);
}

const startTimers = () => {
  setTimeout(() => {
    lightningSaleTimerId = setInterval(startLightningSale, LIGHTNING_INTERVAL);
  }, LIGHTNING_DELAY);

  setTimeout(function () {
    suggestSaleTimerId = setInterval(startSuggestSale, SUGGEST_INTERVAL);
  }, SUGGEST_DELAY);
};

function stopTimers() {
  clearInterval(lightningSaleTimerId);
  clearInterval(suggestSaleTimerId);
}

const alertNotifications = () => {
  if (state.notifications.length > 0) {
    state.notifications.forEach((noti) => {
      alert(noti.message);
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: { notificationId: noti.id } });
    });
  }
};

const handleAddItemToCart = () => {
  const { productSelect } = elements;
  const selectedId = productSelect.value;
  if (!selectedId) return;

  dispatch({ type: 'ADD_ITEM', payload: { productId: selectedId } });
  dispatch({ type: 'SET_LAST_SELECTED', payload: { productId: selectedId } });
};

const handleCartItemActions = (event) => {
  const button = event.target.closest('.quantity-change, .remove-item');

  if (!button) {
    return;
  }

  const { productId } = button.dataset;

  if (!productId) return;

  if (button.classList.contains('quantity-change')) {
    const change = parseInt(button.dataset.change, 10);
    if (change > 0) {
      dispatch({ type: 'INCREASE_QUANTITY', payload: { productId } });
    } else {
      dispatch({ type: 'DECREASE_QUANTITY', payload: { productId } });
    }
  }

  if (button.classList.contains('remove-item')) {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  }
};

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
    (product) => product.id !== state.lastSelectedId && product.quantity && !product.suggestSale,
  );
  if (luckyItem) {
    dispatch({ type: 'START_SUGGEST_SALE', payload: { productId: luckyItem.id } });
  }
};

function init() {
  renderInitialLayout();
  cacheDOMElements();
  subscribe(render);
  render();
  attachEventListeners();
  startTimers();
}

export default { init };
