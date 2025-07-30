// UI Renderer module - React 컴포넌트 네이밍 규칙 적용
import {
  setProductSelectElement,
  setStockStatusDisplay,
  setCartItemsContainer,
  setCartTotalDisplay,
  getItemCount,
} from '../cart/cartState.js';
import {
  findProductById,
  getLowStockProducts,
  getOutOfStockProducts,
} from '../data/productData.js';
import { isTuesday } from '../services/discountService.js';
import { DISCOUNT_RATES } from '../data/productData.js';

// Header 컴포넌트
export function Header() {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  return header;
}

// ProductSelector 컴포넌트
export function ProductSelector() {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  const productSelectElement = document.createElement('select');
  productSelectElement.id = 'product-select';
  productSelectElement.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  const addBtn = document.createElement('button');
  addBtn.id = 'add-to-cart';
  addBtn.innerHTML = 'Add to Cart';
  addBtn.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  const stockStatusDisplay = document.createElement('div');
  stockStatusDisplay.id = 'stock-status';
  stockStatusDisplay.className =
    'text-xs text-red-500 mt-3 whitespace-pre-line';

  // 전역 상태에 저장
  setProductSelectElement(productSelectElement);
  setStockStatusDisplay(stockStatusDisplay);

  selectorContainer.appendChild(productSelectElement);
  selectorContainer.appendChild(addBtn);
  selectorContainer.appendChild(stockStatusDisplay);

  return selectorContainer;
}

// CartDisplay 컴포넌트
export function CartDisplay() {
  const cartItemsContainer = document.createElement('div');
  cartItemsContainer.id = 'cart-items';
  setCartItemsContainer(cartItemsContainer);
  return cartItemsContainer;
}

// OrderSummary 컴포넌트
export function OrderSummary() {
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
  const cartTotalDisplay = rightColumn.querySelector('#cart-total');
  setCartTotalDisplay(cartTotalDisplay);
  return rightColumn;
}

// ManualOverlay 컴포넌트
export function ManualOverlay() {
  const manualToggle = document.createElement('button');
  manualToggle.className =
    'fixed top-4 right-4 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-lg hover:bg-gray-800 transition-all';

  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  const manualOverlay = document.createElement('div');
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  const manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
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

  // 이벤트 리스너
  manualToggle.addEventListener('click', () => {
    manualOverlay.classList.remove('hidden');
    manualColumn.classList.remove('translate-x-full');
  });

  manualOverlay.addEventListener('click', (e) => {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  });

  manualColumn.querySelector('button').addEventListener('click', () => {
    manualOverlay.classList.add('hidden');
    manualColumn.classList.add('translate-x-full');
  });

  manualOverlay.appendChild(manualColumn);

  return { manualToggle, manualOverlay };
}

// CartItem 컴포넌트
export function CartItem(product) {
  const cartItem = document.createElement('div');
  cartItem.id = product.id;
  cartItem.className =
    'flex items-center gap-4 py-4 first:pt-0 last:border-b-0 border-b border-gray-200';

  cartItem.innerHTML = `
    <div class="w-16 h-16 bg-gradient-black relative overflow-hidden rounded-lg flex items-center justify-center text-2xl">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      ${product.name.charAt(0)}
    </div>
    <div class="flex-1">
      <h3 class="font-medium text-gray-900">${product.name}</h3>
      <div class="text-lg font-semibold text-gray-900">${getPriceDisplay(product)}</div>
    </div>
    <div class="flex items-center gap-2">
      <button class="quantity-change w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" data-product-id="${product.id}" data-change="-1">-</button>
      <span class="quantity-number w-8 text-center">1</span>
      <button class="quantity-change w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50" data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item w-8 h-8 border border-red-300 text-red-600 rounded flex items-center justify-center hover:bg-red-50" data-product-id="${product.id}">×</button>
    </div>
  `;

  return cartItem;
}

