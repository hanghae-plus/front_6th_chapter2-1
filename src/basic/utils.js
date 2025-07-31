// 공통 유틸리티 함수들
export const isTuesday = () => new Date().getDay() === 2;

export const formatPrice = (price) => `₩${Math.round(price).toLocaleString()}`;

export const findProductById = (products, productId) =>
  products.find((product) => product.id === productId);
