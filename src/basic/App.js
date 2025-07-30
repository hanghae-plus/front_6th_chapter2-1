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
import { state, dispatch, subscribe, getCartSummary, getBonusPoints } from './store';
import { startSaleTimers, stopSaleTimers } from './utils/saleTimers';

const DOMElements = {};

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

const cacheDOMElements = () => {
  DOMElements.itemCount = document.getElementById('item-count');
  DOMElements.productSelect = document.getElementById('product-select');
  DOMElements.stockStatus = document.getElementById('stock-status');
  DOMElements.cartItems = document.getElementById('cart-items');
  DOMElements.addToCart = document.getElementById('add-to-cart');

  DOMElements.summaryDetails = document.getElementById('summary-details');
  DOMElements.discountInfo = document.getElementById('discount-info');
  DOMElements.totalAmount = document.querySelector('#cart-total .text-2xl');
  DOMElements.loyaltyPoints = document.getElementById('loyalty-points');
  DOMElements.tuesdaySpecial = document.getElementById('tuesday-special');

  DOMElements.manualToggle = document.getElementById('manual-toggle');
  DOMElements.manualOverlay = document.getElementById('manual-overlay');
  DOMElements.manualColumn = document.getElementById('manual-column');
  DOMElements.manualCloseBtn = document.getElementById('manual-close-btn');
};

const attachEventListeners = () => {
  const { addToCart, cartItems, manualToggle, manualOverlay, manualColumn, manualCloseBtn } =
    DOMElements;

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

  window.addEventListener('beforeunload', stopSaleTimers);
};

function renderCartItems() {
  const { cartItems } = DOMElements;

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
  } = DOMElements;
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

const handleAddItemToCart = () => {
  const { productSelect } = DOMElements;
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
