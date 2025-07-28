// 상품 검색 유틸리티 함수들
export function findProductById(products, productId) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === productId) {
      return products[i];
    }
  }
  return null;
}

export function findAvailableProductExcept(products, excludeId) {
  for (var i = 0; i < products.length; i++) {
    var product = products[i];
    if (product.id !== excludeId && product.q > 0 && !product.suggestSale) {
      return product;
    }
  }
  return null;
}

export function calculateTotalStock(products) {
  var total = 0;
  for (var i = 0; i < products.length; i++) {
    total += products[i].q;
  }
  return total;
}

// 날짜 유틸리티
export function isTuesday(date = new Date()) {
  return date.getDay() === 2;
}

// 포맷터 함수들
export function formatCurrency(amount) {
  return '₩' + Math.round(amount).toLocaleString();
}

export function formatPoints(points) {
  return points + 'p';
}

// 할인율 계산
export function calculateDiscountRate(originalAmount, discountedAmount) {
  if (originalAmount === 0) return 0;
  return (originalAmount - discountedAmount) / originalAmount;
}