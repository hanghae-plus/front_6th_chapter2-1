import { MouseEvent, useState } from 'react';

import ShoppingGuide from './ShoppingGuide';

const GuideToggle = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  const overlayClassName = isToggleOpen
    ? 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300'
    : 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 hidden';

  const handleOpenToggle = () => {
    setIsToggleOpen((prev) => !prev);
  };

  const handleClickOutside = (e: MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setIsToggleOpen(false);
    }
  };

  return (
    <>
      <button
        className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
        onClick={handleOpenToggle}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
      <div className={overlayClassName} onClick={handleClickOutside}>
        <ShoppingGuide isOpen={isToggleOpen} />
      </div>
    </>
  );
};

export default GuideToggle;