// UI 업데이트 함수들
export function updateStockInfo() {
  const stockStatusDisplay = document.getElementById('stock-status');
  if (!stockStatusDisplay) return;

  const lowStockItems = getLowStockProducts();
  const outOfStockItems = getOutOfStockProducts();

  let stockMessage = '';

  // 재고 부족 상품들 표시 (5개 미만이면서 0개 초과)
  lowStockItems.forEach((item) => {
    stockMessage += `${item.name}: 재고 부족 (${item.stockQuantity}개 남음)\n`;
  });

  // 품절 상품들 표시 (0개)
  outOfStockItems.forEach((item) => {
    stockMessage += `${item.name}: 품절\n`;
  });

  stockStatusDisplay.textContent = stockMessage;
}

export function updateItemCountDisplay(count) {
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    itemCountElement.textContent = `🛍️ ${count} items in cart`;
  }
}

export function updateSummaryDetails(cartItems, subtotal, itemDiscounts) {
  const summaryDetails = document.getElementById('summary-details');
  if (!summaryDetails) return;

  // 기존 내용 제거
  summaryDetails.innerHTML = '';

  if (subtotal <= 0) return;

  // DocumentFragment 사용으로 성능 개선
  const fragment = document.createDocumentFragment();

  // 개별 아이템들 추가
  addCartItemsToFragment(cartItems, fragment);

  // 구분선 추가
  const divider = createDivider();
  fragment.appendChild(divider);

  // 소계 추가
  const subtotalRow = createSummaryRow('Subtotal', formatPrice(subtotal));
  fragment.appendChild(subtotalRow);

  // 할인 정보 추가
  addDiscountRowsToFragment(itemDiscounts, fragment);

  // 화요일 할인 추가
  addTuesdayDiscountToFragment(fragment);

  // 배송비 추가
  const shippingRow = createSummaryRow('Shipping', 'Free', 'text-gray-400');
  fragment.appendChild(shippingRow);

  // 한 번에 DOM에 추가
  summaryDetails.appendChild(fragment);
}

// 헬퍼 함수들로 분리 (20라인 이하)
function addCartItemsToFragment(cartItems, fragment) {
  Array.from(cartItems).forEach((itemElement) => {
    const product = findProductById(itemElement.id);
    if (!product) return;

    const quantity = parseInt(
      itemElement.querySelector('.quantity-number').textContent
    );
    const itemTotal = product.price * quantity;

    const itemRow = createSummaryItemRow(product.name, quantity, itemTotal);
    fragment.appendChild(itemRow);
  });
}

function addDiscountRowsToFragment(itemDiscounts, fragment) {
  const discountRows = createDiscountRows(itemDiscounts);
  discountRows.forEach((row) => fragment.appendChild(row));
}

function addTuesdayDiscountToFragment(fragment) {
  if (isTuesday()) {
    const tuesdayRow = createTuesdayDiscountRow();
    fragment.appendChild(tuesdayRow);
  }
}

function createSummaryItemRow(productName, quantity, itemTotal) {
  const row = document.createElement('div');
  row.className = 'flex justify-between text-xs tracking-wide text-gray-400';
  row.innerHTML = `
    <span>${productName} x ${quantity}</span>
    <span>${formatPrice(itemTotal)}</span>
  `;
  return row;
}

function createDivider() {
  const divider = document.createElement('div');
  divider.className = 'border-t border-white/10 my-3';
  return divider;
}

function createSummaryRow(label, value, className = '') {
  const row = document.createElement('div');
  row.className = `flex justify-between text-sm tracking-wide ${className}`;
  row.innerHTML = `
    <span>${label}</span>
    <span>${value}</span>
  `;
  return row;
}

function createDiscountRows(itemDiscounts) {
  const rows = [];

  if (getItemCount() >= DISCOUNT_RATES.BULK_PURCHASE_THRESHOLD) {
    const bulkRow = document.createElement('div');
    bulkRow.className =
      'flex justify-between text-sm tracking-wide text-green-400';
    bulkRow.innerHTML = `
      <span class="text-xs">🎉 대량구매 할인 (30개 이상)</span>
      <span class="text-xs">-${DISCOUNT_RATES.BULK_PURCHASE_DISCOUNT}%</span>
    `;
    rows.push(bulkRow);
  } else if (itemDiscounts.length > 0) {
    itemDiscounts.forEach((item) => {
      const discountRow = document.createElement('div');
      discountRow.className =
        'flex justify-between text-sm tracking-wide text-green-400';
      discountRow.innerHTML = `
        <span class="text-xs">${item.name} (10개↑)</span>
        <span class="text-xs">-${item.discount}%</span>
      `;
      rows.push(discountRow);
    });
  }

  return rows;
}

