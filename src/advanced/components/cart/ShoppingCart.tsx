import { CartItem, Product } from '@/types/index';

import ProductPicker from './ProductPicker';

interface ShoppingCartProps {
  products: Product[];
  cartItems: CartItem[];
  selectedProductId: string;
  onProductSelect: (productId: string) => void;
  onAddToCart: () => void;
  onQuantityChange: (productId: string, change: number) => void;
  onRemoveItem: (productId: string) => void;
  stockInfoMessage: string;
  totalStockQuantity: number;
}

const ShoppingCart = ({
  products,
  cartItems,
  selectedProductId,
  onProductSelect,
  onAddToCart,
  onQuantityChange,
  onRemoveItem,
  stockInfoMessage,
  totalStockQuantity,
}: ShoppingCartProps) => {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      {/* ProductPicker 컴포넌트에 props를 전달합니다. */}
      <ProductPicker
        products={products}
        selectedProductId={selectedProductId}
        onProductSelect={onProductSelect}
        onAddToCart={onAddToCart}
        stockInfoMessage={stockInfoMessage}
        totalStockQuantity={totalStockQuantity}
      />

      {/* 장바구니 아이템 목록 (동적으로 렌더링) */}
      <div id="cart-items">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-10">장바구니가 비어있습니다.</p>
        ) : (
          cartItems.map((cartItem) => {
            const product = products.find((p) => p.id === cartItem.id);

            if (!product) return null; // 상품 정보를 찾을 수 없는 경우

            const itemTotal = product.val * cartItem.quantity;
            const priceFontWeight = cartItem.quantity >= 10 ? 'font-bold' : 'font-normal';

            return (
              <div
                key={cartItem.id} // React에서 리스트 렌더링 시 key는 필수입니다.
                id={cartItem.id} // DOM ID로 사용될 수 있으나 React에서는 key가 더 중요합니다.
                className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                </div>
                <div>
                  <h3 className="text-base font-normal mb-1 tracking-tight">
                    {product.onSale && product.suggestSale
                      ? '⚡💝'
                      : product.onSale
                        ? '⚡'
                        : product.suggestSale
                          ? '💝'
                          : ''}
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-0.5 tracking-wide">Product</p>
                  <p className="text-xs text-black mb-3">
                    {product.onSale || product.suggestSale ? (
                      <>
                        <span className="line-through text-gray-400">
                          ₩{product.originalVal.toLocaleString()}
                        </span>{' '}
                        <span
                          className={
                            product.onSale && product.suggestSale
                              ? 'text-purple-600'
                              : product.onSale
                                ? 'text-red-500'
                                : 'text-blue-500'
                          }
                        >
                          ₩{product.val.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      `₩${product.val.toLocaleString()}`
                    )}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                      onClick={() => onQuantityChange(cartItem.id, -1)}
                    >
                      −
                    </button>
                    <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
                      {cartItem.quantity}
                    </span>
                    <button
                      className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                      onClick={() => onQuantityChange(cartItem.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col text-right">
                  <div
                    className={`text-right text-lg mb-2 tracking-tight tabular-nums ${priceFontWeight}`}
                  >
                    {/* 장바구니 아이템의 개별 총액을 표시하는 것이 더 적절할 수 있습니다. */}
                    {product.onSale || product.suggestSale ? (
                      <>
                        <span className="line-through text-gray-400">
                          ₩{(product.originalVal * cartItem.quantity).toLocaleString()}
                        </span>{' '}
                        <span
                          className={
                            product.onSale && product.suggestSale
                              ? 'text-purple-600'
                              : product.onSale
                                ? 'text-red-500'
                                : 'text-blue-500'
                          }
                        >
                          ₩{itemTotal.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      `₩${itemTotal.toLocaleString()}`
                    )}
                  </div>
                  <a
                    className="remove-item text-xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-b-transparent hover:text-black hover:border-black"
                    onClick={() => onRemoveItem(cartItem.id)}
                  >
                    Remove
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
