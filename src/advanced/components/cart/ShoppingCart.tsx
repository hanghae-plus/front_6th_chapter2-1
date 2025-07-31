import { useRef } from 'react';

import { CartItem, Product } from '../../types'; // Product import 추가
import ProductPicker from './ProductPicker';

interface ShoppingCartProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemoveFromCart: (itemId: string) => void;
}

const ShoppingCart = ({ products, cartItems, onAddToCart, onUpdateQuantity, onRemoveFromCart }: ShoppingCartProps) => {
  const cartRef = useRef<HTMLDivElement>(null);

  const handleCartAction = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button');
    if (!button) return;

    const productId = button.dataset.productId;
    if (!productId) return;

    if (button.classList.contains('quantity-change')) {
      const change = parseInt(button.dataset.change || '0');
      const product = products.find((p) => p.id === productId);
      const cartItem = cartItems.find((item) => item.id === productId);

      if (!product || !cartItem) return;

      // 수량 감소 시
      if (change < 0) {
        // 1개 이하로는 못 내려감 (1개일 때는 Remove 버튼 사용하도록)
        if (cartItem.quantity <= 1) {
          return;
        }
        onUpdateQuantity(productId, change);
        return;
      }

      // 수량 증가 시
      if (change > 0) {
        // 재고가 없는 경우
        if (product.quantity <= 0) {
          alert('재고가 부족합니다.');
          return;
        }
        onUpdateQuantity(productId, change);
        return;
      }
    }

    if (button.classList.contains('remove-item')) {
      onRemoveFromCart(productId);
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductPicker products={products} onAddToCart={onAddToCart} />
      <div ref={cartRef} id="cart-items" onClick={handleCartAction}>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
          >
            <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
            </div>
            <div>
              <h3 className="text-base font-normal mb-1 tracking-tight">
                {item.name}
                {item.onSale && ' ⚡'}
                {item.suggestSale && ' 💝'}
              </h3>
              <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
              <p className="text-xs text-black mb-3">
                {item.originalPrice !== item.price ? (
                  <>
                    <span className="line-through text-gray-400">₩{item.originalPrice.toLocaleString()}</span>{' '}
                    <span
                      className={`${
                        item.onSale && item.suggestSale
                          ? 'text-purple-600'
                          : item.onSale
                            ? 'text-red-500'
                            : 'text-blue-500'
                      }`}
                    >
                      ₩{item.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  `₩${item.price.toLocaleString()}`
                )}
              </p>
              <div className="flex items-center gap-4">
                <button
                  data-product-id={item.id}
                  data-change="-1"
                  className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                >
                  −
                </button>
                <span className="text-sm font-normal min-w-[20px] text-center tabular-nums">{item.quantity}</span>
                <button
                  data-product-id={item.id}
                  data-change="1"
                  className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg mb-2 tracking-tight tabular-nums">
                {item.originalPrice !== item.price ? (
                  <>
                    <span className="line-through text-gray-400">
                      ₩{(item.originalPrice * item.quantity).toLocaleString()}
                    </span>{' '}
                    <span
                      className={`${
                        item.onSale && item.suggestSale
                          ? 'text-purple-600'
                          : item.onSale
                            ? 'text-red-500'
                            : 'text-blue-500'
                      }`}
                    >
                      ₩{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </>
                ) : (
                  `₩${(item.price * item.quantity).toLocaleString()}`
                )}
              </div>
              <button
                data-product-id={item.id}
                className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoppingCart;
