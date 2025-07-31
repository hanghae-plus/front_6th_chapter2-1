import React, { useState } from 'react';

import { Product } from '@/types/product';

import { ProductOptionLabel } from '../../utils/productOption.tsx';

interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductPickerProps {
  products: Product[];
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const ProductPicker: React.FC<ProductPickerProps> = ({ products, cartItems, setCartItems }) => {
  const [selectedId, setSelectedId] = useState(products[0]?.id || '');

  const handleAddToCart = () => {
    const product = products.find((p) => p.id === selectedId);
    if (!product) return;
    // 장바구니에 담긴 수량
    const cartItem = cartItems.find((item) => item.productId === selectedId);
    const cartQty = cartItem ? cartItem.quantity : 0;
    const availableQty = product.quantity - cartQty;
    if (availableQty <= 0) {
      // 품절 상태 메시지는 하단에서 렌더링
      alert('재고가 부족합니다');
      return;
    }
    // 에러 상태 메시지는 하단에서 렌더링
    setCartItems((prev) => {
      const exist = prev.find((item) => item.productId === selectedId);
      if (exist) {
        // 재고 초과 방지
        if (product.quantity - exist.quantity <= 0) {
          // 재고 부족 메시지는 하단에서 렌더링
          alert('재고가 부족합니다');
          return prev;
        }
        return prev.map((item) => (item.productId === selectedId ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        return [...prev, { productId: selectedId, quantity: 1 }];
      }
    });
  };

  // 선택된 상품 정보 미리 계산
  const selectedProduct = products.find((p) => p.id === selectedId);
  const selectedCartItem = cartItems.find((item) => item.productId === selectedId);
  const selectedCartQty = selectedCartItem ? selectedCartItem.quantity : 0;
  const availableQty = selectedProduct ? selectedProduct.quantity - selectedCartQty : 0;
  const isSelectedSoldOut = availableQty <= 0;

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        id="product-select"
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        {products.map((product) => {
          const isSoldOut = product.quantity === 0;
          return (
            <option key={product.id} value={product.id} disabled={isSoldOut}>
              <ProductOptionLabel product={product} />
            </option>
          );
        })}
      </select>
      <button
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
        onClick={handleAddToCart}
        disabled={isSelectedSoldOut}
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs mt-3 whitespace-pre-line">
        {products
          .map((product) => {
            const cartItem = cartItems.find((item) => item.productId === product.id);
            const cartQty = cartItem ? cartItem.quantity : 0;
            const leftQty = product.quantity - cartQty;
            if (leftQty === 0) {
              return <div key={product.id} className="text-red-500">{`${product.name}: 품절`}</div>;
            } else if (leftQty > 0 && leftQty <= 5) {
              return (
                <div key={product.id} className="text-red-500">{`${product.name}: 재고 부족 (${leftQty}개 남음)`}</div>
              );
            } else {
              return null;
            }
          })
          .filter(Boolean)}
      </div>
    </div>
  );
};

export default ProductPicker;
