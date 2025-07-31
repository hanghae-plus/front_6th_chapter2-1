/**
 * 주문 요약 컴포넌트
 * 오른쪽 컬럼의 주문 요약 섹션을 생성합니다.
 */
export function createRightColumn() {
  const rightColumn = document.createElement('div');
  rightColumn.className = 'bg-black text-white p-8 flex flex-col';
  rightColumn.innerHTML =
    createOrderSummaryHeader() +
    createOrderSummaryDetails() +
    createCheckoutButton() +
    createPointsNotice();
  return rightColumn;
}

/**
 * 주문 요약 헤더 컴포넌트
 */
function createOrderSummaryHeader() {
  return `
    <h2 class="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
  `;
}

/**
 * 주문 요약 상세 영역 컴포넌트
 */
function createOrderSummaryDetails() {
  return `
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
  `;
}

/**
 * 체크아웃 버튼 컴포넌트
 */
function createCheckoutButton() {
  return `
    <button class="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
      Proceed to Checkout
    </button>
  `;
}

/**
 * 포인트 안내 컴포넌트
 */
function createPointsNotice() {
  return `
    <p class="mt-4 text-2xs text-white/60 text-center leading-relaxed">
      Free shipping on all orders.<br>
      <span id="points-notice">Earn loyalty points with purchase.</span>
    </p>
  `;
}
