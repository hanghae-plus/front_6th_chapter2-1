import { getProductById } from '../../services/productService';
import { formatCurrency } from '../../utils';

// 개별 장바구니 아이템 컴포넌트
export const CartItem = (cartItemData, onQuantityChange, onRemove) => {
  const itemToAdd = getProductById(cartItemData.id); // 상품 정보 가져오기
  if (!itemToAdd) return null; // 상품 없으면 null 반환

  const newItem = document.createElement('div');
  newItem.id = itemToAdd.id; // HTML ID 설정
  newItem.className =
    'grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0';

  // 판매 라벨 (번개세일, 추천할인) 설정
  const saleLabel =
    itemToAdd.onSale && itemToAdd.suggestSale
      ? '⚡💝'
      : itemToAdd.onSale
        ? '⚡'
        : itemToAdd.suggestSale
          ? '💝'
          : '';

  // 가격 표시 (할인 적용 여부에 따라 다르게 표시)
  const priceHTML =
    itemToAdd.onSale || itemToAdd.suggestSale
      ? `<span class="line-through text-gray-400">${formatCurrency(itemToAdd.originalVal)}</span>
         <span class="${
           itemToAdd.onSale && itemToAdd.suggestSale
             ? 'text-purple-600'
             : itemToAdd.onSale
               ? 'text-red-500'
               : 'text-blue-500'
         }">${formatCurrency(itemToAdd.val)}</span>`
      : formatCurrency(itemToAdd.val);

  newItem.innerHTML = `
    <div class="w-20 h-20 bg-gradient-black relative overflow-hidden">
      <div class="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
    </div>
    <div>
      <h3 class="text-base font-normal mb-1 tracking-tight">${saleLabel}${itemToAdd.name}</h3>
      <p class="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
      <p class="text-xs text-black mb-3">${priceHTML}</p>
      <div class="flex items-center gap-4">
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="-1">−</button>
        <span class="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">${cartItemData.quantity}</span>
        <button class="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white" data-product-id="${itemToAdd.id}" data-change="1">+</button>
      </div>
    </div>
    <div class="text-right">
      <div class="text-lg mb-2 tracking-tight tabular-nums">${priceHTML}</div>
      <a class="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black" data-product-id="${itemToAdd.id}">Remove</a>
    </div>
  `;

  // 수량 변경 버튼 이벤트 리스너 추가
  newItem.querySelectorAll('.quantity-change').forEach((button) => {
    button.addEventListener('click', () => {
      onQuantityChange(itemToAdd.id, parseInt(button.dataset.change));
    });
  });

  // 제거 버튼 이벤트 리스너 추가
  newItem.querySelector('.remove-item').addEventListener('click', () => {
    onRemove(itemToAdd.id);
  });

  return newItem;
};
