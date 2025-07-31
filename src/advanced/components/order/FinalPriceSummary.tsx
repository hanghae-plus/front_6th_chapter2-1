import React from 'react';

type Props = {};
const FinalPrice = (props: Props) => {
  return (
    <>
      <div className="flex justify-between items-baseline">
        <span className="text-sm uppercase tracking-wider">Total</span>
        <div className="text-2xl tracking-tight">₩0</div>
      </div>
      <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right">
        `
        <div>
          적립 포인트: <span className="font-bold">보너스포인트 전체p</span>
        </div>
        <div className="text-2xs opacity-70 mt-1">포인트 디테일한 내용ㅇ</div>
      </div>
    </>
  );
};

export default FinalPrice;
