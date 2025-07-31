// 날짜/시간 유틸리티
export function isTuesday() {
  return new Date().getDay() === 2;
}

// 포맷팅 유틸리티
export function formatPrice(amount) {
  return `₩${Math.round(amount).toLocaleString()}`;
}

// DOM 유틸리티
export function getQuantityFromElement(element) {
  return parseInt(element.textContent) || 0;
}

// 수학/계산 유틸리티
export function safeParseInt(value, defaultValue = 0) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// 배열/객체 유틸리티
export function findById(list, id) {
  return list.find((item) => item.id === id);
}
