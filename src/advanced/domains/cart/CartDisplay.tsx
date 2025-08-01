import { useCallback } from "react";
import { ICartItem } from "./types";

interface CartDisplayProps {
  cartItems: ICartItem[];
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

/**
 * 개별 장바구니 아이템 컴포넌트
 */
function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const handleQuantityChange = useCallback(
    (delta: number) => {
      const newQuantity = item.quantity + delta;
      if (newQuantity <= 0) {
        onRemoveItem(item.id);
      } else {
        onUpdateQuantity(item.id, newQuantity);
      }
    },
    [item.id, item.quantity, onUpdateQuantity, onRemoveItem],
  );

  const handleRemove = useCallback(() => {
    onRemoveItem(item.id);
  }, [item.id, onRemoveItem]);

  /**
   * 상품명 생성 (할인 표시 포함)
   */
  const getDisplayName = () => {
    let prefix = "";
    if (item.onSale && item.suggestSale) {
      prefix = "⚡💝";
    } else if (item.onSale) {
      prefix = "⚡";
    } else if (item.suggestSale) {
      prefix = "💝";
    }
    return `${prefix}${item.name}`;
  };

  /**
   * 가격 표시 생성 (할인 가격 강조)
   */
  const getPriceDisplay = () => {
    if (item.onSale && item.suggestSale) {
      return (
        <>
          <span className="line-through text-gray-400">₩{item.originalVal.toLocaleString()}</span>{" "}
          <span className="text-purple-600">₩{item.val.toLocaleString()}</span>
        </>
      );
    } else if (item.onSale) {
      return (
        <>
          <span className="line-through text-gray-400">₩{item.originalVal.toLocaleString()}</span>{" "}
          <span className="text-red-500">₩{item.val.toLocaleString()}</span>
        </>
      );
    } else if (item.suggestSale) {
      return (
        <>
          <span className="line-through text-gray-400">₩{item.originalVal.toLocaleString()}</span>{" "}
          <span className="text-blue-500">₩{item.val.toLocaleString()}</span>
        </>
      );
    } else {
      return `₩${item.val.toLocaleString()}`;
    }
  };

  const getPriceClassName = () => {
    if (item.onSale && item.suggestSale) return "text-purple-600";
    if (item.onSale) return "text-red-500";
    if (item.suggestSale) return "text-blue-500";
    return "";
  };

  return (
    <div
      id={item.id}
      data-testid={`cart-item-${item.id}`}
      className="flex justify-between items-center py-2 border-b border-gray-200"
    >
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-900">{getDisplayName()}</h3>
        <div className={`text-lg ${getPriceClassName()}`}>{getPriceDisplay()}</div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
          aria-label="수량 감소"
        >
          -
        </button>

        <span className="quantity-number w-8 text-center text-sm font-medium">{item.quantity}</span>

        <button
          onClick={() => handleQuantityChange(1)}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600"
          aria-label="수량 증가"
        >
          +
        </button>

        <button
          onClick={handleRemove}
          className="ml-2 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600"
          aria-label="상품 제거"
        >
          ×
        </button>
      </div>
    </div>
  );
}

/**
 * Cart 도메인 - 장바구니 표시 컴포넌트
 *
 * 기존 DOM 기반 장바구니 렌더링을 React 컴포넌트로 변환
 * - 장바구니 아이템 목록 표시
 * - 수량 증감 버튼
 * - 할인 상품 강조 표시
 * - 상품 제거 기능
 */
export function CartDisplay({ cartItems, onUpdateQuantity, onRemoveItem }: CartDisplayProps) {
  if (cartItems.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">장바구니</h2>
        <p className="text-gray-500 text-center py-8">장바구니가 비어있습니다.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">장바구니</h2>
      <div id="cart-items" className="space-y-2">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} onRemoveItem={onRemoveItem} />
        ))}
      </div>
    </div>
  );
}
