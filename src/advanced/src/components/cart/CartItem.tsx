interface CartItemProps {
  id: string;
  name: string;
  val: number;
  quantity: number;
  discount: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export const CartItem = ({
  id,
  name,
  val,
  quantity,
  discount,
  onQuantityChange,
  onRemove,
}: CartItemProps) => {
  const discountedPrice = val * (1 - discount / 100);

  // 가격 렌더링 (할인 적용 시)
  const priceString =
    discount > 0 ? (
      <>
        <span className="line-through text-gray-400">
          ₩{val.toLocaleString()}
        </span>
        <span className="text-red-500 ml-2">
          ₩{discountedPrice.toLocaleString()}
        </span>
      </>
    ) : (
      `₩${val.toLocaleString()}`
    );

  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0">
      {/* 이미지 영역 */}
      <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black relative overflow-hidden rounded-lg">
        <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>

      {/* 상품 정보 */}
      <div>
        <h3 className="text-base font-normal mb-1 tracking-tight">{name}</h3>
        <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
        <p className="text-xs text-black mb-3">{priceString}</p>

        {/* 수량 조절 버튼 */}
        <div className="flex items-center gap-4">
          <button
            aria-label={`${name} 수량 감소`}
            onClick={() => onQuantityChange(id, Math.max(0, quantity - 1))}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            -
          </button>
          <span className="quantity-number text-sm font-normal min-w-[20px] text-center tabular-nums">
            {quantity}
          </span>
          <button
            aria-label={`${name} 수량 증가`}
            onClick={() => onQuantityChange(id, quantity + 1)}
            className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
          >
            +
          </button>
        </div>
      </div>

      {/* 가격 및 제거 버튼 */}
      <div className="text-right">
        <div className="text-lg mb-2 tracking-tight tabular-nums">
          {priceString}
        </div>
        <button
          aria-label={`${name} 장바구니에서 제거`}
          onClick={() => onRemove(id)}
          className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
        >
          Remove
        </button>
      </div>
    </div>
  );
};
