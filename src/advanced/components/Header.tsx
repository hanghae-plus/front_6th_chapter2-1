import { useEffect, useRef } from "react";

function usePrevious(value: number) {
  const ref = useRef<number | null>(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

interface Props {
  totalItemCount: number;
}

export const Header = ({ totalItemCount = 0 }: Props) => {
  const prevItemCount = usePrevious(totalItemCount);

  return (
    <div className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div className="text-5xl tracking-tight leading-none">Shopping Cart</div>
      <p
        id="item-count"
        className="text-sm text-gray-500 font-normal mt-3"
        data-changed={totalItemCount !== prevItemCount}
      >
        🛍️ {totalItemCount} items in cart
      </p>
    </div>
  );
};
