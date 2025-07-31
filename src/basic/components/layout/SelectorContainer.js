import { AddToCartButton } from '../cart/AddToCartButton.js';
import { ProductSelector } from '../product/ProductSelector.js';
import { StockInfo } from '../product/StockInfo.js';

/**
 * SelectorContainer 컴포넌트
 * 상품 선택과 관련된 컨트롤들을 포함하는 컨테이너를 렌더링합니다.
 * @returns {string} 셀렉터 컨테이너 HTML
 */
export function SelectorContainer() {
  return /* HTML */ `
    <div class="mb-6 pb-6 border-b border-gray-200">
      ${ProductSelector()} ${AddToCartButton()} ${StockInfo()}
    </div>
  `;
}
