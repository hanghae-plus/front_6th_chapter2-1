import React from 'react';

interface ModalPanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * 모달 패널 컴포넌트
 */
export const ModalPanel: React.FC<ModalPanelProps> = ({ 
  isOpen, 
  onClose, 
  children 
}) => {
  return (
    <div
      id="manual-panel"
      className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl p-6 overflow-y-auto z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Close Button */}
      <button
        id="close-manual"
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-black"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      {children}
    </div>
  );
}; 