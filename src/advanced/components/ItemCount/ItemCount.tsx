import React, { memo } from "react";
import { useItemCount } from "../../hooks/useItemCount";

/**
 * 장바구니 아이템 수를 표시하는 컴포넌트
 */
const ItemCount: React.FC = () => {
  const { itemCount } = useItemCount();

  return (
    <p id="item-count" className="mt-3 text-sm font-normal text-gray-500">
      🛍️ {itemCount} items in cart
    </p>
  );
};

export default memo(ItemCount);
