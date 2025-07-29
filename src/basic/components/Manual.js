/**
 * 매뉴얼 토글 버튼을 생성합니다.
 * @returns {HTMLElement} 매뉴얼 토글 버튼 요소
 */
export function createManualToggle() {
  const manualToggle = document.createElement("button");
  manualToggle.className = "fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50";
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  return manualToggle;
}

/**
 * 매뉴얼 오버레이를 생성합니다.
 * @returns {HTMLElement} 매뉴얼 오버레이 요소
 */
export function createManualOverlay() {
  const manualOverlay = document.createElement("div");
  manualOverlay.className = "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";
  return manualOverlay;
}

/**
 * 매뉴얼 컬럼(내용)을 생성합니다.
 * @returns {HTMLElement} 매뉴얼 컬럼 요소
 */
export function createManualColumn() {
  const manualColumn = document.createElement("div");
  manualColumn.className = "fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300";
  manualColumn.innerHTML = /* HTML */ `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black manual-close-btn">
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
            • 키보드 10개↑: 10%<br />
            • 마우스 10개↑: 15%<br />
            • 모니터암 10개↑: 20%<br />
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
            • 화요일: +10%<br />
            • ⚡번개세일: 20%<br />
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
            • 화요일: 2배<br />
            • 키보드+마우스: +50p<br />
            • 풀세트: +100p<br />
            • 10개↑: +20p / 20개↑: +50p / 30개↑: +100p
          </p>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 pt-4 mt-4">
      <p class="text-xs font-bold mb-1">💡 TIP</p>
      <p class="text-2xs text-gray-600 leading-relaxed">
        • 화요일 대량구매 = MAX 혜택<br />
        • ⚡+💝 중복 가능<br />
        • 상품4 = 품절
      </p>
    </div>
  `;
  return manualColumn;
}

/**
 * 매뉴얼 시스템을 생성하고 이벤트를 설정합니다.
 * @returns {Object} 매뉴얼 컴포넌트들과 이벤트 핸들러
 */
export function createManualSystem() {
  const manualToggle = createManualToggle();
  const manualOverlay = createManualOverlay();
  const manualColumn = createManualColumn();

  // 이벤트 핸들러들
  const openManual = () => {
    manualOverlay.classList.remove("hidden");
    manualColumn.classList.remove("translate-x-full");
  };

  const closeManual = () => {
    manualOverlay.classList.add("hidden");
    manualColumn.classList.add("translate-x-full");
  };

  // 이벤트 리스너 설정
  manualToggle.addEventListener("click", openManual);

  manualOverlay.addEventListener("click", e => {
    if (e.target === manualOverlay) {
      closeManual();
    }
  });

  const closeButton = manualColumn.querySelector(".manual-close-btn");
  closeButton.addEventListener("click", closeManual);

  // 오버레이에 컬럼 추가
  manualOverlay.appendChild(manualColumn);

  return {
    toggle: manualToggle,
    overlay: manualOverlay,
    column: manualColumn,
    open: openManual,
    close: closeManual,
  };
}
