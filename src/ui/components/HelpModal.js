export function createHelpModal() {
  const overlay = document.createElement("div");
  overlay.className =
    "fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300";

  const panel = document.createElement("div");
  panel.className =
    "fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform translate-x-full transition-transform duration-300";

  panel.innerHTML = `
    <button class="absolute top-4 right-4 text-gray-500 hover:text-black close-modal">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    <h2 class="text-xl font-bold mb-4">📖 이용 안내</h2>
    <!-- 본문은 기존 manualColumn.innerHTML 참고하여 필요 시 채움 -->
  `;

  overlay.appendChild(panel);
  // 닫기 핸들러
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.classList.contains("close-modal")) {
      overlay.classList.add("hidden");
      panel.classList.add("translate-x-full");
    }
  });

  return { overlay, panel };
}
