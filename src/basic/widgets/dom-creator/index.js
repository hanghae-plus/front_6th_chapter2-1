/**
 * DOM 요소 생성 위젯
 * 클린 코드 원칙에 따라 모듈화된 DOM 생성 로직
 */

/**
 * 헤더 요소 생성
 * @returns {HTMLElement} 생성된 헤더 요소
 */
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

/**
 * 상품 선택 컨테이너 생성
 * @param {Object} appState - AppState 인스턴스
 * @returns {HTMLElement} 생성된 선택 컨테이너
 */
function createProductSelector(appState) {
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  // 상품 선택 드롭다운
  appState.elements.productSelect = document.createElement('select');
  appState.elements.productSelect.id = 'product-select';
  appState.elements.productSelect.className =
    'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  // 장바구니 추가 버튼
  appState.elements.addButton = document.createElement('button');
  appState.elements.addButton.id = 'add-to-cart';
  appState.elements.addButton.className =
    'w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all';
  appState.elements.addButton.innerHTML = 'Add to Cart';

  // 재고 정보
  appState.elements.stockInfo = document.createElement('div');
  appState.elements.stockInfo.id = 'stock-status';
  appState.elements.stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  selectorContainer.appendChild(appState.elements.productSelect);
  selectorContainer.appendChild(appState.elements.addButton);
  selectorContainer.appendChild(appState.elements.stockInfo);

  return selectorContainer;
}

/**
 * 왼쪽 컬럼 생성
 * @param {Object} appState - AppState 인스턴스
 * @returns {HTMLElement} 생성된 왼쪽 컬럼
 */
function createLeftColumn(appState) {
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  const selectorContainer = createProductSelector(appState);
  leftColumn.appendChild(selectorContainer);

  // 장바구니 표시 영역
  appState.elements.cartDisplay = document.createElement('div');
  appState.elements.cartDisplay.id = 'cart-items';
  leftColumn.appendChild(appState.elements.cartDisplay);

  return leftColumn;
}

/**
 * 오른쪽 컬럼 생성
 * @param {Object} appState - AppState 인스턴스
 * @returns {HTMLElement} 생성된 오른쪽 컬럼
 */
function createRightColumn(appState) {
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

  appState.elements.sum = rightColumn.querySelector('#cart-total');
  return rightColumn;
}

/**
 * 도움말 토글 버튼 생성
 * @returns {HTMLElement} 생성된 토글 버튼
 */
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

/**
 * 도움말 모달 생성
 * @returns {Object} 생성된 모달 요소들
 */
function createHelpModal() {
  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  const manualColumn = document.createElement('div');
  manualColumn.className =
    'fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300';
  manualColumn.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black" onclick="document.querySelector('.fixed.inset-0').classList.add('hidden'); this.parentElement.classList.add('translate-x-full')">
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

  // 이벤트 핸들러 설정
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };

  manualOverlay.appendChild(manualColumn);

  return { manualOverlay, manualColumn };
}

/**
 * 메인 그리드 컨테이너 생성
 * @param {Object} appState - AppState 인스턴스
 * @returns {HTMLElement} 생성된 그리드 컨테이너
 */
function createGridContainer(appState) {
  const gridContainer = document.createElement('div');
  gridContainer.className =
    'grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden';

  const leftColumn = createLeftColumn(appState);
  const rightColumn = createRightColumn(appState);

  gridContainer.appendChild(leftColumn);
  gridContainer.appendChild(rightColumn);

  return gridContainer;
}

/**
 * DOM 요소들을 생성하고 설정
 * @param {Object} appState - AppState 인스턴스
 */
export function createDOMElements(appState) {
  const root = document.getElementById('app');

  // 헤더 생성
  const header = createHeader();

  // 메인 그리드 생성
  const gridContainer = createGridContainer(appState);

  // 도움말 모달 생성
  const helpToggle = createHelpToggle();
  const { manualOverlay } = createHelpModal();

  // 도움말 토글 이벤트 설정
  helpToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    const manualColumn = manualOverlay.querySelector('div');
    manualColumn.classList.toggle('translate-x-full');
  };

  // DOM에 요소들 추가
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(helpToggle);
  root.appendChild(manualOverlay);
}
