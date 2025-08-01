import { CartItem as CartItemType } from '../types/cart';
import { Product } from '../types/product';

interface CartItemProps {
  item: CartItemType;
  productList: Product[];
}

const CartItem = ({ item, productList }: CartItemProps) => {
  const product = productList.find((p) => p.id === item.id);

  if (!product) return null; // product가 없을 경우 렌더링하지 않음
  const priceDisplay = () => {
    if (product.onSale || product.suggestSale) {
      return (
        <>
          <span className="line-through text-gray-400">
            ₩{product.originalVal.toLocaleString()}
          </span>
          <span className="text-red-500"> ₩{product.val.toLocaleString()}</span>
        </>
      );
    } else {
      return <span>₩{product.val.toLocaleString()}</span>;
    }
  };

  const nameDisplay = () => {
    if (product.onSale && product.suggestSale) {
      return `⚡💝${product.name}`;
    } else if (product.onSale) {
      return `⚡${product.name}`;
    } else if (product.suggestSale) {
      return `💝${product.name}`;
    } else {
      return product.name;
    }
  };

  return (
    <div
      data-testid={`cart-item-${item.id}`}
      id={item.id}
      className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden rounded-lg">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">
          {nameDisplay()}
        </h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{priceDisplay()}</p>
        <div className="flex items-center gap-4">
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id={product.id}
            data-change="-1"
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {item.quantity}
          </span>
          <button
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id={product.id}
            data-change="1"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <div
          className="text-lg mb-2 tracking-tight tabular-nums"
          data-testid="cart-item-total-price"
        >
          {product.onSale || product.suggestSale ? (
            <>
              <span className="line-through text-gray-400">
                ₩{(product.originalVal * item.quantity).toLocaleString()}
              </span>
              <span className="text-red-500">
                {' '}
                ₩{(product.val * item.quantity).toLocaleString()}
              </span>
            </>
          ) : (
            <span>₩{(product.val * item.quantity).toLocaleString()}</span>
          )}
        </div>
        <a
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id={product.id}
        >
          Remove
        </a>
      </div>
    </div>
  );
};

export default CartItem;
