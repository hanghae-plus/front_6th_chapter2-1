import { STOCK, DISCOUNT } from './constants.js';

// --- Template Creation Functions ---

const createSelectOptionTemplate = (item) => {
  let discountText = '';
  if (item.onSale) discountText += ' ⚡SALE';
  if (item.suggestSale) discountText += ' 💝추천';

  if (item.q === 0) {
    return `<option value="${item.id}" disabled class="text-gray-400">${item.name} - ${item.val}원 (품절)${discountText}</option>`;
  }

  if (item.onSale && item.suggestSale) {
    return `<option value="${item.id}" class="text-purple-600 font-bold">⚡💝${item.name} - ${item.originalVal}원 → ${item.val}원 (25% SUPER SALE!)</option>`;
  }
  if (item.onSale) {
    return `<option value="${item.id}" class="text-red-500 font-bold">⚡${item.name} - ${item.originalVal}원 → ${item.val}원 (20% SALE!)</option>`;
  }
  if (item.suggestSale) {
    return `<option value="${item.id}" class="text-blue-500 font-bold">💝${item.name} - ${item.originalVal}원 → ${item.val}원 (5% 추천할인!)</option>`;
  }
  return `<option value="${item.id}">${item.name} - ${item.val}원${discountText}</option>`;
};

const createCartItemTemplate = (item, product, index, array) => {
  const subtotal = product.val * item.quantity;
  let priceDisplay;
  let nameDisplay = product.name;

  if (product.onSale && product.suggestSale) {
    priceDisplay = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-purple-600">₩${product.val.toLocaleString()}</span>`;
    nameDisplay = `⚡💝${product.name}`;
  } else if (product.onSale) {
    priceDisplay = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-red-500">₩${product.val.toLocaleString()}</span>`;
    nameDisplay = `⚡${product.name}`;
  } else if (product.suggestSale) {
    priceDisplay = `<span class="line-through text-gray-400">₩${product.originalVal.toLocaleString()}</span> <span class="text-blue-500">₩${product.val.toLocaleString()}</span>`;
    nameDisplay = `💝${product.name}`;
  } else {
    priceDisplay = `₩${product.val.toLocaleString()}`;
  }

  const isFirst = index === 0;
  const isLast = index === array.length - 1;
  let classNames = "flex items-center justify-between py-4 border-b border-gray-200";
  if (isFirst) classNames += " first:pt-0";
  if (isLast) classNames += " last:border-b-0";

  return `
    <div class="${classNames}" id="${
      product.id
    }">
      <div class="flex items-center gap-4 flex-1">
        <div class="w-16 h-16 bg-gradient-black rounded-lg flex-shrink-0"></div>
        <div class="flex-1">
          <h3 class="text-base font-semibold">${nameDisplay}</h3>
          <div class="text-sm text-gray-500">${priceDisplay}</div>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <button data-product-id="${
            product.id
          }" data-change="-1" class="quantity-change w-8 h-8 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors">-</button>
          <span class="quantity-number text-base font-medium w-5 text-center">${
            item.quantity
          }</span>
          <button data-product-id="${
            product.id
          }" data-change="1" class="quantity-change w-8 h-8 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors">+</button>
        </div>
        <div class="text-base font-bold w-24 text-right">₩${subtotal.toLocaleString()}</div>
        <button data-product-id="${
            product.id
          }" class="remove-item text-gray-400 hover:text-red-500 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  `;
};

