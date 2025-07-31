import React, { useMemo } from 'react';
import { OrderSummaryProps, Product } from '../../types';
import { calculatePointsInfo } from '../../services/cartService';
import { CART_CONSTANTS } from '../../constants';

export const OrderSummary: React.FC<OrderSummaryProps> = ({ summary, items, products, onOrder }) => {
  const getProductById = useMemo(() => {
    return (productId: string): Product | undefined => {
      return products.find((p) => p.id === productId);
    };
  }, [products]);

  const isTuesday = useMemo(() => {
    const TUESDAY = 2;
    return new Date().getDay() === TUESDAY;
  }, []);

  const pointsInfo = calculatePointsInfo(summary.finalAmount, items, products);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
      <h2 className="text-xl font-bold mb-4">주문 요약</h2>

      <div className="space-y-4">
        {/* 상품 목록 */}
        <div>
          <h3 className="font-semibold mb-2">상품 목록</h3>
          <div className="space-y-2">
            {items.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>
                    {product.name} × {item.quantity}
                  </span>
                  <span>{(product.price * item.quantity).toLocaleString()}원</span>
                </div>
              );
            })}
          </div>
        </div>

        <hr />

        {/* 금액 정보 */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>소계</span>
            <span>{summary.subtotal.toLocaleString()}원</span>
          </div>

          {summary.totalDiscount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>할인</span>
              <span>-{summary.totalDiscount.toLocaleString()}원</span>
            </div>
          )}

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>총 결제금액</span>
            <span>{summary.finalAmount.toLocaleString()}원</span>
          </div>
        </div>

        <hr />

        {/* 포인트 정보 */}
        <div>
          <h3 className="font-semibold mb-2">적립 포인트</h3>
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{pointsInfo.totalPoints}p</div>
              <div className="text-sm text-gray-600 mt-1">적립 예정</div>
            </div>

            {pointsInfo.details.length > 0 && (
              <div className="mt-3 space-y-1">
                {pointsInfo.details.map((detail, index) => (
                  <div key={index} className="text-xs text-gray-600">
                    • {detail}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 화요일 특별 혜택 */}
        {isTuesday && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="text-center">
              <div className="text-yellow-600 font-semibold">🌟 화요일 특별 혜택</div>
              <div className="text-sm text-yellow-700 mt-1">포인트 2배 적립 + 10% 추가 할인</div>
            </div>
          </div>
        )}

        {/* 주문 버튼 */}
        <button
          onClick={onOrder}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={items.length === CART_CONSTANTS.EMPTY_CART}
        >
          주문하기
        </button>
      </div>
    </div>
  );
};
