import { useState } from 'react';

import ShoppingGuide from './ShoppingGuide';

const GuideToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openGuide = () => setIsOpen(true);
  const closeGuide = () => setIsOpen(false);

  return (
    <>
      <button
        className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
        onClick={openGuide}
        aria-label="이용 안내 열기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      {/* 오버레이 및 슬라이드 패널 */}
      {/* 오버레이 및 슬라이드 패널: 항상 마운트, translate-x-full/0로 애니메이션 */}
      <div style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
        {/* 오버레이 */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeGuide}
          aria-label="이용 안내 닫기 배경"
        />
        {/* 슬라이드 패널 */}
        <div
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 m-0 overflow-y-auto z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ boxShadow: 'rgba(0,0,0,0.2) -4px 0px 24px' }}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            onClick={closeGuide}
            aria-label="이용 안내 닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <ShoppingGuide />
        </div>
      </div>
    </>
  );
};

export default GuideToggle;
