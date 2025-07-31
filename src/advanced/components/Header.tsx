// ==========================================
// 헤더 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';

/**
 * Header 컴포넌트 Props 타입
 */
interface HeaderProps {
  itemCount?: number;
}

/**
 * Header 컴포넌트
 *
 * @description 브랜드 로고, 제목, 아이템 카운트를 포함한 헤더 섹션을 생성
 */
export const Header: React.FC<HeaderProps> = ({ itemCount = 0 }) => {
  return (
    <div className="mb-8">
      <h1 className="text-xs font-medium tracking-extra-wide uppercase mb-2">
        🛒 Hanghae Online Store
      </h1>
      <div className="text-5xl tracking-tight leading-none">
        Shopping Cart - React
      </div>
      <p className="text-sm text-gray-500 font-normal mt-3">
        🛍️ {itemCount} items in cart
      </p>
    </div>
  );
};

export default Header;