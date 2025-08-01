/**
 * 심화과제 메인 엔트리 포인트
 * React + TypeScript로 구현된 쇼핑카트 애플리케이션
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';

// 에러 바운더리 컴포넌트
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('애플리케이션 에러:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center p-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-4'>🛒 Hanghae Online Store</h1>
            <p className='text-gray-600 mb-6'>애플리케이션을 로딩하는 중 문제가 발생했습니다.</p>
            <button
              onClick={() => window.location.reload()}
              className='px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors'
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// DOM 요소 확인 및 앱 마운트
const initializeApp = () => {
  const container = document.getElementById('app');

  if (!container) {
    console.error('App container not found');
    return;
  }

  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );

  console.log('✅ React 애플리케이션이 성공적으로 로드되었습니다!');
  console.log('🚀 TypeScript + React 기반 모듈화된 쇼핑카트');
};

// DOM 로드 완료 시 자동 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// 디버깅을 위한 전역 접근
if (typeof window !== 'undefined') {
  (window as any).reactApp = { initializeApp };
}
