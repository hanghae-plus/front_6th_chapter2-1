// ==========================================
// 레이아웃 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';

/**
 * Layout Props 타입
 */
interface LayoutProps {
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * 메인 애플리케이션 레이아웃 컴포넌트
 *
 * @description 2열 그리드 레이아웃 (좌측: 상품선택+장바구니, 우측: 주문요약)
 */
export const Layout: React.FC<LayoutProps> = ({ 
  leftContent, 
  rightContent, 
  children 
}) => {
  if (children) {
    // children이 있으면 단순히 래핑만
    return <>{children}</>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 overflow-hidden">
      {/* 좌측 컬럼 */}
      <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
        {leftContent}
      </div>
      
      {/* 우측 컬럼 */}
      {rightContent}
    </div>
  );
};

/**
 * 상품 선택 영역 컨테이너
 */
export const SelectorContainer: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      {children}
    </div>
  );
};

export default Layout;