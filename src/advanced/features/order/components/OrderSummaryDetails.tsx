interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface ItemDiscount {
  name: string;
  discount: number;
}

interface OrderSummaryDetailsProps {
  cartItems?: CartItem[];
  subtotal?: number;
  itemCount?: number;
  isTuesday?: boolean;
  hasBulkDiscount?: boolean;
  itemDiscounts?: ItemDiscount[];
}

const OrderSummaryDetails = ({
  cartItems = [],
  subtotal = 0,
  itemCount = 0,
  isTuesday = false,
  hasBulkDiscount = false,
  itemDiscounts = [],
}: OrderSummaryDetailsProps) => {
  if (!cartItems.length || subtotal === 0) {
    return (
      <div className='text-center text-sm text-gray-400 py-8'>Empty Cart</div>
    );
  }

  return (
    <div className='space-y-3'>
      {/* 개별 아이템 목록 */}
      {cartItems.map(item => (
        <div
          key={item.id}
          className='flex justify-between text-xs tracking-wide text-gray-400'
        >
          <span>
            {item.name} x {item.quantity}
          </span>
          <span>₩{(item.price * item.quantity).toLocaleString()}</span>
        </div>
      ))}

      {/* 구분선 */}
      <div className='border-t border-white/10 my-3'></div>

      {/* Subtotal */}
      <div className='flex justify-between text-sm tracking-wide'>
        <span>Subtotal</span>
        <span>₩{subtotal.toLocaleString()}</span>
      </div>

      {/* 할인 정보 */}
      {hasBulkDiscount && itemCount >= 30 && (
        <div className='flex justify-between text-sm tracking-wide text-green-400'>
          <span className='text-xs'>🎉 대량구매 할인 (30개 이상)</span>
          <span className='text-xs'>-25%</span>
        </div>
      )}

      {!hasBulkDiscount &&
        itemDiscounts.length > 0 &&
        itemDiscounts.map((discount, index) => (
          <div
            key={index}
            className='flex justify-between text-sm tracking-wide text-green-400'
          >
            <span className='text-xs'>{discount.name} (10개↑)</span>
            <span className='text-xs'>-{discount.discount}%</span>
          </div>
        ))}

      {/* 화요일 할인 */}
      {isTuesday && (
        <div className='flex justify-between text-sm tracking-wide text-purple-400'>
          <span className='text-xs'>🌟 화요일 추가 할인</span>
          <span className='text-xs'>-10%</span>
        </div>
      )}

      {/* 무료 배송 */}
      <div className='flex justify-between text-sm tracking-wide text-gray-400'>
        <span>Shipping</span>
        <span>Free</span>
      </div>
    </div>
  );
};

export default OrderSummaryDetails;
