import { ReactElement } from 'react';

import { useLayoutStore } from '@/advanced/store';

export default function HelpToggle(): ReactElement {
  const { showHelpOverlay, setShowHelpOverlay } = useLayoutStore();

  const handleToggleHelpOverlay = () => setShowHelpOverlay(!showHelpOverlay);

  return (
    <button
      onClick={handleToggleHelpOverlay}
      className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
    </button>
  );
}
