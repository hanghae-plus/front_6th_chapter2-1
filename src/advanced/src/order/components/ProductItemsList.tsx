import { commaizeNumber } from 'shared/utils';

interface ProductItemsListProps {
  cartItems: Array<{ product: any; quantity: number }>;
}

export function ProductItemsList({ cartItems }: ProductItemsListProps) {
  return (
    <>
      {cartItems.map(({ product, quantity }) => (
        <div
          key={product.id}
          className="flex justify-between text-xs tracking-wide text-gray-400"
        >
          <span>
            {product.name} x {quantity}
          </span>
          <span>₩{commaizeNumber(product.val * quantity)}</span>
        </div>
      ))}
    </>
  );
}
