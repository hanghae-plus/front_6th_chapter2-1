/**
 * @description 상품 목록의 재고 총합 계산
 * @param {{
 *  id: string;
 *  name: string;
 *  value: number;
 *  originalValue: number;
 *  quantity: number;
 *  onSale: boolean;
 *  suggestSale: boolean;
 * }} products - 상품 목록
 * @returns {number} 총 재고 수량
 * @example
 * getTotalStock([{ quantity: 10 }, { quantity: 5 }]); // 15
 */
export const getTotalStock = (products) => {
  return products.reduce((acc, product) => acc + product.quantity, 0);
};
