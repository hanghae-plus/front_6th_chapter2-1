import useDiscount from '@/advanced/hooks/useDiscount';

export default function SpecialDiscount() {
  const { isTuesday } = useDiscount();

  return (
    <div>
      {isTuesday ? (
        <div className="flex justify-between text-sm tracking-wide text-purple-400">
          <span className="text-xs">🌟 화요일 추가 할인</span>
          <span className="text-xs">-10%</span>
        </div>
      ) : null}
    </div>
  );
}
