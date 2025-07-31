/**
 * 상품 선택 옵션 업데이트
 * 상품 목록을 기반으로 선택 옵션을 동적으로 생성
 */
export function updateProductOptions({ sel, prodList }) {
  sel.innerHTML = '';

  // 상품별 옵션 생성
  prodList.forEach(product => {
    const option = document.createElement('option');
    option.value = product.id;

    let priceDisplay = `${product.name} - ${product.val}원`;

    if (product.onSale || product.suggestSale) {
      priceDisplay = `${product.name} - ${product.val}원 (할인가)`;
    }

    option.textContent = priceDisplay;

    // 품절 상품은 비활성화
    if (product.q <= 0) {
      option.disabled = true;
      option.textContent += ' (품절)';
    }

    sel.appendChild(option);
  });
}
