// ==================== DOM 구조 생성 ====================

// 헤더 요소 생성
function createHeader() {
  const header = document.createElement('div');
  header.className = 'mb-8';
  header.innerHTML = `
    <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
    <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
    <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
  `;
  return header;
}

// 상품 선택 패널 생성
function createProductPanel() {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  // 상품 선택 드롭다운
  const productSelect = document.createElement('select');
  productSelect.id = 'product-select';
  productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  // 추가 버튼
  const addButton = document.createElement('button');
  addButton.id = 'add-to-cart';
  addButton.innerHTML = 'Add to Cart';
  addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';

  // 재고 정보 표시 영역
  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  selectorContainer.appendChild(productSelect);
  selectorContainer.appendChild(addButton);
  selectorContainer.appendChild(stockInfo);

  return selectorContainer;
}

// 장바구니 표시 영역 생성
function createCartDisplay() {
  const cartContainer = document.createElement('div');
  cartContainer.id = 'cart-items';
  return cartContainer;
}

// 주문 요약 패널 생성
function createOrderSummary() {
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
  return rightColumn;
}

// DOM 요소 참조 설정
function setupElementReferences(appState) {
  appState.elements.stockInfo = document.getElementById('stock-status');
  appState.elements.productSelect = document.getElementById('product-select');
  appState.elements.addButton = document.getElementById('add-to-cart');
  appState.elements.cartDisplay = document.getElementById('cart-items');
  appState.elements.totalDisplay = document.getElementById('cart-total');
}

// 헬프 매뉴얼 토글 버튼 생성
function createHelpToggle() {
  const manualToggle = document.createElement('button');
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  return manualToggle;
}

// 헬프 매뉴얼 오버레이 생성
function createHelpOverlay() {
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

  manualOverlay.appendChild(manualColumn);
  return { overlay: manualOverlay, column: manualColumn };
}

// 전체 DOM 구조 생성
export function createDOMStructure(appState) {
  const root = document.getElementById('app');

  // 헤더 생성
  const header = createHeader();

  // 메인 그리드 컨테이너 - 기존 레이아웃 유지
  const mainGrid = document.createElement('div');
  mainGrid.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  // 좌측 컬럼 (상품 선택 + 장바구니) - 기존 스타일 유지
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  const productPanel = createProductPanel();
  const cartDisplay = createCartDisplay();

  leftColumn.appendChild(productPanel);
  leftColumn.appendChild(cartDisplay);

  // 우측 컬럼 (주문 요약) - 기존 스타일 유지
  const rightColumn = createOrderSummary();

  // 헬프 매뉴얼 요소들
  const helpToggle = createHelpToggle();
  const { overlay: helpOverlay, column: helpColumn } = createHelpOverlay();

  // 이벤트 핸들러 설정
  helpToggle.onclick = function () {
    helpOverlay.classList.toggle('hidden');
    helpColumn.classList.toggle('translate-x-full');
  };

  helpOverlay.onclick = function (e) {
    if (e.target === helpOverlay) {
      helpOverlay.classList.add('hidden');
      helpColumn.classList.add('translate-x-full');
    }
  };

  const closeButton = helpColumn.querySelector('button');
  closeButton.onclick = function () {
    helpOverlay.classList.add('hidden');
    helpColumn.classList.add('translate-x-full');
  };

  // 그리드에 컬럼들 추가
  mainGrid.appendChild(leftColumn);
  mainGrid.appendChild(rightColumn);

  // 루트에 모든 요소 추가
  root.appendChild(header);
  root.appendChild(mainGrid);
  root.appendChild(helpToggle);
  root.appendChild(helpOverlay);

  // DOM 요소 참조 설정
  setupElementReferences(appState);
}
