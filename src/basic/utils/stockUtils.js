import { STOCK_THRESHOLDS } from '../constants.js';

// 재고 총합 계산
export function getStockTotal(productList) {
  let sum = 0;
  for (let i = 0; i < productList.length; i++) {
    sum += productList[i].q;
  }
  return sum;
}

// 재고 정보 업데이트
export function updateStockInfo(productList, stockInfoElement) {
  let infoMsg = '';

  productList.forEach(function (item) {
    if (item.q < STOCK_THRESHOLDS.LOW_STOCK_WARNING) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });

  stockInfoElement.textContent = infoMsg;
}
