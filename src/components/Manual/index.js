import { createManualColumn } from './ManualColumn.js';

export function createManual() {
  const container = document.createElement('div');
  container.className =
    'fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300';
  const column = createManualColumn();
  container.appendChild(column);

  // Manual에 setupEventListeners 메서드 추가
  container.setupEventListeners = function () {
    container.addEventListener('click', function (e) {
      if (e.target === container) {
        container.classList.add('hidden');
        container.querySelector('.transform').classList.add('translate-x-full');
      }
    });

    const closeButton = container.querySelector('#manual-close-button');
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        container.classList.add('hidden');
        container.querySelector('.transform').classList.add('translate-x-full');
      });
    }
  };

  return container;
}
