import React from 'react';
import { UI_CONSTANTS } from '../constants';
import { ModalOverlay } from './ModalOverlay';
import { ModalPanel } from './ModalPanel';
import { DiscountPolicySection } from './DiscountPolicySection';
import { PointsPolicySection } from './PointsPolicySection';
import { TipSection } from './TipSection';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 도움말 모달 컴포넌트
 */
export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <ModalPanel isOpen={isOpen} onClose={onClose}>
        {/* Manual Content */}
        <h2 className="text-xl font-bold mb-4">{UI_CONSTANTS.TEXT.MANUAL_TITLE}</h2>

        <DiscountPolicySection />
        <PointsPolicySection />
        <TipSection />
      </ModalPanel>
    </ModalOverlay>
  );
};