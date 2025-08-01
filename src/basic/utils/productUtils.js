import { productList } from './stores';

// 9. 총 재고 수량 계산
export function getTotalStock() {
  return productList.reduce((sum, item) => sum + item.quantity, 0);
}
