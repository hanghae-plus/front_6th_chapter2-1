import React, { useState } from 'react';
import { DISCOUNT_POLICY, POINTS_POLICY } from '../constants';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 도움말 모달 컴포넌트 - basic 버전과 동일한 UI
 */
export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const closeModal = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      {/* Manual Overlay */}
      <div
        id="manual-overlay"
        className={`fixed inset-0 bg-black/50 z-40 ${isOpen ? '' : 'hidden'} transition-opacity duration-300`}
        onClick={handleOverlayClick}
      >
        <div
          id="manual-panel"
          className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close Button */}
          <button
            id="close-manual"
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          {/* Manual Content */}
          <h2 className="text-xl font-bold mb-4">📖 이용 안내</h2>

          {/* Discount Policy */}
          <div className="mb-6">
            <h3 className="text-base font-bold mb-3">💰 할인 정책</h3>
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">개별 상품</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 키보드 10개↑: 10%<br />
                  • 마우스 10개↑: 15%<br />
                  • 모니터암 10개↑: 20%<br />
                  • 스피커 10개↑: 25%
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">전체 수량</p>
                <p className="text-gray-700 text-xs pl-2">
                  • {DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD}개 이상: {(DISCOUNT_POLICY.BULK_PURCHASE_RATE * 100)}%
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">특별 할인</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 화요일: +{(DISCOUNT_POLICY.TUESDAY_DISCOUNT_RATE * 100)}%<br />
                  • ⚡번개세일: {(DISCOUNT_POLICY.LIGHTNING_SALE_RATE * 100)}%<br />
                  • 💝추천할인: {(DISCOUNT_POLICY.SUGGESTED_SALE_RATE * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Point Policy */}
          <div className="mb-6">
            <h3 className="text-base font-bold mb-3">🎁 포인트 적립</h3>
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">기본</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 구매액의 {(POINTS_POLICY.BASE_RATE * 100)}%
                </p>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <p className="font-semibold text-sm mb-1">추가</p>
                <p className="text-gray-700 text-xs pl-2">
                  • 화요일: {POINTS_POLICY.TUESDAY_MULTIPLIER}배<br />
                  • 키보드+마우스: +{POINTS_POLICY.KEYBOARD_MOUSE_BONUS}p<br />
                  • 풀세트: +{POINTS_POLICY.FULL_SET_BONUS}p<br />
                  • 10개↑: +{POINTS_POLICY.BULK_PURCHASE_BONUS[10]}p / 20개↑: +{POINTS_POLICY.BULK_PURCHASE_BONUS[20]}p / 30개↑: +{POINTS_POLICY.BULK_PURCHASE_BONUS[30]}p
                </p>
              </div>
            </div>
          </div>

          {/* Tip */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-xs font-bold mb-1">💡 TIP</p>
            <p className="text-2xs text-gray-600 leading-relaxed">
              • 화요일 대량구매 = MAX 혜택<br />
              • ⚡+💝 중복 가능<br />
              • 상품4 = 품절
            </p>
          </div>
        </div>
      </div>
    </>
  );
};