import React, { memo } from "react";
import Cart from "../Cart/Cart";
import OrderSummary from "../OrderSummary/OrderSummary";
import ProductSelector from "../ProductSelector/ProductSelector";

/**
 * 메인 레이아웃 컴포넌트
 * 상품 선택, 장바구니, 주문 요약을 포함한 메인 컨텐츠 영역
 */
const MainLayout: React.FC = () => {
  return (
    <div className="grid flex-1 grid-cols-1 gap-6 overflow-hidden lg:grid-cols-[1fr_360px]">
      {/* 왼쪽 컬럼 - 상품 선택 및 장바구니 */}
      <div className="overflow-y-auto border border-gray-200 bg-white p-8">
        <ProductSelector />
        <Cart />
      </div>

      {/* 오른쪽 컬럼 - 주문 요약 (main.original.js와 동일한 검은색 배경) */}
      <div className="flex flex-col bg-black p-8 text-white">
        <OrderSummary />
      </div>
    </div>
  );
};

export default memo(MainLayout);
