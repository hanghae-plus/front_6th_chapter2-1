import React from 'react';

type Props = {};
const DiscountList = (props: Props) => {
  return (
    <>
      <div className="flex justify-between text-sm tracking-wide text-green-400">
        <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
        <span className="text-xs">-25%</span>
      </div>
      <div className="flex justify-between text-sm tracking-wide text-green-400">
        <span className="text-xs">개별아이템 이름 (10개↑)</span>
        <span className="text-xs">-개별아이템 할인율%</span>
      </div>

      {/* 화요일만 */}
      <div className="flex justify-between text-sm tracking-wide text-purple-400">
        <span className="text-xs">🌟 화요일 추가 할인</span>
        <span className="text-xs">-10%</span>
      </div>
    </>
  );
};

export default DiscountList;
