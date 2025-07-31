// 매뉴얼 토글 버튼 클릭 이벤트
export const handleManualToggle = () => {
  const manualOverlay = document.getElementById('manual-overlay');
  const manualPanel = document.getElementById('manual-panel');
  
  if (manualOverlay && manualPanel) {
    manualOverlay.classList.toggle('hidden');
    manualPanel.classList.toggle('translate-x-full');
  }
};

// 매뉴얼 오버레이 클릭 이벤트 (배경 클릭 시 닫기)
export const handleManualOverlayClick = (event) => {
  const manualOverlay = document.getElementById('manual-overlay');
  
  if (event.target === manualOverlay) {
    closeManual();
  }
};

// 매뉴얼 닫기 버튼 클릭 이벤트
export const handleManualCloseClick = (event) => {
  if (event.target.id === 'close-manual') {
    closeManual();
  }
};

// 매뉴얼 닫기 함수
const closeManual = () => {
  const manualOverlay = document.getElementById('manual-overlay');
  const manualPanel = document.getElementById('manual-panel');
  
  if (manualOverlay && manualPanel) {
    manualOverlay.classList.add('hidden');
    manualPanel.classList.add('translate-x-full');
  }
};

// 매뉴얼 이벤트 리스너 설정
export const setupManualEventListeners = () => {
  // 매뉴얼 토글 버튼 이벤트
  const manualToggleButton = document.querySelector('[data-manual-toggle]');
  if (manualToggleButton) {
    manualToggleButton.addEventListener('click', handleManualToggle);
  }

  // 매뉴얼 오버레이 클릭 이벤트
  const manualOverlay = document.getElementById('manual-overlay');
  if (manualOverlay) {
    manualOverlay.addEventListener('click', handleManualOverlayClick);
  }

  // 매뉴얼 패널 내부 클릭 이벤트 (닫기 버튼)
  const manualPanel = document.getElementById('manual-panel');
  if (manualPanel) {
    manualPanel.addEventListener('click', handleManualCloseClick);
  }
}; 