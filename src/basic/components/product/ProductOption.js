/**
 * ProductOption 컴포넌트
 * 상품 선택 드롭다운의 개별 옵션을 렌더링합니다.
 * @param {Object} props - 컴포넌트 props
 * @param {Object} props.item - 상품 정보 객체
 * @param {string} props.item.id - 상품 ID
 * @param {string} props.item.name - 상품명
 * @param {number} props.item.val - 가격
 * @param {number} props.item.quantity - 재고 수량
 * @param {boolean} props.item.onSale - 번개세일 여부
 * @param {boolean} props.item.suggestSale - 추천할인 여부
 * @returns {string} 상품 옵션 HTML
 */
export function ProductOption({ item }) {
  const { id, name, val, quantity, onSale, suggestSale } = item;

  // 할인 상태 계산
  const discountStates = [];
  if (onSale) discountStates.push('⚡SALE');
  if (suggestSale) discountStates.push('💝SUGGEST');

  const stockText = quantity === 0 ? '품절' : `${quantity}개`;
  const discountDisplay = discountStates.length > 0 ? ` (${discountStates.join(', ')})` : '';

  return /* HTML */ `
    <option value="${id}" ${quantity === 0 ? 'disabled' : ''}>
      ${name}${discountDisplay} - ${val}원 - ${stockText}
    </option>
  `;
}
