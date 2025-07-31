import { useMemo } from 'react';
import { calculateItemDiscountRate } from '@/advanced/features/cart/utils/discountUtils.js';
import { BUSINESS_CONSTANTS } from '@/advanced/shared/constants/business.ts';
import { PRODUCTS } from '@/advanced/features/product/constants/index.ts';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderSummaryDetailsProps {
  cartItems?: CartItem[];
  subtotal?: number;
  itemCount?: number;
  isTuesday?: boolean;
  hasBulkDiscount?: boolean;
}

const OrderSummaryDetails = ({
  cartItems = [],
  subtotal = 0,
  itemCount = 0,
  isTuesday = false,
  hasBulkDiscount = false,
}: OrderSummaryDetailsProps) => {
  const calculatedDiscounts = useMemo(() => {
    return cartItems
      .map(item => {
        const discountRate = calculateItemDiscountRate(
          item.id,
          item.quantity,
          BUSINESS_CONSTANTS,
          PRODUCTS,
        );

        return {
          name: item.name,
          discount: discountRate * 100,
        };
      })
      .filter(item => item.discount > 0);
  }, [cartItems]);

  // 장바구니가 비어있을 때
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

      {/* 동적으로 계산된 개별 상품 할인 (30개 미만일 때만) */}
      {!hasBulkDiscount &&
        calculatedDiscounts.length > 0 &&
        calculatedDiscounts.map((discount, index) => (
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
