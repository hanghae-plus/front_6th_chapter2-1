import React from 'react';
import { CURRENCY_SYMBOL } from '../../../constants';
import { productList } from '../../../data/productData';
import { ItemDiscount, PointsDetail } from '../../../types';

interface DiscountSectionProps {
  itemDiscounts: ReadonlyArray<ItemDiscount>;
  finalPoints: number;
  pointsDetail: PointsDetail;
  hasItems: boolean;
}

const DiscountSection: React.FC<DiscountSectionProps> = ({
  itemDiscounts,
  finalPoints,
  pointsDetail,
  hasItems,
}) => {
  const renderDiscountList = (): React.ReactElement | null => {
    if (itemDiscounts.length === 0) return null;

    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-300">적용된 할인:</div>
        {itemDiscounts.map((discount) => {
          const product = productList.find((p) => p.id === discount.productId);
          return (
            <div
              key={`discount-${discount.productId}-${Math.round(discount.discountRate * 100)}`}
              className="flex justify-between text-sm"
            >
              <span className="text-green-400">
                {product?.name} ({Math.round(discount.discountRate * 100)}%
                할인)
              </span>
              <span className="text-green-400">
                -{CURRENCY_SYMBOL}
                {discount.discountAmount.toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderLoyaltyPoints = (): React.ReactElement | null => {
    if (!hasItems) return null;

    return (
      <div className="mt-4 p-3 bg-gray-800 rounded">
        <p className="text-sm text-gray-300">적립 예정 포인트</p>
        <p className="text-xl font-semibold text-yellow-400">{finalPoints}p</p>
        <div className="text-xs text-gray-400 mt-1">
          기본: {pointsDetail.basePoints}p
          {pointsDetail.bonusPoints > 0 && (
            <span> + 보너스: {pointsDetail.bonusPoints}p</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderDiscountList()}
      {renderLoyaltyPoints()}
    </>
  );
};

export default DiscountSection;
