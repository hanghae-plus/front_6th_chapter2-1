import React, { memo } from "react";
import { useHelpModal } from "../../hooks/useHelpModal";

/**
 * 도움말 토글 버튼 컴포넌트
 */
const HelpToggle: React.FC = () => {
  const { toggle } = useHelpModal();

  return (
    <button
      id="help-toggle"
      data-testid="help-toggle"
      onClick={toggle}
      className="fixed right-4 top-4 z-50 rounded-full bg-black p-3 text-white transition-colors hover:bg-gray-900"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </button>
  );
};

export default memo(HelpToggle);
