import { useMemo } from 'react';

import { CartItem } from '@/types';

interface OrderSummaryProps {
  cartItems: CartItem[];
}

const OrderSummary = ({ cartItems }: OrderSummaryProps) => {
  // 기본 계산
  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  const originalTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0),
    [cartItems]
  );

  const totalQuantity = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  // 할인 계산
  const { discounts, finalTotal } = useMemo(() => {
    const discountList = [];
    let total = 0;

    // 각 상품별 할인된 가격 계산 (10개 이상 구매 할인 포함)
    cartItems.forEach((item) => {
      let itemTotal = item.price * item.quantity;

      // 10개 이상 구매시 상품별 할인
      if (item.quantity >= 10) {
        let discountRate = 0;
        switch (item.id) {
          case 'p1':
            discountRate = 10;
            break; // 키보드
          case 'p2':
            discountRate = 15;
            break; // 마우스
          case 'p3':
            discountRate = 20;
            break; // 모니터암
          case 'p5':
            discountRate = 25;
            break; // 스피커
        }

        if (discountRate > 0) {
          const discountedPrice = itemTotal * (1 - discountRate / 100);
          discountList.push({
            name: `${item.name} (10개↑)`,
            rate: discountRate,
            amount: itemTotal - discountedPrice,
          });
          itemTotal = discountedPrice;
        }
      }

      total += itemTotal;
    });

    // 대량 구매 할인 (30개 이상)
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalQuantity >= 30) {
      const bulkDiscount = total * 0.25; // 25% 할인
      total = total * 0.75;
      discountList.push({
        name: '🎉 대량구매 할인 (30개 이상)',
        rate: 25,
        amount: bulkDiscount,
      });
    }

    // 화요일 특별 할인
    const isTuesday = new Date().getDay() === 2;
    if (isTuesday && total > 0) {
      const tuesdayDiscount = total * 0.1; // 10% 추가 할인
      total = total * 0.9;
      discountList.push({
        name: '🌟 화요일 추가 할인',
        rate: 10,
        amount: tuesdayDiscount,
      });
    }

    return {
      discounts: discountList,
      finalTotal: Math.round(total),
    };
  }, [cartItems]);

  // 포인트 계산
  const { points, pointDetails } = useMemo(() => {
    let totalPoints = Math.floor(finalTotal / 1000); // 기본 포인트
    const details = [];

    if (totalPoints > 0) {
      details.push(`기본: ${totalPoints}p`);

      // 화요일 2배 포인트
      if (new Date().getDay() === 2) {
        totalPoints *= 2;
        details.push('화요일 2배');
      }
    }

    // 세트 구매 보너스
    const hasKeyboard = cartItems.some((item) => item.id === 'p1');
    const hasMouse = cartItems.some((item) => item.id === 'p2');
    const hasMonitorArm = cartItems.some((item) => item.id === 'p3');

    if (hasKeyboard && hasMouse) {
      totalPoints += 50;
      details.push('키보드+마우스 세트 +50p');
    }

    if (hasKeyboard && hasMouse && hasMonitorArm) {
      totalPoints += 100;
      details.push('풀세트 구매 +100p');
    }

    // 수량별 보너스
    if (totalQuantity >= 30) {
      totalPoints += 100;
      details.push('대량구매(30개+) +100p');
    } else if (totalQuantity >= 20) {
      totalPoints += 50;
      details.push('대량구매(20개+) +50p');
    } else if (totalQuantity >= 10) {
      totalPoints += 20;
      details.push('대량구매(10개+) +20p');
    }

    return { points: totalPoints, pointDetails: details };
  }, [cartItems, finalTotal, totalQuantity]);

  const isTuesday = new Date().getDay() === 2;
  const savedAmount = originalTotal - finalTotal;

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div id="summary-details" className="space-y-3">
          {/* 장바구니 아이템 목록 */}
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-xs tracking-wide text-gray-400">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₩{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}

          {cartItems.length > 0 && (
            <>
              <div className="border-t border-white/10 my-3" />
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{subtotal.toLocaleString()}</span>
              </div>

              {/* 할인 정보 */}
              {discounts.map((discount) => (
                <div key={discount.name} className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">{discount.name}</span>
                  <span className="text-xs">
                    -₩{Math.round(discount.amount).toLocaleString()} (-{discount.rate}%)
                  </span>
                </div>
              ))}

              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-auto">
          {/* 할인 금액 표시 */}
          {savedAmount > 0 && (
            <div id="discount-info" className="mb-4">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
                  <span className="text-sm font-medium text-green-400">
                    {((savedAmount / originalTotal) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xs text-gray-300">₩{Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
              </div>
            </div>
          )}

          {/* 최종 금액 */}
          <div id="cart-total" className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">₩{Math.round(finalTotal).toLocaleString()}</div>
            </div>
            {points > 0 && (
              <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
                <div>
                  적립 포인트: <span className="font-bold">{points}p</span>
                </div>
                <div className="text-2xs opacity-70 mt-1">{pointDetails.join(', ')}</div>
              </div>
            )}
          </div>

          {/* 화요일 특별 할인 배지 */}
          {isTuesday && finalTotal > 0 && (
            <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};

export default OrderSummary;
