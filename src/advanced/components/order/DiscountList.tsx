import { ItemDiscount } from '@/usecase/applyDiscount';

export const ItemDiscountList = ({ discountList }: { discountList: ItemDiscount[] }) => {
  return discountList.map((item) => (
    <div
      className="flex justify-between text-sm tracking-wide text-green-400"
      key={`itemdiscountlist-item-${item.name}`}
    >
      <span className="text-xs">{item.name}(10개↑)</span>
      <span className="text-xs">-{item.discount}%</span>
    </div>
  ));
};

export const TotalDiscountItem = () => {
  return (
    <div className="flex justify-between text-sm tracking-wide text-green-400">
      <span className="text-xs">🎉 대량구매 할인 (30개 이상)</span>
      <span className="text-xs">-25%</span>
    </div>
  );
};

export const TuesdayDiscountItem = () => {
  return (
    <div className="flex justify-between text-sm tracking-wide text-purple-400">
      <span className="text-xs">🌟 화요일 추가 할인</span>
      <span className="text-xs">-10%</span>
    </div>
  );
};
