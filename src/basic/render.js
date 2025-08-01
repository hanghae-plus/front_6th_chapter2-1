import { calculateBonusPoints } from './utils/cart';
import { getProductNameWithBadge, getProductPriceHTML, getTotalStock } from './utils/product';

export const renderAppLayout = () => {
  const root = document.getElementById('app');

  const header = renderHeader();
  const { gridContainer, leftColumn } = renderRootLayout();
  const selectorBlock = renderSelectorBlock();
  const cartItemsBlock = renderCartItemsBlock();
  const manualGuideBlock = renderManualGuideBlock();

  leftColumn.appendChild(selectorBlock);
  leftColumn.appendChild(cartItemsBlock);
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualGuideBlock.toggleButton);
  root.appendChild(manualGuideBlock.overlay);
};

const renderHeader = () => {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  return header;
};

const renderRootLayout = () => {
  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

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

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  return { gridContainer, leftColumn, rightColumn };
};

const renderSelectorBlock = () => {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  const selectElement = document.createElement('select');
  selectElement.id = 'product-select';
  selectElement.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  const addToCartButton = document.createElement('button');
  addToCartButton.id = 'add-to-cart';
  addToCartButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  addToCartButton.innerHTML = 'Add to Cart';

  const stockStatusElement = document.createElement('div');
  stockStatusElement.id = 'stock-status';
  stockStatusElement.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  selectorContainer.appendChild(selectElement);
  selectorContainer.appendChild(addToCartButton);
  selectorContainer.appendChild(stockStatusElement);

  return selectorContainer;
};

const renderCartItemsBlock = () => {
  const container = document.createElement('div');
  container.id = 'cart-items';
  return container;
};

const renderManualGuideBlock = () => {
  const toggleButton = document.createElement('button');
  toggleButton.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  toggleButton.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  const sidebar = document.createElement('div');
  sidebar.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  sidebar.innerHTML = `  <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
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
    </div>`;

  toggleButton.onclick = () => {
    overlay.classList.toggle('hidden');
    sidebar.classList.toggle('translate-x-full');
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      sidebar.classList.add('translate-x-full');
    }
  };

  overlay.appendChild(sidebar);
  return { toggleButton, overlay };
};

export const renderProductSelectOptions = (productList) => {
  const productSelectElement = document.getElementById('product-select');
  productSelectElement.innerHTML = '';

  const totalStock = getTotalStock(productList);

  productList.forEach((product) => {
    const option = createProductOption(product);
    productSelectElement.appendChild(option);
  });

  productSelectElement.style.borderColor = totalStock < 50 ? 'orange' : '';
};

const createProductOption = (product) => {
  const option = document.createElement('option');
  option.value = product.id;

  const badge = product.isOnSale ? ' ⚡SALE' : product.isRecommended ? ' 💝추천' : '';

  if (product.quantity === 0) {
    option.textContent = `${product.name} - ${product.price}원 (품절)${badge}`;
    option.disabled = true;
    option.className = 'text-gray-400';
  } else if (product.isOnSale && product.isRecommended) {
    option.textContent = `⚡💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
    option.className = 'text-purple-600 font-bold';
  } else if (product.isOnSale) {
    option.textContent = `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
    option.className = 'text-red-500 font-bold';
  } else if (product.isRecommended) {
    option.textContent = `💝${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
    option.className = 'text-blue-500 font-bold';
  } else {
    option.textContent = `${product.name} - ${product.price}원${badge}`;
  }

  return option;
};

export const renderBonusPoints = ({
  cartElements,
  productList,
  totalItemCount,
  subTotalAfterDiscount,
  isTuesday,
}) => {
  const loyaltyPointsElement = document.getElementById('loyalty-points');
  if (!loyaltyPointsElement) return;

  if (cartElements.length === 0) {
    loyaltyPointsElement.style.display = 'none';
    return;
  }

  const { finalPoints, pointsDetail } = calculateBonusPoints({
    cartElements,
    productList,
    totalItemCount,
    subTotalAfterDiscount,
    isTuesday,
  });

  loyaltyPointsElement.style.display = 'block';

  if (finalPoints > 0) {
    loyaltyPointsElement.innerHTML =
      `<div>적립 포인트: <span class="font-bold">${finalPoints}p</span></div>` +
      `<div class="text-2xs opacity-70 mt-1">${pointsDetail.join(', ')}</div>`;
  } else {
    loyaltyPointsElement.textContent = '적립 포인트: 0p';
  }
};

export const renderNewCartItem = (product, container) => {
  const newItem = document.createElement('div');
  newItem.id = product.id;
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  const nameWithBadge = getProductNameWithBadge(product);
  const priceHTML = getProductPriceHTML(product);

  newItem.innerHTML = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${nameWithBadge}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceHTML}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHTML}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${product.id}">Remove</a>
    </div>
  `;

  container.appendChild(newItem);
  product.quantity -= 1;
};
