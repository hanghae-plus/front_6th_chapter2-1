import { Product } from 'types';
import { commaizeNumber } from 'shared/utils';
import { UI_TEXTS } from '@shared/constants/event';

// 상품 상태 판단
const getProductStatus = (product: Product) => {
  const isOutOfStock = product.q <= 0;
  const hasDiscount = product.onSale || product.suggestSale;

  return { isOutOfStock, hasDiscount };
};

interface ProductOptionProps {
  product: Product;
}

export function ProductOption({ product }: ProductOptionProps) {
  const { val, id, name } = product;
  const { isOutOfStock, hasDiscount } = getProductStatus(product);
  const formattedPrice = commaizeNumber(val);

  // 상품 상태별 표시 정보를 한 곳에 정의
  const displayInfo = (() => {
    if (isOutOfStock) {
      return {
        suffix: ` (${UI_TEXTS.stockMessages.outOfStock.split(':')[1].trim()})`,
        disabled: true,
      };
    }
    if (hasDiscount) {
      return { suffix: ' (할인가)', disabled: false };
    }
    return { suffix: '', disabled: false };
  })();

  return (
    <option value={id} disabled={displayInfo.disabled}>
      {name} - ₩{formattedPrice}
      {displayInfo.suffix}
    </option>
  );
}
