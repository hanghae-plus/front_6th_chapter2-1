import React, { useState } from 'react';

import { QUANTITY_THRESHOLDS, DISCOUNT_PERCENTAGES, POINTS_CONFIG } from '../constants';

export const ManualOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleManualToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleManualClose = () => {
    setIsOpen(false);
  };

  return (
    <>
          <button
      id="manual-toggle"
      data-testid="manual-toggle"
      className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
      onClick={handleManualToggle}
    >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>

      {/* Manual Overlay */}
      <div 
        id="manual-overlay"
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleManualClose}
      >
        <div 
          id="manual-column"
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            onClick={handleManualClose}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <h2 className="text-xl font-bold mb-4">📖 이용 안내</h2>
          
          <div className="mb-6">
            <h3 className="text-base font-bold mb-3">💰 할인 정책</h3>
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">개별 상품</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 키보드 {QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑: {DISCOUNT_PERCENTAGES.KEYBOARD}%<br/>
                  • 마우스 {QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑: {DISCOUNT_PERCENTAGES.MOUSE}%<br/>
                  • 모니터암 {QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑: {DISCOUNT_PERCENTAGES.MONITOR_ARM}%<br/>
                  • 스피커 {QUANTITY_THRESHOLDS.INDIVIDUAL_DISCOUNT}개↑: {DISCOUNT_PERCENTAGES.SPEAKER}%
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">전체 수량</p>
                <p className="text-gray-700 text-xs pl-2">• {QUANTITY_THRESHOLDS.BULK_PURCHASE}개 이상: {DISCOUNT_PERCENTAGES.BULK_PURCHASE}%</p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">특별 할인</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 화요일: +{DISCOUNT_PERCENTAGES.TUESDAY}%<br/>
                  • ⚡번개세일: {DISCOUNT_PERCENTAGES.LIGHTNING_SALE}%<br/>
                  • 💝추천할인: {DISCOUNT_PERCENTAGES.RECOMMENDATION}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-base font-bold mb-3">🎁 포인트 적립</h3>
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">기본</p>
                <p className="text-gray-700 text-xs pl-2">• 구매액의 {(POINTS_CONFIG.POINTS_DIVISOR / 10000).toFixed(1)}%</p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">추가</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 화요일: {POINTS_CONFIG.TUESDAY_MULTIPLIER}배<br/>
                  • 키보드+마우스: +{POINTS_CONFIG.KEYBOARD_MOUSE_BONUS}p<br/>
                  • 풀세트: +{POINTS_CONFIG.FULL_SET_BONUS}p<br/>
                  • {QUANTITY_THRESHOLDS.POINTS_BONUS_10}개↑: +{POINTS_CONFIG.BONUS_10_ITEMS}p / {QUANTITY_THRESHOLDS.POINTS_BONUS_20}개↑: +{POINTS_CONFIG.BONUS_20_ITEMS}p / {QUANTITY_THRESHOLDS.BULK_PURCHASE}개↑: +{POINTS_CONFIG.BONUS_30_ITEMS}p
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-xs font-bold mb-1">💡 TIP</p>
            <p className="text-2xs text-gray-600 leading-relaxed">
              • 화요일 대량구매 = MAX 혜택<br/>
              • ⚡+💝 중복 가능<br/>
              • 상품4 = 품절
            </p>
          </div>
        </div>
      </div>
    </>
  );
}; 