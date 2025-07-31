import ProductPrice from '@/advanced/components/cart/ProductPrice';
import { useCartStore, useProductStore } from '@/advanced/store';
import type { CartItem } from '@/advanced/types/cart.type';
import { Product } from '@/advanced/types/product.type';
import { getProductStatusIcon } from '@/advanced/utils/cart.util';

interface Props {
  item: CartItem;
}

export default function CartListItem({ item }: Props) {
  const { products, increaseStock, decreaseStock } = useProductStore();
  const { increaseProductQuantity, decreaseProductQuantity } = useCartStore();

  const { id, quantity } = item;

  const product = products.find(product => product.id === id) as Product;

  const handleClickIncrease = () => {
    if (product.stock === 0) return;

    decreaseStock(product.id);
    increaseProductQuantity(product);
  };
  const handleClickDecrease = () => {
    increaseStock(product.id);
    decreaseProductQuantity(product);
  };

  return (
    <div
      id={id}
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {getProductStatusIcon(product)}
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">
          <ProductPrice product={product} size="sm" />
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleClickDecrease}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {quantity}
          </span>
          <button
            onClick={handleClickIncrease}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <ProductPrice product={product} />
        <a
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id={id}
        >
          Remove
        </a>
      </div>
    </div>
  );
}
