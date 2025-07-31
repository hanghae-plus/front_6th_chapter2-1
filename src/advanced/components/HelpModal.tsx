// ==========================================
// 도움말 모달 컴포넌트 (React + TypeScript)
// ==========================================

import React, { useState, useEffect } from 'react';

/**
 * HelpModal Props 타입
 */
interface HelpModalProps {
  className?: string;
}

/**
 * HelpModal 컴포넌트
 *
 * @description 쇼핑몰 사용법을 보여주는 도움말 모달
 */
export const HelpModal: React.FC<HelpModalProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* 매뉴얼 토글 버튼 */}
      <div id="manual-toggle" className={`fixed top-4 right-4 z-50 ${className}`}>
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors"
          onClick={() => setIsOpen(true)}
          aria-label="도움말 열기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>

      {/* 도움말 모달 오버레이 */}
      {isOpen && (
        <div 
          id="manual-overlay" 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleOverlayClick}
        >
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">🛒 쇼핑몰 사용법</h2>
                  <button 
                    id="close-manual" 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setIsOpen(false)}
                    aria-label="도움말 닫기"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4 text-sm text-gray-700">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">💰 할인 혜택</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li><span className="text-red-500">⚡ 번개세일</span>: 특정 상품 20% 할인</li>
                      <li><span className="text-blue-500">💝 추천상품</span>: 인기 상품 10% 할인</li>
                      <li><span className="text-purple-500">🎯 대량구매</span>: 30개 이상 구매시 25% 할인</li>
                      <li><span className="text-green-500">🌟 화요일특가</span>: 화요일에 추가 10% 할인</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🎁 포인트 적립</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>구매액의 1% 기본 적립</li>
                      <li>화요일 구매시 포인트 2배 적립</li>
                      <li>키보드 + 마우스 세트 구매시 +50포인트</li>
                      <li>풀세트 구매시 +100포인트 추가</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">📦 재고 관리</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>실시간 재고 확인 가능</li>
                      <li>품절시 자동으로 구매 버튼 비활성화</li>
                      <li>재고가 부족할 때 경고 표시</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpModal;