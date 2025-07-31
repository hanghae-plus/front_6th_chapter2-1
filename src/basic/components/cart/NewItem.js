import { getProductDiscountIcon, getProductDiscountStyle } from '../../utils/product.js';

/**
 * NewItem 컴포넌트
 * 장바구니에 추가된 개별 상품 아이템을 렌더링합니다.
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.item - 상품 정보 객체
 * @param {string} props.item.id - 상품 ID
 * @param {string} props.item.name - 상품명
 * @param {number} props.item.val - 현재 가격
 * @param {number} props.item.originalVal - 원래 가격
 * @param {boolean} props.item.onSale - 번개세일 여부
 * @param {boolean} props.item.suggestSale - 추천할인 여부
 * @returns {string} 장바구니 아이템 HTML
 */
export function NewItem({ item }) {
  const { id, name, val, originalVal, onSale, suggestSale } = item;

  return /* HTML */ `
    <div
      id="${id}"
      class="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div
          class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"
        ></div>
      </div>
      <div>
        <h3 class="text-base font-normal mb-1 tracking-tight">
          ${getProductDiscountIcon({ onSale, suggestSale })}${name}
        </h3>
        <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p class="text-xs text-black mb-3">
          ${renderPrice({ onSale, suggestSale, originalVal, val })}
        </p>
        <div class="flex items-center gap-4">
          <button
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="${id}"
            data-change="-1"
          >
            -
          </button>
          <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums"
            >1</span
          >
          <button
            class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id="${id}"
            data-change="1"
          >
            +
          </button>
        </div>
      </div>
      <div class="text-right">
        <div class="text-lg mb-2 tracking-tight tabular-nums">
          ${renderPrice({ onSale, suggestSale, originalVal, val })}
        </div>
        <a
          class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id="${id}"
          >Remove</a
        >
      </div>
    </div>
  `;
}

/**
 * 가격 표시를 렌더링합니다.
 * 할인이 적용된 경우 원래 가격과 할인된 가격을 모두 표시합니다.
 * @returns {string} 가격 표시 HTML
 */
function renderPrice({ onSale, suggestSale, originalVal, val }) {
  if (onSale || suggestSale) {
    return `
        <span class="line-through text-gray-400">₩${originalVal}</span>
        <span class="${getProductDiscountStyle({ onSale, suggestSale })}">₩${val}</span>
      `;
  }
  return `₩${val}`;
}
