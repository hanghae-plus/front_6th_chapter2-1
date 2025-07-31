// ==========================================
// UI 컴포넌트 함수들 (Template Literal 방식)
// ==========================================

// ==========================================
// 유틸리티 컴포넌트들
// ==========================================

function Button({ text, className, id, onclick = '', type = 'button' }) {
  return `
    <button 
      id="${id}" 
      type="${type}"
      class="${className}" 
      ${onclick ? `onclick="${onclick}"` : ''}
    >
      ${text}
    </button>
  `;
}

function Select({ id, className, options }) {
  return `
    <select id="${id}" class="${className}">
      ${options.map((option) => option).join('')}
    </select>
  `;
}

// ==========================================
// 상품 관련 컴포넌트들
// ==========================================

function ProductOption(product) {
  const isDisabled = product.quantity === 0;
  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  if (isDisabled) {
    return `
      <option value="${product.id}" disabled class="text-gray-400">
        ${product.name} - ${product.price}원 (품절)
      </option>
    `;
  }

  if (product.onSale || product.suggestSale) {
    const discountText =
      product.onSale && product.suggestSale
        ? '25% SUPER SALE!'
        : product.onSale
          ? '20% SALE!'
          : '5% 추천할인!';
    const textColor =
      product.onSale && product.suggestSale
        ? 'text-purple-600 font-bold'
        : product.onSale
          ? 'text-red-500 font-bold'
          : 'text-blue-500 font-bold';

    return `
      <option value="${product.id}" class="${textColor}">
        ${saleIcon}${product.name} - ${product.originalPrice}원 → ${product.price}원 (${discountText})
      </option>
    `;
  }

  return `
    <option value="${product.id}">
      ${product.name} - ${product.price}원
    </option>
  `;
}

function ProductSelector(productList) {
  return `
    <div class="mb-6 pb-6 border-b border-gray-200">
      ${Select({
        id: 'product-select',
        className:
          'w-full p-3 border border-gray-300 rounded-lg text-base mb-3',
        options: productList.map((product) => ProductOption(product)),
      })}
      ${Button({
        id: 'add-to-cart',
        text: 'Add to Cart',
        className:
          'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all',
      })}
      <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line"></div>
    </div>
  `;
}

// ==========================================
// 장바구니 관련 컴포넌트들
// ==========================================

function ProductImage() {
  return `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
  `;
}

function formatPrice(product) {
  if (product.onSale || product.suggestSale) {
    const colorClass =
      product.onSale && product.suggestSale
        ? 'text-purple-600'
        : product.onSale
          ? 'text-red-500'
          : 'text-blue-500';

    return `
      <span class="line-through text-gray-400">₩${product.originalPrice.toLocaleString()}</span> 
      <span class="${colorClass}">₩${product.price.toLocaleString()}</span>
    `;
  }
  return `₩${product.price.toLocaleString()}`;
}

function QuantityControls(product) {
  return `
    <div class="flex items-center gap-4">
      <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="-1">−</button>
      <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">1</span>
      <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${product.id}" data-change="1">+</button>
    </div>
  `;
}

function CartItem(product) {
  const saleIcon =
    product.onSale && product.suggestSale
      ? '⚡💝'
      : product.onSale
        ? '⚡'
        : product.suggestSale
          ? '💝'
          : '';

  return `
    <div id="${product.id}" class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      ${ProductImage()}
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">${saleIcon}${product.name}</h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">${formatPrice(product)}</p>
        ${QuantityControls(product)}
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">${formatPrice(product)}</div>
        <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" 
           data-product-id="${product.id}">Remove</a>
      </div>
    </div>
  `;
}

// ==========================================
// 레이아웃 컴포넌트들
// ==========================================

function Header() {
  return `
    <div class="mb-8">
      <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
      <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
    </div>
  `;
}

function LeftPanel(productList, cartItems = []) {
  return `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      ${ProductSelector(productList)}
      <div id="cart-items">
        ${cartItems.map((item) => CartItem(item)).join('')}
      </div>
    </div>
  `;
}

function OrderSummary() {
  return `
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
      ${Button({
        className:
          'w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30',
        text: 'Proceed to Checkout',
      })}
      <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.<br>
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  `;
}

function HelpModal() {
  return `
    <button id="manual-toggle" class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </button>
    
    <div id="manual-overlay" class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300">
      <div id="manual-panel" class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
        <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="toggleHelp()">
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
      </div>
    </div>
  `;
}

function MainLayout(productList, cartItems = []) {
  return `
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      ${LeftPanel(productList, cartItems)}
      ${OrderSummary()}
    </div>
  `;
}

// ==========================================
// 최상위 앱 컴포넌트
// ==========================================

function App(productList, cartItems = []) {
  return `
    <div id="app">
      ${Header()}
      ${MainLayout(productList, cartItems)}
      ${HelpModal()}
    </div>
  `;
}

// ==========================================
// 렌더링 함수들
// ==========================================

function renderApp(productList, cartItems = []) {
  document.body.innerHTML = App(productList, cartItems);
}

function updateCartDisplay(cartItems) {
  const cartContainer = document.getElementById('cart-items');
  if (cartContainer) {
    cartContainer.innerHTML = cartItems.map((item) => CartItem(item)).join('');
  }
}

function updateProductSelect(productList) {
  const selectElement = document.getElementById('product-select');
  if (selectElement) {
    selectElement.innerHTML = productList
      .map((product) => ProductOption(product))
      .join('');
  }
}

// ==========================================
// 내보내기
// ==========================================

export {
  App,
  renderApp,
  updateCartDisplay,
  updateProductSelect,
  Button,
  CartItem,
  ProductSelector,
  Header,
  MainLayout,
  OrderSummary,
  HelpModal,
};
