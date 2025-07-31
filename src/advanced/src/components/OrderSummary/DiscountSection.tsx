interface DiscountSectionProps {
  appliedDiscounts: string[];
}

export default function DiscountSection({ appliedDiscounts }: DiscountSectionProps) {
  if (appliedDiscounts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-1 my-2">
      {appliedDiscounts.map((discount, index) => {
        // "상품명 X% 할인" 형태를 파싱
        const match = discount.match(/^(.+?)\s+(\d+)%\s+할인$/);
        if (match) {
          const [, productName, percentage] = match;
          return (
            <div key={index} className="flex justify-between text-sm tracking-wide text-green-400">
              <span className="text-xs">{productName} (10개↑)</span>
              <span className="text-xs">-{percentage}%</span>
            </div>
          );
        }
        // 대량 구매나 화요일 특가 등 다른 할인
        return (
          <div key={index} className="flex justify-between text-sm tracking-wide text-green-400">
            <span className="text-xs">{discount}</span>
            <span className="text-xs">적용</span>
          </div>
        );
      })}
    </div>
  );
}