import { SelectorContainer } from "./selector/SelectorContainer";
import { CartItemBox } from "./CartItemBox";
import { StockInfoText } from "./selector/StockInfoText";

// TODO: 추후 분리 예정
const getStockInfoMessage = (productList) => {
  return productList.reduce((acc, item) => {
    if (item.quantity < 5) {
      if (item.quantity > 0) {
        acc += `${item.name}: 재고 부족 (${item.quantity}개 남음)\n`;
      } else {
        acc += `${item.name}: 품절\n`;
      }
    }
    return acc;
  }, "");
};

export const LeftColumn = ({ productList, isLowStock }) => {
  const stockInfoMessage = getStockInfoMessage(productList);

  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <SelectorContainer
        productList={productList}
        isLowStock={isLowStock}
        bottom={<StockInfoText>{stockInfoMessage}</StockInfoText>}
      />
      <CartItemBox />
    </div>
  );
};
