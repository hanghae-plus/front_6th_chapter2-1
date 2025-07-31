import React from "react";
import Header from "./components/Header/Header";
import HelpModal from "./components/HelpModal/HelpModal";
import HelpToggle from "./components/HelpModal/HelpToggle";
import MainLayout from "./components/Layout/MainLayout";
import AppProvider from "./context/AppProvider";

/**
 * 메인 애플리케이션 컴포넌트
 * UI 로직만 포함하며, 비즈니스 로직은 Hook으로 분리
 */
const App: React.FC = () => {
  return (
    <AppProvider>
      {/* 헤더 */}
      <Header />

      {/* 메인 컨텐츠 */}
      <MainLayout />

      {/* 도움말 토글 버튼 */}
      <HelpToggle />

      {/* 도움말 모달 */}
      <HelpModal />
    </AppProvider>
  );
};

export default App;
