import { PRODUCT_STATUS } from '../../data/product.data';
import { formatPrice } from '../../utils/format.util';
import { getProductStatus } from '../../utils/product.util';

const priceStyle = {
  [PRODUCT_STATUS.SUPER_SALE]: 'text-purple-600',
  [PRODUCT_STATUS.LIGHTNING_SALE]: 'text-red-500',
  [PRODUCT_STATUS.SUGGESTION_SALE]: 'text-blue-500',
  [PRODUCT_STATUS.OUT_OF_STOCK]: '',
  [PRODUCT_STATUS.NORMAL]: '',
};

export default function ProductPrice(product) {
  const productStatus = getProductStatus(product);
  const originalPrice = formatPrice(product.originalVal);

  const isOnSale = product.onSale || product.suggestSale;

  return /* HTML */ `
    ${isOnSale &&
    `<>
        <span class="line-through text-gray-400">₩${originalPrice.toLocaleString()}</span>
        <span>&nbsp;</span>
      </>`}
    <span class="${priceStyle[productStatus]}">${formatPrice(product.val)}</span>
  `;
}
