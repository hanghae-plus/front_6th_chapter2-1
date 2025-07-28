export const createManualOverlay = () => {
  const manualOverlay = document.createElement('div');
  manualOverlay.className = 'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';

  // 오버레이 배경 눌러도 토글 적용
  //   manualOverlay.onclick = (e) => {
  //     if (e.target === manualOverlay) {
  //       manualOverlay.classList.add('hidden');
  //       manualColumn.classList.add('translate-x-full');
  //     }
  //   };

  return manualOverlay;
};
