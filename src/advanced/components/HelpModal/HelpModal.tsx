import React, { memo } from "react";
import { HELP_CONTENT } from "../../constants/helpContent";
import { useHelpModal } from "../../hooks/useHelpModal";

/**
 * 도움말 모달 컴포넌트
 */
const HelpModal: React.FC = () => {
  const { isOpen, close } = useHelpModal();

  if (!isOpen) return null;

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close();
    }
  };

  return (
    <div
      id="help-modal"
      data-testid="manual-overlay"
      onClick={handleModalClose}
      className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
    >
      <div
        id="slide-panel"
        data-testid="manual-column"
        className="fixed right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl"
      >
        <button onClick={close} className="absolute right-4 top-4 text-gray-500 hover:text-black">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <h2 className="mb-4 text-xl font-bold">{HELP_CONTENT.title}</h2>

        {/* 할인 정책 섹션 */}
        <div className="mb-6">
          <h3 className="mb-3 text-base font-bold">{HELP_CONTENT.sections.discount.title}</h3>
          <div className="space-y-3">
            {HELP_CONTENT.sections.discount.items.map((item, index) => (
              <div key={index} className="rounded-lg bg-gray-100 p-3">
                <p className="mb-1 text-sm font-semibold">{item.subtitle}</p>
                <p className="pl-2 text-xs text-gray-700">
                  {item.content.map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < item.content.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 포인트 적립 섹션 */}
        <div className="mb-6">
          <h3 className="mb-3 text-base font-bold">{HELP_CONTENT.sections.points.title}</h3>
          <div className="space-y-3">
            {HELP_CONTENT.sections.points.items.map((item, index) => (
              <div key={index} className="rounded-lg bg-gray-100 p-3">
                <p className="mb-1 text-sm font-semibold">{item.subtitle}</p>
                <p className="pl-2 text-xs text-gray-700">
                  {item.content.map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {line}
                      {lineIndex < item.content.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 팁 섹션 */}
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="mb-1 text-xs font-bold">{HELP_CONTENT.tips.title}</p>
          <p className="text-2xs leading-relaxed text-gray-600">
            {HELP_CONTENT.tips.content.map((tip, index) => (
              <span key={index}>
                {tip}
                {index < HELP_CONTENT.tips.content.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(HelpModal);
