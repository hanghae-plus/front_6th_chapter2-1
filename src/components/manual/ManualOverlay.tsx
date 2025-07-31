import React from 'react';
import { ManualOverlayProps } from '../../types';

export const ManualOverlay: React.FC<ManualOverlayProps> = ({ isOpen, onClose, children }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" onClick={handleOverlayClick}>
      {children}
    </div>
  );
};
