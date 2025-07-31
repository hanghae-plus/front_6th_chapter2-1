/**
 * 가격 포맷 함수 - 원화 표시
 * @param price - 가격
 */
export const formatPrice = (price) => `₩${price.toLocaleString()}`;
