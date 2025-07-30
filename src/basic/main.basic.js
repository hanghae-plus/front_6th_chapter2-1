import { state, dispatch, subscribe, getCartSummary, getBonusPoints } from './store';

const LIGHTNING_DELAY = Math.random() * 10000;
const LIGHTNING_INTERVAL = 30000;
const SUGGEST_DELAY = Math.random() * 20000;
const SUGGEST_INTERVAL = 60000;

const elements = {};

const ProductSelectItem = (product) => {
  // 품절 상품
  if (product.quantity === 0) {
    return `
      <option value="${product.id}" disabled class="text-gray-400">
        ${product.name} - ${product.price}원 (품절)
      </option>
    `;
  }
  // ⚡ 번개 세일 + 💝 추천 할인
  if (product.onSale && product.suggestSale) {
    return `
      <option value="${product.id}" class="text-purple-600 font-bold">
        ⚡💝 ${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)
      </option>
    `;
  }
  // ⚡ 번개 세일
  if (product.onSale) {
    return `
      <option value="${product.id}" class="text-red-500 font-bold">
        ⚡ ${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)
      </option>
    `;
  }
  // 💝 추천 할인
  if (product.suggestSale) {
    return `
      <option value="${product.id}" class="text-blue-500 font-bold">
        💝 ${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)
      </option>
    `;
  }
  // 기본 상품
  return `
    <option value="${product.id}">
      ${product.name} - ${product.price}원
    </option>
		`;
};

const CartProductItem = ({ product, quantity }) => {
  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  const priceHTML =
    product.onSale || product.suggestSale
      ? `<span class="line-through text-gray-400">₩${product.originalPrice}</span> <span class="${
          product.onSale && product.suggestSale
            ? 'text-purple-600'
            : product.onSale
              ? 'text-red-500'
              : 'text-blue-500'
        }">₩${product.price}</span>`
      : `₩${product.price}`;

  return `<div
      class='grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0'
      id='${product.id}'
    >
      <div class='w-20 h-20 bg-gradient-black relative overflow-hidden'>
        <div class='absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45'></div>
      </div>
      <div>
        <h3 class='text-base font-normal mb-1 tracking-tight'>
          ${saleIcon} ${product.name}
        </h3>
        <p class='text-xs text-gray-500 mb-0.5 tracking-wide'>PRODUCT</p>
        <p class='text-xs text-black mb-3'>${priceHTML}</p>
        <div class='flex items-center gap-4'>
          <button
            class='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
            data-product-id='${product.id}'
            data-change='-1'
          >−</button>
          <span class='quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums'>${quantity}</span>
          <button
            class='quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white'
            data-product-id='${product.id}'
            data-change='1'
          >+</button>
        </div>
      </div>
      <div class='text-right'>
        <div class='text-lg mb-2 tracking-tight tabular-nums'>${priceHTML}</div>
        <a
          class='remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black'
          data-product-id='${product.id}'
        >
          Remove
        </a>
      </div>
    </div>`;
};

const StockStatus = () => {
  let text = '';
  state.products.forEach(function (item) {
    if (item.quantity === 0) {
      text += `${item.name}: 품절\n`;
    } else if (item.quantity < 5) {
      text += `${item.name} : 재고 부족 (${item.quantity}개 남음)\n`;
    }
  });
  return text;
};

const LoyaltyPoints = (bonusPts, pointsDetail) => {
  if (bonusPts <= 0) {
    return '<div>적립 포인트: 0p</div>';
  }

  const detailHTML =
    pointsDetail.length > 0
      ? `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`
      : '';

  return `
    <div>적립 포인트: <span class="font-bold">${bonusPts}p</span></div>
    ${detailHTML}
  `;
};

const Header = () => `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    </div>
  `;

const CartContainer = () => `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      <div class="mb-6 pb-6 border-b border-gray-200">
        <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"></select>
        <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">Add to Cart</button>
        <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
      </div>
      <div id="cart-items"></div>
    </div>
  `;

const OrderSummary = () => `
    <div class="bg-black text-white p-8 flex flex-col">
      <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div class="flex-1 flex flex-col">
        <div id="summary-details" class="space-y-3"></div>
        <div class="mt-auto">
          <div id="discount-info" class="mb-4"></div>
          <div id="cart-total" class="pt-5 border-t border-white/10">
            <div class="flex justify-between items-baseline">
              <span class="text-sm uppercase tracking-wider">Total</span>
              <div class="text-2xl tracking-tight">₩0</div>
            </div>
            <div id="loyalty-points" class="text-xs text-blue-400 mt-2 text-right">적립 포인트: 0p</div>
          </div>
          <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
            <div class="flex items-center gap-2">
              <span class="text-2xs">🎉</span>
              <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
            </div>
          </div>
        </div>
      </div>
      <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br>
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  `;

