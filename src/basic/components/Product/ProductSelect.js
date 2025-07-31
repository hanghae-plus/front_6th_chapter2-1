import { getProducts } from '../../services/productService';

export const ProductSelect = (onChange) => {
  const sel = document.createElement('select');
  sel.id = 'product-select';
  sel.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  sel.addEventListener('change', (e) => {
    onChange(e.target.value);
  });

  const updateOptions = () => {
    const currentValue = sel.value;

    sel.innerHTML = '';
    const products = getProducts();
    let totalStock = 0;

    products.forEach((item) => {
      totalStock += item.q;
      const opt = document.createElement('option');
      opt.value = item.id;

      // 가격을 단순 숫자+원으로 표기
      const priceText = `${item.val}원`;
      const originalPriceText = `${item.originalVal}원`;

      if (item.q === 0) {
        opt.textContent = `${item.name} - ${priceText} (품절)`;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent = `⚡💝${item.name} - ${originalPriceText} → ${priceText} (25% SUPER SALE!)`;
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = `⚡${item.name} - ${originalPriceText} → ${priceText} (20% SALE!)`;
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = `💝${item.name} - ${originalPriceText} → ${priceText} (5% 추천할인!)`;
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = `${item.name} - ${priceText}`;
        }
      }
      sel.appendChild(opt);
    });
    // 💡 옵션들을 모두 추가한 후, 이전에 저장했던 값을 다시 설정

    if (
      currentValue &&
      Array.from(sel.options).some((opt) => opt.value === currentValue && !opt.disabled)
    ) {
      sel.value = currentValue;
    } else if (sel.options.length > 0) {
      // 저장된 값이 없거나 유효하지 않으면, 첫 번째 유효한 (disabled가 아닌) 옵션을 선택
      const firstValidOption = Array.from(sel.options).find((opt) => !opt.disabled);
      if (firstValidOption) {
        sel.value = firstValidOption.value;
      }
    }
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