function createTuesdayDiscountRow() {
  const row = document.createElement('div');
  row.className = 'flex justify-between text-sm tracking-wide text-purple-400';
  row.innerHTML = `
    <span class="text-xs">🌟 화요일 추가 할인</span>
    <span class="text-xs">-${DISCOUNT_RATES.TUESDAY_DISCOUNT}%</span>
  `;
  return row;
}

export function updateDiscountInfo(discountRate, totalAmount, originalTotal) {
  const discountInfoDiv = document.getElementById('discount-info');
  if (!discountInfoDiv) return;

  // 기존 내용 제거
  discountInfoDiv.innerHTML = '';

  if (discountRate <= 0 || totalAmount <= 0) return;

  const savedAmount = originalTotal - totalAmount;
  const discountElement = createDiscountInfoElement(discountRate, savedAmount);
  discountInfoDiv.appendChild(discountElement);
}

function createDiscountInfoElement(discountRate, savedAmount) {
  const container = document.createElement('div');
  container.className = 'bg-green-500/20 rounded-lg p-3';

  const headerRow = document.createElement('div');
  headerRow.className = 'flex justify-between items-center mb-1';
  headerRow.innerHTML = `
    <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
    <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
  `;

  const savedAmountText = document.createElement('div');
  savedAmountText.className = 'text-2xs text-gray-300';
  savedAmountText.textContent = `${formatPrice(Math.round(savedAmount))} 할인되었습니다`;

  container.appendChild(headerRow);
  container.appendChild(savedAmountText);

  return container;
}

export function updateTuesdaySpecialDisplay() {
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (!tuesdaySpecial) return;

  if (isTuesday()) {
    tuesdaySpecial.classList.remove('hidden');
  } else {
    tuesdaySpecial.classList.add('hidden');
  }
}

export function updateLoyaltyPointsDisplay(points, pointsDetail) {
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (!loyaltyPointsDiv) return;

  // 기존 내용 제거
  loyaltyPointsDiv.innerHTML = '';

  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer || cartItemsContainer.children.length === 0) {
    loyaltyPointsDiv.style.display = 'none';
    return;
  }

  if (points > 0) {
    const pointsElement = createLoyaltyPointsElement(points, pointsDetail);
    loyaltyPointsDiv.appendChild(pointsElement);
    loyaltyPointsDiv.style.display = 'block';
  } else {
    const zeroPointsElement = createZeroPointsElement();
    loyaltyPointsDiv.appendChild(zeroPointsElement);
    loyaltyPointsDiv.style.display = 'block';
  }
}

function createLoyaltyPointsElement(points, pointsDetail) {
  const container = document.createElement('div');

  const pointsText = document.createElement('div');
  pointsText.innerHTML = `적립 포인트: <span class="font-bold">${points}p</span>`;

  const detailText = document.createElement('div');
  detailText.className = 'text-2xs opacity-70 mt-1';
  detailText.textContent = pointsDetail.join(', ');

  container.appendChild(pointsText);
  container.appendChild(detailText);

  return container;
}

function createZeroPointsElement() {
  const element = document.createElement('div');
  element.textContent = '적립 포인트: 0p';
  return element;
}

// 유틸리티 함수들

function getPriceDisplay(product) {
  if (!product.isFlashSale && !product.isRecommended) {
    return formatPrice(product.price);
  }

  const priceClass =
    product.isFlashSale && product.isRecommended
      ? 'text-purple-600'
      : product.isFlashSale
        ? 'text-red-500'
        : 'text-blue-500';

  return `
    <span class="line-through text-gray-400">${formatPrice(product.originalPrice)}</span>
    <span class="${priceClass}">${formatPrice(product.price)}</span>
  `;
}

function formatPrice(price) {
  return '₩' + price.toLocaleString();
}
