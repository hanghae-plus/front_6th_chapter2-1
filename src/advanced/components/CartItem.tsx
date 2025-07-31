import type { Cart } from "../types";
import { useCart } from "../context/CartContext";

interface CartItemProps {
  item: Cart;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart, state } = useCart();
  const { product, quantity } = item;

  // 실시간 상품 정보 가져오기
  const currentProduct = state.products.find(p => p.id === product.id) || product;

  const handleQuantityChange = (change: number) => {
    updateQuantity(product.id, change);
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const getProductDisplayName = (): string => {
    if (currentProduct.onSale && currentProduct.suggestSale) {
      return `⚡💝${currentProduct.name}`;
    } else if (currentProduct.onSale) {
      return `⚡${currentProduct.name}`;
    } else if (currentProduct.suggestSale) {
      return `💝${currentProduct.name}`;
    }
    return currentProduct.name;
  };

  const getPriceDisplay = (): React.ReactNode => {
    if (currentProduct.onSale || currentProduct.suggestSale) {
      return (
        <>
          <span className="line-through text-gray-400">₩{currentProduct.originalPrice.toLocaleString()}</span>{" "}
          <span className={currentProduct.onSale && currentProduct.suggestSale ? "text-purple-600" : currentProduct.onSale ? "text-red-500" : "text-blue-500"}>
            ₩{currentProduct.price.toLocaleString()}
          </span>
        </>
      );
    }
    return `₩${currentProduct.price.toLocaleString()}`;
  };

  const getDiscountDisplay = (): React.ReactNode => {
    if (currentProduct.onSale || currentProduct.suggestSale) {
      const discountRate = currentProduct.onSale && currentProduct.suggestSale ? 25 : currentProduct.onSale ? 20 : 5;
      const discountStatus = currentProduct.onSale && currentProduct.suggestSale ? "SUPER SALE" : currentProduct.onSale ? "SALE" : "추천할인";
      return (
        <span className="text-xs text-red-500 font-medium">
          -{discountRate}% {discountStatus}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
      </div>

      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">{getProductDisplayName()}</h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">
          {getPriceDisplay()} {getDiscountDisplay()}
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id={product.id}
            data-change="-1"
          >
            −
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
            data-product-id={product.id}
            data-change="1"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">{getPriceDisplay()}</div>
        <button
          onClick={handleRemove}
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
          data-product-id={product.id}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
