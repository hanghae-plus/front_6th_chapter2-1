import { getProducts } from '../../services/productService';
import { formatCurrency } from '../../utils';

export const ProductSelect = (onChange) => {
  const sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  sel.addEventListener('change', (e) => onChange(e.target.value)); // 드롭다운 값 변경 시 콜백 호출

  const updateOptions = () => {
    sel.innerHTML = ''; // 기존 옵션 비우기
    const products = getProducts(); // 최신 상품 목록 가져오기
    let totalStock = 0;

    products.forEach((item) => {
      totalStock += item.q; // 전체 재고 계산
      const opt = document.createElement('option');
      opt.value = item.id;

      // 품절 상품 처리
      if (item.q === 0) {
        opt.textContent = `${item.name} - ${formatCurrency(item.val)} (품절)`;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        // 할인 적용된 상품에 따라 텍스트 및 스타일 변경
        if (item.onSale && item.suggestSale) {
          opt.textContent = `⚡💝${item.name} - ${formatCurrency(item.originalVal)} → ${formatCurrency(item.val)} (25% SUPER SALE!)`;
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = `⚡${item.name} - ${formatCurrency(item.originalVal)} → ${formatCurrency(item.val)} (20% SALE!)`;
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = `💝${item.name} - ${formatCurrency(item.originalVal)} → ${formatCurrency(item.val)} (5% 추천할인!)`;
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = `${item.name} - ${formatCurrency(item.val)}`;
        }
      }
      sel.appendChild(opt);
    });

    // 전체 재고가 50개 미만이면 드롭다운 테두리 색상 변경
    if (totalStock < 50) {
      sel.style.borderColor = 'orange';
    } else {
      sel.style.borderColor = '';
    }
  };

  updateOptions(); // 초기 옵션 업데이트
  return { element: sel, updateOptions }; // DOM 요소와 업데이트 함수 반환
};
