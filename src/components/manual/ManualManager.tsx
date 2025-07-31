import React from 'react';
import { ManualManagerProps } from '../../types';
import { ManualToggle } from './ManualToggle';
import { ManualOverlay } from './ManualOverlay';
import { ManualColumn } from './ManualColumn';

export const ManualManager: React.FC<ManualManagerProps> = ({ isOpen, onToggle }) => {
  const handleClose = () => {
    if (isOpen) {
      onToggle();
    }
  };

  return (
    <>
      <ManualToggle onToggle={onToggle} />
      <ManualOverlay isOpen={isOpen} onClose={handleClose}>
        <ManualColumn isOpen={isOpen} onClose={handleClose} />
      </ManualOverlay>
    </>
  );
};
