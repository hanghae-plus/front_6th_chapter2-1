import type { ComponentPropsWithoutRef } from 'react';

interface ManualButtonProps extends ComponentPropsWithoutRef<'button'> {}

export const ManualButton = ({ ...props }: ManualButtonProps) => {
  return (
    <button
      className="fixed top-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-900 transition-colors z-50"
      {...props}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default ManualButton;
