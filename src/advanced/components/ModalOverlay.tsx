import React from 'react';

interface ModalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * 모달 오버레이 컴포넌트
 */
export const ModalOverlay: React.FC<ModalOverlayProps> = ({ 
  isOpen, 
  onClose, 
  children 
}) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="manual-overlay"
      className={`fixed inset-0 bg-black/50 z-40 ${isOpen ? '' : 'hidden'} transition-opacity duration-300`}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
}; 