const Manual = () => `
    <button id="manual-toggle" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
    <div id="manual-overlay" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300">
      <div id="manual-column" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
        <button id="manual-close-btn" class="absolute top-4 right-4 text-gray-500 hover:text-black">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
        <div class="mb-6">
          <h3 class="text-base font-bold mb-3">💰 할인 정책</h3>
          <div class="space-y-3">
            <div class="bg-gray-100 rounded-lg p-3">
              <p class="font-semibold text-sm mb-1">개별 상품</p>
              <p class="text-gray-700 text-xs pl-2">
                • 키보드 10개↑: 10%<br>
                • 마우스 10개↑: 15%<br>
                • 모니터암 10개↑: 20%<br>
                • 스피커 10개↑: 25%
              </p>
            </div>
            <div class="bg-gray-100 rounded-lg p-3">
              <p class="font-semibold text-sm mb-1">전체 수량</p>
              <p class="text-gray-700 text-xs pl-2">• 30개 이상: 25%</p>
            </div>
            <div class="bg-gray-100 rounded-lg p-3">
              <p class="font-semibold text-sm mb-1">특별 할인</p>
              <p class="text-gray-700 text-xs pl-2">
                • 화요일: +10%<br>
                • ⚡번개세일: 20%<br>
                • 💝추천할인: 5%
              </p>
            </div>
          </div>
        </div>
        </div>
    </div>
  `;

function OrderItemSummary(summary) {
  const itemsHTML = summary.cartItemsForDisplay
    .map(
      (item) => `
    <div class="flex justify-between text-xs tracking-wide text-gray-400">
      <span>${item.name} x ${item.quantity}</span>
      <span>₩${item.totalPrice}</span>
    </div>
  `,
    )
    .join('');

  const discountsHTML = summary.discounts
    .map(
      (d) => `
    <div class="flex justify-between text-sm tracking-wide text-green-400">
      <span class="text-xs">${d.reason}</span>
      <span class="text-xs">-${d.amount}</span>
    </div>
  `,
    )
    .join('');

  if (summary.totalQuantity === 0) return '';

  return `
    ${itemsHTML}
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${summary.subtotal}</span>
    </div>
    ${discountsHTML}
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;
}

function DiscountInfo(summary) {
  if (summary.savedAmount <= 0) return '';

  return `
    <div class="bg-green-500/20 rounded-lg p-3">
      <div class="flex justify-between items-center mb-1">
        <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
        <span class="text-sm font-medium text-green-400">${(summary.totalDiscountRate * 100).toFixed(1)}%</span>
      </div>
      <div class="text-2xs text-gray-300">₩${Math.round(summary.savedAmount)} 할인되었습니다</div>
    </div>
  `;
}

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
}

const cacheDOMElements = () => {
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
};

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

  stockStatus.innerHTML = StockStatus();

  renderCartItems();

  summaryDetails.innerHTML = OrderItemSummary(summary);
  discountInfo.innerHTML = DiscountInfo(summary);
  totalAmount.textContent = `₩${Math.round(summary.finalTotal).toLocaleString()}`;

  tuesdaySpecial.classList.toggle('hidden', !summary.isTuesday || summary.totalQuantity === 0);
}

function main() {
  renderInitialLayout();
  cacheDOMElements();
  subscribe(render);
  render();
  attachEventListeners();

  setTimeout(() => {
    setInterval(startLightningSale, LIGHTNING_INTERVAL);
  }, LIGHTNING_DELAY);

  setTimeout(function () {
    setInterval(startSuggestSale, SUGGEST_INTERVAL);
  }, SUGGEST_DELAY);
}

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
    alert(`⚡번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    dispatch({ type: 'START_LIGHTNING_SALE', payload: { productId: luckyItem.id } });
  }
};

const startSuggestSale = () => {
  if (!state.lastSelectedId) return;

  const luckyItem = state.products.find(
    (product) => product.id !== state.lastSelectedId && product.quantity && !product.suggestSale,
  );
  if (luckyItem) {
    alert(`💝 ${luckyItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    dispatch({ type: 'START_SUGGEST_SALE', payload: { productId: luckyItem.id } });
  }
};

main();
