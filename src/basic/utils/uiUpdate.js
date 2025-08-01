import { productList } from './stores';
import { doRenderBonusPoints } from './ui/bonusPointsRender';
import { stockInfo } from './ui/initialRenders';
export function updateStockAndPoints() {
  const stockMsg = productList
    .filter((item) => item.quantity < 5)
    .map((item) =>
      item.quantity > 0
        ? `${item.name}: 재고 부족 (${item.quantity}개 남음)`
        : `${item.name}: 품절`,
    )
    .join('\n');
  stockInfo.textContent = stockMsg;
  doRenderBonusPoints();
}
