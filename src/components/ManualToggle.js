export function createManualToggle() {
  const container = document.createElement('button');
  container.className =
    'fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50';
  container.innerHTML = `
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
  `;

  // Manual 토글 핸들러 함수
  const toggleManual = function () {
    const manual = document.querySelector('.fixed.inset-0');
    if (manual) {
      manual.classList.toggle('hidden');
      manual.querySelector('.transform').classList.toggle('translate-x-full');
    }
  };

  // ManualToggle에 setupEventListeners 메서드 추가
  container.setupEventListeners = function ({ onToggle } = {}) {
    container.addEventListener('click', function () {
      toggleManual();
      if (onToggle) onToggle();
    });
  };

  return container;
}
