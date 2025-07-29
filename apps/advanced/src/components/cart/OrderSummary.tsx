import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  total: number;
  points: number;
}

interface SummaryRowProps {
  label: string;
  value: string | number;
  isTotal?: boolean;
  isDiscount?: boolean;
}

const SummaryRow = React.memo(
  ({ label, value, isTotal = false, isDiscount = false }: SummaryRowProps) => {
    const rowClass = React.useMemo(() => {
      const classes = ['flex justify-between py-2'];
      if (isTotal)
        classes.push('border-t-2 border-gray-300 pt-3 font-bold text-lg');
      if (isDiscount) classes.push('text-green-600');
      return classes.join(' ');
    }, [isTotal, isDiscount]);

    return (
      <div className={rowClass}>
        <span className='text-gray-700'>{label}</span>
        <span
          className={
            isTotal
              ? 'text-blue-600'
              : isDiscount
                ? 'text-green-600'
                : 'text-gray-800'
          }>
          {value}
        </span>
      </div>
    );
  }
);

SummaryRow.displayName = 'SummaryRow';

interface DiscountInfoProps {
  discount: number;
  subtotal: number;
}

const DiscountInfo = React.memo(({ discount, subtotal }: DiscountInfoProps) => {
  const discountPercentage = React.useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.round((discount / subtotal) * 100);
  }, [discount, subtotal]);

  if (discount === 0) return null;

  return (
    <div className='mb-4'>
      <SummaryRow
        label='할인 금액'
        value={`-${discount.toLocaleString()}원`}
        isDiscount={true}
      />
      <div className='text-center text-sm text-green-600 font-medium'>
        할인율: {discountPercentage}%
      </div>
    </div>
  );
});

DiscountInfo.displayName = 'DiscountInfo';

/**
 * 포인트 정보 컴포넌트 Props
 */
interface PointsInfoProps {
  points: number;
}

/**
 * 포인트 정보 컴포넌트
 * 포인트 적립 정보를 표시하는 컴포넌트
 */
const PointsInfo: React.FC<PointsInfoProps> = React.memo(({ points }) => {
  if (points === 0) return null;

  return (
    <div className='mb-4'>
      <SummaryRow label='적립 포인트' value={`${points.toLocaleString()}P`} />
      <div className='text-center text-sm text-blue-600 font-medium'>
        💡 포인트는 주문 완료 후 적립됩니다
      </div>
    </div>
  );
});

PointsInfo.displayName = 'PointsInfo';

interface CheckoutButtonProps {
  total: number;
  itemCount: number;
}

const CheckoutButton = React.memo(
  ({ total, itemCount }: CheckoutButtonProps) => {
    const handleCheckout = () => {
      if (itemCount === 0) {
        alert('장바구니에 상품을 추가해주세요.');
        return;
      }

      // 실제 주문 로직은 여기에 구현
      alert(`주문 금액: ${total.toLocaleString()}원\n주문이 완료되었습니다!`);
    };

    const isDisabled = itemCount === 0;
    const buttonText = isDisabled ? '상품을 추가해주세요' : '주문하기';

    return (
      <div className='mt-6'>
        <button
          onClick={handleCheckout}
          disabled={isDisabled}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          aria-label='주문하기'>
          {buttonText}
        </button>

        {!isDisabled && (
          <div className='text-center mt-3 text-sm text-gray-600'>
            💳 안전한 결제 시스템으로 주문하세요
          </div>
        )}
      </div>
    );
  }
);

CheckoutButton.displayName = 'CheckoutButton';

export const OrderSummary = React.memo(
  ({ subtotal, discount, total, points }: OrderSummaryProps) => {
    const savings = React.useMemo(() => {
      return discount > 0 ? discount : 0;
    }, [discount]);

    const hasSavings = savings > 0;

    return (
      <div className='bg-gray-50 border border-gray-200 rounded-lg p-6'>
        <div className='mb-6'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>주문 요약</h3>
        </div>

        <div className='space-y-2'>
          <SummaryRow
            label='상품 금액'
            value={`${subtotal.toLocaleString()}원`}
          />

          <DiscountInfo discount={discount} subtotal={subtotal} />

          <SummaryRow
            label='총 결제 금액'
            value={`${total.toLocaleString()}원`}
            isTotal={true}
          />

          <PointsInfo points={points} />
        </div>

        {hasSavings && (
          <div className='text-center mt-4 p-3 bg-green-100 rounded-lg'>
            <span className='text-green-800 font-semibold'>
              💰 {savings.toLocaleString()}원 절약!
            </span>
          </div>
        )}

        <CheckoutButton
          total={total}
          itemCount={subtotal > 0 ? 1 : 0} // 실제로는 장바구니 아이템 수를 전달해야 함
        />
      </div>
    );
  }
);

OrderSummary.displayName = 'OrderSummary';
