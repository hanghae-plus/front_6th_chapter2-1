import { useEffect, useRef } from "react";

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export const Header = ({ totalItemCount = 0 }) => {
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
