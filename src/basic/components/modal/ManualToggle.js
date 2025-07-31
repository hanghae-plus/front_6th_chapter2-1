/**
 * 이용 안내 토글 버튼 컴포넌트
 * 모달을 열고 닫는 토글 버튼을 생성합니다.
 */
export function createManualToggle() {
  const manualToggle = document.createElement('button');
  manualToggle.onclick = function () {
    const manualOverlay = document.querySelector('.manual-overlay');
    const manualColumn = document.querySelector('.manual-column');
    if (manualOverlay && manualColumn) {
      manualOverlay.classList.toggle('hidden');
      manualColumn.classList.toggle('translate-x-full');
    }
  };
  manualToggle.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  manualToggle.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;
  return manualToggle;
}
