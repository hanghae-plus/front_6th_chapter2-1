import React from 'react';
import { Header } from './components/Header';

function App() {
  return (
    <div className="max-w-screen-xl h-screen max-h-800 mx-auto p-8 flex flex-col">
      {/* 기존 스타일링과 동일한 Header 컴포넌트 */}
      <Header itemCount={3} />
      
      <div className="mt-4">
        <p className="text-gray-600">React + TypeScript 마이그레이션 진행 중...</p>
        <p className="text-sm text-gray-500 mt-2">Header 컴포넌트가 성공적으로 변환되었습니다!</p>
      </div>
    </div>
  );
}

export default App;