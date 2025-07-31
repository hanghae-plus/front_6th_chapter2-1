/**
 * 매뉴얼 오버레이 이벤트 핸들러
 * DOM 기반 이벤트 처리
 */

export function setupManualEvents(ui) {
  const { toggle, overlay, column } = ui.manualOverlay;

  // 토글 버튼 클릭 이벤트
  toggle.addEventListener('click', () => {
    overlay.classList.toggle('hidden');
    column.classList.toggle('translate-x-full');
  });

  // 오버레이 클릭 시 닫기
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
      column.classList.add('translate-x-full');
    }
  });

  // 닫기 버튼 클릭 이벤트
  const closeButton = document.getElementById('manual-close');
  closeButton.addEventListener('click', () => {
    overlay.classList.add('hidden');
    column.classList.add('translate-x-full');
  });
}
