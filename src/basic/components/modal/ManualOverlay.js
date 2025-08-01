/**
 * 이용 안내 오버레이 컴포넌트
 * 모달의 배경 오버레이를 생성합니다.
 */
export function createManualOverlay() {
  const manualOverlay = document.createElement('div');
  manualOverlay.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300 manual-overlay';
  manualOverlay.onclick = function (e) {
    if (e.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      const manualColumn = document.querySelector('.manual-column');
      if (manualColumn) {
        manualColumn.classList.add('translate-x-full');
      }
    }
  };
  return manualOverlay;
}
