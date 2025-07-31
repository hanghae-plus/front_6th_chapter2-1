import { useCartStore } from '@/advanced/store';
import { Product, ProductStatus } from '@/advanced/types/product.type';
import formatPrice from '@/advanced/utils/format.util';
import { getProductStatus } from '@/advanced/utils/product.util';

const priceStyle: Record<ProductStatus, string> = {
  [ProductStatus.SUPER_SALE]: 'text-purple-600',
  [ProductStatus.LIGHTNING_SALE]: 'text-red-500',
  [ProductStatus.SUGGESTION_SALE]: 'text-blue-500',
  [ProductStatus.OUT_OF_STOCK]: '',
  [ProductStatus.NORMAL]: '',
};

interface Props {
  product: Product;
  size?: 'lg' | 'sm';
}

export default function ProductPrice({ product, size = 'lg' }: Props) {
  const { cartItems } = useCartStore();

  const originalPrice = formatPrice(product.originalPrice);
  const productStatus = getProductStatus(product);

  const isOnSale = product.onSale || product.suggestSale;

  const cartItem = cartItems.find(item => item.id === product.id);

  const isProductDiscount = cartItem ? cartItem.quantity >= 10 : false;

  const productDiscountStyle = isProductDiscount ? 'font-bold' : 'font-normal';

  const textStyle = size === 'lg' ? 'text-lg' : 'text-xs';

  return (
    <div
      className={`${textStyle} mb-2 tracking-tight tabular-nums ${size === 'lg' ? productDiscountStyle : ''}`}
    >
      {isOnSale && (
        <>
          <span className="line-through text-gray-400">{originalPrice}</span>
          <span>&nbsp;</span>
        </>
      )}
      <span className={priceStyle[productStatus]}>{formatPrice(product.price)}</span>
    </div>
  );
}
