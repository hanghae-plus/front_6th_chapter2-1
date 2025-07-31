import React, { memo } from "react";
import ItemCount from "../ItemCount/ItemCount";

/**
 * 애플리케이션 헤더 컴포넌트
 */
const Header: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="tracking-extra-wide mb-2 text-xs font-medium uppercase">
        🛒 Hanghae Online Store
      </h1>
      <div className="text-5xl leading-none tracking-tight">Shopping Cart</div>
      <ItemCount />
    </div>
  );
};

export default memo(Header);
