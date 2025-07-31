import { ManualColumn } from './ManualColumn.js';

/**
 * ManualOverlay 컴포넌트
 * 매뉴얼 오버레이를 렌더링합니다.
 * @returns {string} 매뉴얼 오버레이 HTML
 */
export function ManualOverlay() {
  return /* HTML */ `
    <div
      id="manual-overlay"
      class="fixed inset-0 bg-black/50 z-40 hidden transition-opacity duration-300"
    >
      ${ManualColumn()}
    </div>
  `;
}
