import { SelectorContainer } from './SelectorContainer.js';
import { CartDisplay } from '../cart/CartDisplay.js';

/**
 * LeftColumn 컴포넌트
 * 왼쪽 컬럼의 메인 레이아웃을 렌더링합니다.
 * @returns {string} 왼쪽 컬럼 HTML
 */
export function LeftColumn() {
  return /* HTML */ `
    <div class="bg-white border border-gray-200 p-8 overflow-y-auto">
      ${SelectorContainer()} ${CartDisplay()}
    </div>
  `;
}
