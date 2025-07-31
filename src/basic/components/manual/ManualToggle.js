/**
 * ManualToggle 컴포넌트
 * 매뉴얼 오버레이를 토글하는 버튼을 렌더링합니다.
 * @returns {string} 매뉴얼 토글 버튼 HTML
 */
export function ManualToggle() {
  return /* HTML */ `
    <button
      id="manual-toggle"
      class="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </button>
  `;
}
