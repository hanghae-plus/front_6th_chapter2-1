import { TOTAL_STOCK_WARNING } from '../../data/policy';

/** 상품 옵션 텍스트 생성
 * @param {Object} product - 상품 정보
 */
const createOptionText = (product) => {
  const isOutOfStock = product.stock === 0;
  const badges = [];

  if (product.isOnSale) badges.push('⚡SALE');
  if (product.isRecommended) badges.push('💝추천');
  const badgeText = badges.length > 0 ? ` ${badges.join(' ')}` : '';

  // 품절 상품
  if (isOutOfStock) {
    return `${product.name} - ${product.price}원 (품절)${badgeText}`;
  }

  // 할인 상품들
  if (product.isOnSale && product.isRecommended) {
    return `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (25% SUPER SALE!)`;
  }
  if (product.isOnSale) {
    return `⚡${product.name} - ${product.originalPrice}원 → ${product.price}원 (20% SALE!)`;
  }
  if (product.isRecommended) {
    return `${product.name} - ${product.originalPrice}원 → ${product.price}원 (5% 추천할인!)`;
  }

  // 일반 상품
  return `${product.name} - ${product.price}원${badgeText}`;
};

/** 상품 상태에 따른 스타일 적용
 * @param {Object} product - 상품 정보
 * @returns {string} 상품 스타일
 */
const getProductStyle = (product) => {
  if (product.stock === 0) return 'text-gray-400';
  if (product.isOnSale && product.isRecommended) return 'text-purple-600 font-bold';
  if (product.isOnSale) return 'text-red-500 font-bold';
  if (product.isRecommended) return 'text-blue-500 font-bold';
  return '';
};

export const createProductSelector = () => {
  const productSelector = document.createElement('select');
  productSelector.id = 'product-select';
  productSelector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';
  return productSelector;
};

/** 상품 옵션 업데이트
 * @param {Element} productSelector - 상품 선택기 요소
 * @param {Array} productList - 상품 목록
 */
export const updateProductOptions = (productSelector, productList) => {
  // 상품 선택기 또는 상품 목록이 없으면 종료
  if (!productSelector || !productList?.length) return;

  productSelector.innerHTML = '';

  // 총 재고 계산
  const totalStock = productList.reduce((total, product) => total + product.stock, 0);

  // 상품 옵션 생성
  productList.forEach((product) => {
    const option = document.createElement('option');
    option.value = product.productId;
    option.textContent = createOptionText(product);

    // 스타일 및 상태 적용
    const style = getProductStyle(product);
    if (style) option.className = style;
    if (product.stock === 0) option.disabled = true;

    productSelector.appendChild(option);
  });

  // 재고 부족 시 테두리 색상 변경
  productSelector.style.borderColor = totalStock < TOTAL_STOCK_WARNING ? 'orange' : '';
};
