// ==========================================
// 메인 레이아웃 컴포넌트 (React + TypeScript)
// ==========================================

import React from 'react';
import { Header } from './Header';
import { HelpModal } from './HelpModal';

/**
 * MainLayout Props 타입
 */
interface MainLayoutProps {
  children: React.ReactNode;
  cartCount: number;
}

/**
 * MainLayout 컴포넌트
 *
 * @description 전체 애플리케이션의 메인 레이아웃 (헤더, 콘텐츠, 도움말 모달)
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children, cartCount }) => {
  return (
    <div className="max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
      {/* Header 컴포넌트 */}
      <Header itemCount={cartCount} />
      
      {/* 메인 콘텐츠 */}
      {children}
      
      {/* Help Modal */}
      <HelpModal />
    </div>
  );
};

export default MainLayout;