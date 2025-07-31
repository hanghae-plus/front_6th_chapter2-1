import React from 'react';

type Props = {
  finalPrice: number;
  totalPoint: number;
  pointDetails: string[];
};

const FinalPrice = ({ finalPrice, totalPoint, pointDetails }: Props) => {
  return (
    <>
      <div className="flex justify-between items-baseline">
        <span className="text-sm uppercase tracking-wider">Total</span>
        <div className="text-2xl tracking-tight">₩{finalPrice.toLocaleString()}</div>
      </div>
      <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
        `
        <div>
          적립 포인트: <span className="font-bold">{totalPoint}p</span>
        </div>
        <div className="text-2xs opacity-70 mt-1">{pointDetails.join(', ')}</div>
      </div>
    </>
  );
};

export default FinalPrice;
