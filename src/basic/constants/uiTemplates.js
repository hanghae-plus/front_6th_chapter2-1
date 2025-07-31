/**
 * UI 템플릿 상수들
 * 원본 main.original.js의 레이아웃과 스타일을 100% 유지
 */

/**
 * 헤더 템플릿 - 원본과 동일
 */
export const HEADER_IMPROVED_TEMPLATE = `
  <h1 class="text-xs font-medium tracking-extra-wide uppercase mb-2">🛒 Hanghae Online Store</h1>
  <div class="text-5xl tracking-tight leading-none">Shopping Cart</div>
  <p id="item-count" class="text-sm text-gray-500 font-normal mt-3">🛍️ 0 items in cart</p>
`;

/**
 * 헤더 컨테이너 템플릿
 */
export const HEADER_CONTAINER_TEMPLATE = `
  <div class="mb-8">
    {{headerContent}}
  </div>
`;

/**
 * 상품 선택기 템플릿 - 원본과 동일
 */
export const PRODUCT_SELECTOR_IMPROVED_TEMPLATE = `
  <select id="product-select" class="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
    <!-- 옵션들은 동적으로 생성됨 -->
  </select>
`;

/**
 * 장바구니 추가 버튼 템플릿 - 원본과 동일
 */
export const ADD_TO_CART_BUTTON_IMPROVED_TEMPLATE = `
  <button id="add-to-cart" class="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all">
    Add to Cart
  </button>
`;

/**
 * 재고 정보 템플릿 - 원본과 동일
 */
export const STOCK_INFO_IMPROVED_TEMPLATE = `
  <div id="stock-status" class="text-xs text-red-500 mt-3 whitespace-pre-line">
    <!-- 재고 정보는 동적으로 업데이트됨 -->
  </div>
`;

/**
 * 장바구니 표시 영역 템플릿 - 원본과 동일
 */
export const CART_DISPLAY_IMPROVED_TEMPLATE = `
  <div id="cart-items" class="cart-items">
    <!-- 장바구니 아이템들은 동적으로 추가됨 -->
  </div>
`;

/**
 * 선택기 컨테이너 템플릿 - 원본과 동일
 */
export const SELECTOR_CONTAINER_IMPROVED_TEMPLATE = `
  <div class="mb-6 pb-6 border-b border-gray-200">
    <!-- 상품 선택기, 추가 버튼, 재고 정보가 동적으로 추가됨 -->
  </div>
`;

/**
 * 왼쪽 컬럼 템플릿 - 원본과 동일
 */
export const LEFT_COLUMN_IMPROVED_TEMPLATE = `
  <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
    <!-- 선택기 컨테이너와 장바구니 표시가 동적으로 추가됨 -->
  </div>
`;

/**
 * 오른쪽 컬럼 템플릿 - 원본과 동일
 */
export const RIGHT_COLUMN_IMPROVED_TEMPLATE = `
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

/**
 * 그리드 컨테이너 템플릿 - 원본과 동일
 */
export const GRID_CONTAINER_IMPROVED_TEMPLATE = `
  <div class="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
    <!-- 왼쪽/오른쪽 컬럼이 동적으로 추가됨 -->
  </div>
`;

/**
 * 도움말 토글 버튼 템플릿 - 원본과 동일
 */
export const HELP_TOGGLE_BUTTON_IMPROVED_TEMPLATE = `
  <button class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  </button>
`;

/**
 * 도움말 모달 오버레이 템플릿 - 원본과 동일
 */
export const HELP_MODAL_CONTAINER_TEMPLATE = `
  <div class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300">
  </div>
`;

/**
 * 슬라이드 패널 컨테이너 템플릿 - 원본과 동일
 */
export const SLIDE_PANEL_CONTAINER_TEMPLATE = `
  <div class="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300">
    {{panelContent}}
  </div>
`;

/**
 * 슬라이드 패널 템플릿 - 원본과 동일
 */
export const SLIDE_PANEL_IMPROVED_TEMPLATE = `
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

/**
 * 화요일 배너 컨테이너 템플릿
 */
export const TUESDAY_BANNER_CONTAINER_TEMPLATE = `
  <div id="tuesday-special" class="mt-4 p-3 bg-white/10 rounded-lg hidden">
    {{bannerContent}}
  </div>
`;

/**
 * 화요일 특별 할인 배너 템플릿
 */
export const TUESDAY_BANNER_TEMPLATE = `
  <div class="flex items-center gap-2">
    <span class="text-2xs">🎉</span>
    <span class="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
  </div>
`;

/**
 * 상품 옵션 템플릿 (정상 상품)
 */
export const PRODUCT_OPTION_NORMAL_TEMPLATE = `
  <option value="{{productId}}">{{displayText}}</option>
`;

/**
 * 상품 옵션 템플릿 (품절 상품)
 */
export const PRODUCT_OPTION_SOLD_OUT_TEMPLATE = `
  <option value="{{productId}}" disabled class="text-gray-400">{{displayText}}</option>
`;

/**
 * 상품 옵션 템플릿 (재고 부족)
 */
export const PRODUCT_OPTION_LOW_STOCK_TEMPLATE = `
  <option value="{{productId}}">{{displayText}}</option>
`;

/**
 * 재고 경고 옵션 템플릿
 */
export const STOCK_WARNING_OPTION_TEMPLATE = `
  <option disabled>{{warningMessage}}</option>
`;
