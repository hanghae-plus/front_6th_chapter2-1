/**
 * 메인 애플리케이션 컴포넌트
 * 선언적 프로그래밍 패러다임을 적용한 React 애플리케이션
 */

import React from 'react';
import { CartDisplay } from './components/cart/CartDisplay';
import { ProductSelector } from './components/product/ProductSelector';
import { CartProvider } from './context/CartContext';

/**
 * 애플리케이션 헤더 컴포넌트
 * 애플리케이션의 제목과 네비게이션을 포함하는 컴포넌트
 */
const AppHeader: React.FC = () => {
  return (
    <header className='bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'>
      <div className='container mx-auto px-6 py-8'>
        <h1 className='text-4xl font-bold mb-2'>🛒 쇼핑몰 애플리케이션</h1>
        <p className='text-blue-100 text-lg'>선언적 프로그래밍 패러다임 적용</p>
      </div>
    </header>
  );
};

/**
 * 메인 컨텐츠 컴포넌트
 * 애플리케이션의 주요 컨텐츠를 포함하는 컴포넌트
 */
const MainContent: React.FC = () => {
  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <section className='bg-white rounded-lg shadow-md p-6'>
            <ProductSelector />
          </section>

          <section className='bg-white rounded-lg shadow-md p-6'>
            <CartDisplay />
          </section>
        </div>
      </div>
    </main>
  );
};

/**
 * 애플리케이션 푸터 컴포넌트
 * 애플리케이션의 푸터 정보를 포함하는 컴포넌트
 */
const AppFooter: React.FC = () => {
  return (
    <footer className='bg-gray-800 text-white py-8'>
      <div className='container mx-auto px-6 text-center'>
        <p className='text-gray-300 mb-2'>
          © 2024 쇼핑몰 애플리케이션 - React + TypeScript
        </p>
        <p className='text-gray-400'>선언적 프로그래밍 패러다임으로 구현</p>
      </div>
    </footer>
  );
};

/**
 * 메인 애플리케이션 컴포넌트
 * 전체 애플리케이션의 구조를 정의하는 컴포넌트
 */
export const App: React.FC = () => {
  return (
    <CartProvider>
      <div className='app min-h-screen bg-gray-50'>
        <AppHeader />
        <MainContent />
        <AppFooter />
      </div>
    </CartProvider>
  );
};

export default App;