const createSummaryDetailsTemplate = ({
  cart,
  products,
  subtotal,
  totalAmount,
  discounts,
}) => {
  if (subtotal <= 0) return '';

  const itemsHtml = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return '';
      const itemTotal = product.val * item.quantity;
      return `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${product.name} x ${item.quantity}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    })
    .join('');

  const subtotalHtml = `
    <div class="border-t border-white/10 my-3"></div>
    <div class="flex justify-between text-sm tracking-wide">
      <span>Subtotal</span>
      <span>₩${subtotal.toLocaleString()}</span>
    </div>
  `;

  let discountsHtml = '';
  if (discounts.bulkDiscountRate > 0) {
    discountsHtml = `
      <div class="flex justify-between text-sm tracking-wide text-green-400">
        <span class="text-xs">🎉 대량구매 할인 (${
          DISCOUNT.BULK_DISCOUNT_THRESHOLD
        }개 이상)</span>
        <span class="text-xs">-${discounts.bulkDiscountRate * 100}%</span>
      </div>
    `;
  } else if (discounts.itemDiscounts.length > 0) {
    discountsHtml = discounts.itemDiscounts
      .map(
        (item) => `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">${item.name} (10개↑)</span>
          <span class="text-xs">-${item.discount}%</span>
        </div>
      `
      )
      .join('');
  }

  const isTuesday = new Date().getDay() === 2;
  const tuesdayDiscountHtml =
    isTuesday && totalAmount > 0
      ? `
      <div class="flex justify-between text-sm tracking-wide text-purple-400">
        <span class="text-xs">🌟 화요일 추가 할인</span>
        <span class="text-xs">-${
          DISCOUNT.TUESDAY_DISCOUNT_RATE * 100
        }%</span>
      </div>
    `
      : '';

  const shippingHtml = `
    <div class="flex justify-between text-sm tracking-wide text-gray-400">
      <span>Shipping</span>
      <span>Free</span>
    </div>
  `;

  return itemsHtml + subtotalHtml + discountsHtml + tuesdayDiscountHtml + shippingHtml;
};

// --- Original and Refactored DOM Update Functions ---

export function createInitialDOM() {
  const root = document.getElementById('app');
  root.innerHTML = ''; // DOM 초기화 코드 추가

  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;

  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  const productSelect = document.createElement('select');
  productSelect.id = 'product-select';
  productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  const addToCartButton = document.createElement('button');
  addToCartButton.id = 'add-to-cart';
  addToCartButton.innerHTML = 'Add to Cart';
  addToCartButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  const stockStatus = document.createElement('div');
  stockStatus.id = 'stock-status';
  stockStatus.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  selectorContainer.appendChild(productSelect);
  selectorContainer.appendChild(addToCartButton);
  selectorContainer.appendChild(stockStatus);

  const cartItemsContainer = document.createElement('div');
  cartItemsContainer.id = 'cart-items';

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(cartItemsContainer);

  const rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML = `
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
  `;

  const helpButton = document.createElement('button');
  helpButton.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  helpButton.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  const helpOverlay = document.createElement('div');
  helpOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  const helpColumn = document.createElement('div');
  helpColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  helpColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black">
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
    <div class="mb-6">
      <h3 class="text-base font-bold mb-3">🎁 포인트 적립</h3>
      <div class="space-y-3">
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">기본</p>
          <p class="text-gray-700 text-xs pl-2">• 구매액의 0.1%</p>
        </div>
        <div class="bg-gray-100 rounded-lg p-3">
          <p class="font-semibold text-sm mb-1">추가</p>
          <p class="text-gray-700 text-xs pl-2">
            • 화요일: 2배<br>
            • 키보드+마우스: +50p<br>
            • 풀세트: +100p<br>
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br>
        • ⚡+💝 중복 가능<br>
        • 상품4 = 품절
      </p>
    </div>
  `;

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);
  helpOverlay.appendChild(helpColumn);

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(helpButton);
  root.appendChild(helpOverlay);

  return {
    root,
    productSelect,
    addToCartButton,
    cartItemsContainer,
    stockStatus,
    helpButton,
    helpOverlay,
    helpColumn,
  };
}

export function onUpdateSelectOptions(sel, products) {
  const totalStock = products.reduce((sum, p) => sum + p.q, 0);

  sel.innerHTML = products.map(createSelectOptionTemplate).join('');

  sel.style.borderColor =
    totalStock < STOCK.TOTAL_STOCK_WARNING_THRESHOLD ? 'orange' : '';
}

export function updateItemCount(count) {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${count} items in cart`;
  }
}

export function updateCartSummary(props) {
  const summaryDetails = document.getElementById('summary-details');
  const totalDiv = document.querySelector('#cart-total .text-2xl');

  if (!summaryDetails || !totalDiv) return;

  summaryDetails.innerHTML = createSummaryDetailsTemplate(props);
  totalDiv.textContent = `₩${Math.round(props.totalAmount).toLocaleString()}`;
}

export function updateDiscountInfo(subtotal, totalAmount) {
  const discountInfoDiv = document.getElementById('discount-info');
  if (!discountInfoDiv) return;

  const savedAmount = subtotal - totalAmount;
  if (savedAmount > 0) {
    const totalDiscountRate =
      subtotal > 0 ? (savedAmount / subtotal) * 100 : 0;
    discountInfoDiv.innerHTML = `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${totalDiscountRate.toFixed(
            1
          )}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(
          savedAmount
        ).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  } else {
    discountInfoDiv.innerHTML = '';
  }
}

export function updateLoyaltyPoints(points) {
  const ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) return;

  if (points.finalPoints > 0) {
    ptsTag.innerHTML = `
      <div>적립 포인트: <span class="font-bold">${points.finalPoints}p</span></div>
      <div class="text-2xs opacity-70 mt-1">${points.pointsDetail.join(
        ', '
      )}</div>
    `;
    ptsTag.style.display = 'block';
  } else {
    ptsTag.innerHTML = '적립 포인트: 0p';
    ptsTag.style.display = 'none';
  }
}

export function updateStockStatus(products) {
  const stockInfo = document.getElementById('stock-status');
  if (!stockInfo) return;

  const stockMsg = products
    .filter((item) => item.q < STOCK.LOW_STOCK_THRESHOLD)
    .map((item) =>
      item.q > 0
        ? `${item.name}: 재고 부족 (${item.q}개 남음)`
        : `${item.name}: 품절`
    )
    .join('\n');

  stockInfo.textContent = stockMsg;
}

export function updateTuesdaySpecial(totalAmount, date) {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (!tuesdaySpecial) return;

  if (date.getDay() === 2 && totalAmount > 0) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

export function renderCart(cartContainer, cart, products) {
  cartContainer.innerHTML = cart
    .map((item, index, array) => {
      const product = products.find((p) => p.id === item.id);
      return product ? createCartItemTemplate(item, product, index, array) : '';
    })
    .join('');
}

// This function is now obsolete as its logic is merged into `renderCart`
export function doUpdatePricesInCart() {
  // No longer needed. The main render function will take care of this.
}
