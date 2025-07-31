/**
 * 도움말 모달 이벤트 핸들러
 */
export function setupHelpModalHandlers(manualToggle, manualOverlay, manualColumn) {
  // 도움말 버튼 클릭 핸들러
  manualToggle.onclick = function () {
    manualOverlay.classList.toggle('hidden');
    manualColumn.classList.toggle('translate-x-full');
  };

  // 오버레이 클릭 핸들러 (모달 외부 클릭시 닫기)
  manualOverlay.onclick = function (event) {
    if (event.target === manualOverlay) {
      manualOverlay.classList.add('hidden');
      manualColumn.classList.add('translate-x-full');
    }
  };
}