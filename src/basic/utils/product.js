// ================================================
// 상품 관련 유틸리티
// ================================================

/**
 * 상품 ID로 상품 찾기
 * @param {Array} products - 상품 목록
 * @param {string} productId - 상품 ID
 * @returns {Object|null} 상품 정보
 */
export function findProductById(products, productId) {
  return products.find((product) => product.id === productId) || null;
}

/**
 * 상품이 할인 중인지 확인
 * @param {Object} product - 상품 정보
 * @returns {boolean} 할인 중 여부
 */
export function isProductOnSale(product) {
  return product.onSale || product.suggestSale;
}

/**
 * 상품 할인 정보 가져오기
 * @param {Object} product - 상품 정보
 * @returns {Object} 할인 정보
 */
export function getProductDiscountInfo(product) {
  const discountInfo = {
    isOnSale: false,
    isSuggestSale: false,
    originalPrice: product.val,
    currentPrice: product.val,
    discountRate: 0,
  };

  if (product.onSale && product.suggestSale) {
    discountInfo.isOnSale = true;
    discountInfo.isSuggestSale = true;
    discountInfo.originalPrice = product.originalVal;
    discountInfo.currentPrice = product.val;
    discountInfo.discountRate = 25; // SUPER SALE
  } else if (product.onSale) {
    discountInfo.isOnSale = true;
    discountInfo.originalPrice = product.originalVal;
    discountInfo.currentPrice = product.val;
    discountInfo.discountRate = 20;
  } else if (product.suggestSale) {
    discountInfo.isSuggestSale = true;
    discountInfo.originalPrice = product.originalVal;
    discountInfo.currentPrice = product.val;
    discountInfo.discountRate = 5;
  }

  return discountInfo;
}

/**
 * 상품 할인 아이콘 가져오기
 * @param {Object} product - 상품 정보
 * @returns {string} 할인 아이콘
 */
export function getProductDiscountIcon(product) {
  if (product.onSale && product.suggestSale) {
    return '⚡💝';
  }
  if (product.onSale) {
    return '⚡';
  }
  if (product.suggestSale) {
    return '💝';
  }
  return '';
}

/**
 * 상품 할인 스타일 클래스 가져오기
 * @param {Object} product - 상품 정보
 * @returns {string} CSS 클래스
 */
export function getProductDiscountStyle(product) {
  if (product.onSale && product.suggestSale) {
    return 'text-purple-600';
  }
  if (product.onSale) {
    return 'text-red-500';
  }
  if (product.suggestSale) {
    return 'text-blue-500';
  }
  return '';
}

/**
 * 상품 가격 표시 텍스트 생성
 * @param {Object} product - 상품 정보
 * @param {boolean} useLocaleString - 천 단위 구분자 사용 여부
 * @returns {string} 가격 표시 텍스트
 */
export function formatProductPrice(product, useLocaleString = false) {
  const discountInfo = getProductDiscountInfo(product);

  if (discountInfo.isOnSale || discountInfo.isSuggestSale) {
    const originalPrice = useLocaleString
      ? discountInfo.originalPrice.toLocaleString()
      : discountInfo.originalPrice;
    const currentPrice = useLocaleString
      ? discountInfo.currentPrice.toLocaleString()
      : discountInfo.currentPrice;
    return `${originalPrice}원 → ${currentPrice}원`;
  }

  const price = useLocaleString ? product.val.toLocaleString() : product.val;
  return `${price}원`;
}

/**
 * 상품 표시 이름 생성
 * @param {Object} product - 상품 정보
 * @returns {string} 상품 표시 이름
 */
export function getProductDisplayName(product) {
  const icon = getProductDiscountIcon(product);
  return `${icon}${product.name}`;
}
