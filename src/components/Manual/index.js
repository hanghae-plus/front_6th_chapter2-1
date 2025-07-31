import { createManualColumn } from './ManualColumn.js';

export function createManual() {
  const container = document.createElement('div');
  container.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  const column = createManualColumn();
  container.appendChild(column);

  // Manual 닫기 핸들러 함수
  const closeManual = function () {
    container.classList.add('hidden');
    container.querySelector('.transform').classList.add('translate-x-full');
  };

  // Manual에 setupEventListeners 메서드 추가
  container.setupEventListeners = function ({ onClose } = {}) {
    container.addEventListener('click', function (e) {
      if (e.target === container) {
        closeManual();
        if (onClose) onClose();
      }
    });

    const closeButton = container.querySelector('#manual-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        closeManual();
        if (onClose) onClose();
      });
    }
  };

  return container;
}
